import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BsChatDotsFill } from 'react-icons/bs';
import { IoClose, IoArrowBack, IoHome, IoSend } from 'react-icons/io5';
import { CONVERSATION_TREE } from '../../constants/conversationTree';
import { matchUserInput, buildSearchIndex } from '../../constants/chatbotIntents';
import styles from './Chatbot.module.css';

const TYPING_DELAY = 600;
const STORAGE_KEY = 'shopifypro_chatbot';

const WHATSAPP_API = import.meta.env.VITE_WHATSAPP_API;
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

function getStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* noop */ }
}

// ─── Rich text renderer ───
// Converts plain text to JSX with clickable links for:
// - Email addresses → mailto:
// - Phone numbers like +92 320 9246199 → WhatsApp link
// - Internal routes like [Contact Us](/contact) → react-router nav
// - URLs → external links
function RichText({ text, onNavigate }) {
  if (!text) return null;

  // Process markdown-style internal links: [label](/path)
  // Then auto-detect emails, phones, and URLs
  const parts = [];
  let remaining = text;
  let key = 0;

  // Pattern for [label](/path) internal links
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkPattern.exec(text)) !== null) {
    // Add text before this match
    if (match.index > lastIndex) {
      parts.push(...parseInlineLinks(text.slice(lastIndex, match.index), key, onNavigate));
      key += 100;
    }

    const label = match[1];
    const path = match[2];

    if (path.startsWith('/')) {
      // Internal route
      parts.push(
        <a
          key={`link-${key++}`}
          href={path}
          className={styles.chatLink}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(path);
          }}
        >
          {label}
        </a>
      );
    } else {
      // External URL
      parts.push(
        <a key={`link-${key++}`} href={path} className={styles.chatLink} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(...parseInlineLinks(text.slice(lastIndex), key, onNavigate));
  }

  return <>{parts}</>;
}

function parseInlineLinks(text, startKey, onNavigate) {
  const parts = [];
  let key = startKey;

  // Combined pattern: emails, phone numbers, URLs
  const inlinePattern = /([\w.-]+@[\w.-]+\.\w+)|(\+\d[\d\s-]{8,}\d)|(https?:\/\/[^\s,]+)/g;
  let lastIdx = 0;
  let m;

  while ((m = inlinePattern.exec(text)) !== null) {
    // Text before match
    if (m.index > lastIdx) {
      parts.push(<span key={`t-${key++}`}>{text.slice(lastIdx, m.index)}</span>);
    }

    if (m[1]) {
      // Email
      parts.push(
        <a key={`e-${key++}`} href={`mailto:${m[1]}`} className={styles.chatLink}>
          {m[1]}
        </a>
      );
    } else if (m[2]) {
      // Phone → WhatsApp link
      const cleaned = m[2].replace(/[\s-]/g, '');
      const waUrl = WHATSAPP_API && WHATSAPP_NUMBER
        ? `${WHATSAPP_API}?phone=${WHATSAPP_NUMBER}`
        : `https://wa.me/${cleaned}`;
      parts.push(
        <a key={`p-${key++}`} href={waUrl} className={styles.chatLink} target="_blank" rel="noopener noreferrer">
          {m[2]}
        </a>
      );
    } else if (m[3]) {
      // URL
      parts.push(
        <a key={`u-${key++}`} href={m[3]} className={styles.chatLink} target="_blank" rel="noopener noreferrer">
          {m[3]}
        </a>
      );
    }

    lastIdx = m.index + m[0].length;
  }

  // Remaining text
  if (lastIdx < text.length) {
    parts.push(<span key={`t-${key++}`}>{text.slice(lastIdx)}</span>);
  }

  return parts;
}

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentNode, setCurrentNode] = useState('root');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [hasUnread, setHasUnread] = useState(() => {
    const stored = getStoredState();
    if (!stored) return true;
    return stored.hasUnread === true;
  });

  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const pendingResponseRef = useRef(false);

  const searchIndex = useMemo(() => buildSearchIndex(CONVERSATION_TREE), []);

  const handleInternalNavigate = useCallback((path) => {
    navigate(path);
    setIsOpen(false);
  }, [navigate]);

  useEffect(() => {
    const stored = getStoredState();
    if (!stored) {
      setStoredState({ opened: false, hasUnread: true });
    }
  }, []);

  useEffect(() => {
    const stored = getStoredState() || {};
    setStoredState({ ...stored, hasUnread });
  }, [hasUnread]);

  const refocusInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const addBotMessage = useCallback((nodeKey) => {
    const node = CONVERSATION_TREE[nodeKey] || CONVERSATION_TREE.fallback;
    setIsTyping(true);
    pendingResponseRef.current = true;

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: node.message, options: node.options, nodeKey },
      ]);
      setIsTyping(false);
      pendingResponseRef.current = false;
      refocusInput();
    }, TYPING_DELAY);
  }, [refocusInput]);

  const addDirectMessage = useCallback((message, options) => {
    setIsTyping(true);
    pendingResponseRef.current = true;

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: message, options, nodeKey: null },
      ]);
      setIsTyping(false);
      pendingResponseRef.current = false;
      refocusInput();
    }, TYPING_DELAY);
  }, [refocusInput]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage('root');
    }
  }, [isOpen, messages.length, addBotMessage]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (!pendingResponseRef.current) {
          setHasUnread(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isTyping && messages.length > 0) {
      setHasUnread(false);
    }
  }, [isOpen, isTyping, messages.length]);

  useEffect(() => {
    if (!isOpen && pendingResponseRef.current) {
      setHasUnread(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const navigateToNode = useCallback((nodeKey) => {
    setHistory((prev) => [...prev, currentNode]);
    setCurrentNode(nodeKey);
    addBotMessage(nodeKey);
  }, [currentNode, addBotMessage]);

  const handleOptionClick = (option) => {
    setMessages((prev) => [...prev, { type: 'user', text: option.label }]);
    navigateToNode(option.next);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    const query = inputValue.trim();
    if (!query || isTyping) return;

    setMessages((prev) => [...prev, { type: 'user', text: query }]);
    setInputValue('');

    const result = matchUserInput(query, searchIndex);

    if (!result) {
      navigateToNode('fallback');
      return;
    }

    if (result.type === 'node') {
      navigateToNode(result.node);
    } else {
      setHistory((prev) => [...prev, currentNode]);
      addDirectMessage(result.message, result.options);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prevNode = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentNode(prevNode);
    setMessages((prev) => [...prev, { type: 'system', text: 'Went back' }]);
    addBotMessage(prevNode);
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentNode('root');
    setMessages([]);
    addBotMessage('root');
  };

  const toggleChat = () => {
    setIsOpen((prev) => {
      const willOpen = !prev;
      if (willOpen) {
        const stored = getStoredState() || {};
        setStoredState({ ...stored, opened: true });
      }
      return willOpen;
    });
  };

  return (
    <>
      <motion.button
        className={styles.toggleBtn}
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.toggleIcon}
            >
              <IoClose />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.toggleIcon}
            >
              <BsChatDotsFill />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!isOpen && hasUnread && (
            <motion.span
              className={styles.badge}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              1
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <div className={styles.avatar}>S</div>
                <div className={styles.headerInfo}>
                  <span className={styles.headerTitle}>ShopifyPro</span>
                  <span className={styles.headerStatus}>
                    <span className={styles.statusDot} />
                    Online
                  </span>
                </div>
              </div>
              <div className={styles.headerActions}>
                {history.length > 0 && (
                  <button className={styles.headerBtn} onClick={handleBack} aria-label="Go back" title="Go back">
                    <IoArrowBack />
                  </button>
                )}
                <button className={styles.headerBtn} onClick={handleReset} aria-label="Start over" title="Start over">
                  <IoHome />
                </button>
                <button className={styles.headerBtn} onClick={toggleChat} aria-label="Close chat">
                  <IoClose />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.body} ref={chatBodyRef}>
              {messages.map((msg, idx) => {
                if (msg.type === 'system') {
                  return (
                    <div key={idx} className={styles.systemMsg}>{msg.text}</div>
                  );
                }

                if (msg.type === 'user') {
                  return (
                    <motion.div
                      key={idx}
                      className={styles.userMsg}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {msg.text}
                    </motion.div>
                  );
                }

                const isLatest = idx === messages.length - 1 && !isTyping;
                return (
                  <motion.div
                    key={idx}
                    className={styles.botMsgWrapper}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={styles.botMsg}>
                      <RichText text={msg.text} onNavigate={handleInternalNavigate} />
                    </div>
                    {isLatest && msg.options && (
                      <div className={styles.options}>
                        {msg.options.map((opt, optIdx) => (
                          <motion.button
                            key={optIdx}
                            className={styles.optionBtn}
                            onClick={() => handleOptionClick(opt)}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: optIdx * 0.05, duration: 0.2 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {opt.label}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {isTyping && (
                <div className={styles.botMsgWrapper}>
                  <div className={styles.typingIndicator}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className={styles.inputBar} onSubmit={handleTextSubmit}>
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Type your question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isTyping}
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
              >
                <IoSend />
              </button>
            </form>

            <div className={styles.footer}>
              <span>Powered by ShopifyPro</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

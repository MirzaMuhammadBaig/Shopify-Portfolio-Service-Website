import { useState, useRef, useEffect } from 'react';
import { HiChat, HiX, HiPaperAirplane } from 'react-icons/hi';
import { CONVERSATION_TREE } from '../../constants/conversationTree';
import styles from './ChatbotWidget.module.css';

const BOT_NAME = 'ShopifyPro Bot';

function findBestNode(input) {
  const lower = input.toLowerCase();
  const keywords = {
    services: ['service', 'offer', 'what do you do', 'help me'],
    pricing: ['price', 'pricing', 'cost', 'how much', 'rate', 'fee', 'budget', 'quote', 'afford'],
    process: ['process', 'step', 'workflow', 'how do you work', 'phases'],
    timelines: ['how long', 'time', 'take', 'duration', 'weeks', 'days', 'deadline', 'timeline'],
    svc_setup: ['store setup', 'set up', 'new store', 'start a store', 'create store'],
    svc_theme: ['theme', 'design', 'custom theme', 'redesign', 'look', 'brand'],
    svc_seo: ['seo', 'search engine', 'google ranking', 'organic', 'traffic'],
    svc_app: ['app', 'custom app', 'develop', 'integration', 'build app'],
    svc_migration: ['migrate', 'migration', 'move', 'transfer', 'woocommerce', 'magento', 'switch platform'],
    svc_cro: ['conversion', 'cro', 'optimize', 'a/b test', 'checkout', 'abandon'],
    tech_payments: ['payment', 'pay', 'stripe', 'paypal', 'apple pay', 'google pay', 'klarna'],
    tech_speed: ['speed', 'slow', 'fast', 'performance', 'page speed', 'lighthouse'],
    tech_international: ['currency', 'language', 'international', 'translate', 'multi-currency'],
    shopify_plus: ['shopify plus', 'enterprise', 'plus', 'wholesale', 'high volume'],
    tech_headless: ['headless', 'hydrogen', 'react', 'storefront api'],
    support_packages: ['support', 'maintenance', 'ongoing', 'after launch', 'retainer'],
    contact: ['contact', 'email', 'phone', 'whatsapp', 'talk', 'call', 'reach', 'hire', 'human'],
    marketing: ['marketing', 'social media', 'instagram', 'tiktok', 'ads', 'loyalty'],
    shopify_plans: ['plan', 'basic', 'advanced', 'which plan', 'shopify plan'],
    compare_platforms: ['compare', 'vs', 'versus', 'woocommerce vs', 'wix vs', 'squarespace vs', 'bigcommerce vs'],
    tech_dropshipping: ['dropship', 'print on demand', 'pod', 'printful'],
    tech_b2b: ['b2b', 'wholesale', 'bulk', 'trade'],
    tech_security: ['security', 'ssl', 'pci', 'gdpr', 'privacy', 'compliance'],
    tech_analytics: ['analytics', 'ga4', 'google analytics', 'report', 'dashboard', 'tracking'],
    industries: ['fashion', 'beauty', 'food', 'home', 'industry'],
    tips_hub: ['tip', 'advice', 'best practice', 'recommend', 'suggestion'],
    about_us: ['about', 'who are you', 'company', 'team', 'portfolio'],
    getting_started: ['get started', 'begin', 'start', 'first step', 'how to start'],
  };

  let bestKey = null;
  let maxScore = 0;

  for (const [nodeId, kws] of Object.entries(keywords)) {
    let score = 0;
    for (const kw of kws) {
      if (lower.includes(kw)) score += kw.split(' ').length + 1;
    }
    if (score > maxScore) {
      maxScore = score;
      bestKey = nodeId;
    }
  }

  if (maxScore >= 2 && bestKey && CONVERSATION_TREE[bestKey]) {
    return bestKey;
  }

  return 'fallback';
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      const root = CONVERSATION_TREE.root;
      setMessages([{ from: 'bot', text: root.message, options: root.options }]);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addBotResponse = (nodeId) => {
    const node = CONVERSATION_TREE[nodeId] || CONVERSATION_TREE.fallback;
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: node.message, options: node.options }]);
      setIsTyping(false);
    }, 500 + Math.random() * 400);
  };

  const handleOptionClick = (option) => {
    setMessages((prev) => [...prev, { from: 'user', text: option.label }]);
    addBotResponse(option.next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const text = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');

    const nodeId = findBestNode(text);
    addBotResponse(nodeId);
  };

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>
                <HiChat />
              </div>
              <div>
                <span className={styles.botName}>{BOT_NAME}</span>
                <span className={styles.status}>Online</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className={styles.closeBtn}>
              <HiX />
            </button>
          </div>

          <div className={styles.messages} ref={chatRef}>
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`${styles.message} ${msg.from === 'bot' ? styles.botMsg : styles.userMsg}`}>
                  {msg.text}
                </div>
                {msg.from === 'bot' && msg.options && i === messages.length - 1 && (
                  <div className={styles.quickReplies}>
                    {msg.options.map((opt, j) => (
                      <button key={j} onClick={() => handleOptionClick(opt)} className={styles.quickBtn}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.message} ${styles.botMsg} ${styles.typing}`}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className={styles.input}
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
              <HiPaperAirplane />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`${styles.toggleBtn} ${open ? styles.active : ''}`}
        aria-label="Open chatbot"
      >
        {open ? <HiX className={styles.toggleIcon} /> : <HiChat className={styles.toggleIcon} />}
      </button>
    </div>
  );
}

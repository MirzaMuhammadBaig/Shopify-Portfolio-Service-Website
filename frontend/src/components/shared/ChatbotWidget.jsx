import { useState, useRef, useEffect } from 'react';
import { HiChat, HiX, HiPaperAirplane } from 'react-icons/hi';
import { FAQ_DATA } from '../../constants/static-data';
import styles from './ChatbotWidget.module.css';

const BOT_NAME = 'ShopifyPro Bot';

const QUICK_REPLIES = [
  'How long does it take?',
  'Do you offer support?',
  'Can you migrate my store?',
  'What makes you different?',
  'Do you build custom apps?',
  'What is your pricing?',
];

function findBestAnswer(input) {
  const lower = input.toLowerCase();
  const keywords = {
    'faq-1': ['how long', 'time', 'take', 'build', 'duration', 'weeks'],
    'faq-2': ['support', 'ongoing', 'after', 'launch', 'maintenance'],
    'faq-3': ['migrate', 'migration', 'move', 'transfer', 'woocommerce', 'magento'],
    'faq-4': ['different', 'why', 'unique', 'special', 'what makes'],
    'faq-5': ['custom app', 'app', 'develop', 'build app', 'integration'],
    'faq-6': ['price', 'pricing', 'cost', 'how much', 'payment', 'quote'],
    'faq-7': ['mobile', 'responsive', 'phone', 'tablet', 'mobile-friendly'],
    'faq-8': ['shopify plus', 'enterprise', 'plus', 'wholesale', 'high volume'],
    'faq-9': ['photography', 'content', 'photo', 'images', 'creative'],
    'faq-10': ['seo', 'migration seo', 'redirect', 'rankings', 'organic'],
    'faq-11': ['integrate', 'third party', 'stripe', 'klaviyo', 'shipping'],
    'faq-12': ['payment method', 'pay', 'apple pay', 'google pay', 'klarna'],
    'faq-13': ['guarantee', 'satisfaction', 'revision', 'refund'],
    'faq-14': ['update', 'myself', 'edit', 'manage', 'content management', 'training'],
  };

  let bestMatch = null;
  let maxScore = 0;

  for (const faq of FAQ_DATA) {
    const faqKeywords = keywords[faq.id] || [];
    let score = 0;

    for (const kw of faqKeywords) {
      if (lower.includes(kw)) score += 2;
    }

    const questionWords = faq.question.toLowerCase().split(/\s+/);
    for (const word of questionWords) {
      if (word.length > 3 && lower.includes(word)) score += 1;
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = faq;
    }
  }

  if (maxScore >= 2 && bestMatch) {
    return bestMatch.answer;
  }

  return "Thanks for your question! I don't have an exact answer for that, but our team would love to help. You can reach us on WhatsApp for instant support, or browse our FAQ section for more details.";
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi there! I'm the ShopifyPro assistant. How can I help you today? Feel free to ask about our services, pricing, or timelines." },
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { from: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const answer = findBestAnswer(text);
      setMessages((prev) => [...prev, { from: 'bot', text: answer }]);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
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
              <div key={i} className={`${styles.message} ${msg.from === 'bot' ? styles.botMsg : styles.userMsg}`}>
                {msg.text}
              </div>
            ))}
            {messages.length === 1 && (
              <div className={styles.quickReplies}>
                <span className={styles.quickLabel}>Quick questions:</span>
                {QUICK_REPLIES.map((q, i) => (
                  <button key={i} onClick={() => handleQuickReply(q)} className={styles.quickBtn}>
                    {q}
                  </button>
                ))}
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

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrderChat } from '../../hooks/useOrderChat';
import styles from './OrderChat.module.css';
import { HiPaperAirplane } from 'react-icons/hi';

export default function OrderChat({ orderId, disabled = false }) {
  const { user } = useAuth();
  const { messages, sendMessage, emitTyping, isTyping } = useOrderChat(orderId, !disabled);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    sendMessage(input);
    setInput('');
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    emitTyping();
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h4 className={styles.chatTitle}>Order Chat</h4>
        {disabled && <span className={styles.chatDisabled}>Chat is closed</span>}
      </div>

      <div className={styles.messagesContainer} ref={containerRef}>
        {messages.length === 0 && (
          <div className={styles.emptyChat}>
            {disabled ? 'Chat history is empty.' : 'No messages yet. Start the conversation!'}
          </div>
        )}
        {messages.map((msg) => {
          const isSelf = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`${styles.messageBubble} ${isSelf ? styles.self : styles.other}`}>
              {!isSelf && (
                <span className={styles.senderName}>
                  {msg.sender?.firstName || 'User'} {msg.sender?.role === 'ADMIN' ? '(Admin)' : ''}
                </span>
              )}
              <p className={styles.messageText}>{msg.content}</p>
              <div className={styles.messageFooter}>
                <span className={styles.messageTime}>{formatTime(msg.createdAt)}</span>
                {isSelf && msg.isRead && <span className={styles.readIndicator}>Read</span>}
              </div>
            </div>
          );
        })}
        {isTyping && <div className={styles.typingIndicator}>Typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      {!disabled && (
        <form className={styles.inputArea} onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className={styles.chatInput}
            maxLength={1000}
          />
          <button type="submit" className={styles.sendBtn} disabled={!input.trim()}>
            <HiPaperAirplane />
          </button>
        </form>
      )}
    </div>
  );
}

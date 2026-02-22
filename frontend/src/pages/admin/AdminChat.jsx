import { useState } from 'react';
import { useConversations, useConversation, useSendMessage } from '../../hooks/useChat';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDateTime } from '../../utils/formatters';
import styles from './AdminChat.module.css';

export default function AdminChat() {
  const [activeId, setActiveId] = useState(null);
  const [message, setMessage] = useState('');
  const { data, isLoading } = useConversations();
  const { data: activeConv } = useConversation(activeId);
  const sendMessage = useSendMessage();
  const conversations = data?.data || [];
  const messages = activeConv?.data?.messages || [];

  const handleSend = () => {
    if (!message.trim() || !activeId) return;
    sendMessage.mutate({ conversationId: activeId, data: { content: message } });
    setMessage('');
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className={styles.title}>Chat Management</h1>
      <div className={styles.wrapper}>
        <div className={styles.sidebar}>
          {conversations.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)} className={`${styles.convItem} ${activeId === c.id ? styles.active : ''}`}>
              <span className={styles.convName}>{c.user.firstName} {c.user.lastName}</span>
              <span className={styles.convDate}>{formatDateTime(c.updatedAt)}</span>
            </button>
          ))}
        </div>
        <div className={styles.chatArea}>
          {activeId ? (
            <>
              <div className={styles.messages}>
                {messages.map((m) => (
                  <div key={m.id} className={`${styles.msg} ${m.sender === 'ADMIN' ? styles.sent : styles.received}`}>
                    <span className={styles.sender}>{m.sender}</span>
                    <p>{m.content}</p>
                    <span className={styles.time}>{formatDateTime(m.createdAt)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.inputArea}>
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Reply as admin..." onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
                <Button onClick={handleSend} loading={sendMessage.isPending}>Send</Button>
              </div>
            </>
          ) : (
            <div className={styles.placeholder}>Select a conversation</div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useConversations, useConversation, useSendMessage, useCreateConversation } from '../../hooks/useChat';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDateTime } from '../../utils/formatters';
import styles from './DashboardChat.module.css';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-messages', label: 'Most Messages' },
  { value: 'a-z', label: 'A-Z' },
  { value: 'z-a', label: 'Z-A' },
];

export default function DashboardChat() {
  const [activeId, setActiveId] = useState(null);
  const [message, setMessage] = useState('');
  const [sort, setSort] = useState('recent');
  const { data: convData, isLoading } = useConversations({ sort });
  const { data: activeConv } = useConversation(activeId);
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();
  const conversations = convData?.data || [];
  const messages = activeConv?.data?.messages || [];

  const handleSend = () => {
    if (!message.trim() || !activeId) return;
    sendMessage.mutate({ conversationId: activeId, data: { content: message } });
    setMessage('');
  };

  const handleNewConversation = () => {
    createConversation.mutate({ subject: 'New conversation' }, {
      onSuccess: (data) => setActiveId(data.data.id),
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.title}>Messages</h2>
          <Button size="sm" onClick={handleNewConversation}>New</Button>
        </div>
        <div className={styles.sortBar}>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.sortSelect}>
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className={styles.convList}>
          {conversations.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)} className={`${styles.convItem} ${activeId === c.id ? styles.active : ''}`}>
              <span className={styles.convSubject}>{c.subject || 'Conversation'}</span>
              <div className={styles.convMeta}>
                <span className={styles.convDate}>{formatDateTime(c.updatedAt)}</span>
                {c._count?.messages > 0 && <span className={styles.convCount}>{c._count.messages} msgs</span>}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.chatArea}>
        {activeId ? (
          <>
            <div className={styles.messages}>
              {messages.map((m) => (
                <div key={m.id} className={`${styles.msg} ${m.sender === 'USER' ? styles.sent : styles.received}`}>
                  <p className={styles.msgContent}>{m.content}</p>
                  <span className={styles.msgTime}>{formatDateTime(m.createdAt)}</span>
                </div>
              ))}
            </div>
            <div className={styles.inputArea}>
              <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
              <Button onClick={handleSend} loading={sendMessage.isPending}>Send</Button>
            </div>
          </>
        ) : (
          <div className={styles.placeholder}>Select a conversation or start a new one</div>
        )}
      </div>
    </div>
  );
}

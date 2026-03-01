import { useState, useRef, useEffect } from 'react';
import { useConversations, useConversation, useSendMessage, useMarkAsRead } from '../../hooks/useChat';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDateTime } from '../../utils/formatters';
import { HiMenuAlt2, HiX, HiSearch } from 'react-icons/hi';
import styles from './AdminChat.module.css';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most-messages', label: 'Most Messages' },
  { value: 'a-z', label: 'Name A-Z' },
  { value: 'z-a', label: 'Name Z-A' },
];

export default function AdminChat() {
  const [activeId, setActiveId] = useState(null);
  const [message, setMessage] = useState('');
  const [sort, setSort] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem('adminChatSidebarVisible');
    return stored !== null ? stored === 'true' : true;
  });
  const messagesEndRef = useRef(null);

  const { data, isLoading } = useConversations({ sort });
  const { data: activeConv } = useConversation(activeId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const conversations = data?.data || [];
  const messages = activeConv?.data?.messages || [];
  const activeConvData = activeConv?.data;

  const filteredConversations = searchTerm
    ? conversations.filter((c) => {
        const name = `${c.user.firstName} ${c.user.lastName}`.toLowerCase();
        const subject = (c.subject || '').toLowerCase();
        const term = searchTerm.toLowerCase();
        return name.includes(term) || subject.includes(term);
      })
    : conversations;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (!message.trim() || !activeId) return;
    sendMessage.mutate({ conversationId: activeId, data: { content: message } });
    setMessage('');
  };

  const handleSelectConversation = (id) => {
    setActiveId(id);
    markAsRead.mutate(id);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      localStorage.setItem('adminChatSidebarVisible', String(!prev));
      return !prev;
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className={styles.pageTitle}>Chat Management</h1>
      <div className={styles.wrapper}>
        {sidebarOpen && (
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarTitle}>Conversations</span>
              <button className={styles.toggleBtn} onClick={toggleSidebar} title="Hide sidebar">
                <HiX size={16} />
              </button>
            </div>
            <div className={styles.searchBar}>
              <div className={styles.searchWrap}>
                <HiSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search by name or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>
            <div className={styles.sortBar}>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.sortSelect}>
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className={styles.convList}>
              {filteredConversations.map((c) => {
                const unread = c._count?.messages || 0;
                return (
                  <button key={c.id} onClick={() => handleSelectConversation(c.id)} className={`${styles.convItem} ${activeId === c.id ? styles.active : ''} ${unread > 0 ? styles.convUnread : ''}`}>
                    <div className={styles.convTop}>
                      <span className={styles.convName}>{c.user.firstName} {c.user.lastName}</span>
                      {unread > 0 && <span className={styles.unreadBadge}>{unread}</span>}
                    </div>
                    {c.subject && <span className={styles.convSubject}>{c.subject}</span>}
                    <span className={styles.convDate}>{formatDateTime(c.updatedAt)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div className={styles.chatArea}>
          {!sidebarOpen && (
            <button className={styles.showSidebarBtn} onClick={toggleSidebar} title="Show sidebar">
              <HiMenuAlt2 size={18} />
            </button>
          )}
          {activeId ? (
            <>
              <div className={styles.chatHeader}>
                <div>
                  <span className={styles.chatUserName}>
                    {activeConvData?.user?.firstName} {activeConvData?.user?.lastName}
                  </span>
                  {activeConvData?.subject && (
                    <span className={styles.chatSubject}> — {activeConvData.subject}</span>
                  )}
                </div>
              </div>
              <div className={styles.messages}>
                {messages.map((m) => (
                  <div key={m.id} className={`${styles.msg} ${m.sender === 'ADMIN' ? styles.sent : styles.received}`}>
                    <span className={styles.sender}>{m.sender}</span>
                    <p>{m.content}</p>
                    <span className={styles.time}>{formatDateTime(m.createdAt)}</span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
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

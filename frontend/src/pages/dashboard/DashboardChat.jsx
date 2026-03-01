import { useState, useRef, useEffect } from 'react';
import { useConversations, useConversation, useSendMessage, useCreateConversation, useUpdateSubject, useMarkAsRead } from '../../hooks/useChat';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { formatDateTime } from '../../utils/formatters';
import { HiMenuAlt2, HiPencil, HiCheck, HiX, HiSearch } from 'react-icons/hi';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem('chatSidebarVisible');
    return stored !== null ? stored === 'true' : true;
  });
  const [editingSubject, setEditingSubject] = useState(false);
  const [subjectDraft, setSubjectDraft] = useState('');
  const subjectInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const { data: convData, isLoading } = useConversations({ sort });
  const { data: activeConv } = useConversation(activeId);
  const sendMessage = useSendMessage();
  const createConversation = useCreateConversation();
  const updateSubject = useUpdateSubject();
  const markAsRead = useMarkAsRead();
  const conversations = convData?.data || [];
  const messages = activeConv?.data?.messages || [];
  const activeConvData = activeConv?.data;

  const filteredConversations = searchTerm
    ? conversations.filter((c) => (c.subject || '').toLowerCase().includes(searchTerm.toLowerCase()))
    : conversations;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    if (editingSubject && subjectInputRef.current) {
      subjectInputRef.current.focus();
    }
  }, [editingSubject]);

  const handleSend = () => {
    if (!message.trim() || !activeId) return;
    sendMessage.mutate({ conversationId: activeId, data: { content: message } });
    setMessage('');
  };

  const handleNewConversation = () => {
    createConversation.mutate({}, {
      onSuccess: (data) => setActiveId(data.data.id),
    });
  };

  const handleSelectConversation = (id) => {
    setActiveId(id);
    markAsRead.mutate(id);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      localStorage.setItem('chatSidebarVisible', String(!prev));
      return !prev;
    });
  };

  const startEditSubject = () => {
    setSubjectDraft(activeConvData?.subject || '');
    setEditingSubject(true);
  };

  const saveSubject = () => {
    if (subjectDraft.trim() && subjectDraft !== activeConvData?.subject) {
      updateSubject.mutate({ conversationId: activeId, data: { subject: subjectDraft.trim() } });
    }
    setEditingSubject(false);
  };

  const cancelEditSubject = () => {
    setEditingSubject(false);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={styles.wrapper}>
      {sidebarOpen && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.title}>Messages</h2>
            <div className={styles.sidebarActions}>
              <Button size="sm" onClick={handleNewConversation}>New</Button>
              <button className={styles.toggleBtn} onClick={toggleSidebar} title="Hide sidebar">
                <HiX size={16} />
              </button>
            </div>
          </div>
          <div className={styles.searchBar}>
            <div className={styles.searchWrap}>
              <HiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search conversations..."
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
            {filteredConversations.map((c) => (
              <button key={c.id} onClick={() => handleSelectConversation(c.id)} className={`${styles.convItem} ${activeId === c.id ? styles.active : ''}`}>
                <span className={styles.convSubject}>{c.subject || 'New conversation'}</span>
                <div className={styles.convMeta}>
                  <span className={styles.convDate}>{formatDateTime(c.updatedAt)}</span>
                  {c._count?.messages > 0 && <span className={styles.convCount}>{c._count.messages} msgs</span>}
                </div>
              </button>
            ))}
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
              {editingSubject ? (
                <div className={styles.editSubjectWrap}>
                  <input
                    ref={subjectInputRef}
                    type="text"
                    value={subjectDraft}
                    onChange={(e) => setSubjectDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveSubject(); if (e.key === 'Escape') cancelEditSubject(); }}
                    className={styles.subjectInput}
                    maxLength={200}
                  />
                  <button className={styles.subjectActionBtn} onClick={saveSubject} title="Save"><HiCheck size={16} /></button>
                  <button className={styles.subjectActionBtn} onClick={cancelEditSubject} title="Cancel"><HiX size={16} /></button>
                </div>
              ) : (
                <>
                  <span className={styles.chatSubject}>{activeConvData?.subject || 'New conversation'}</span>
                  <button className={styles.editSubjectBtn} onClick={startEditSubject} title="Rename conversation">
                    <HiPencil size={14} />
                  </button>
                </>
              )}
            </div>
            <div className={styles.messages}>
              {messages.map((m) => (
                <div key={m.id} className={`${styles.msg} ${m.sender === 'USER' ? styles.sent : styles.received}`}>
                  <p className={styles.msgContent}>{m.content}</p>
                  <span className={styles.msgTime}>{formatDateTime(m.createdAt)}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
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

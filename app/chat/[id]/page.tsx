'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { getChatMessages, sendMessage, markChatRead, getChatRoom, type ChatMessage } from '@/lib/workpro-api';

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = use(params);
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [otherUserName, setOtherUserName] = useState<string>('');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loadingRef = useRef(false);

  const currentUserId = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('piUser') || '{}')?.uid || null
    : null;

  useEffect(() => {
    try {
      const uid = JSON.parse(localStorage.getItem('piUser') || 'null')?.uid;
      if (!uid) { router.replace('/login'); return; }
    } catch { router.replace('/login'); return; }
  }, [router]);

  // Merge by ID to prevent duplicates from optimistic updates
  const mergeMessages = (prev: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] => {
    const map = new Map(incoming.map(m => [m.id, m]));
    // Keep optimistic (high negative temp ids) that server hasn't confirmed yet
    prev.forEach(m => { if (!map.has(m.id)) map.set(m.id, m); });
    return Array.from(map.values()).sort((a, b) => a.id - b.id);
  };

  const loadMessages = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    try {
      const { messages: msgs } = await getChatMessages(roomId);
      setMessages((prev) => mergeMessages(prev, msgs));
      setError(null);
    } catch (_) {
      // silently retry next interval
    } finally {
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    markChatRead();
    loadMessages();
    getChatRoom(roomId).then(({ room }) => {
      if (!room) return;
      const isClient = room.client_id === currentUserId;
      const name = isClient ? room.freelancer_username : room.client_username;
      if (name) setOtherUserName(name);
    }).catch(() => {});
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput('');
    setError(null);
    try {
      const { message } = await sendMessage(roomId, text);
      setMessages((prev) => mergeMessages(prev, [message]));
    } catch (e: any) {
      setInput(text);
      setError('Не удалось отправить сообщение');
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      backgroundColor: PIWORK_THEME.colors.bgPrimary, color: PIWORK_THEME.colors.textPrimary,
    }}>
      <header style={{
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
        padding: `${PIWORK_THEME.spacing.md}px`,
        display: 'flex', alignItems: 'center', gap: PIWORK_THEME.spacing.md, flexShrink: 0,
      }}>
        <button onClick={() => router.back()} style={{
          backgroundColor: 'transparent', border: 'none',
          color: PIWORK_THEME.colors.primary, fontSize: 24, cursor: 'pointer', padding: 0,
        }}>←</button>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{otherUserName || 'Чат'}</h1>
          <p style={{ fontSize: 12, color: PIWORK_THEME.colors.textSecondary, margin: 0 }}>
            {messages.length > 0 ? `${messages.length} сообщений` : 'онлайн'}
          </p>
        </div>
      </header>

      <div style={{
        flex: 1, overflowY: 'auto', padding: PIWORK_THEME.spacing.md,
        display: 'flex', flexDirection: 'column', gap: PIWORK_THEME.spacing.sm,
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: PIWORK_THEME.colors.textSecondary, marginTop: 40, fontSize: 14 }}>
            Начните общение
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
              {!isMe && (
                <span style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, marginBottom: 2 }}>
                  {msg.sender_name}
                </span>
              )}
              <div style={{
                maxWidth: '75%', padding: `${PIWORK_THEME.spacing.sm}px ${PIWORK_THEME.spacing.md}px`,
                borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                backgroundColor: isMe ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.bgSecondary,
                color: isMe ? '#fff' : PIWORK_THEME.colors.textPrimary,
                border: isMe ? 'none' : `1px solid ${PIWORK_THEME.colors.border}`,
              }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.message}</p>
              </div>
              <span style={{ fontSize: 11, color: PIWORK_THEME.colors.textSecondary, marginTop: 2 }}>
                {formatTime(msg.created_at)}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div style={{
          margin: `0 ${PIWORK_THEME.spacing.md}px ${PIWORK_THEME.spacing.sm}px`,
          padding: '8px 12px', backgroundColor: '#EF444420',
          borderRadius: PIWORK_THEME.radius.md, color: '#EF4444', fontSize: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          {error}
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
      )}

      <div style={{
        backgroundColor: PIWORK_THEME.colors.bgSecondary,
        borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
        padding: PIWORK_THEME.spacing.md,
        display: 'flex', gap: PIWORK_THEME.spacing.sm, alignItems: 'center', flexShrink: 0,
      }}>
        <input
          ref={inputRef} type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Сообщение..."
          style={{
            flex: 1, backgroundColor: PIWORK_THEME.colors.bgPrimary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            borderRadius: 24, padding: '10px 16px',
            color: PIWORK_THEME.colors.textPrimary, fontSize: 14, outline: 'none',
          }}
        />
        <button onClick={handleSend} disabled={!input.trim() || sending} style={{
          width: 44, height: 44, borderRadius: '50%',
          backgroundColor: input.trim() ? PIWORK_THEME.colors.primary : PIWORK_THEME.colors.border,
          border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, transition: 'all 200ms ease', flexShrink: 0,
        }}>
          {sending ? '...' : '➤'}
        </button>
      </div>
    </div>
  );
}

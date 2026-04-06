'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PIWORK_THEME } from '@/lib/piwork-design-tokens';
import { BottomNavigation } from '@/components/bottom-navigation';
import { Spinner } from '@/components/spinner';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
}

export default async function ChatDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm interested in your writing task.",
      sender: 'other',
      timestamp: '10:30',
    },
    {
      id: 2,
      text: "Sure! What's your experience with product descriptions?",
      sender: 'me',
      timestamp: '10:32',
    },
    {
      id: 3,
      text: 'I have 5 years of experience in e-commerce content writing.',
      sender: 'other',
      timestamp: '10:35',
    },
    {
      id: 4,
      text: 'Perfect! Can you start tomorrow?',
      sender: 'me',
      timestamp: '10:37',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const checkTablet = () => setIsTablet(window.innerWidth >= 768);
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setIsSending(true);
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
      };
      
      await new Promise((resolve) => setTimeout(resolve, 300));
      setMessages([...messages, newMessage]);
      setInputValue('');
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: PIWORK_THEME.colors.bgPrimary,
        color: PIWORK_THEME.colors.textPrimary,
        paddingBottom: isTablet ? 80 : 64,
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderBottom: `1px solid ${PIWORK_THEME.colors.border}`,
          padding: `${PIWORK_THEME.spacing.md}px`,
          display: 'flex',
          alignItems: 'center',
          gap: PIWORK_THEME.spacing.md,
          animation: 'slideInRight 300ms ease-out',
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: PIWORK_THEME.colors.primary,
            fontSize: 24,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          ←
        </button>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: PIWORK_THEME.colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
        >
          👤
        </div>

        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: PIWORK_THEME.typography.h2.fontSize,
              fontWeight: 700,
              margin: 0,
              marginBottom: 4,
            }}
          >
            TechStore Designer
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: PIWORK_THEME.typography.small.fontSize,
              color: PIWORK_THEME.colors.textSecondary,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: '#22C55E',
              }}
            />
            Online
          </div>
        </div>
      </header>

      {/* Messages */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: PIWORK_THEME.spacing.md,
          display: 'flex',
          flexDirection: 'column',
          gap: PIWORK_THEME.spacing.md,
          maxWidth: 1024,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'me' ? 'flex-end' : 'flex-start',
              animation: `slideUp 200ms ease-out ${index * 50}ms both`,
            }}
          >
            <div
              style={{
                maxWidth: isTablet ? '50%' : '75%',
                backgroundColor:
                  message.sender === 'me'
                    ? PIWORK_THEME.colors.primary
                    : PIWORK_THEME.colors.bgSecondary,
                color:
                  message.sender === 'me'
                    ? '#FFFFFF'
                    : PIWORK_THEME.colors.textPrimary,
                padding: `${PIWORK_THEME.spacing.md}px`,
                borderRadius: PIWORK_THEME.radius.lg,
                wordWrap: 'break-word',
                border:
                  message.sender === 'me'
                    ? 'none'
                    : `1px solid ${PIWORK_THEME.colors.border}`,
              }}
            >
              <p
                style={{
                  fontSize: PIWORK_THEME.typography.body.fontSize,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {message.text}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color:
                    message.sender === 'me'
                      ? 'rgba(255, 255, 255, 0.7)'
                      : PIWORK_THEME.colors.textSecondary,
                  margin: '4px 0 0 0',
                }}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer
        style={{
          backgroundColor: PIWORK_THEME.colors.bgSecondary,
          borderTop: `1px solid ${PIWORK_THEME.colors.border}`,
          padding: PIWORK_THEME.spacing.md,
          display: 'flex',
          gap: PIWORK_THEME.spacing.sm,
          alignItems: 'center',
          maxWidth: 1024,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <button
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: PIWORK_THEME.colors.textSecondary,
            fontSize: 20,
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 200ms ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = PIWORK_THEME.colors.primary;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color =
              PIWORK_THEME.colors.textSecondary;
          }}
          title="Attach file"
        >
          📎
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isSending) {
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          disabled={isSending}
          style={{
            flex: 1,
            height: 48,
            padding: `${PIWORK_THEME.spacing.md}px`,
            backgroundColor: PIWORK_THEME.colors.bgPrimary,
            border: `1px solid ${PIWORK_THEME.colors.border}`,
            borderRadius: PIWORK_THEME.radius.lg,
            color: PIWORK_THEME.colors.textPrimary,
            fontSize: PIWORK_THEME.typography.body.fontSize,
            outline: 'none',
            transition: 'border-color 200ms ease',
          }}
        />

        <button
          onClick={handleSendMessage}
          disabled={isSending}
          style={{
            backgroundColor: PIWORK_THEME.colors.primary,
            border: 'none',
            color: '#FFFFFF',
            fontSize: 20,
            cursor: isSending ? 'not-allowed' : 'pointer',
            padding: 8,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            opacity: isSending ? 0.6 : 1,
            transition: 'all 200ms ease',
          }}
          onMouseDown={(e) => {
            if (!isSending) {
              (e.currentTarget as HTMLElement).style.transform = 'scale(0.97)';
            }
          }}
          onMouseUp={(e) => {
            if (!isSending) {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }
          }}
        >
          {isSending ? <Spinner size="sm" color="white" /> : '📤'}
        </button>
      </footer>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

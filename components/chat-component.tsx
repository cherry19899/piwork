'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  jobId?: string;
}

export interface ChatThread {
  id: string;
  participantIds: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: Date;
  jobId?: string;
}

interface ChatComponentProps {
  threadId?: string;
  recipientId?: string;
  recipientName?: string;
  jobId?: string;
}

export function ChatComponent({ threadId, recipientId, recipientName, jobId }: ChatComponentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !recipientId) return;

    setIsLoading(true);
    try {
      // Firebase integration will go here
      // For now, mock implementation
      const newMessage: ChatMessage = {
        id: 'msg_' + Math.random().toString(36).substr(2, 9),
        senderId: 'current_user_id',
        senderName: 'You',
        recipientId,
        content: messageText,
        timestamp: new Date(),
        read: false,
        jobId,
      };

      setMessages([...messages, newMessage]);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          {recipientName || 'Chat'}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">No messages yet</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === 'current_user_id' ? 'justify-end' : 'justify-start'}`}
            >
              <Card
                className={`max-w-xs px-3 py-2 text-sm ${
                  msg.senderId === 'current_user_id'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-card text-foreground'
                }`}
              >
                {msg.content}
              </Card>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !messageText.trim()}
          className="bg-accent hover:bg-accent/90 text-accent-foreground px-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

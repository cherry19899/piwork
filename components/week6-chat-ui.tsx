'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { sendMessage, getMessageHistory, subscribeToMessages, markMessageAsRead, compressImage } from '@/lib/week6-chat';
import { notifyNewMessage } from '@/lib/push-notifications';
import { Send, Image as ImageIcon, Loader2, Check, CheckCheck } from 'lucide-react';

interface ChatProps {
  taskId: string;
  userId: string;
  recipientId: string;
  onSendMessage?: () => void;
}

export function Chat({ taskId, userId, recipientId, onSendMessage }: ChatProps) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load message history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const history = await getMessageHistory(taskId);
      setMessages(history);
    };
    loadHistory();
  }, [taskId]);

  // Subscribe to real-time messages
  useEffect(() => {
    const unsubscribe = subscribeToMessages(taskId, (updatedMessages) => {
      setMessages(updatedMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [taskId]);

  // Mark messages as read
  useEffect(() => {
    messages.forEach(msg => {
      if (!msg.isRead && msg.id) {
        markMessageAsRead(msg.id);
      }
    });
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      await sendMessage(taskId, userId, 'User', newMessage);
      await notifyNewMessage(recipientId, taskId, 'User');
      setNewMessage('');
      onSendMessage?.();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum 5MB allowed.');
      return;
    }

    setIsLoading(true);
    try {
      const compressed = await compressImage(file, 800);
      // Upload to storage and get URL
      const imageUrl = 'data:image/jpeg;base64,placeholder';
      
      await sendMessage(taskId, userId, 'User', '', imageUrl);
      await notifyNewMessage(recipientId, taskId, 'User');
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-background p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
          >
            <Card
              className={`max-w-xs p-3 ${
                msg.senderId === userId
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-foreground'
              }`}
            >
              <p className="text-sm break-words">{msg.content}</p>
              {msg.imageUrl && <img src={msg.imageUrl} alt="Message" className="mt-2 max-w-xs rounded" />}
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-xs opacity-70">
                  {msg.createdAt?.toDate().toLocaleTimeString() || 'now'}
                </span>
                {msg.senderId === userId && (
                  msg.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                )}
              </div>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-3 space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
            className="text-sm"
          />
          <Button
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            variant="outline"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

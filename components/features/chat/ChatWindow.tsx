// components/features/chat/ChatWindow.tsx
'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

let socket;

export default function ChatWindow({ caseId, userId }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to the WebSocket server
    fetch('/api/socket').then(() => {
      socket = io();
      socket.emit('join_room', caseId);

      socket.on('receive_message', (data) => {
        setMessages((prev) => [...prev, data]);
      });
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [caseId]);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        caseId,
        senderId: userId,
        content: message,
        createdAt: new Date(),
      };
      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]); // Add own message to UI
      setMessage('');
    }
  };

  return (
    <div className="flex h-[500px] w-full flex-col rounded-xl border border-accent bg-card p-4 shadow-lg">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((msg, index) => (
          <div key={index} className="my-2 rounded-lg bg-gray-200 p-3">
            <p className="text-sm text-muted-text">User ID: {msg.senderId}</p>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex space-x-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          className="flex-1 rounded-2xl"
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage} className="rounded-2xl bg-primary">Send</Button>
      </div>
    </div>
  );
}

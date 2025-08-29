// components/features/chat/ChatWindow.tsx (Revised)
'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaVideo } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

let socket;

export default function ChatWindow({ caseId, userId }) {
  const { data: session } = useSession();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
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

  const sendMessage = (content) => {
    if (content.trim()) {
      const messageData = {
        caseId,
        senderId: userId,
        content: content,
        createdAt: new Date(),
      };
      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
      setMessage('');
    }
  };

  const scheduleMeeting = async () => {
    try {
      const response = await fetch('/api/zoom/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'Legal Consultation', duration: 30 }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }

      // Send the meeting URL as a chat message
      sendMessage(`A Zoom meeting has been scheduled. Join here: ${data.joinUrl}`);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      alert('Failed to schedule meeting. Please try again.');
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
            if (e.key === 'Enter') sendMessage(message);
          }}
          className="flex-1 rounded-2xl"
          placeholder="Type a message..."
        />
        <Button onClick={() => sendMessage(message)} className="rounded-2xl bg-primary">Send</Button>
        {session?.user.role === 'LAWYER' && (
          <Button onClick={scheduleMeeting} className="rounded-2xl bg-secondary">
            <FaVideo />
          </Button>
        )}
      </div>
    </div>
  );
}

// components/features/zoom/ZoomScheduler.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function ZoomScheduler({ caseId }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');

  const createMeeting = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/zoom/create-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          start_time: new Date().toISOString(),
          duration: 30, // 30 minutes
          password: '123',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Zoom meeting.');
      }

      const data = await response.json();
      setMeetingUrl(data.joinUrl);
      // Here you would also send the meeting URL to the client via the chat system.
      // e.g., socket.emit('send_message', { caseId, content: `Meeting link: ${data.joinUrl}` });

    } catch (error) {
      console.error(error);
      alert('Failed to create meeting.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 rounded-xl border border-primary bg-card"
    >
      <h3 className="text-xl font-bold mb-4">Schedule a Zoom Meeting</h3>
      <Input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Meeting Topic (e.g., Case Consultation)"
        className="mb-4 rounded-2xl"
      />
      <Button onClick={createMeeting} disabled={loading} className="w-full rounded-2xl">
        {loading ? 'Creating...' : 'Create Meeting Link'}
      </Button>
      {meetingUrl && (
        <div className="mt-4">
          <p className="text-muted-text">Meeting created! Share this link:</p>
          <a href={meetingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
            {meetingUrl}
          </a>
        </div>
      )}
    </motion.div>
  );
}

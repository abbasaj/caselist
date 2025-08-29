// app/(main)/client/profile/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaUserCircle, FaEnvelope } from 'react-icons/fa';

export default function ClientProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile.');
      }

      const data = await response.json();
      await updateSession({ user: data.user }); // Update the session immediately
      setIsEditing(false);
      // Show success toast
    } catch (error) {
      console.error(error);
      // Show error toast
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="rounded-xl border border-primary shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-primary">My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <FaUserCircle size={64} className="text-primary" />
              <div>
                <p className="text-sm text-muted-text">Role: {session?.user.role}</p>
                <p className="text-sm text-muted-text">Email: {session?.user.email}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-muted-text">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <Button onClick={handleSave} className="rounded-2xl bg-primary text-white">Save Changes</Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="rounded-2xl bg-secondary text-white">Edit Profile</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

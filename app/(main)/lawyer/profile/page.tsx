// app/(main)/lawyer/profile/page.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LawyerProfilePage() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  
  // Example state for profile data
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || 'Loading...',
    specialization: 'Criminal Law',
    yearsExperience: 8,
    barAssociationId: '12345-CA',
    availability: 'Mondays, Wednesdays, Fridays',
    fees: '$300/hour',
    bio: 'Experienced criminal defense lawyer with a passion for justice.',
  });

  const handleSave = async () => {
    // API call to update the lawyer's profile
    setIsEditing(false);
    // You would use an API route here to save this data to your database.
    // e.g., POST request to `/api/lawyers/update-profile`
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (session?.user.role !== 'LAWYER' && session?.user.role !== 'ADMIN') {
    // This is for client viewing. A client would see a read-only version.
    // For this example, we'll assume a lawyer is viewing their own profile.
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
            <p className="text-sm text-muted-text">Manage your professional details for clients.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-muted-text">Name</label>
                <Input value={profileData.name} disabled className="mt-1" />
              </div>
              <div>
                <label className="block text-muted-text">Specialization</label>
                <Input value={profileData.specialization} disabled={!isEditing} onChange={(e) => setProfileData({...profileData, specialization: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="block text-muted-text">Years of Experience</label>
                <Input value={profileData.yearsExperience} type="number" disabled={!isEditing} onChange={(e) => setProfileData({...profileData, yearsExperience: parseInt(e.target.value)})} className="mt-1" />
              </div>
              <div>
                <label className="block text-muted-text">Bar Association ID</label>
                <Input value={profileData.barAssociationId} disabled={!isEditing} onChange={(e) => setProfileData({...profileData, barAssociationId: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="block text-muted-text">Availability</label>
                <Input value={profileData.availability} disabled={!isEditing} onChange={(e) => setProfileData({...profileData, availability: e.target.value})} className="mt-1" />
              </div>
              <div>
                <label className="block text-muted-text">Fees</label>
                <Input value={profileData.fees} disabled={!isEditing} onChange={(e) => setProfileData({...profileData, fees: e.target.value})} className="mt-1" />
              </div>
            </div>
            
            <div>
              <label className="block text-muted-text">Bio</label>
              <textarea value={profileData.bio} disabled={!isEditing} onChange={(e) => setProfileData({...profileData, bio: e.target.value})} rows={4} className="mt-1 w-full rounded-2xl border border-accent p-4" />
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

// app/(main)/admin/lawyer-approval/page.tsx

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { FaUserCheck, FaTimesCircle } from 'react-icons/fa';

export default async function LawyerApprovalPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/signin');
  }

  // Fetch users with the CLIENT role who have provided lawyer-specific details
  const pendingLawyers = await prisma.user.findMany({
    where: {
      role: 'CLIENT', // Assuming new lawyers sign up as clients first
      barAssociationId: { not: null }, // Simple check to see if they've submitted credentials
    },
    select: {
      id: true,
      name: true,
      email: true,
      specialization: true,
      yearsExperience: true,
      barAssociationId: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const handleApproval = async (lawyerId) => {
    'use server'; // This function runs on the server
    await prisma.user.update({
      where: { id: lawyerId },
      data: { role: 'LAWYER' },
    });
    redirect('/admin/lawyer-approval'); // Refresh the page
  };

  return (
    <div className="flex min-h-screen flex-col p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-primary mb-6">Lawyer Approval</h1>
        <p className="text-lg text-muted-text mb-8">Review and approve new lawyer applications.</p>
        
        {pendingLawyers.length === 0 ? (
          <Card className="rounded-xl border border-accent shadow-lg text-center p-8">
            <h2 className="text-2xl text-accent">No pending applications.</h2>
            <p className="mt-2 text-muted-text">All lawyers have been approved.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingLawyers.map((lawyer) => (
              <Card key={lawyer.id} className="rounded-xl border border-secondary shadow-lg p-6">
                <CardHeader>
                  <CardTitle className="text-2xl">{lawyer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li><span className="font-semibold">Email:</span> {lawyer.email}</li>
                    <li><span className="font-semibold">Specialization:</span> {lawyer.specialization}</li>
                    <li><span className="font-semibold">Experience:</span> {lawyer.yearsExperience} years</li>
                    <li><span className="font-semibold">Bar ID:</span> {lawyer.barAssociationId}</li>
                  </ul>
                  <div className="mt-6 flex justify-between space-x-4">
                    <form action={() => handleApproval(lawyer.id)} className="w-full">
                      <Button type="submit" className="w-full rounded-2xl bg-secondary text-white">
                        <FaUserCheck className="mr-2" /> Approve
                      </Button>
                    </form>
                    {/* A reject button could also be implemented here */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

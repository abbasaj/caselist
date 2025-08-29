// app/(main)/lawyer/case/[id]/page.tsx (Revised)

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ChatWindow from '@/components/features/chat/ChatWindow';
import ClientProfileCard from '@/components/features/client/ClientProfileCard';
import prisma from '@/lib/prisma';
import { FaGavel } from 'react-icons/fa';

async function handleCloseCase(caseId) {
  'use server';
  try {
    // Update the case status to 'CLOSED'
    await prisma.case.update({
      where: { id: caseId },
      data: { status: 'CLOSED' },
    });
    // Redirect the lawyer back to their dashboard
    redirect('/lawyer/dashboard');
  } catch (error) {
    console.error('Failed to close case:', error);
    // Handle error gracefully
  }
}

export default async function LawyerCaseDetailsPage({ params }) {
  const session = await auth();

  if (!session || session.user.role !== 'LAWYER') {
    redirect('/signin');
  }

  const caseId = params.id;
  const caseDetails = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      client: true,
      lawyer: true,
    },
  });

  if (!caseDetails || caseDetails.lawyerId !== session.user.id) {
    redirect('/lawyer/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-primary mb-6">{caseDetails.title}</h1>
        <p className="text-lg text-muted-text mb-8">Case ID: {caseDetails.id}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="rounded-xl border border-secondary shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-secondary">Case Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{caseDetails.summary}</p>
              </CardContent>
            </Card>
            <h2 className="text-3xl font-bold text-primary">Secure Chat</h2>
            <ChatWindow caseId={caseDetails.id} userId={session.user.id} />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary">Case Client</h2>
            <ClientProfileCard client={caseDetails.client} />
            {caseDetails.status !== 'CLOSED' && (
              <form action={async () => {
                'use server';
                await handleCloseCase(caseDetails.id);
              }}>
                <Button type="submit" className="w-full rounded-2xl bg-primary text-white">
                  <FaGavel className="mr-2" /> Close Case
                </Button>
              </form>
            )}
            {caseDetails.status === 'CLOSED' && (
              <p className="text-center text-lg text-green-500 font-semibold">Case is Closed</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

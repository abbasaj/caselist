// app/(main)/lawyer/case/[id]/page.tsx

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatWindow from '@/components/features/chat/ChatWindow';
import ClientProfileCard from '@/components/features/client/ClientProfileCard';
import prisma from '@/lib/prisma';
import { FaGavel } from 'react-icons/fa';

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

  // Ensure the lawyer is assigned to this case before allowing access
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
          {/* Main Content Area */}
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

          {/* Sidebar */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-primary">Case Client</h2>
            <ClientProfileCard client={caseDetails.client} />
            {/* The lawyer could have a "Close Case" button here */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

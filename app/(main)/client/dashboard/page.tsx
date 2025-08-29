// app/(main)/client/dashboard/page.tsx

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { FaGavel, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== 'CLIENT') {
    redirect('/signin');
  }

  // Fetch all cases for the authenticated client
  const cases = await prisma.case.findMany({
    where: { clientId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      status: true,
      lawyer: { select: { name: true } },
      createdAt: true,
    },
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <FaSpinner className="animate-spin text-secondary" />;
      case 'PENDING_LAWYER_MATCH':
        return <FaExclamationCircle className="text-accent" />;
      case 'CLOSED':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaGavel className="text-muted-text" />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-primary mb-6">My Cases</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.length === 0 ? (
            <Card className="rounded-xl border border-accent shadow-lg text-center p-8">
              <h2 className="text-2xl text-accent">No cases found.</h2>
              <p className="mt-2 text-muted-text">Start a new case to get legal help.</p>
              <Link href="/client/case-intake">
                <Button className="mt-4 rounded-2xl bg-primary">Start a New Case</Button>
              </Link>
            </Card>
          ) : (
            cases.map((caseItem) => (
              <motion.div
                key={caseItem.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link href={`/client/case/${caseItem.id}`}>
                  <Card className="rounded-xl border border-secondary shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300">
                    <CardHeader className="flex flex-row justify-between items-center">
                      <CardTitle className="text-xl text-foreground">{caseItem.title}</CardTitle>
                      {getStatusIcon(caseItem.status)}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-text mt-2">
                        Lawyer: {caseItem.lawyer?.name || 'Pending Match'}
                      </p>
                      <p className="text-sm text-muted-text">
                        Status: <span className="font-semibold">{caseItem.status.replace(/_/g, ' ')}</span>
                      </p>
                      <p className="text-xs text-muted-text mt-2">
                        Created: {new Date(caseItem.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

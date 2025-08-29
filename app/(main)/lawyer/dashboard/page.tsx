// app/(main)/lawyer/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaBriefcase, FaStar, FaMoneyBillWave } from 'react-icons/fa';

export default async function LawyerDashboardPage() {
  const session = await auth();

  if (!session || (session.user.role !== 'LAWYER' && session.user.role !== 'ADMIN')) {
    redirect('/signin');
  }

  // Placeholder data - in a real app, this would be fetched from your database
  const lawyerStats = {
    openCases: 5,
    casesInProgress: 2,
    rating: 4.8,
    totalEarnings: '$12,500',
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-primary">Welcome, {session.user.name}!</h1>
        <p className="mt-2 text-lg text-muted-text">
          Here's a quick overview of your cases.
        </p>
      </motion.div>

      <div className="mt-12 grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="rounded-xl border border-secondary shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl text-secondary">Open Cases</CardTitle>
              <FaBriefcase size={32} className="text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-foreground">{lawyerStats.openCases}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="rounded-xl border border-accent shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl text-accent">In Progress</CardTitle>
              <FaBriefcase size={32} className="text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-foreground">{lawyerStats.casesInProgress}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="rounded-xl border border-primary shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl text-primary">Your Rating</CardTitle>
              <FaStar size={32} className="text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-foreground">{lawyerStats.rating}</div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="rounded-xl border border-muted-text shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl text-muted-text">Total Earnings</CardTitle>
              <FaMoneyBillWave size={32} className="text-muted-text" />
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-foreground">{lawyerStats.totalEarnings}</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

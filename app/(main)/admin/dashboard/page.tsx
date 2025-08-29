// app/(main)/admin/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUserShield, FaGavel, FaHandshake, FaChartBar } from 'react-icons/fa';

export default async function AdminDashboardPage() {
  const session = await auth();

  // Redirect if user is not an Admin
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/signin');
  }

  return (
    <div className="flex min-h-screen flex-col p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/admin/lawyer-approval">
              <Card className="rounded-xl border border-secondary shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-2xl text-secondary">Approve Lawyers</CardTitle>
                  <FaUserShield size={40} className="text-secondary" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-text">Review and approve new lawyer signups to grant them access.</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/admin/manage-cases">
              <Card className="rounded-xl border border-accent shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-2xl text-accent">Manage Cases</CardTitle>
                  <FaGavel size={40} className="text-accent" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-text">View all active and closed cases. Intervene in disputes.</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/admin/payments">
              <Card className="rounded-xl border border-primary shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-2xl text-primary">Manage Payments</CardTitle>
                  <FaHandshake size={40} className="text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-text">Oversee all financial transactions, including fund releases.</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/admin/analytics">
              <Card className="rounded-xl border border-gray-400 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-2xl text-gray-400">View Analytics</CardTitle>
                  <FaChartBar size={40} className="text-gray-400" />
                </CardHeader>
                <CardContent>
                  <p className="text-muted-text">Access platform performance data, revenue, and user metrics.</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

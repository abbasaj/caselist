// app/(main)/client/payments/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FaMoneyBillWave } from 'react-icons/fa';
import prisma from '@/lib/prisma';

export default async function PaymentsPage() {
  const session = await auth();

  if (!session) {
    redirect('/signin');
  }

  // Fetch payments for the current user
  const payments = await prisma.payment.findMany({
    where: {
      OR: [
        { clientId: session.user.id },
        { lawyerId: session.user.id }
      ]
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      case: true,
    },
  });

  return (
    <div className="flex min-h-screen flex-col p-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-primary mb-6">Payment History</h1>
        <Card className="rounded-xl border border-primary shadow-lg">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-2xl">Transactions</CardTitle>
            <FaMoneyBillWave size={32} className="text-primary" />
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-center text-muted-text">No payments found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Case</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.case?.title || 'N/A'}</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                          ${payment.status === 'RELEASED' ? 'bg-green-100 text-green-800' :
                           payment.status === 'HELD' ? 'bg-yellow-100 text-yellow-800' :
                           'bg-gray-100 text-gray-800'}`
                        }>
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

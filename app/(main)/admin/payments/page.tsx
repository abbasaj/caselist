// app/(main)/admin/payments/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import prisma from '@/lib/prisma';

export default async function AdminPaymentsPage() {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/signin');
  }

  // Fetch all payments that are not yet released
  const heldPayments = await prisma.payment.findMany({
    where: { status: 'HELD' },
    include: {
      case: {
        include: {
          client: true,
          lawyer: true,
        },
      },
    },
  });

  const handleReleaseFunds = async (paymentId, amount, lawyerStripeId) => {
    'use server'; // This function runs on the server
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/release-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, amount, lawyerStripeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to release funds.');
      }

      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'RELEASED' },
      });
      
      redirect('/admin/payments'); // Refresh the page
    } catch (error) {
      console.error(error);
      // Handle error, maybe update the UI with an error message
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
        <h1 className="text-4xl font-bold text-primary mb-6">Payments & Disputes</h1>
        <p className="text-lg text-muted-text mb-8">Manage held funds and resolve case disputes.</p>
        
        <Card className="rounded-xl border border-secondary shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-secondary">Held Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {heldPayments.length === 0 ? (
              <p className="text-center text-muted-text">No funds are currently being held.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Lawyer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {heldPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.caseId}</TableCell>
                        <TableCell>${payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{payment.case.client.name}</TableCell>
                        <TableCell>{payment.case.lawyer?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                            HELD
                          </span>
                        </TableCell>
                        <TableCell>
                          <form action={() => handleReleaseFunds(payment.id, payment.amount, payment.case.lawyer?.stripeId)}>
                            <Button type="submit" className="rounded-2xl" variant="outline">
                              <FaCheckCircle className="mr-2" /> Release Funds
                            </Button>
                          </form>
                          {/* A "Resolve Dispute" button would go here for DISPUTE status */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

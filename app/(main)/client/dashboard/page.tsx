// app/(main)/client/dashboard/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session || session.user.role !== 'CLIENT') {
    redirect('/signin');
  }

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
          What would you like to do today?
        </p>
      </motion.div>

      <div className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="rounded-xl border border-secondary shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-secondary">Start a New Case</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-text">
                Start a new case by providing details and get matched with a lawyer.
              </p>
              <Button asChild className="mt-4 w-full rounded-2xl bg-secondary text-white">
                <Link href="/client/case/intake">Start Now</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="rounded-xl border border-accent shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-accent">View My Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-text">
                Review the status and history of all your past and current cases.
              </p>
              <Button asChild className="mt-4 w-full rounded-2xl bg-accent text-white">
                <Link href="/client/cases">View Cases</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Card className="rounded-xl border border-primary shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Saved Lawyers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-text">
                Access a list of lawyers you've saved for future reference.
              </p>
              <Button asChild className="mt-4 w-full rounded-2xl bg-primary text-white">
                <Link href="/client/saved-lawyers">View List</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

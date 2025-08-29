// app/(main)/client/case/[id]/page.tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatWindow from '@/components/features/chat/ChatWindow';
import LawyerProfileCard from '@/components/features/lawyer/LawyerProfileCard';
import prisma from '@/lib/prisma';
import { PDFDownloadLink } from '@react-pdf/renderer';
import CaseSummaryPDF from '@/components/features/case/CaseSummaryPDF';
import { Button } from '@/components/ui/button';

export default async function CaseDetailsPage({ params }) {
  const session = await auth();

  if (!session) {
    redirect('/signin');
  }

  const caseId = params.id;

  // Fetch case and lawyer details from the database
  const caseDetails = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      lawyer: true,
      client: true,
    },
  });

  if (!caseDetails || caseDetails.clientId !== session.user.id) {
    // Redirect if the case doesn't exist or the user doesn't own it
    redirect('/client/dashboard');
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
                <div className="mt-4">
                  <PDFDownloadLink
                    document={<CaseSummaryPDF caseTitle={caseDetails.title} summary={caseDetails.summary} clientName={caseDetails.client.name} />}
                    fileName={`${caseDetails.title}_summary.pdf`}
                  >
                    {({ loading }) => (
                      <Button className="rounded-2xl" disabled={loading} variant="outline">
                        {loading ? 'Generating...' : 'Download PDF'}
                      </Button>
                    )}
                  </PDFDownloadLink>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-3xl font-bold text-primary">Secure Chat</h2>
            <ChatWindow caseId={caseDetails.id} userId={session.user.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {caseDetails.lawyer ? (
              <>
                <h2 className="text-3xl font-bold text-primary">Your Lawyer</h2>
                <LawyerProfileCard lawyer={caseDetails.lawyer} />
                {/* A button to initiate payment would go here */}
              </>
            ) : (
              <Card className="rounded-xl border border-accent shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-accent">No Lawyer Assigned</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-text">We are currently matching you with a suitable lawyer. You will be notified when one has been assigned.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

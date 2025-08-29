// app/(main)/layout.tsx
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminLayout from '@/components/layouts/AdminLayout';
import LawyerLayout from '@/components/layouts/LawyerLayout';
import ClientLayout from '@/components/layouts/ClientLayout';
import { Session } from 'next-auth'; // Import Session type

export default async function MainLayout({ children }: { children: ReactNode }) {
  const session: Session | null = await auth();

  if (!session) {
    redirect('/signin');
  }

  const userRole = session.user.role;

  switch (userRole) {
    case 'ADMIN':
      return <AdminLayout>{children}</AdminLayout>;
    case 'LAWYER':
      return <LawyerLayout>{children}</LawyerLayout>;
    case 'CLIENT':
      return <ClientLayout>{children}</ClientLayout>;
    default:
      redirect('/signin');
  }
}

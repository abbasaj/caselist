// components/layouts/ClientLayout.tsx
'use client';

import { ReactNode } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaUserCircle, FaSignOutAlt, FaPlusCircle, FaListAlt } from 'react-icons/fa';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="sticky top-0 z-50 flex items-center justify-between p-4 shadow-xl bg-background"
      >
        <Link href="/client/dashboard" className="text-3xl font-bold text-primary">
          Caselist
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/client/profile" className="text-muted-text hover:text-primary transition-colors">
            <FaUserCircle size={24} />
          </Link>
          <button onClick={handleSignOut} className="text-muted-text hover:text-accent transition-colors">
            <FaSignOutAlt size={24} />
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background p-4 shadow-2xl md:hidden">
        <div className="flex justify-around items-center text-muted-text">
          <Link href="/client/dashboard" className="flex flex-col items-center">
            <FaListAlt size={24} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          <Link href="/client/case/intake" className="flex flex-col items-center">
            <FaPlusCircle size={24} />
            <span className="text-xs mt-1">New Case</span>
          </Link>
          <Link href="/client/profile" className="flex flex-col items-center">
            <FaUserCircle size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

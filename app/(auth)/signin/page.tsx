// app/(auth)/signin/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaMicrosoft, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async (provider: string) => {
    await signIn(provider, { callbackUrl: '/client/dashboard' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-background p-4"
    >
      <div className="w-full max-w-md rounded-xl border border-accent bg-background p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-4xl font-bold text-primary">Caselist</h1>
        <p className="mb-8 text-center text-muted-text">
          Sign in to your account
        </p>

        <div className="flex flex-col space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSignIn('google')}
            className="flex items-center justify-center space-x-2 rounded-2xl bg-white px-6 py-3 text-lg font-semibold text-gray-800 shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-primary"
          >
            <FaGoogle />
            <span>Sign in with Google</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSignIn('microsoft')}
            className="flex items-center justify-center space-x-2 rounded-2xl bg-[#2F2F2F] px-6 py-3 text-lg font-semibold text-white shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-primary"
          >
            <FaMicrosoft />
            <span>Sign in with Microsoft</span>
          </motion.button>

          <div className="relative my-4 flex items-center">
            <div className="flex-grow border-t border-gray-400"></div>
            <span className="mx-4 flex-shrink text-muted-text">or</span>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/signup')}
            className="flex items-center justify-center space-x-2 rounded-2xl bg-accent px-6 py-3 text-lg font-semibold text-white shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-primary"
          >
            <FaEnvelope />
            <span>Sign Up with Email</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

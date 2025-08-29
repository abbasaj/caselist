// components/ui/toast.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export function Toast({ message, type, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 transform rounded-2xl p-4 text-white shadow-lg ${bgColor} flex items-center space-x-2`}
        >
          {icon}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Example usage
// const [toast, setToast] = useState({ message: '', type: '' });
// setToast({ message: 'Login successful!', type: 'success' });
// <Toast message={toast.message} type={toast.type} />

import React from 'react';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';

// The MainLayout is a wrapper for all authenticated user routes.
// It provides a consistent dashboard-like experience with a sidebar and a content area.
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {/* Placeholder for a Dashboard Sidebar. This could be where you add
            links for 'Dashboard', 'Case Intake', 'Profile', etc. */}
        <aside className="w-64 bg-gray-100 p-4 border-r border-gray-200 hidden md:block">
          <div className="text-xl font-bold mb-4">Dashboard Navigation</div>
          <ul className="space-y-2">
            <li><a href="/client/dashboard" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">Client Dashboard</a></li>
            <li><a href="/lawyer/dashboard" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">Lawyer Dashboard</a></li>
            <li><a href="/admin/dashboard" className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">Admin Dashboard</a></li>
          </ul>
        </aside>

        {/* The main content area where the specific pages will be rendered. */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

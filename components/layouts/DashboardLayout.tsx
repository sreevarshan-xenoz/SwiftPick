import React from 'react';
import Footer from '../common/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 
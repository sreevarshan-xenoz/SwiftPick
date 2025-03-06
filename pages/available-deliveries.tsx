import React from 'react';
import Head from 'next/head';
import Navigation from '../components/common/Navigation';
import AvailableDeliveries from '../components/delivery/AvailableDeliveries';

export default function AvailableDeliveriesPage() {
  return (
    <>
      <Head>
        <title>Available Deliveries - SwiftPick</title>
        <meta name="description" content="Find available delivery opportunities near you" />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AvailableDeliveries />
        </main>
      </div>
    </>
  );
} 
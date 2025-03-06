import React from 'react';
import Head from 'next/head';
import AvailableDeliveries from '../components/delivery/AvailableDeliveries';
import DashboardLayout from '../components/layouts/DashboardLayout';

export default function AvailableDeliveriesPage() {
  return (
    <>
      <Head>
        <title>Available Deliveries - SwiftPick</title>
        <meta name="description" content="Find available delivery opportunities near you" />
      </Head>
      <DashboardLayout>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AvailableDeliveries />
        </main>
      </DashboardLayout>
    </>
  );
} 
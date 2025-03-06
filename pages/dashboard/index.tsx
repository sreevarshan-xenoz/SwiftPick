import React from 'react';
import Head from 'next/head';
import Dashboard from '../../components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <>
      <Head>
        <title>Dashboard - SwiftPick</title>
        <meta name="description" content="SwiftPick Dashboard - Send or deliver packages" />
      </Head>
      <Dashboard />
    </>
  );
} 
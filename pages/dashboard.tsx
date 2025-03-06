import React from 'react';
import Dashboard from '../components/dashboard/Dashboard';
import Head from 'next/head';

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
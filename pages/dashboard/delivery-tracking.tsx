import React from 'react';
import Head from 'next/head';
import DeliveryTracking from '../../components/delivery/DeliveryTracking';

export default function DeliveryTrackingPage() {
  return (
    <>
      <Head>
        <title>Track Delivery - SwiftPick</title>
        <meta name="description" content="Track your package delivery in real-time on SwiftPick" />
      </Head>
      <DeliveryTracking />
    </>
  );
} 
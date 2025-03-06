import React from 'react';
import Head from 'next/head';
import RequestForm from '../components/delivery/RequestForm';

export default function SendPackagePage() {
  return (
    <>
      <Head>
        <title>Send a Package - SwiftPick</title>
        <meta name="description" content="Create a new delivery request on SwiftPick" />
      </Head>
      <RequestForm />
    </>
  );
} 
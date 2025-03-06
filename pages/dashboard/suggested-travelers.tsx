import React from 'react';
import Head from 'next/head';
import SuggestedTravelers from '../../components/delivery/SuggestedTravelers';

export default function SuggestedTravelersPage() {
  return (
    <>
      <Head>
        <title>Suggested Travelers - SwiftPick</title>
        <meta name="description" content="Find available travelers for your delivery on SwiftPick" />
      </Head>
      <SuggestedTravelers />
    </>
  );
} 
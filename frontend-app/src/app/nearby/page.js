'use client';

import Layout from '@/components/Layout';
import NearbyStations from '@/components/NearbyStations';

export default function NearbyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <NearbyStations compact={false} />
      </div>
    </Layout>
  );
}

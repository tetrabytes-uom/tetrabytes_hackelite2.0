'use client';

import Availability from '@/components/layouts/Availability';
import Welcome from '@/components/layouts/Welcome';
import { useSession } from 'next-auth/react';

export default function AvailabilityPage() {
  const { status } = useSession();

  const showSession = () => {
    if (status === 'authenticated') {
      return <Availability />;
    } else if (status === 'loading') {
      return (
        <span className="flex min-h-screen flex-col items-center justify-center text-[#888] text-sm mt-7">
          Loading...
        </span>
      );
    } else {
      return <Welcome />;
    }
  };

  return <div>{showSession()}</div>;
}

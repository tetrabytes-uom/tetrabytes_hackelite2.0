'use client';

import { useSession } from 'next-auth/react';
import Welcome from '@/components/layouts/Welcome';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {status === 'loading' ? (
        <span className="text-[#888] text-sm mt-7">Loading...</span>
      ) : status === 'authenticated' ? (
        <span className="text-[#888] text-sm mt-7">Redirecting...</span>
      ) : (
        <Welcome />
      )}
    </main>
  );
}

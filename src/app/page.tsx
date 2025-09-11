'use client';

import { signOut, useSession } from 'next-auth/react';
import Welcome from '@/components/layouts/Welcome';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const showSession = () => {
    if (status === 'authenticated') {
      return (
        <button
          className="border border-solid border-black rounded"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push('/');
            });
          }}
        >
          Sign Out
        </button>
      );
    } else if (status === 'loading') {
      return <span className="text-[#888] text-sm mt-7">Loading...</span>;
    } else {
      return <Welcome />;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {showSession()}
    </main>
  );
}

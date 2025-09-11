'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const res = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });
    setIsLoading(false);
    if (res?.error) {
      setError(res.error as string);
    }
    if (res?.ok) {
      return router.push('/dashboard');
    }
  };

  return (
    <section className="flex w-full h-screen">
      {/* Left Panel - Gradient Background with Welcome Text */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#f3cc4c] to-[#f9e08c] text-gray-800 p-12 flex-col justify-center relative">
        <div className="absolute top-8 left-8">
          <h1 className="text-2xl font-bold">planBee<span className="text-[#329f6a]">.</span></h1>
        </div>
        <div className="mt-32">
          <h2 className="text-5xl font-extrabold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">Welcome.</h2>
          <p className="text-2xl font-medium leading-relaxed">
            Optimize your learning journey
            <br />with our AI study planner
          </p>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in to your account</h2>
            <p className="text-gray-600">Access your personalized study plans</p>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f3cc4c] focus:border-[#f3cc4c] transition-all duration-200"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f3cc4c] focus:border-[#f3cc4c] transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => {
                    const input = document.getElementById('password') as HTMLInputElement;
                    input.type = input.type === 'password' ? 'text' : 'password';
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-[#329f6a] to-[#39b97a] text-white font-semibold rounded-lg shadow-md hover:from-[#2a8559] hover:to-[#329f6a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#329f6a] transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-b from-white to-gray-50 text-gray-500">or continue with</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-lg bg-white shadow-sm text-gray-700 hover:bg-gray-50 hover:shadow transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="mr-3" viewBox="0 0 16 16">
                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account? <Link href="/signup" className="text-[#329f6a] font-semibold hover:text-[#2a8559] transition-colors duration-200">Sign up for free</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

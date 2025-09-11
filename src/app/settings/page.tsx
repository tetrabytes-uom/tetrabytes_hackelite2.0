'use client';

import React from 'react';
import Footer from '@/components/UI/Footer';
import { motion } from 'framer-motion';
import {
  Bell,
  Lock,
  User,
  Shield,
  Globe,
  ArrowLeft,
  Settings,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SettingsPage: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#70A961] to-[#5f8c4b] rounded-xl flex items-center justify-center">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-500">
                    Manage your account preferences, notifications, and privacy.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session?.user?.name || 'Student'}
              </span>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(session?.user?.name || session?.user?.email || 'S')
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-16">
        {/* Settings Sections */}
        <div className="space-y-8">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-white p-6 shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <User className="h-6 w-6 text-[#70A961]" />
              <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-800 focus:border-[#70A961] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-800 focus:border-[#70A961] focus:outline-none"
                />
              </div>
            </div>
            <button
              className="mt-4 rounded-lg bg-[#70A961] px-5 py-2 text-white 
  hover:bg-[#5f8c4b] transition-all duration-200 cursor-pointer 
  hover:shadow-lg active:scale-95"
            >
              Save Changes
            </button>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-white p-6 shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <Lock className="h-6 w-6 text-[#70A961]" />
              <h2 className="text-xl font-semibold text-gray-800">Password</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-600">
                  Current Password
                </label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-800 focus:border-[#70A961] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">
                  New Password
                </label>
                <input
                  type="password"
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-800 focus:border-[#70A961] focus:outline-none"
                />
              </div>
            </div>
            <button
              className="mt-4 rounded-lg bg-[#70A961] px-5 py-2 text-white 
  hover:bg-[#5f8c4b] transition-all duration-200 cursor-pointer 
  hover:shadow-lg active:scale-95"
            >
              Update Password
            </button>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-white p-6 shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <Bell className="h-6 w-6 text-[#70A961]" />
              <h2 className="text-xl font-semibold text-gray-800">
                Notifications
              </h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
                Email reminders about study plans
              </label>
              <label className="flex items-center gap-3 text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                />
                Push notifications on progress & updates
              </label>
            </div>
            <button
              className="mt-4 rounded-lg bg-[#70A961] px-5 py-2 text-white 
  hover:bg-[#5f8c4b] transition-all duration-200 cursor-pointer 
  hover:shadow-lg active:scale-95"
            >
              Save Preferences
            </button>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl bg-white p-6 shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <Shield className="h-6 w-6 text-[#70A961]" />
              <h2 className="text-xl font-semibold text-gray-800">Privacy</h2>
            </div>
            <p className="text-gray-700">
              Control what information is visible to others and manage data
              export.
            </p>
            <button
              className="mt-4 rounded-lg bg-[#70A961] px-5 py-2 text-white 
  hover:bg-[#5f8c4b] transition-all duration-200 cursor-pointer 
  hover:shadow-lg active:scale-95"
            >
              Manage Privacy
            </button>
          </motion.div>

          {/* Language/Region */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl bg-white p-6 shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <Globe className="h-6 w-6 text-[#70A961]" />
              <h2 className="text-xl font-semibold text-gray-800">
                Language & Region
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-600">Language</label>
                <select className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-800 focus:border-[#70A961] focus:outline-none">
                  <option>English</option>
                  <option>Sinhala</option>
                  <option>Tamil</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600">Region</label>
                <select className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-800 focus:border-[#70A961] focus:outline-none">
                  <option>Sri Lanka</option>
                  <option>India</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <button
              className="mt-4 rounded-lg bg-[#70A961] px-5 py-2 text-white 
  hover:bg-[#5f8c4b] transition-all duration-200 cursor-pointer 
  hover:shadow-lg active:scale-95"
            >
              Save Settings
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SettingsPage;

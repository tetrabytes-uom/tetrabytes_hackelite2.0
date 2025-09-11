'use client';

import React from 'react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';

type Notification = {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  time: string;
};

const dummyNotifications: Notification[] = [
  {
    id: 1,
    title: 'Plan Updated',
    message: 'Your study plan for AWS Certification has been updated automatically.',
    type: 'success',
    time: '2 hours ago',
  },
  {
    id: 2,
    title: 'New Resource Added',
    message: 'We’ve added new curated resources for your Python track.',
    type: 'info',
    time: 'Yesterday',
  },
  {
    id: 3,
    title: 'Streak Broken',
    message: 'You missed a planned session. Adjust your schedule to stay on track.',
    type: 'warning',
    time: '2 days ago',
  },
];

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    default:
      return <Info className="h-5 w-5 text-blue-600" />;
  }
};

const Notifications: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#70A961]/10 px-4 py-2 text-sm font-semibold text-[#70A961]">
            <Bell className="h-4 w-4" />
            Notifications
          </div>
          <h1 className="bg-gradient-to-r from-[#70A961] to-[#4B7340] bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Stay Up To Date
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            All your alerts and updates in one place.
          </p>
        </motion.div>

        {/* Notification List */}
        <div className="space-y-4">
          {dummyNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm hover:shadow-md"
            >
              <div className="mt-1 rounded-lg bg-gray-50 p-2">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Notifications;

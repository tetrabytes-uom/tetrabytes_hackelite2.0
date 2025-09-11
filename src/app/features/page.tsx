'use client';

import React from 'react';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import { motion } from 'framer-motion';
import { Target, BookOpen, Award, Users, Calendar, Bell } from 'lucide-react';

const features = [
  {
    icon: <Target className="h-7 w-7 text-[#70A961]" />,
    title: 'AI-Powered Study Plans',
    description:
      'Automatically generates and updates personalized study plans based on your goals and schedule.',
  },
  {
    icon: <BookOpen className="h-7 w-7 text-[#70A961]" />,
    title: 'Goal-Oriented Learning Paths',
    description:
      'Create paths aligned to certifications or personal learning objectives with milestones.',
  },
  {
    icon: <Calendar className="h-7 w-7 text-[#70A961]" />,
    title: 'Smart Calendar Integration',
    description:
      'Sync tasks to your calendar and get reminders when it’s time to study or reschedule.',
  },
  {
    icon: <Award className="h-7 w-7 text-[#70A961]" />,
    title: 'Certification Mode',
    description:
      'Focused mode with practice tests and readiness checks for official exams.',
  },
  {
    icon: <Users className="h-7 w-7 text-[#70A961]" />,
    title: 'Gamified Learning',
    description:
      'Earn streaks, badges and climb leaderboards to stay consistent and motivated.',
  },
  {
    icon: <Bell className="h-7 w-7 text-[#70A961]" />,
    title: 'Smart Notifications',
    description:
      'Timely alerts to help you stay on track and adjust plans without stress.',
  },
];

const FeaturesPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-[#70A961]/10 px-4 py-2 text-sm font-semibold text-[#70A961]">
            Features
          </span>
          <h1 className="bg-gradient-to-r from-[#70A961] to-[#4B7340] bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Powerful Features for Smart Learning
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600"
          >
            PlanBee equips you with cutting-edge tools to organize, track and
            complete your learning goals faster and with less stress.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-xl bg-[#70A961]/10 p-3">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;

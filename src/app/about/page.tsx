'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/UI/Navbar';
import Footer from '@/components/UI/Footer';
import { motion } from 'framer-motion';
import { Users, Target, Award, BookOpen } from 'lucide-react';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <Target className="h-6 w-6 text-[#70A961]" />,
      title: 'Dynamic Scheduling with AI',
      description: 'Plans adjust automatically when you fall behind or reschedule.',
    },
    {
      icon: <BookOpen className="h-6 w-6 text-[#70A961]" />,
      title: 'Goal-Oriented Learning Paths',
      description: 'Aligns content and deadlines with your personal goals or certification syllabi.',
    },
    {
      icon: <Award className="h-6 w-6 text-[#70A961]" />,
      title: 'Certification Mode',
      description: 'Focused paths tied to official certifications with mock readiness assessments.',
    },
    {
      icon: <Users className="h-6 w-6 text-[#70A961]" />,
      title: 'Gamified Learning',
      description: 'Streaks, badges and leaderboards to maintain consistency and motivation.',
    },
  ];

  const teamMembers = [
    {name : 'Ishan Hansaka Silva', image: "/ishan.jpg"},
    {name : 'Heshan Maduwantha Yatigammana', image: "/heshan.jpg"},
    {name : 'Chami Praveesha De Silva', image: "/praveesha.jpg"},
    {name : 'Maleesha Nuwanthi Kolombage', image: "/maleesha.jpg"},
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full bg-[#70A961]/10 px-4 py-2 text-sm font-semibold text-[#70A961]">
            About Us
          </span>
          <h1 className="bg-gradient-to-r from-[#70A961] to-[#4B7340] bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            About PlanBee
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-600"
          >
            Revolutionizing self-directed learning with intelligent, adaptive study
            planning for students and professionals worldwide.
          </motion.p>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-24 overflow-hidden rounded-3xl bg-white p-8 shadow-xl"
        >
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-full bg-[#70A961]/10 blur-3xl"></div>
              <Image
                src="/Bee.png"
                alt="PlanBee Logo"
                width={300}
                height={300}
                className="relative mx-auto drop-shadow-xl"
              />
            </motion.div>
            <div>
              <h2 className="mb-6 text-3xl font-bold text-gray-800">Our Story</h2>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-4 text-lg leading-relaxed text-gray-700"
              >
                PlanBee was born at the University of Moratuwa as a project to
                tackle one of the biggest problems in self-directed learning:
                poor planning, static schedules, and lack of motivation. Despite
                the boom in e-learning, course completion rates remain under 30%.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                className="text-lg leading-relaxed text-gray-700"
              >
                We created PlanBee to generate{' '}
                <strong>personalised, adaptive study plans</strong> that match
                your goals, time and learning style — and to keep you engaged
                with reminders, gamification and curated resources.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-24">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
            What Makes Us Different
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
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
        </div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-24 rounded-3xl bg-[#70A961] p-8 text-white md:p-12"
        >
          <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
          <p className="text-lg leading-relaxed text-white/90">
            To empower learners worldwide to save time on manual planning, stay
            on track, and make certification prep less overwhelming — providing
            an engaging, rewarding experience that leads to real results.
          </p>
        </motion.div>

        {/* Team Section */}
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Meet the Team
          </h2>
          <p className="mb-8 text-center text-gray-600">
            PlanBee is developed by a passionate team of undergraduates from the
            University of Moratuwa
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="rounded-xl bg-gray-50 p-4 text-center"
              >
                <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#70A961]/10">
                  {member.image ? (
                    <div className="relative h-16 w-16 rounded-full overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <Users className="h-8 w-8 text-[#70A961]" />
                  )}
                </div>
                <h3 className="font-semibold text-gray-800">{member.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;

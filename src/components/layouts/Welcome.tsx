'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/UI/Navbar';
import {
  Sparkles,
  Clock,
  Trophy,
  Shield,
  LayoutList,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold text-gray-700">
              <Sparkles className="h-4 w-4" />
              AI-powered study assistant
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Build consistent study habits with an assistant that adapts.
            </h1>
            <p className="mt-4 text-lg text-gray-600 md:max-w-[48ch]">
              PlanBee creates dynamic, goal-aligned study plans and reschedules
              automatically when life happens. Prepare for certifications, learn
              new skills, and stay motivated.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-[#70A961] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5f8c4b]"
              >
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-gray-50"
              >
                See how it works
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy-first
              </div>
            </div>
          </div>

          {/* Mock plan preview */}
          <div className="relative">
            <div className="rounded-2xl border bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold">
                  Your 10-week AWS Plan
                </div>
                <span className="text-xs text-gray-500">Auto-synced</span>
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Week 1 · Cloud basics', done: true },
                  { title: 'Week 2 · IAM & Security', done: true },
                  { title: 'Week 3 · Networking (VPC)', done: false },
                  { title: 'Week 4 · Compute (EC2)', done: false },
                ].map((i, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl border px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-4 w-4 rounded-full border ${
                          i.done ? 'bg-[#70A961]' : 'bg-white'
                        }`}
                      />
                      <p className="text-sm font-medium">{i.title}</p>
                    </div>
                    <button className="text-xs font-semibold text-gray-600 hover:text-gray-900">
                      Details
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                Fell behind? We rescheduled Week 3 to keep your streak.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section id="features" className="border-t bg-gray-50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-3 md:px-6">
          <Feature
            icon={<Clock className="h-5 w-5" />}
            title="Dynamic schedules"
            desc="Auto-reshuffle tasks when you miss a day so you never lose momentum."
          />
          <Feature
            icon={<LayoutList className="h-5 w-5" />}
            title="Goal-aligned paths"
            desc="Pick a goal (e.g., AWS, Python) and get a syllabus-aware plan."
          />
          <Feature
            icon={<Trophy className="h-5 w-5" />}
            title="Gamified motivation"
            desc="Streaks, badges, and gentle nudges to keep you engaged."
          />
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 py-16 md:px-6"
      >
        <h2 className="text-2xl font-bold md:text-3xl">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Step
            n={1}
            title="Set your goal"
            desc="Tell us your target (e.g., ‘PMP in 8 weeks’) and availability."
          />
          <Step
            n={2}
            title="Get your plan"
            desc="We generate an adaptive schedule with curated resources."
          />
          <Step
            n={3}
            title="Stay on track"
            desc="Automatic rescheduling + weekly reports to keep you consistent."
          />
        </div>
      </section>

      {/* Certification Mode banner */}
      <section className="border-y bg-[#1a3d28] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold md:text-3xl">
                Certification Mode
              </h3>
              <p className="mt-3 text-gray-200">
                Syllabus-aligned learning paths, mock readiness checks, and
                exam-style reviews for AWS, PMP, and more.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/register"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
              >
                Try it now
              </Link>
              <Link
                href="/certifications"
                className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Browse tracks
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="text-2xl font-bold md:text-3xl">Loved by learners</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              q: 'I finally passed AWS on my first try.',
              a: 'Shifts my plan whenever work gets busy.',
              name: 'Praveesha DS.',
            },
            {
              q: 'My study streak is alive!',
              a: 'The gentle nudges are perfect, not spammy.',
              name: 'Heshan Y.',
            },
            {
              q: 'Way less overwhelming.',
              a: 'It breaks down big goals into daily, doable tasks.',
              name: 'Ishan H.',
            },
          ].map((t, i) => (
            <blockquote key={i} className="rounded-2xl border p-6 shadow-sm">
              <p className="text-lg font-semibold">“{t.q}”</p>
              <p className="mt-2 text-gray-600">{t.a}</p>
              <footer className="mt-4 text-sm font-medium text-gray-700">
                — {t.name}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <h2 className="text-2xl font-bold md:text-3xl">FAQs</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Faq
              q="Is there a free plan?"
              a="Yes. Start free and upgrade for Certification Mode and advanced tracking."
            />
            <Faq
              q="Can I change my goal later?"
              a="Absolutely. We’ll regenerate your plan and move unfinished tasks automatically."
            />
            <Faq
              q="Do you support mobile?"
              a="A mobile app is on the roadmap; the web app already works great on phones."
            />
            <Faq
              q="What about my data?"
              a="We take privacy seriously and only use data to improve your plan experience."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-600 md:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <Image src="/Bee.png" alt="PlanBee" width={20} height={20} />
            <span>© {new Date().getFullYear()} PlanBee</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gray-900">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===== UI atoms ===== */

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-gray-100 p-2">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border p-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#70A961] text-white">
        {n}
      </div>
      <h4 className="mt-4 text-lg font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="rounded-2xl border bg-white p-5">
      <summary className="cursor-pointer list-none text-base font-semibold marker:hidden">
        {q}
      </summary>
      <p className="mt-2 text-sm text-gray-600">{a}</p>
    </details>
  );
}

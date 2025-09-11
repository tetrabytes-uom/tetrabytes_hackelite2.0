"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Target,
  Brain,
  Plus,
  Clock,
  TrendingUp,
  Home,
  Settings,
  Menu,
  X,
  Calendar,
  BarChart3,
  ArrowRight,
  LogOut,
} from "lucide-react";
import Loading from "@/components/UI/Loading";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userGoalsCount, setUserGoalsCount] = useState(0);
  const [userStudyPlans, setUserStudyPlans] = useState<ManualStudyPlan[]>([]);

  interface ManualStudyPlan {
    id: string;
    subject: string;
    modules: { name: string; timeAllocation: number }[];
    totalTime: number;
    createdAt: string;
  }

  // Move all useState hooks to the top before any conditional logic
  const [activeGoals] = useState(
    userStudyPlans.length > 0
      ? userStudyPlans.map((plan) => ({
          id: plan.id,
          title: plan.subject,
          progress: Math.floor(Math.random() * 40) + 30, // Random progress between 30-70%
          daysLeft: Math.floor(Math.random() * 20) + 5, // Random days left
          totalDays: Math.floor(Math.random() * 30) + 14, // Random total days
          type: "manual" as const,
        }))
      : [
          {
            id: 1,
            title: "Learn Python Programming",
            progress: 65,
            daysLeft: 8,
            totalDays: 14,
            type: "manual" as const,
          },
          {
            id: 2,
            title: "JavaScript Fundamentals",
            progress: 30,
            daysLeft: 12,
            totalDays: 21,
            type: "ai-generated" as const,
          },
        ]
  );

  const stats = {
    totalGoals: userGoalsCount,
    activeGoals: userGoalsCount > 0 ? Math.min(userGoalsCount, 2) : 0, // Assume some are active
    completedGoals: Math.max(0, userGoalsCount - 2), // Assume some are completed
    totalStudyHours: userGoalsCount * 10, // Rough estimate
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Brain, label: "AI Coach", href: "/ai-coach", active: false },
    { icon: Target, label: "My Goals", href: "/goals", active: false },
    { icon: Calendar, label: "Schedule", href: "/schedule", active: false },
    { icon: BarChart3, label: "Analytics", href: "/analytics", active: false },
    { icon: Settings, label: "Settings", href: "/settings", active: false },
  ];

  // Load user goals count on component mount
  useEffect(() => {
    if (status === "authenticated") {
      loadUserGoalsCount();
    }
  }, [status]);

  const loadUserGoalsCount = async () => {
    try {
      const response = await fetch("/api/study-plans");
      if (response.ok) {
        const data = await response.json();
        const plans = data.studyPlans || [];
        setUserGoalsCount(plans.length);
        setUserStudyPlans(plans.slice(0, 2)); // Show first 2 plans as active
      }
    } catch (error) {
      console.error("Error loading goals count:", error);
    }
  };

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return <Loading />;
  }

  // Show nothing while redirecting
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Unified Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                className="lg:hidden mr-4"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6 text-gray-500" />
              </button>
              <div className="flex items-center gap-2">
                <Image
                  src="/Bee.png"
                  alt="PlanBee Logo"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  PlanBee
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back,{" "}
                {session?.user?.name || session?.user?.email || "Student"}!
              </span>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(session?.user?.name || session?.user?.email || "S")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`w-64 bg-white shadow-lg flex-shrink-0 ${
            sidebarOpen ? "block" : "hidden"
          } lg:block fixed lg:sticky inset-y-0 lg:inset-y-auto left-0 lg:left-auto z-40 lg:z-auto transform transition-transform duration-300 ease-in-out lg:transform-none lg:h-[calc(100vh-4rem)] lg:top-16`}
        >
          <div className="flex flex-col h-full lg:h-[calc(100vh-4rem)]">
            <div className="lg:hidden flex items-center justify-between h-16 px-6 border-b flex-shrink-0">
              <div className="flex items-center gap-2">
                <Image
                  src="/Bee.png"
                  alt="PlanBee Logo"
                  width={32}
                  height={32}
                />
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  PlanBee
                </span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <nav className="flex-1 mt-8 px-4 overflow-y-auto">
              <ul className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                        item.active
                          ? "bg-[#70A961] text-white"
                          : "text-gray-600 hover:bg-yellow-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex-shrink-0 p-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {(session?.user?.name || session?.user?.email || "S")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {session?.user?.name || "Student"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {session?.user?.email || "student@example.com"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Track your learning progress and manage your study goals
              </p>
            </div>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Goals
                    </p>
                    <p className="text-3xl font-bold text-black">
                      {stats.totalGoals}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Target className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Active Goals
                    </p>
                    <p className="text-3xl font-bold text-black">
                      {stats.activeGoals}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-[#70A961]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-black">
                      {stats.completedGoals}
                    </p>
                  </div>
                  <div className="p-3 bg-black rounded-xl">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Study Hours
                    </p>
                    <p className="text-3xl font-bold text-black">
                      {stats.totalStudyHours}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-black mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <button
                  onClick={() => router.push("/ai-coach")}
                  className="bg-gradient-to-br from-[#70A961] to-[#5f8c4b] hover:from-[#5f8c4b] hover:to-[#4e7a3e] text-white rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Brain className="h-10 w-10" />
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Study Coach</h3>
                  <p className="text-green-100 text-sm leading-relaxed">
                    Let AI create a personalized study plan tailored to your
                    learning style and schedule
                  </p>
                </button>

                <button
                  onClick={() => router.push("/schedule")}
                  className="bg-gradient-to-br from-black to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Plus className="h-10 w-10" />
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Create Manual Goal
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Set up your own custom study goals with specific timelines
                    and milestones
                  </p>
                </button>

                <button className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-[1.02] shadow-lg md:col-span-2 xl:col-span-1">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="h-10 w-10" />
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">View Analytics</h3>
                  <p className="text-yellow-900 text-sm leading-relaxed">
                    Track your progress and see detailed insights about your
                    learning journey
                  </p>
                </button>
              </div>
            </div>{" "}
            {/* Active Goals */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Active Study Goals
                  </h2>
                  <span className="text-sm text-gray-500">
                    {userGoalsCount} active
                  </span>
                </div>
              </div>

              {activeGoals.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {activeGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-6 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {goal.title}
                            </h3>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                goal.type === "ai-generated"
                                  ? "bg-[#70A961]/10 text-[#70A961] border border-[#70A961]/20"
                                  : "bg-gray-100 text-gray-700 border border-gray-200"
                              }`}
                            >
                              {goal.type === "ai-generated"
                                ? "🤖 AI Generated"
                                : "✋ Manual"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Day {goal.totalDays - goal.daysLeft + 1} of{" "}
                            {goal.totalDays} • {goal.daysLeft} days remaining
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Progress
                          </span>
                          <span className="text-sm font-bold text-black">
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#70A961] to-[#5f8c4b] h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>Updated 2h ago</span>
                          </div>
                        </div>
                        <button className="inline-flex items-center gap-1 text-[#70A961] hover:text-[#5f8c4b] text-sm font-medium transition-colors">
                          View Details
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    No active goals yet
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start your learning journey by creating your first study
                    goal. Choose between AI-generated plans or create your own
                    custom schedule.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => router.push("/ai-coach")}
                      className="inline-flex items-center justify-center gap-2 bg-[#70A961] hover:bg-[#5f8c4b] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      <Brain className="h-4 w-4" />
                      AI Study Coach
                    </button>
                    <button
                      onClick={() => router.push("/schedule")}
                      className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Create Manual Goal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

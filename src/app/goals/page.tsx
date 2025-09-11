"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Target,
  Home,
  Brain,
  Calendar,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Clock,
  BookOpen,
  Plus,
} from "lucide-react";

interface Module {
  name: string;
  timeAllocation: number;
}

interface ManualStudyPlan {
  id: string;
  subject: string;
  modules: Module[];
  totalTime: number;
  createdAt: string;
}

export default function GoalsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studyPlans, setStudyPlans] = useState<ManualStudyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: false },
    { icon: Brain, label: "AI Coach", href: "/ai-coach", active: false },
    { icon: Target, label: "My Goals", href: "/goals", active: true },
    { icon: Calendar, label: "Schedule", href: "/schedule", active: false },
    { icon: BarChart3, label: "Analytics", href: "/analytics", active: false },
    { icon: Settings, label: "Settings", href: "/settings", active: false },
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Load study plans on component mount
  useEffect(() => {
    if (status === "authenticated") {
      loadStudyPlans();
    }
  }, [status]);

  const loadStudyPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/study-plans");
      if (response.ok) {
        const data = await response.json();
        setStudyPlans(data.studyPlans || []);
      } else {
        console.error("Failed to load study plans");
      }
    } catch (error) {
      console.error("Error loading study plans:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70A961] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
                  onClick={() => router.push("/")}
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
                My Goals
              </h1>
              <p className="text-gray-600">
                View and manage all your study goals and learning plans
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
                      {studyPlans.length}
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
                      Total Modules
                    </p>
                    <p className="text-3xl font-bold text-black">
                      {studyPlans.reduce(
                        (total, plan) => total + plan.modules.length,
                        0
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <BookOpen className="h-6 w-6 text-blue-600" />
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
                      {studyPlans.reduce(
                        (total, plan) => total + plan.totalTime,
                        0
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Clock className="h-6 w-6 text-[#70A961]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      This Month
                    </p>
                    <p className="text-3xl font-bold text-black">
                      {
                        studyPlans.filter((plan) => {
                          const planDate = new Date(plan.createdAt);
                          const now = new Date();
                          return (
                            planDate.getMonth() === now.getMonth() &&
                            planDate.getFullYear() === now.getFullYear()
                          );
                        }).length
                      }
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Calendar className="h-6 w-6 text-purple-600" />
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
                  onClick={() => router.push("/schedule")}
                  className="bg-gradient-to-br from-[#70A961] to-[#5f8c4b] hover:from-[#5f8c4b] hover:to-[#4e7a3e] text-white rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Plus className="h-10 w-10" />
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Create New Goal
                  </h3>
                  <p className="text-green-100 text-sm leading-relaxed">
                    Add a new study goal with custom modules and time allocation
                  </p>
                </button>

                <button
                  onClick={() => router.push("/ai-coach")}
                  className="bg-gradient-to-br from-black to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Brain className="h-10 w-10" />
                    <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Study Coach</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Let AI create a personalized study plan for you
                  </p>
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black rounded-xl p-6 text-left transition-all duration-200 transform hover:scale-[1.02] shadow-lg md:col-span-2 xl:col-span-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="h-10 w-10" />
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">View Dashboard</h3>
                  <p className="text-yellow-900 text-sm leading-relaxed">
                    See your overall progress and statistics
                  </p>
                </button>
              </div>
            </div>

            {/* Study Goals List */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Study Goals
                  </h2>
                  <span className="text-sm text-gray-500">
                    {studyPlans.length} goal{studyPlans.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70A961] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your goals...</p>
                </div>
              ) : studyPlans.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {studyPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-6 hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {plan.subject}
                            </h3>
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#70A961]/10 text-[#70A961] border border-[#70A961]/20">
                              ✋ Manual Plan
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {plan.modules.length} module
                            {plan.modules.length !== 1 ? "s" : ""} •{" "}
                            {plan.totalTime} total hours
                          </p>
                        </div>
                      </div>

                      {/* Modules Preview */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Modules:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {plan.modules.slice(0, 6).map((module, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg"
                            >
                              <div className="w-6 h-6 bg-[#70A961] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {module.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {module.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {module.timeAllocation}h
                                </p>
                              </div>
                            </div>
                          ))}
                          {plan.modules.length > 6 && (
                            <div className="flex items-center justify-center p-2 bg-gray-100 rounded-lg">
                              <span className="text-sm text-gray-600">
                                +{plan.modules.length - 6} more
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              Created{" "}
                              {new Date(plan.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            router.push(`/schedule?edit=${plan.id}`)
                          }
                          className="inline-flex items-center gap-1 text-[#70A961] hover:text-[#5f8c4b] text-sm font-medium transition-colors"
                        >
                          Edit Plan
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
                    No study goals yet
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Start your learning journey by creating your first study
                    goal. You can create manual plans or use our AI coach for
                    personalized recommendations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => router.push("/schedule")}
                      className="inline-flex items-center justify-center gap-2 bg-[#70A961] hover:bg-[#5f8c4b] text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Create Manual Goal
                    </button>
                    <button
                      onClick={() => router.push("/ai-coach")}
                      className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                      <Brain className="h-4 w-4" />
                      AI Study Coach
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

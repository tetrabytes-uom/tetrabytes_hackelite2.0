"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Home,
  Brain,
  Target,
  Calendar,
  Settings,
  Menu,
  X,
  LogOut,
  TrendingUp,
  Clock,
  Award,
  BookOpen,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<{
    stats: {
      totalStudyHours: number;
      averageDailyHours: number;
      goalsCompleted: number;
      currentStreak: number;
    };
    progressData: Array<{
      date: string;
      progress: number;
      completedTasks: number;
      totalTasks: number;
    }>;
    subjectHoursData: Array<{
      subject: string;
      hours: number;
    }>;
    completionData: Array<{
      name: string;
      value: number;
      color: string;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: false },
    { icon: Brain, label: "AI Coach", href: "/ai-coach", active: false },
    { icon: Target, label: "My Goals", href: "/goals", active: false },
    { icon: Calendar, label: "Schedule", href: "/schedule", active: false },
    { icon: BarChart3, label: "Analytics", href: "/analytics", active: true },
    { icon: Settings, label: "Settings", href: "/settings", active: false },
  ];

  // Mock data for charts (fallback if API fails)
  const progressData = analyticsData?.progressData || [
    { date: "2024-09-01", progress: 10 },
    { date: "2024-09-02", progress: 15 },
    { date: "2024-09-03", progress: 20 },
    { date: "2024-09-04", progress: 25 },
    { date: "2024-09-05", progress: 30 },
    { date: "2024-09-06", progress: 35 },
    { date: "2024-09-07", progress: 40 },
    { date: "2024-09-08", progress: 45 },
    { date: "2024-09-09", progress: 50 },
    { date: "2024-09-10", progress: 55 },
    { date: "2024-09-11", progress: 60 },
  ];

  const subjectHoursData = analyticsData?.subjectHoursData || [
    { subject: "Mathematics", hours: 25 },
    { subject: "Physics", hours: 20 },
    { subject: "Chemistry", hours: 18 },
    { subject: "Biology", hours: 15 },
    { subject: "Computer Science", hours: 22 },
  ];

  const completionData = analyticsData?.completionData || [
    { name: "Completed", value: 8, color: "#70A961" },
    { name: "In Progress", value: 5, color: "#FFA500" },
    { name: "Not Started", value: 3, color: "#FF6B6B" },
  ];

  const stats = analyticsData?.stats || {
    totalStudyHours: 120,
    averageDailyHours: 3.5,
    goalsCompleted: 8,
    currentStreak: 12,
  };

  // Fetch analytics data on component mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchAnalyticsData();
    }
  }, [status]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/analytics");
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        setError("Failed to load analytics data");
      }
    } catch (err) {
      setError("Error loading analytics data");
      console.error("Error fetching analytics:", err);
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
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                        item.active
                          ? "bg-[#70A961] text-white"
                          : "text-gray-600 hover:bg-yellow-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
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
                Analytics
              </h1>
              <p className="text-gray-600">
                Track your learning progress and analyze your study patterns
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70A961] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading analytics data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error loading analytics
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      {error}
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={fetchAnalyticsData}
                        className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Study Hours
                        </p>
                        <p className="text-3xl font-bold text-black">
                          {stats.totalStudyHours}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Daily Average
                        </p>
                        <p className="text-3xl font-bold text-black">
                          {stats.averageDailyHours}h
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
                          Goals Completed
                        </p>
                        <p className="text-3xl font-bold text-black">
                          {stats.goalsCompleted}
                        </p>
                      </div>
                      <div className="p-3 bg-yellow-100 rounded-xl">
                        <Award className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Current Streak
                        </p>
                        <p className="text-3xl font-bold text-black">
                          {stats.currentStreak} days
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Progress Over Time */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Progress Over Time
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(value) =>
                            new Date(value).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })
                          }
                        />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(value) =>
                            new Date(value).toLocaleDateString()
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="progress"
                          stroke="#70A961"
                          strokeWidth={2}
                          dot={{ fill: "#70A961" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Study Hours by Subject */}
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Study Hours by Subject
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={subjectHoursData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="hours" fill="#70A961" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Goal Completion Status */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Goal Completion Status
                  </h3>
                  <div className="flex flex-col lg:flex-row items-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={completionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) =>
                            `${name}: ${value}`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {completionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="lg:ml-8 mt-4 lg:mt-0">
                      <div className="space-y-2">
                        {completionData.map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div
                              className="w-4 h-4 rounded mr-2"
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm text-gray-600">
                              {item.name}: {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
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

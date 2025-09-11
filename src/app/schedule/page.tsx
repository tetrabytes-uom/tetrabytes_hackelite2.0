"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  Plus,
  Clock,
  Trash2,
  Save,
  Home,
  Brain,
  Target,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";

interface Module {
  id: string;
  name: string;
  timeAllocation: number; // in hours
}

interface ManualStudyPlan {
  id?: string;
  subject: string;
  modules: Module[];
  totalTime: number;
  createdAt?: Date;
}

export default function SchedulePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studyPlan, setStudyPlan] = useState<ManualStudyPlan>({
    subject: "",
    modules: [],
    totalTime: 0,
  });
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleTime, setNewModuleTime] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPlans, setSavedPlans] = useState<ManualStudyPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingModuleName, setEditingModuleName] = useState("");
  const [editingModuleTime, setEditingModuleTime] = useState<number>(1);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: false },
    { icon: Brain, label: "AI Coach", href: "/ai-coach", active: false },
    { icon: Target, label: "My Goals", href: "/goals", active: false },
    { icon: Calendar, label: "Schedule", href: "/schedule", active: true },
    { icon: BarChart3, label: "Analytics", href: "/analytics", active: false },
    { icon: Settings, label: "Settings", href: "/settings", active: false },
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // Load saved plans on component mount
  useEffect(() => {
    if (status === "authenticated") {
      loadSavedPlans();
    }
  }, [status]);

  // Check for edit mode and load existing plan
  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId && status === "authenticated") {
      setIsEditMode(true);
      setEditingPlanId(editId);

      const loadPlanForEditing = async (planId: string) => {
        try {
          const response = await fetch(`/api/study-plans/${planId}`);
          if (response.ok) {
            const data = await response.json();
            const plan = data.studyPlan;
            setStudyPlan({
              id: plan._id,
              subject: plan.subject,
              modules: plan.modules.map(
                (
                  module: { name: string; timeAllocation: number },
                  index: number
                ) => ({
                  id: `existing-${index}`,
                  name: module.name,
                  timeAllocation: module.timeAllocation,
                })
              ),
              totalTime: plan.totalTime,
              createdAt: plan.createdAt,
            });
          } else {
            console.error("Failed to load plan for editing");
            alert("Failed to load the plan for editing. Please try again.");
            router.push("/goals");
          }
        } catch (error) {
          console.error("Error loading plan for editing:", error);
          alert("Failed to load the plan for editing. Please try again.");
          router.push("/goals");
        }
      };

      loadPlanForEditing(editId);
    }
  }, [searchParams, status, router]);

  const addModule = () => {
    if (!newModuleName.trim()) return;

    const newModule: Module = {
      id: Date.now().toString(),
      name: newModuleName.trim(),
      timeAllocation: newModuleTime,
    };

    setStudyPlan((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
      totalTime: prev.totalTime + newModuleTime,
    }));

    setNewModuleName("");
    setNewModuleTime(1);
  };

  const removeModule = (moduleId: string) => {
    setStudyPlan((prev) => {
      const moduleToRemove = prev.modules.find((m) => m.id === moduleId);
      return {
        ...prev,
        modules: prev.modules.filter((m) => m.id !== moduleId),
        totalTime: prev.totalTime - (moduleToRemove?.timeAllocation || 0),
      };
    });
  };

  const startEditingModule = (module: Module) => {
    setEditingModuleId(module.id);
    setEditingModuleName(module.name);
    setEditingModuleTime(module.timeAllocation);
  };

  const cancelEditingModule = () => {
    setEditingModuleId(null);
    setEditingModuleName("");
    setEditingModuleTime(1);
  };

  const saveEditingModule = () => {
    if (!editingModuleName.trim() || editingModuleTime <= 0) return;

    setStudyPlan((prev) => {
      const oldModule = prev.modules.find((m) => m.id === editingModuleId);
      const timeDifference =
        editingModuleTime - (oldModule?.timeAllocation || 0);

      return {
        ...prev,
        modules: prev.modules.map((module) =>
          module.id === editingModuleId
            ? {
                ...module,
                name: editingModuleName.trim(),
                timeAllocation: editingModuleTime,
              }
            : module
        ),
        totalTime: prev.totalTime + timeDifference,
      };
    });

    cancelEditingModule();
  };

  const saveStudyPlan = async () => {
    if (!studyPlan.subject.trim() || studyPlan.modules.length === 0) {
      alert("Please enter a subject name and add at least one module.");
      return;
    }

    setIsSaving(true);
    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `/api/study-plans/${editingPlanId}`
        : "/api/study-plans";

      const requestData = {
        subject: studyPlan.subject,
        modules: studyPlan.modules.map((module) => ({
          name: module.name,
          timeAllocation: module.timeAllocation,
        })),
        totalTime: studyPlan.totalTime,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const message = isEditMode
          ? "Study plan updated successfully!"
          : "Study plan saved successfully!";
        alert(message);
        setStudyPlan({
          subject: "",
          modules: [],
          totalTime: 0,
        });
        loadSavedPlans(); // Reload the saved plans
        // Navigate to goals page to see the updated plan
        setTimeout(() => {
          router.push("/goals");
        }, 1000);
      } else {
        const errorData = await response.json();
        throw new Error(
          `Failed to ${isEditMode ? "update" : "save"} study plan: ${
            errorData.error || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "saving"} study plan:`,
        error
      );
      alert(
        `Failed to ${
          isEditMode ? "update" : "save"
        } study plan. Please try again.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const loadSavedPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await fetch("/api/study-plans");
      if (response.ok) {
        const data = await response.json();
        setSavedPlans(data.studyPlans || []);
      } else {
        console.error("Failed to load study plans");
      }
    } catch (error) {
      console.error("Error loading study plans:", error);
    } finally {
      setLoadingPlans(false);
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
                {isEditMode ? "Edit Study Schedule" : "Create Study Schedule"}
              </h1>
              <p className="text-gray-600">
                {isEditMode
                  ? "Update your learning plan by modifying modules and time allocations"
                  : "Plan your learning journey by adding modules and allocating time for each topic"}
              </p>
            </div>

            {/* Subject Input */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Study Subject
              </h2>
              <div className="max-w-md">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject Name
                </label>
                <input
                  type="text"
                  id="subject"
                  value={studyPlan.subject}
                  onChange={(e) =>
                    setStudyPlan((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  placeholder="e.g., Data Structures and Algorithms"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A961] focus:border-transparent"
                />
              </div>
            </div>

            {/* Add Module Section */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Add Modules
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="moduleName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Module Name
                  </label>
                  <input
                    type="text"
                    id="moduleName"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    placeholder="e.g., Arrays and Strings"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A961] focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="moduleTime"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Time Allocation (hours)
                  </label>
                  <input
                    type="number"
                    id="moduleTime"
                    value={newModuleTime}
                    onChange={(e) => setNewModuleTime(Number(e.target.value))}
                    min="0.5"
                    step="0.5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A961] focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={addModule}
                disabled={!newModuleName.trim()}
                className="inline-flex items-center gap-2 bg-[#70A961] hover:bg-[#5f8c4b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Module
              </button>
            </div>

            {/* Modules List */}
            {studyPlan.modules.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Study Modules ({studyPlan.modules.length})
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Total: {studyPlan.totalTime} hours
                  </div>
                </div>
                <div className="space-y-3">
                  {studyPlan.modules.map((module) => (
                    <div
                      key={module.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      {editingModuleId === module.id ? (
                        // Edit mode
                        <div className="flex-1 flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#70A961] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {editingModuleName.charAt(0).toUpperCase() || "?"}
                            </span>
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="md:col-span-2">
                              <input
                                type="text"
                                value={editingModuleName}
                                onChange={(e) =>
                                  setEditingModuleName(e.target.value)
                                }
                                placeholder="Module name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A961] focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="number"
                                value={editingModuleTime}
                                onChange={(e) =>
                                  setEditingModuleTime(Number(e.target.value))
                                }
                                min="0.5"
                                step="0.5"
                                placeholder="Hours"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#70A961] focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={saveEditingModule}
                              disabled={
                                !editingModuleName.trim() ||
                                editingModuleTime <= 0
                              }
                              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Save changes"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditingModule}
                              className="p-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Cancel editing"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#70A961] rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {module.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {module.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {module.timeAllocation} hours
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditingModule(module)}
                              className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit module"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeModule(module.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove module"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            {studyPlan.modules.length > 0 && studyPlan.subject.trim() && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={saveStudyPlan}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold text-lg transition-colors"
                >
                  <Save className="h-5 w-5" />
                  {isSaving
                    ? isEditMode
                      ? "Updating..."
                      : "Saving..."
                    : isEditMode
                    ? "Update Study Plan"
                    : "Save Study Plan"}
                </button>
              </div>
            )}

            {/* Saved Study Plans */}
            {savedPlans.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Saved Study Plans
                </h2>
                <div className="space-y-4">
                  {savedPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {plan.subject}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          {plan.totalTime} hours total
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {plan.modules.map((module, index) => (
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
                      </div>
                      {plan.createdAt && (
                        <p className="text-xs text-gray-500 mt-3">
                          Created on{" "}
                          {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state for saved plans */}
            {loadingPlans && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Saved Study Plans
                </h2>
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#70A961]"></div>
                  <span className="ml-3 text-gray-600">
                    Loading study plans...
                  </span>
                </div>
              </div>
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

"use client";
import { Dashboard } from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar (Always visible on the left) */}
      <div className="w-64">
        <Dashboard />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold">Main Content</h1>
        <p>Here goes the main dashboard content...</p>
      </div>
    </div>
  );
}

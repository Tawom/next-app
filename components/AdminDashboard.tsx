"use client";

import { useState } from "react";
import AdminStats from "./AdminStats";
import TourManagement from "./TourManagement";
import BookingManagement from "./BookingManagement";
import UserManagement from "./UserManagement";

type Tab = "stats" | "tours" | "bookings" | "users";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("stats");

  const tabs = [
    { id: "stats" as Tab, label: "📊 Dashboard", icon: "📊" },
    { id: "tours" as Tab, label: "🗺️ Tours", icon: "🗺️" },
    { id: "bookings" as Tab, label: "📅 Bookings", icon: "📅" },
    { id: "users" as Tab, label: "👥 Users", icon: "👥" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage tours, bookings, and users</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-6 text-sm font-medium border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === "stats" && <AdminStats />}
        {activeTab === "tours" && <TourManagement />}
        {activeTab === "bookings" && <BookingManagement />}
        {activeTab === "users" && <UserManagement />}
      </div>
    </div>
  );
}

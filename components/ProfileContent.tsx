"use client";

import { useState } from "react";
import Image from "next/image";
import Card from "./Card";
import Button from "./Button";
import ProfileEditForm from "./ProfileEditForm";
import BookingHistory from "./BookingHistory";

/**
 * ProfileContent Component
 *
 * Main content for user profile page with tabs
 *
 * Features:
 * - Profile information display
 * - Edit profile form
 * - Booking history
 * - Account statistics
 */

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ProfileContentProps {
  user: User;
}

type TabType = "overview" | "edit" | "bookings" | "settings";

export default function ProfileContent({ user }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: "👤" },
    { id: "edit" as TabType, label: "Edit Profile", icon: "✏️" },
    { id: "bookings" as TabType, label: "My Bookings", icon: "📅" },
    { id: "settings" as TabType, label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <div className="text-center p-6">
            {/* Profile Picture */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src={
                  user.image ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                }
                alt={user.name || "User"}
                fill
                sizes="96px"
                className="rounded-full object-cover"
              />
            </div>

            {/* User Info */}
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600 text-sm mt-1">{user.email}</p>

            {/* Member Since */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-gray-500">MEMBER SINCE</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="mt-6">
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Total Bookings</span>
                <span className="font-bold text-gray-900">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Reviews Written</span>
                <span className="font-bold text-gray-900">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Wishlist Items</span>
                <span className="font-bold text-gray-900">0</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-4 px-6 text-center font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Account Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <p className="text-gray-900">{user.name || "Not set"}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Status
                  </label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Active
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === "edit" && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Edit Profile
              </h3>
              <ProfileEditForm user={user} />
            </div>
          </Card>
        )}

        {activeTab === "bookings" && (
          <div>
            <BookingHistory userId={user.id} />
          </div>
        )}

        {activeTab === "settings" && (
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Account Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Email Notifications
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">
                        Booking confirmations
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">
                        Special offers and promotions
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Newsletter</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3 text-red-600">
                    Danger Zone
                  </h4>
                  <Button variant="secondary" className="text-red-600">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";

export default function SeekerDashboardPage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-pink-700">Job Seeker Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {/* User Profile */}
          <section className="md:col-span-1 bg-gray-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="text-gray-600">Profile details and edit form will go here.</div>
          </section>
          {/* Resume Upload & Applications */}
          <section className="md:col-span-2 flex flex-col gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
              <div className="text-gray-600">Resume upload form will go here.</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Applied Jobs & Status</h2>
              <div className="text-gray-600">List of applied jobs and their status will go here.</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 
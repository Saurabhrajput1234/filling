"use client";

import React from "react";

export default function CompanyDashboardPage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-purple-700">Company Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Profile */}
          <section className="md:col-span-1 bg-gray-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
            <div className="text-gray-600">Profile details and edit form will go here.</div>
          </section>
          {/* Job Posting & Applicants */}
          <section className="md:col-span-2 flex flex-col gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Post a Job</h2>
              <div className="text-gray-600">Job posting form will go here.</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Applicants</h2>
              <div className="text-gray-600">List of applicants for your jobs will go here.</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 
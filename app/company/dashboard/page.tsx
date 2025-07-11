"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { RootState } from "../../../store/store";

interface Job {
  id: string;
  title: string;
  description: string;
  salary?: string;
  experience?: string;
  location?: string;
  type?: string;
  isActive: boolean;
  createdAt: string;
  applications: Application[];
}

interface Application {
  id: string;
  userId: string;
  status: string;
  message?: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function CompanyDashboard() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.companyId) {
      fetchJobs();
    }
  }, [isAuthenticated, user?.companyId, router]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/jobs?companyId=${user?.companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error("Failed to fetch jobs:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      console.log('Updating application status:', applicationId, 'to', status);
      setUpdatingStatus(applicationId);
      
      const token = localStorage.getItem("token");
      const response = await fetch("/api/applications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: applicationId,
          status,
        }),
      });

      if (response.ok) {
        console.log('Application status updated successfully');
        fetchJobs(); // Refresh data
      } else {
        const errorData = await response.json();
        console.error("Failed to update application status:", errorData);
        alert(`Failed to update status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Failed to update application status:", error);
      alert('Failed to update application status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "SHORTLISTED": return "bg-blue-100 text-blue-800";
      case "INTERVIEW": return "bg-purple-100 text-purple-800";
      case "ACCEPTED": return "bg-green-100 text-green-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/");
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/jobs/post"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Post Job</h3>
                <p className="text-gray-600">Create a new job listing</p>
              </div>
            </div>
          </Link>

          <Link
            href="/applications"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                <p className="text-gray-600">Review job applications</p>
              </div>
            </div>
          </Link>

          <Link
            href="/conversations"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                <p className="text-gray-600">Chat with candidates</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Jobs Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Job Postings</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <div key={job.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                      <p className="text-gray-600">{job.location} • {job.type}</p>
                      <p className="text-sm text-gray-500">
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <Link
                        href={`/jobs/${job.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>

                  {/* Applications for this job */}
                  {job.applications && job.applications.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Applications ({job.applications.length})
                      </h4>
                      <div className="space-y-2">
                        {job.applications.map((application) => (
                          <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium text-gray-900">{application.user?.name || 'Unknown User'}</p>
                              <p className="text-sm text-gray-600">{application.user?.email || 'No email'}</p>
                              {application.message && (
                                <p className="text-sm text-gray-500 mt-1">{application.message}</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(application.status)}`}>
                                {application.status}
                              </span>
                              <select
                                value={application.status}
                                onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                                disabled={updatingStatus === application.id}
                                className="text-xs border border-gray-300 rounded px-2 py-1 hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:opacity-50"
                              >
                                <option value="PENDING">Pending</option>
                                <option value="SHORTLISTED">Shortlisted</option>
                                <option value="INTERVIEW">Interview</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="REJECTED">Rejected</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No jobs posted yet. Create your first job listing!</p>
              <Link
                href="/jobs/post"
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Post Job
              </Link>
            </div>
          )}
        </div>

        {/* Company Profile Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Company Profile</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <p className="mt-1 text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-gray-900">{user?.role}</p>
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
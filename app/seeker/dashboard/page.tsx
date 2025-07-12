"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { RootState } from "../../../store/store";
import NotificationBell from "../../components/NotificationBell";

interface Application {
  id: string;
  jobId: string;
  status: string;
  message?: string;
  createdAt: string;
  job: {
    title: string;
    company: {
      name: string;
    };
  };
}

// Helper to get token from cookie
function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export default function SeekerDashboard() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Resume state
  const [resume, setResume] = useState<{ id: string; url: string; createdAt?: string } | null>(null);
  const [resumeLoading, setResumeLoading] = useState(true);

  // Fetch current resume on mount
  useEffect(() => {
    if (!user || !user.id) return;
    const fetchResume = async () => {
      setResumeLoading(true);
      try {
        const res = await fetch(`/api/resumes`);
        if (res.ok) {
          const resumes = await res.json();
          // Find resume for this user
          const userResume = resumes.find((r: any) => r.userId === user.id);
          setResume(userResume || null);
        }
      } catch (e) {
        setResume(null);
      } finally {
        setResumeLoading(false);
      }
    };
    fetchResume();
  }, [user]);

  // Resume upload state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleResumeUploadOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");
    setUploadSuccess("");
    if (!resumeFile) {
      setUploadError("Please select a file to upload.");
      return;
    }
    if (!user || !user.id) {
      setUploadError("User not found. Please log in again.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("userId", user.id);
      let response, data;
      if (resume) {
        // Update existing resume
        formData.append("id", resume.id);
        response = await fetch("/api/resumes", {
          method: "PUT",
          body: formData,
        });
      } else {
        // Upload new resume
        response = await fetch("/api/resumes", {
          method: "POST",
          body: formData,
        });
      }
      data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }
      setUploadSuccess(resume ? "Resume updated successfully!" : "Resume uploaded successfully!");
      setResumeFile(null);
      setResume(data);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      fetchApplications();
    }
  }, [hydrated, isAuthenticated]);

  const fetchApplications = async () => {
    try {
      const token = getCookie('token');
      const response = await fetch("/api/applications", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
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

  // Helper to format date
  function formatDate(dateStr?: string) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  }

  const handleEditProfile = () => {
    router.push('/seeker/profile/edit');
  };

  const startConversation = async (companyName: string) => {
    try {
      console.log('Starting conversation with company:', companyName);
      
      // For seekers, we need to find the company by name first
      const response = await fetch(`/api/companies?name=${encodeURIComponent(companyName)}`);
      console.log('Companies API response status:', response.status);
      
      if (response.ok) {
        const companies = await response.json();
        console.log('Found companies:', companies);
        
        if (companies.length > 0) {
          const company = companies[0];
          console.log('Selected company:', company);
          
          // Create or get existing conversation
          const conversationResponse = await fetch("/api/conversations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: user?.id,
              companyId: company.id,
            }),
          });

          console.log('Conversation API response status:', conversationResponse.status);
          
          if (conversationResponse.ok) {
            const conversation = await conversationResponse.json();
            console.log('Created/found conversation:', conversation);
            // Navigate to conversations page with the conversation ID
            router.push(`/seeker/conversations?conversationId=${conversation.id}`);
          } else {
            const errorData = await conversationResponse.json();
            console.error('Conversation creation failed:', errorData);
            alert('Failed to create conversation. Please try again.');
          }
        } else {
          console.log('No company found with name:', companyName);
          alert('Company not found. Please try again.');
        }
      } else {
        console.error('Companies API failed:', response.status);
        alert('Failed to find company. Please try again.');
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  if (!hydrated) return null;
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Seeker Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationBell />
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
            href="/jobs"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Browse Jobs</h3>
                <p className="text-gray-600">Find your next opportunity</p>
              </div>
            </div>
          </Link>

          <a
            href="#my-resume"
            className={`bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between ${resume ? 'border-green-400' : 'border-red-400'}`}
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Resume</h3>
                <p className="text-gray-600">{resume ? 'Resume Uploaded' : 'No Resume Uploaded'}</p>
              </div>
            </div>
            {resume && (
              <div className="mt-4 text-xs text-green-700">Last uploaded: {formatDate(resume.createdAt)}</div>
            )}
          </a>

          <Link
            href="/seeker/conversations"
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
                <p className="text-gray-600">Chat with employers</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Applications Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading applications...</p>
            </div>
          ) : applications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => (
                <div key={application.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {application.job.title}
                      </h3>
                      <p className="text-gray-600">{application.job.company.name}</p>
                      <p className="text-sm text-gray-500">
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                      <button
                        onClick={() => startConversation(application.job.company.name)}
                        className="text-xs bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Message
                      </button>
                    </div>
                  </div>
                  {application.message && (
                    <p className="mt-2 text-gray-600 text-sm">{application.message}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No applications yet. Start applying to jobs!</p>
              <Link
                href="/jobs"
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Browse Jobs
              </Link>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div id="my-resume" className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
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
            {/* Resume Upload Section (integrated) */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-2 text-green-700 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Resume
              </h3>
              {resumeLoading ? (
                <div className="text-gray-500 text-sm">Loading resume...</div>
              ) : resume ? (
                <div className="mb-2 flex flex-col md:flex-row md:items-center md:gap-4">
                  <a href={resume.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">View Current Resume</a>
                  <span className="text-xs text-gray-500 mt-1 md:mt-0">{resume.url.split('/').pop()}</span>
                  <span className="text-xs text-gray-500 mt-1 md:mt-0">Uploaded: {formatDate(resume.createdAt)}</span>
                </div>
              ) : (
                <div className="mb-2 text-red-600 text-sm">No resume uploaded yet.</div>
              )}
              <form onSubmit={handleResumeUploadOrUpdate} className="flex flex-col md:flex-row gap-2 md:items-center mt-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="border border-gray-200 rounded px-3 py-2 w-full md:w-auto"
                  disabled={uploading}
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? (resume ? "Updating..." : "Uploading...") : (resume ? "Update Resume" : "Upload Resume")}
                </button>
              </form>
              {uploadError && <div className="text-red-600 text-sm mt-1">{uploadError}</div>}
              {uploadSuccess && <div className="text-green-600 text-sm mt-1">{uploadSuccess}</div>}
            </div>
            {/* End Resume Upload Section */}
            <div className="mt-6">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleEditProfile}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 
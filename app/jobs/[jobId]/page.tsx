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
  companyId: string;
  company?: {
    id: string;
    name: string;
    profile?: string;
  };
  createdAt: string;
  isActive: boolean;
}

export default function JobDetailsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = React.use(params);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [applicationMessage, setApplicationMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/jobs/${jobId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Job not found");
        } else {
          throw new Error("Failed to fetch job");
        }
        return;
      }
      
      const jobData = await response.json();
      setJob(jobData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch job");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "SEEKER") {
      setError("Only job seekers can apply for jobs");
      return;
    }

    try {
      setApplying(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: jobId,
          userId: user.id,
          message: applicationMessage || "I'm interested in this position"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to apply for job");
      }

      setSuccess("Application submitted successfully!");
      setApplicationMessage("");
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/seeker/dashboard");
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to apply for job");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </main>
    );
  }

  if (error && !job) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            href="/jobs"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Job not found</p>
          <Link 
            href="/jobs"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Jobs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/jobs"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>

        {/* Job Details */}
        <div className="bg-gray-50 rounded-lg shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-blue-700">{job.title}</h1>
          <div className="text-lg font-medium text-gray-700 mb-1">{job.company?.name}</div>
          <div className="flex gap-4 text-sm text-gray-500 mb-4">
            <span>{job.location || 'Location not specified'}</span>
            {job.experience && <span>• {job.experience}</span>}
            <span>• {job.type || 'Full Time'}</span>
          </div>
          {job.salary && <div className="text-green-600 font-bold mb-4">{job.salary}</div>}
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>
          
          {/* Job Meta Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Posted:</span>
                <p className="text-gray-800">{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <p className={`font-medium ${job.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {job.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Type:</span>
                <p className="text-gray-800">{job.type || 'Full Time'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Location:</span>
                <p className="text-gray-800">{job.location || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Section */}
        {job.isActive && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Apply for this Position</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {!isAuthenticated ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Please log in to apply for this job</p>
                <Link 
                  href="/auth/login"
                  className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition font-semibold"
                >
                  Login to Apply
                </Link>
              </div>
            ) : user?.role !== "SEEKER" ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Only job seekers can apply for jobs</p>
                <Link 
                  href="/jobs"
                  className="bg-gray-600 text-white py-2 px-6 rounded hover:bg-gray-700 transition font-semibold"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Message (optional)
                  </label>
                  <textarea
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder="Tell the employer why you're interested in this position..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                  >
                    {applying ? "Applying..." : "Apply Now"}
                  </button>
                  
                  <Link 
                    href="/seeker/dashboard"
                    className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition font-semibold"
                  >
                    View My Applications
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {!job.isActive && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800 font-medium">This job posting is no longer active</p>
          </div>
        )}
      </div>
    </main>
  );
} 
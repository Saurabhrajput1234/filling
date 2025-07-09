"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setJobs } from "../../store/jobsSlice";
import type { RootState, AppDispatch } from "../../store/store";

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
    name: string;
  };
  createdAt: string;
  isActive: boolean;
}

export default function JobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const jobList = useSelector((state: RootState) => state.jobs.jobs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    experience: "",
    type: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs");
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const jobs = await response.json();
      dispatch(setJobs(jobs));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobList.filter((job: Job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !filters.location || job.location?.includes(filters.location);
    const matchesExperience = !filters.experience || job.experience?.includes(filters.experience);
    const matchesType = !filters.type || job.type?.includes(filters.type);

    return matchesSearch && matchesLocation && matchesExperience && matchesType;
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-gray-900 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white text-gray-900 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchJobs}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Job Feed</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <div className="flex gap-2 w-full md:w-auto">
            <select 
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none"
            >
              <option value="">All Locations</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Remote">Remote</option>
            </select>
            <select 
              value={filters.experience}
              onChange={(e) => setFilters({...filters, experience: e.target.value})}
              className="px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none"
            >
              <option value="">All Experience</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-6">3-6 years</option>
            </select>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-gray-600">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </div>

        {/* Job Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredJobs.map((job: Job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2 hover:bg-blue-50"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-blue-700">{job.title}</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{job.type || 'Full Time'}</span>
              </div>
              <div className="text-gray-700 font-medium">{job.company?.name || 'Company'}</div>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{job.location || 'Location not specified'}</span>
                {job.experience && <span>• {job.experience}</span>}
              </div>
              {job.salary && <div className="text-green-600 font-bold mt-2">{job.salary}</div>}
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{job.description}</p>
              <span className="mt-4 text-blue-600 hover:underline font-semibold">View Details</span>
            </Link>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setFilters({location: "", experience: "", type: ""});
              }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 
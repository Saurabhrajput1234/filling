"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setJobs } from "../../store/jobsSlice";
import type { RootState, AppDispatch } from "../../store/store";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Innovators Pvt Ltd",
    location: "Bangalore, India",
    experience: "2-4 years",
    salary: "₹8L - ₹12L",
    type: "Full Time",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "Cloud Solutions",
    location: "Remote",
    experience: "3-6 years",
    salary: "₹10L - ₹16L",
    type: "Remote",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "Mumbai, India",
    experience: "1-3 years",
    salary: "₹6L - ₹9L",
    type: "Full Time",
  },
];

export default function JobsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const jobList = useSelector((state: RootState) => state.jobs.jobs);

  useEffect(() => {
    dispatch(setJobs(jobs));
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Job Feed</h1>
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            className="w-full md:w-1/2 px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          />
          <div className="flex gap-2 w-full md:w-auto">
            <select className="px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none">
              <option>Location</option>
              <option>Bangalore</option>
              <option>Mumbai</option>
              <option>Remote</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none">
              <option>Experience</option>
              <option>0-1 years</option>
              <option>1-3 years</option>
              <option>3-6 years</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none">
              <option>Job Type</option>
              <option>Full Time</option>
              <option>Remote</option>
              <option>Internship</option>
            </select>
          </div>
        </div>
        {/* Job Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {jobList.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2 hover:bg-blue-50"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-blue-700">{job.title}</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{job.type}</span>
              </div>
              <div className="text-gray-700 font-medium">{job.company}</div>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>{job.location}</span>
                <span>• {job.experience}</span>
              </div>
              <div className="text-green-600 font-bold mt-2">{job.salary}</div>
              <span className="mt-4 text-blue-600 hover:underline font-semibold">View Details</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 
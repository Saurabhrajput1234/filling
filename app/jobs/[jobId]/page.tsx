import React from "react";
import { notFound } from "next/navigation";

const jobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Innovators Pvt Ltd",
    location: "Bangalore, India",
    experience: "2-4 years",
    salary: "₹8L - ₹12L",
    type: "Full Time",
    description: "Work on modern web apps with React and TypeScript.",
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "Cloud Solutions",
    location: "Remote",
    experience: "3-6 years",
    salary: "₹10L - ₹16L",
    type: "Remote",
    description: "Build scalable APIs and microservices.",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Design Studio",
    location: "Mumbai, India",
    experience: "1-3 years",
    salary: "₹6L - ₹9L",
    type: "Full Time",
    description: "Design beautiful and user-friendly interfaces.",
  },
];

export default async function JobDetailsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const job = jobs.find((j) => j.id === Number(jobId));
  if (!job) return notFound();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="w-full max-w-2xl bg-gray-50 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">{job.title}</h1>
        <div className="text-lg font-medium text-gray-700 mb-1">{job.company}</div>
        <div className="flex gap-4 text-sm text-gray-500 mb-4">
          <span>{job.location}</span>
          <span>• {job.experience}</span>
          <span>• {job.type}</span>
        </div>
        <div className="text-green-600 font-bold mb-4">{job.salary}</div>
        <p className="mb-6 text-gray-700">{job.description}</p>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition font-semibold">Apply</button>
          <button className="bg-gray-200 text-gray-700 py-2 px-6 rounded hover:bg-gray-300 transition font-semibold">Share on LinkedIn</button>
        </div>
      </div>
    </main>
  );
} 
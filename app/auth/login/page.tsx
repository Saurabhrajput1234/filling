"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "../../../store/authSlice";
import type { AppDispatch } from "../../../store/store";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);
      
      // Update Redux state
      dispatch(login({
        user: data.user,
        token: data.token,
      }));

      // Redirect based on user role
      if (data.user.role === "COMPANY") {
        router.push("/company/dashboard");
      } else {
        router.push("/seeker/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="my-4 flex items-center justify-center gap-2">
          <span className="h-px w-16 bg-gray-200" />
          <span className="text-gray-400 text-sm">or</span>
          <span className="h-px w-16 bg-gray-200" />
        </div>
        
        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-2 px-4 rounded hover:bg-gray-100 transition font-semibold text-gray-700">
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.3-4z"/>
              <path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 6.5 29.6 4 24 4c-7.7 0-14.2 4.4-17.7 10.7z"/>
              <path fill="#FBBC05" d="M24 44c5.6 0 10.5-1.9 14.3-5.1l-6.6-5.4C29.7 35.1 27 36 24 36c-6.1 0-10.7-2.9-13.7-7.1l-7 5.4C9.8 41.6 16.4 44 24 44z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.6 4.1-6.1 7.5-11.7 7.5-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 6.5 29.6 4 24 4c-7.7 0-14.2 4.4-17.7 10.7z"/>
            </g>
          </svg>
          Continue with Google
        </button>
        
        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account? <a href="/auth/register" className="text-green-700 hover:underline">Register</a>
        </p>
      </div>
    </main>
  );
} 
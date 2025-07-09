"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">Filling</h1>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">How it Works</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Testimonials</a>
                <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Login</Link>
                <Link href="/auth/register" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">Sign Up</Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a href="#features" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">How it Works</a>
                <a href="#testimonials" className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium">Testimonials</a>
                <Link href="/auth/login" className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">Login</Link>
                <Link href="/auth/register" className="bg-green-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-700">Sign Up</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Dream Job with
              <span className="text-blue-600"> Filling</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect talented professionals with amazing opportunities. Whether you're looking for your next career move or seeking the perfect team member, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg hover:shadow-xl">
                Browse Jobs
              </Link>
              <Link href="/auth/register" className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition duration-300 shadow-lg hover:shadow-xl">
                Post a Job
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">5,000+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Filling?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the tools and platform you need to succeed in your career journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Job Matching</h3>
              <p className="text-gray-600">
                Our AI-powered algorithm matches you with the perfect job opportunities based on your skills, experience, and preferences.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Application Process</h3>
              <p className="text-gray-600">
                Apply to multiple jobs with just a few clicks. Save your resume and cover letter templates for quick applications.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Direct Communication</h3>
              <p className="text-gray-600">
                Chat directly with employers and candidates. No more waiting for email responses - get instant feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up as a job seeker or employer in minutes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Profile</h3>
              <p className="text-gray-600">Add your skills, experience, and preferences</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Opportunities</h3>
              <p className="text-gray-600">Browse jobs or post openings that match your needs</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect & Apply</h3>
              <p className="text-gray-600">Apply for jobs or hire the perfect candidate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">John Smith</h4>
                  <p className="text-gray-600">Software Developer</p>
                </div>
              </div>
                             <p className="text-gray-600">
                 "Filling helped me find my dream job in just 2 weeks! The matching algorithm is incredible."
               </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-semibold">SJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600">HR Manager</p>
                </div>
              </div>
              <p className="text-gray-600">
                "As a recruiter, I love how easy it is to find qualified candidates. The platform is intuitive and efficient."
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-semibold">MC</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Mike Chen</h4>
                  <p className="text-gray-600">Product Manager</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The direct messaging feature made the hiring process so much smoother. Highly recommended!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
                     <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
             Join thousands of professionals who have already found their perfect match on Filling.
           </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-300 shadow-lg hover:shadow-xl">
              Get Started Free
            </Link>
            <Link href="/jobs" className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300">
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                             <h3 className="text-2xl font-bold text-blue-400 mb-4">Filling</h3>
              <p className="text-gray-400">
                Connecting talent with opportunity. Your trusted partner in career growth and recruitment.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/jobs" className="hover:text-white">Browse Jobs</a></li>
                <li><a href="/auth/register" className="hover:text-white">Create Profile</a></li>
                <li><a href="/resumes" className="hover:text-white">Upload Resume</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">For Employers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/jobs/post" className="hover:text-white">Post a Job</a></li>
                <li><a href="/applications" className="hover:text-white">View Applications</a></li>
                <li><a href="/company/dashboard" className="hover:text-white">Company Dashboard</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                         <p>&copy; 2024 Filling. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import ThemeToggle from '../components/ThemeToggle';

export default function TestThemePage() {
  const { theme } = useSelector((state: RootState) => state.theme);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Theme Test Page
          </h1>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Current theme: <span className="font-bold">{theme}</span>
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  This is a blue background that should change with theme
                </p>
              </div>
              
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <p className="text-green-800 dark:text-green-200">
                  This is a green background that should change with theme
                </p>
              </div>
              
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <p className="text-red-800 dark:text-red-200">
                  This is a red background that should change with theme
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <ThemeToggle />
            </div>
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Document class: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {typeof document !== 'undefined' ? document.documentElement.className : 'Loading...'}
              </code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
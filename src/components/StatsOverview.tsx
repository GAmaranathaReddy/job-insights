'use client';

import React from 'react';

interface StatsOverviewProps {
  summary: {
    totalJobs: number;
    totalCompanies: number;
    lastUpdated: string;
  };
  trends: any;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Jobs</p>
            <p className="text-3xl font-bold text-gray-900">
              {summary.totalJobs.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-xl">💼</span>
          </div>
        </div>
        <p className="text-sm text-green-600 mt-2">
          ↗ +5.2% from last week
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Companies</p>
            <p className="text-3xl font-bold text-gray-900">
              {summary.totalCompanies.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="text-green-600 text-xl">🏢</span>
          </div>
        </div>
        <p className="text-sm text-green-600 mt-2">
          ↗ +2.1% from last week
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Top Tech</p>
            <p className="text-3xl font-bold text-gray-900">JavaScript</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-xl">⚡</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          27.2% of all jobs
        </p>
      </div>
    </div>
  );
};

export default StatsOverview;
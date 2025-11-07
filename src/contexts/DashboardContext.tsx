'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DashboardData, JobFilters } from '@/types';

interface DashboardContextType {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  filters: JobFilters;
  setFilters: (filters: Partial<JobFilters>) => void;
  refreshData: () => Promise<void>;
  lastUpdated: string | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<JobFilters>({
    technologies: [],
    cities: [],
    experienceLevels: [],
    companies: []
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dashboard-data');
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }

      const dashboardData = await response.json();
      setData(dashboardData);
      setLastUpdated(dashboardData.summary?.lastUpdated || null);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const setFilters = (newFilters: Partial<JobFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const refreshData = async () => {
    await loadData();
  };

  useEffect(() => {
    loadData();

    // Set up periodic data refresh (every 5 minutes)
    const interval = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const value: DashboardContextType = {
    data,
    loading,
    error,
    filters,
    setFilters,
    refreshData,
    lastUpdated
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
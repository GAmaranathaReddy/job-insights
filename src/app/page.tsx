'use client';

import { useState, useEffect, useMemo, Fragment, useRef } from 'react';
import RefreshButton from '@/components/RefreshButton';

// Professional Icons (we'll use simple SVGs for now)
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const FunnelIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
  </svg>
);

const XMarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-9-6h.008v.008H12V12.75Z" />
  </svg>
);

const BuildingOfficeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15l-.75 18h-13.5L4.5 3ZM9 9h1.5m-1.5 3h1.5m-1.5 3h1.5M13.5 9H15m-1.5 3H15m-1.5 3H15" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

const CodeBracketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </svg>
);

const UserGroupIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M20.707 5.293a1 1 0 0 0-1.414 0L9 15.586 4.707 11.293a1 1 0 0 0-1.414 1.414l5 5a1 1 0 0 0 1.414 0l11-11a1 1 0 0 0 0-1.414Z" clipRule="evenodd" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
  </svg>
);

const BriefcaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
  </svg>
);

const CurrencyRupeeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

// Multi-select dropdown component
const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  placeholder,
  icon: Icon
}: {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  icon: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 text-gray-400" />
          <span className={`text-sm ${selected.length > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            {selected.length > 0 ? `${selected.length} selected` : placeholder}
          </span>
        </div>
        <ChevronDownIcon className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto">
          <div className="p-2">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-left hover:bg-gray-50 rounded-lg transition-colors duration-150"
              >
                <span className={selected.includes(option) ? 'text-blue-600 font-medium' : 'text-gray-700'}>
                  {option}
                </span>
                {selected.includes(option) && (
                  <CheckIcon className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    cities: [] as string[],
    technologies: [] as string[],
    companies: [] as string[],
    jobTitles: [] as string[],
    experience: [] as string[],
    dateRange: { start: '', end: '' }
  });

  useEffect(() => {
    fetch('/api/dashboard-data')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    if (!data) return null;

    const hasActiveFilters =
      filters.cities.length > 0 ||
      filters.technologies.length > 0 ||
      filters.companies.length > 0 ||
      filters.jobTitles.length > 0 ||
      filters.experience.length > 0 ||
      filters.dateRange.start ||
      filters.dateRange.end;

    if (!hasActiveFilters) return data;

    // Simple filtering logic for demonstration
    return {
      ...data,
      summary: {
        ...data.summary,
        totalJobs: Math.floor(data.summary?.totalJobs * 0.7) || 0,
        totalCompanies: Math.floor(data.summary?.totalCompanies * 0.8) || 0,
      },
      technologies: data.technologies?.filter((tech: any) =>
        filters.technologies.length === 0 || filters.technologies.includes(tech.name)
      ),
      cities: data.cities?.filter((city: any) =>
        filters.cities.length === 0 || filters.cities.includes(city.name)
      ),
      companies: data.companies?.filter((company: any) =>
        filters.companies.length === 0 || filters.companies.includes(company.name)
      ),
      jobTitles: data.jobTitles?.filter((job: any) =>
        filters.jobTitles.length === 0 || filters.jobTitles.includes(job.title)
      )
    };
  }, [data, filters]);

  const clearAllFilters = () => {
    setFilters({
      cities: [],
      technologies: [],
      companies: [],
      jobTitles: [],
      experience: [],
      dateRange: { start: '', end: '' }
    });
  };

  const activeFilterCount =
    filters.cities.length +
    filters.technologies.length +
    filters.companies.length +
    filters.jobTitles.length +
    filters.experience.length +
    (filters.dateRange.start || filters.dateRange.end ? 1 : 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600 font-medium">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XMarkIcon className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-lg text-gray-600 font-medium">No data available</p>
        </div>
      </div>
    );
  }

  const displayData = filteredData || data;

  // Extract unique values for filter options
  const cityOptions = data.cities?.map((city: any) => city.name) || [];
  const techOptions = data.technologies?.map((tech: any) => tech.name) || [];
  const companyOptions = data.companies?.map((company: any) => company.name) || [];
  const jobTitleOptions = data.jobTitles?.map((job: any) => job.title) || [];
  const experienceOptions = ['Junior', 'Mid-level', 'Senior', 'Lead', 'Manager'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <TrendingUpIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">India Job Insights</h1>
                  <p className="text-sm text-gray-500">Real-time market analytics</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <RefreshButton />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeFilterCount > 0
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <div className="flex items-center space-x-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <MultiSelectDropdown
                options={cityOptions}
                selected={filters.cities}
                onChange={(cities) => setFilters({...filters, cities})}
                placeholder="Select cities"
                icon={MapPinIcon}
              />

              <MultiSelectDropdown
                options={techOptions}
                selected={filters.technologies}
                onChange={(technologies) => setFilters({...filters, technologies})}
                placeholder="Select technologies"
                icon={CodeBracketIcon}
              />

              <MultiSelectDropdown
                options={companyOptions}
                selected={filters.companies}
                onChange={(companies) => setFilters({...filters, companies})}
                placeholder="Select companies"
                icon={BuildingOfficeIcon}
              />

              <MultiSelectDropdown
                options={jobTitleOptions}
                selected={filters.jobTitles}
                onChange={(jobTitles) => setFilters({...filters, jobTitles})}
                placeholder="Select job titles"
                icon={BriefcaseIcon}
              />

              <MultiSelectDropdown
                options={experienceOptions}
                selected={filters.experience}
                onChange={(experience) => setFilters({...filters, experience})}
                placeholder="Experience level"
                icon={UserGroupIcon}
              />

              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: {...filters.dateRange, start: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Start date"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: {...filters.dateRange, end: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="End date"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Refresh Controls */}
        <div className="mb-8">
          {/* <RefreshButton /> */}
          <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Refresh</h3>
            <p className="text-sm text-blue-700 mb-4">
              On-demand refresh temporarily disabled. Working on fixing the component...
            </p>
            <button 
              disabled 
              className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
            >
              Refresh Now (Coming Soon)
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{displayData.summary?.totalJobs?.toLocaleString()}</p>
                <p className="text-sm text-green-600 font-medium mt-1">+12% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MagnifyingGlassIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Companies</p>
                <p className="text-3xl font-bold text-gray-900">{displayData.summary?.totalCompanies?.toLocaleString()}</p>
                <p className="text-sm text-green-600 font-medium mt-1">+8% from last month</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Top Technology</p>
                <p className="text-3xl font-bold text-gray-900">{displayData.technologies?.[0]?.name || 'N/A'}</p>
                <p className="text-sm text-purple-600 font-medium mt-1">{displayData.technologies?.[0]?.count} positions</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CodeBracketIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Top Job Title</p>
                <p className="text-3xl font-bold text-gray-900">{displayData.jobTitles?.[0]?.title || 'N/A'}</p>
                <p className="text-sm text-orange-600 font-medium mt-1">₹{displayData.jobTitles?.[0]?.avgSalary ? (displayData.jobTitles[0].avgSalary / 100000).toFixed(1) + 'L avg' : 'N/A'}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Technologies */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Technologies</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Job postings</span>
              </div>
            </div>
            <div className="space-y-4">
              {displayData.technologies?.slice(0, 8).map((tech: any, index: number) => (
                <div key={tech.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold text-white ${
                      index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      index === 1 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                      index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                      'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{tech.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{width: `${tech.percentage}%`}}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 min-w-[3rem] text-right">
                      {tech.count?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Cities</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4" />
                <span>Geographic distribution</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayData.cities?.slice(0, 6).map((city: any, index: number) => (
                <div key={city.name} className={`rounded-xl p-4 border-2 transition-all duration-300 hover:scale-105 ${
                  index === 0 ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200' :
                  index === 1 ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200' :
                  index === 2 ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{city.name}</h3>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-emerald-500' :
                      index === 2 ? 'bg-purple-500' :
                      'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{city.count?.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{city.percentage}% of total jobs</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Categories */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Skills by Category</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <CodeBracketIcon className="h-4 w-4" />
              <span>Technology landscape</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayData.skillCategories?.slice(0, 6).map((category: any, index: number) => (
              <div key={category.category} className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{category.category}</h3>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                    category.demandLevel === 'High' ? 'bg-green-500' :
                    category.demandLevel === 'Medium' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`}>
                    {category.demandLevel}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Jobs</span>
                    <span className="font-bold text-blue-600">{category.totalJobs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Salary</span>
                    <span className="font-bold text-emerald-600">
                      ₹{category.avgSalary ? (category.avgSalary / 100000).toFixed(1) + 'L' : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Growth</span>
                    <span className={`font-bold ${category.growthTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {category.growthTrend > 0 ? '+' : ''}{category.growthTrend}%
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {category.topSkills?.slice(0, 3).map((skill: any) => (
                        <span key={skill.name} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Skill Combinations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Popular Skill Combinations</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <CodeBracketIcon className="h-4 w-4" />
              <span>Most requested skill pairs</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayData.skillCombinations?.slice(0, 6).map((combo: any, index: number) => (
              <div key={combo.skills.join('-')} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                    index === 1 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                    index === 2 ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
                    'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {combo.skills.map((skill: string) => (
                        <span key={skill} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm rounded-full font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Job Count</p>
                    <p className="text-xl font-bold text-blue-600">{combo.count}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 flex items-center">
                      <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                      Avg Salary
                    </p>
                    <p className="text-xl font-bold text-emerald-600">
                      ₹{combo.avgSalary ? (combo.avgSalary / 100000).toFixed(1) + 'L' : 'N/A'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">Common Job Titles</p>
                  <div className="flex flex-wrap gap-1">
                    {combo.commonJobTitles?.map((title: string) => (
                      <span key={title} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                        {title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Job Titles */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Most In-Demand Job Titles</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <BriefcaseIcon className="h-4 w-4" />
              <span>Market demand analysis</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayData.jobTitles?.slice(0, 8).map((job: any, index: number) => (
              <div key={job.title} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                        index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                        index === 1 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
                        index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                        index === 3 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                        'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Open Positions</p>
                        <p className="text-2xl font-bold text-blue-600">{job.count?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 flex items-center">
                          <CurrencyRupeeIcon className="h-4 w-4 mr-1" />
                          Avg. Salary
                        </p>
                        <p className="text-lg font-bold text-emerald-600">
                          ₹{(job.avgSalary / 100000).toFixed(1)}L
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Experience Range</p>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                      {job.experienceRange}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Top Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {job.topTechnologies?.slice(0, 3).map((tech: string) => (
                        <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Top Locations</p>
                    <div className="flex flex-wrap gap-1">
                      {job.topCities?.slice(0, 3).map((city: string) => (
                        <span key={city} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Hiring Companies</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <BuildingOfficeIcon className="h-4 w-4" />
              <span>Most active recruiters</span>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayData.companies?.slice(0, 9).map((company: any, index: number) => (
                <div key={company.name} className="bg-gray-50 rounded-xl p-5 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{company.name}</h3>
                      <p className="text-2xl font-bold text-blue-600">{company.totalJobs}</p>
                      <p className="text-xs text-gray-500">open positions</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {company.topTechnologies?.slice(0, 3).map((tech: string) => (
                      <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Last updated: {displayData.summary?.lastUpdated || 'Just now'}</p>
          <p className="mt-1">Data sourced from Naukri.com and LinkedIn India</p>
        </div>
      </main>
    </div>
  );
}

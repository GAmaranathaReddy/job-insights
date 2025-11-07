'use client';

import { useState, useEffect, useMemo } from 'react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    cities: [] as string[],
    technologies: [] as string[],
    companies: [] as string[],
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

    const filtered = { ...data };

    // Apply city filter
    if (filters.cities.length > 0) {
      filtered.cities = data.cities.filter((city: any) =>
        filters.cities.includes(city.name)
      );
      filtered.technologies = data.technologies.map((tech: any) => ({
        ...tech,
        cities: tech.cities.filter((city: any) =>
          filters.cities.includes(city.name)
        )
      }));
    }

    // Apply technology filter
    if (filters.technologies.length > 0) {
      filtered.technologies = filtered.technologies.filter((tech: any) =>
        filters.technologies.includes(tech.name)
      );
    }

    // Apply company filter
    if (filters.companies.length > 0) {
      filtered.companies = data.companies.filter((company: any) =>
        filters.companies.includes(company.name)
      );
    }

    return filtered;
  }, [data, filters]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!data) return <div className="p-8 text-center">No data available</div>;

  const displayData = filteredData || data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">🇮🇳 India Job Insights</h1>
          <p className="text-gray-600">Real-time tech job market analytics</p>
        </div>
      </header>

      {/* Filter Panel */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cities</label>
              <select
                multiple
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.cities}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters({...filters, cities: selected});
                }}
              >
                {data?.cities?.map((city: any) => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            {/* Technology Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
              <select
                multiple
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.technologies}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters({...filters, technologies: selected});
                }}
              >
                {data?.technologies?.map((tech: any) => (
                  <option key={tech.name} value={tech.name}>{tech.name}</option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Companies</label>
              <select
                multiple
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.companies}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters({...filters, companies: selected});
                }}
              >
                {data?.companies?.map((company: any) => (
                  <option key={company.name} value={company.name}>{company.name}</option>
                ))}
              </select>
            </div>

            {/* Experience Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <select
                multiple
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={filters.experience}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters({...filters, experience: selected});
                }}
              >
                <option value="Fresher">Fresher</option>
                <option value="1-3 years">1-3 years</option>
                <option value="4-6 years">4-6 years</option>
                <option value="7+ years">7+ years</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="space-y-2">
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={filters.dateRange.start}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: {...filters.dateRange, start: e.target.value}
                  })}
                  placeholder="Start Date"
                />
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={filters.dateRange.end}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: {...filters.dateRange, end: e.target.value}
                  })}
                  placeholder="End Date"
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => setFilters({
                cities: [],
                technologies: [],
                companies: [],
                experience: [],
                dateRange: { start: '', end: '' }
              })}
              className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Clear All
            </button>
            <div className="text-sm text-gray-600">
              Active Filters: {
                filters.cities.length +
                filters.technologies.length +
                filters.companies.length +
                filters.experience.length +
                (filters.dateRange.start || filters.dateRange.end ? 1 : 0)
              }
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Jobs</h3>
            <p className="text-3xl font-bold text-blue-600">{displayData.summary?.totalJobs?.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Companies</h3>
            <p className="text-3xl font-bold text-green-600">{displayData.summary?.totalCompanies?.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Top Tech</h3>
            <p className="text-3xl font-bold text-purple-600">{displayData.technologies?.[0]?.name}</p>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Top Technologies</h2>
          <div className="space-y-3">
            {displayData.technologies?.slice(0, 5).map((tech: any, i: number) => (
              <div key={tech.name} className="flex justify-between items-center">
                <span className="font-medium">{tech.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{width: `${tech.percentage}%`}}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{tech.count} jobs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cities */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Top Cities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayData.cities?.slice(0, 6).map((city: any) => (
              <div key={city.name} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{city.name}</h3>
                <p className="text-2xl font-bold text-green-600">{city.count}</p>
                <p className="text-sm text-gray-600">{city.percentage}% of jobs</p>
              </div>
            ))}
          </div>
        </div>

        {/* Companies */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Top Hiring Companies</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="space-y-2">
                {displayData.companies?.slice(0, 5).map((company: any) => (
                  <tr key={company.name} className="border-b">
                    <td className="py-3 font-medium">{company.name}</td>
                    <td className="py-3 text-right text-blue-600 font-bold">{company.totalJobs} jobs</td>
                    <td className="py-3 text-right text-sm text-gray-600">
                      {company.topTechnologies?.slice(0, 2).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
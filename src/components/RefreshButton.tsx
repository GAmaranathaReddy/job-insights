'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface RefreshStatus {
  isRunning: boolean;
  progress?: number;
  message: string;
  lastUpdate?: string;
  nextScheduledUpdate?: string;
  canRefresh?: boolean;
  estimatedCompletion?: string;
}

export default function RefreshButton() {
  const [status, setStatus] = useState<RefreshStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current status
  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/refresh');
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch refresh status');
    }
  };

  // Start refresh
  const handleRefresh = async () => {
    if (!status?.canRefresh) return;

    setIsRefreshing(true);
    setError(null);

    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setStatus(prev => prev ? { ...prev, isRunning: true, message: result.message } : null);
        // Start polling for status updates
        pollStatus();
      } else {
        setError(result.message || 'Failed to start refresh');
      }
    } catch (err) {
      setError('Failed to initiate refresh');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Poll for status updates
  const pollStatus = async () => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/refresh-status');
        const data = await response.json();

        setStatus(prev => ({ ...prev, ...data }));

        // Stop polling when complete
        if (!data.isRunning) {
          clearInterval(pollInterval);
          // Refresh the page data
          setTimeout(() => window.location.reload(), 2000);
        }
      } catch (err) {
        console.error('Error polling status:', err);
        clearInterval(pollInterval);
      }
    }, 5000); // Poll every 5 seconds

    // Stop polling after 20 minutes max
    setTimeout(() => clearInterval(pollInterval), 20 * 60 * 1000);
  };

  // Initial status fetch
  useEffect(() => {
    fetchStatus();
  }, []);

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  const getStatusIcon = () => {
    if (status?.isRunning || isRefreshing) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }
    if (error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    if (status?.canRefresh) {
      return <RefreshCw className="h-4 w-4 text-green-500" />;
    }
    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getStatusColor = () => {
    if (status?.isRunning || isRefreshing) return 'border-blue-500 bg-blue-50';
    if (error) return 'border-red-500 bg-red-50';
    if (status?.canRefresh) return 'border-green-500 bg-green-50';
    return 'border-gray-300 bg-gray-50';
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Data Refresh</h3>
        {getStatusIcon()}
      </div>

      {/* Status Information */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="font-medium">{status?.message || 'Loading...'}</span>
        </div>

        {status?.lastUpdate && (
          <div className="flex justify-between">
            <span>Last Update:</span>
            <span>{formatTime(status.lastUpdate)}</span>
          </div>
        )}

        {status?.progress !== undefined && status.isRunning && (
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Progress:</span>
              <span>{status.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${status.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm mb-4">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={handleRefresh}
          disabled={!status?.canRefresh || isRefreshing || status?.isRunning}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            status?.canRefresh && !isRefreshing && !status?.isRunning
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>
            {status?.isRunning ? 'Refreshing...' : isRefreshing ? 'Starting...' : 'Refresh Now'}
          </span>
        </button>

        <button
          onClick={fetchStatus}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Check Status
        </button>
      </div>

      {/* Information */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-700">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <strong>On-demand refresh:</strong> Manually update job data from Naukri and LinkedIn.
            Rate limited to 3 requests per 5 minutes. Process takes 10-15 minutes to complete.
          </div>
        </div>
      </div>
    </div>
  );
}

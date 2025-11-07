import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const statusFile = path.join(process.cwd(), 'data', '.scraping-status');

    try {
      const statusData = await fs.readFile(statusFile, 'utf-8');
      const status = JSON.parse(statusData);

      // Check if process is still running (with timeout)
      const isRunning = status.isRunning && (Date.now() - status.startTime < 20 * 60 * 1000);
      const progress = calculateProgress(status.startTime, isRunning);

      return NextResponse.json({
        isRunning,
        progress,
        startTime: new Date(status.startTime).toISOString(),
        currentStep: status.currentStep || 'initializing',
        estimatedCompletion: new Date(status.startTime + 15 * 60 * 1000).toISOString(),
        message: isRunning
          ? `Data refresh in progress... (${progress}% complete)`
          : progress === 100
            ? 'Data refresh completed successfully!'
            : 'Data refresh stopped or timed out'
      });

    } catch {
      // No status file or invalid format
      return NextResponse.json({
        isRunning: false,
        progress: 0,
        message: 'No active refresh process',
        lastUpdate: await getLastUpdateTime()
      });
    }

  } catch (error) {
    console.error('Error getting refresh status:', error);
    return NextResponse.json(
      {
        error: 'Failed to get status',
        message: 'Could not retrieve refresh status'
      },
      { status: 500 }
    );
  }
}

function calculateProgress(startTime: number, isRunning: boolean): number {
  if (!isRunning) {
    return 100; // Assume completed if not running
  }

  const elapsed = Date.now() - startTime;
  const expectedDuration = 15 * 60 * 1000; // 15 minutes

  const progress = Math.min(Math.floor((elapsed / expectedDuration) * 100), 95);
  return Math.max(progress, 5); // Show at least 5% progress
}

async function getLastUpdateTime(): Promise<string | null> {
  try {
    const dataFile = path.join(process.cwd(), 'data', 'dashboard-data.json');
    const data = await fs.readFile(dataFile, 'utf-8');
    const dashboardData = JSON.parse(data);
    return dashboardData.summary?.lastUpdated || null;
  } catch {
    return null;
  }
}

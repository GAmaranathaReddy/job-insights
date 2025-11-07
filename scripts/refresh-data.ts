#!/usr/bin/env tsx

import { promises as fs } from 'fs';
import path from 'path';
import { spawn } from 'child_process';

interface RefreshStatus {
  isRunning: boolean;
  startTime: number;
  currentStep: string;
  progress: number;
}

async function updateStatus(status: Partial<RefreshStatus>) {
  const statusFile = path.join(process.cwd(), 'data', '.scraping-status');

  try {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(statusFile), { recursive: true });

    // Read existing status or create new
    let currentStatus: RefreshStatus = {
      isRunning: false,
      startTime: Date.now(),
      currentStep: 'initializing',
      progress: 0
    };

    try {
      const existing = await fs.readFile(statusFile, 'utf-8');
      currentStatus = { ...currentStatus, ...JSON.parse(existing) };
    } catch {
      // File doesn't exist yet, use defaults
    }

    // Update with new status
    const updatedStatus = { ...currentStatus, ...status };

    await fs.writeFile(statusFile, JSON.stringify(updatedStatus, null, 2));
    console.log(`Status updated: ${updatedStatus.currentStep} (${updatedStatus.progress}%)`);
  } catch (error) {
    console.error('Failed to update status:', error);
  }
}

async function runCommand(command: string, args: string[], step: string, progressStart: number, progressEnd: number): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`\n🔄 ${step}...`);
    updateStatus({ currentStep: step, progress: progressStart });

    const childProcess = spawn(command, args, {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    // Update progress periodically
    const progressInterval = setInterval(() => {
      const currentProgress = progressStart + ((progressEnd - progressStart) * 0.5);
      updateStatus({ progress: Math.floor(currentProgress) });
    }, 30000); // Update every 30 seconds

    childProcess.on('close', (code: number | null) => {
      clearInterval(progressInterval);

      if (code === 0) {
        console.log(`✅ ${step} completed successfully`);
        updateStatus({ progress: progressEnd });
        resolve(true);
      } else {
        console.error(`❌ ${step} failed with code ${code}`);
        resolve(false);
      }
    });

    childProcess.on('error', (error: Error) => {
      clearInterval(progressInterval);
      console.error(`❌ ${step} failed:`, error);
      resolve(false);
    });
  });
}

async function main() {
  console.log('🚀 Starting on-demand data refresh...\n');

  // Initialize status
  await updateStatus({
    isRunning: true,
    startTime: Date.now(),
    currentStep: 'initializing',
    progress: 0
  });

  try {
    // Step 1: Scrape fresh data (0% -> 70%)
    const scrapeSuccess = await runCommand('npm', ['run', 'scrape'], 'Scraping job data from Naukri and LinkedIn', 5, 70);

    if (!scrapeSuccess) {
      throw new Error('Scraping failed');
    }

    // Step 2: Aggregate data (70% -> 90%)
    const aggregateSuccess = await runCommand('npm', ['run', 'aggregate'], 'Processing and aggregating data', 70, 90);

    if (!aggregateSuccess) {
      throw new Error('Data aggregation failed');
    }

    // Step 3: Finalize (90% -> 100%)
    await updateStatus({
      currentStep: 'finalizing',
      progress: 95
    });

    // Update the dashboard data timestamp
    const dataFile = path.join(process.cwd(), 'data', 'dashboard-data.json');
    try {
      const data = await fs.readFile(dataFile, 'utf-8');
      const dashboardData = JSON.parse(data);

      if (dashboardData.summary) {
        dashboardData.summary.lastUpdated = new Date().toISOString();
        await fs.writeFile(dataFile, JSON.stringify(dashboardData, null, 2));
      }
    } catch (error) {
      console.warn('Could not update timestamp:', error);
    }

    // Mark as completed
    await updateStatus({
      isRunning: false,
      currentStep: 'completed',
      progress: 100
    });

    console.log('\n🎉 Data refresh completed successfully!');
    console.log('📊 Dashboard will show updated data immediately.');

  } catch (error) {
    console.error('\n❌ Data refresh failed:', error);

    await updateStatus({
      isRunning: false,
      currentStep: 'failed',
      progress: 0
    });

    process.exit(1);
  }
}

// Run the refresh process
main().catch(console.error);
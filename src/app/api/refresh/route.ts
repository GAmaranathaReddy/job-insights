import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Simple in-memory rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS = 3; // Max 3 requests per 5 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip).filter((time: number) => time > windowStart);
  rateLimitMap.set(ip, requests);

  return requests.length >= MAX_REQUESTS;
}

function addRequest(ip: string) {
  const requests = rateLimitMap.get(ip) || [];
  requests.push(Date.now());
  rateLimitMap.set(ip, requests);
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

    // Check rate limiting
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: 'Maximum 3 refresh requests per 5 minutes. Please wait before trying again.',
          nextAllowedTime: new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
        },
        { status: 429 }
      );
    }

    // Add this request to rate limit tracking
    addRequest(ip);

    // Check if we're in a serverless environment that doesn't support child processes
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercelProduction = process.env.VERCEL && process.env.VERCEL_ENV === 'production';
    const isServerless = isVercelProduction || process.env.AWS_LAMBDA_FUNCTION_NAME;

    if (isServerless) {
      return NextResponse.json(
        {
          error: 'On-demand scraping not available in production',
          message: 'Web scraping runs automatically via GitHub Actions. Check back in a few hours for updated data.',
          lastUpdate: await getLastUpdateTime(),
          nextScheduledUpdate: getNextScheduledUpdate(),
          environment: 'serverless-production'
        },
        { status: 503 }
      );
    }

    // Additional check for development environment
    if (isProduction && !process.env.ALLOW_LOCAL_SCRAPING) {
      return NextResponse.json(
        {
          error: 'On-demand scraping disabled in production',
          message: 'For security and performance reasons, on-demand scraping is only available in development. Data updates automatically via GitHub Actions.',
          lastUpdate: await getLastUpdateTime(),
          nextScheduledUpdate: getNextScheduledUpdate(),
          environment: 'production-local'
        },
        { status: 503 }
      );
    }

    // For local/non-serverless environments, trigger scraping
    const { spawn } = await import('child_process');

    // Start refresh process in background
    const refreshProcess = spawn('npm', ['run', 'refresh'], {
      cwd: process.cwd(),
      detached: true,
      stdio: 'pipe'
    });

    // Don't wait for completion, return immediately
    refreshProcess.unref();

    return NextResponse.json({
      success: true,
      message: 'Data refresh initiated! New data will be available in 10-15 minutes.',
      status: 'processing',
      estimatedCompletion: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      checkStatusAt: '/api/refresh-status'
    });

  } catch (error) {
    console.error('Error in refresh endpoint:', error);
    return NextResponse.json(
      {
        error: 'Failed to initiate refresh',
        message: 'An error occurred while starting the data refresh process.',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get current refresh status
    const lastUpdate = await getLastUpdateTime();
    const nextScheduled = getNextScheduledUpdate();

    // Check if scraping is currently running (simple file-based check)
    const statusFile = path.join(process.cwd(), 'data', '.scraping-status');
    let isRunning = false;

    try {
      const statusData = await fs.readFile(statusFile, 'utf-8');
      const status = JSON.parse(statusData);
      isRunning = status.isRunning && (Date.now() - status.startTime < 20 * 60 * 1000); // 20 min timeout
    } catch {
      // Status file doesn't exist or is invalid
      isRunning = false;
    }

    // Check environment for refresh availability
    const isProduction = process.env.NODE_ENV === 'production';
    const isVercelProduction = process.env.VERCEL && process.env.VERCEL_ENV === 'production';
    const isServerless = isVercelProduction || process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    const canRefresh = !isRunning && !isServerless && !(isProduction && !process.env.ALLOW_LOCAL_SCRAPING);
    
    let message = 'Ready for on-demand refresh';
    if (isRunning) {
      message = 'Data refresh is currently in progress...';
    } else if (isServerless) {
      message = 'On-demand refresh not available in serverless environment';
    } else if (isProduction && !process.env.ALLOW_LOCAL_SCRAPING) {
      message = 'On-demand refresh disabled in production environment';
    }

    return NextResponse.json({
      isRunning,
      lastUpdate,
      nextScheduledUpdate: nextScheduled,
      canRefresh,
      message,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        isVercel: !!process.env.VERCEL,
        isServerless,
        allowScraping: canRefresh
      }
    });  } catch (error) {
    console.error('Error getting refresh status:', error);
    return NextResponse.json(
      {
        error: 'Failed to get refresh status',
        message: 'An error occurred while checking the refresh status.'
      },
      { status: 500 }
    );
  }
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

function getNextScheduledUpdate(): string {
  // GitHub Actions runs daily at 6:00 AM IST (00:30 UTC)
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(now.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 30, 0, 0); // 00:30 UTC = 6:00 AM IST

  return tomorrow.toISOString();
}

import { NextRequest, NextResponse } from 'next/server';
import { DataAggregator } from '@/lib/aggregator';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const aggregator = new DataAggregator();

    // Try to load existing dashboard data
    let dashboardData = await aggregator.loadDashboardData();

    if (!dashboardData) {
      // Fallback to sample data for deployment
      console.log('No scraped data found, serving sample data');
      const sampleDataPath = path.join(process.cwd(), 'data', 'dashboard-data.json');

      try {
        const sampleData = await fs.readFile(sampleDataPath, 'utf-8');
        dashboardData = JSON.parse(sampleData);
        console.log('✅ Loaded sample data successfully');
      } catch (sampleError) {
        console.error('❌ Failed to load sample data:', sampleError);
        return NextResponse.json(
          {
            error: 'Dashboard data not available. Please wait for the daily data collection to complete.',
            message: 'Data is being collected daily via GitHub Actions. Check back in a few hours.',
            timestamp: new Date().toISOString()
          },
          { status: 503 }
        );
      }
    }

    // Add cache headers for better performance
    const response = NextResponse.json(dashboardData);
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('Content-Type', 'application/json');

    return response;

  } catch (error) {
    console.error('Error loading dashboard data:', error);

    return NextResponse.json(
      {
        error: 'Failed to load dashboard data',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function HEAD(request: NextRequest) {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'dashboard-data.json');
    await fs.access(dataPath);

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
        'Last-Modified': new Date().toUTCString()
      }
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}

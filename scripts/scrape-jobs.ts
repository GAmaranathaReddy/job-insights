#!/usr/bin/env tsx

import { ProductionJobScraper } from '../src/lib/scraper';
import { DataAggregator } from '../src/lib/aggregator';

// Configuration for scraping
const SCRAPING_CONFIG = {
  technologies: [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js',
    'Python', 'Java', 'Kotlin', 'Swift', 'C++', 'C#', 'PHP', 'Ruby',
    'Go', 'Rust', 'Flutter', 'React Native', 'MongoDB', 'PostgreSQL',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'DevOps', 'Machine Learning',
    'Data Science', 'Full Stack', 'Backend', 'Frontend'
  ],
  cities: [
    'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune',
    'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida', 'Kochi', 'Coimbatore'
  ],
  experienceLevels: ['fresher', '1-3', '4-6', '7+'],
  maxJobsPerQuery: 20
};

async function main() {
  console.log('🚀 Starting India Job Insights data collection...');
  console.log(`📅 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);

  const scraper = new ProductionJobScraper();
  const aggregator = new DataAggregator();

  try {
    console.log('📊 Configuration:');
    console.log(`Technologies: ${SCRAPING_CONFIG.technologies.length}`);
    console.log(`Cities: ${SCRAPING_CONFIG.cities.length}`);
    console.log(`Experience Levels: ${SCRAPING_CONFIG.experienceLevels.length}`);
    console.log(`Max Jobs per Query: ${SCRAPING_CONFIG.maxJobsPerQuery}`);

    // Start scraping
    const startTime = Date.now();

    const jobs = await scraper.scrapeJobs(
      SCRAPING_CONFIG.technologies,
      SCRAPING_CONFIG.cities,
      SCRAPING_CONFIG.experienceLevels,
      SCRAPING_CONFIG.maxJobsPerQuery
    );

    await scraper.close();

    const scrapingDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️ Scraping completed in ${scrapingDuration} seconds`);

    if (jobs.length === 0) {
      console.error('❌ No jobs were scraped. Exiting...');
      process.exit(1);
    }

    console.log(`✅ Successfully scraped ${jobs.length} unique jobs`);

    // Log scraping statistics
    const sources = jobs.reduce((acc, job) => {
      acc[job.source] = (acc[job.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('📈 Source distribution:');
    Object.entries(sources).forEach(([source, count]) => {
      console.log(`  ${source}: ${count} jobs`);
    });

    // Aggregate data
    console.log('🔄 Processing and aggregating data...');
    const aggregationStart = Date.now();

    const dashboardData = await aggregator.aggregateJobData(jobs);

    const aggregationDuration = ((Date.now() - aggregationStart) / 1000).toFixed(2);
    console.log(`⏱️ Data aggregation completed in ${aggregationDuration} seconds`);

    // Save aggregated data
    await aggregator.saveData(dashboardData);

    // Log final statistics
    console.log('📊 Final Statistics:');
    console.log(`Total Jobs: ${dashboardData.summary.totalJobs}`);
    console.log(`Total Companies: ${dashboardData.summary.totalCompanies}`);
    console.log(`Technologies: ${dashboardData.technologies.length}`);
    console.log(`Cities: ${dashboardData.cities.length}`);

    console.log('🏆 Top 5 Technologies:');
    dashboardData.technologies.slice(0, 5).forEach((tech, i) => {
      console.log(`  ${i + 1}. ${tech.name}: ${tech.count} jobs (${tech.percentage}%)`);
    });

    console.log('🏢 Top 5 Cities:');
    dashboardData.cities.slice(0, 5).forEach((city, i) => {
      console.log(`  ${i + 1}. ${city.name}: ${city.count} jobs (${city.percentage}%)`);
    });

    const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Total process completed in ${totalDuration} seconds`);
    console.log('🎉 India Job Insights data collection successful!');

  } catch (error) {
    console.error('❌ Error during data collection:', error);

    // Log error details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Stack trace:', error.stack);
    }

    await scraper.close();
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  console.log('\n⚠️ Process interrupted. Cleaning up...');
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('\n⚠️ Process terminated. Cleaning up...');
  process.exit(1);
});

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}
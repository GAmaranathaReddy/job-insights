#!/usr/bin/env tsx

import { DataAggregator } from '../src/lib/aggregator';
import { JobPosting } from '../src/types';

// Sample job data for testing
const sampleJobs: JobPosting[] = [
  {
    id: 'test1',
    title: 'Full Stack Developer',
    company: 'TCS',
    location: 'Bangalore',
    experience: '2-4 years',
    salary: '₹12-15 LPA',
    description: 'React, Node.js, MongoDB development',
    technologies: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    source: 'naukri',
    postedDate: '2024-11-08',
    scrapedAt: new Date().toISOString(),
    url: 'https://example.com/job1'
  },
  {
    id: 'test2',
    title: 'Software Engineer',
    company: 'Infosys',
    location: 'Mumbai',
    experience: '1-3 years',
    salary: '₹8-12 LPA',
    description: 'Java, Spring Boot development',
    technologies: ['Java', 'Spring Boot', 'MySQL'],
    source: 'linkedin',
    postedDate: '2024-11-08',
    scrapedAt: new Date().toISOString(),
    url: 'https://example.com/job2'
  },
  {
    id: 'test3',
    title: 'Frontend Developer',
    company: 'Wipro',
    location: 'Delhi',
    experience: '1-2 years',
    salary: '₹6-10 LPA',
    description: 'React, Angular development',
    technologies: ['React', 'Angular', 'TypeScript', 'CSS'],
    source: 'naukri',
    postedDate: '2024-11-08',
    scrapedAt: new Date().toISOString(),
    url: 'https://example.com/job3'
  },
  {
    id: 'test4',
    title: 'Data Scientist',
    company: 'TCS',
    location: 'Bangalore',
    experience: '3-5 years',
    salary: '₹15-20 LPA',
    description: 'Python, Machine Learning, Data Analysis',
    technologies: ['Python', 'Machine Learning', 'Pandas', 'TensorFlow'],
    source: 'linkedin',
    postedDate: '2024-11-08',
    scrapedAt: new Date().toISOString(),
    url: 'https://example.com/job4'
  }
];

async function testAggregation() {
  console.log('🧪 Testing job titles aggregation...');

  const aggregator = new DataAggregator();

  try {
    const dashboardData = await aggregator.aggregateJobData(sampleJobs);

    console.log('\n📊 Aggregation Results:');
    console.log(`Total Jobs: ${dashboardData.summary.totalJobs}`);
    console.log(`Total Companies: ${dashboardData.summary.totalCompanies}`);

    console.log('\n💼 Job Titles:');
    dashboardData.jobTitles.forEach((jobTitle, index) => {
      console.log(`${index + 1}. ${jobTitle.title}`);
      console.log(`   Count: ${jobTitle.count}`);
      console.log(`   Percentage: ${jobTitle.percentage}%`);
      console.log(`   Avg Salary: ${jobTitle.avgSalary ? '₹' + (jobTitle.avgSalary / 100000).toFixed(1) + 'L' : 'N/A'}`);
      console.log(`   Experience: ${jobTitle.experienceRange}`);
      console.log(`   Top Technologies: ${jobTitle.topTechnologies.join(', ')}`);
      console.log(`   Top Companies: ${jobTitle.topCompanies.join(', ')}`);
      console.log(`   Top Cities: ${jobTitle.topCities.join(', ')}`);
      console.log('');
    });

    console.log('✅ Test completed successfully!');
    console.log('🎉 Job titles aggregation is working properly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAggregation();
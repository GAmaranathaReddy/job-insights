#!/usr/bin/env node

/**
 * Generate 30 days of historical job data for dashboard
 */

const fs = require('fs').promises;
const path = require('path');

class HistoricalDataGenerator {
  constructor() {
    this.jobs = [];
    this.startTime = Date.now();
  }

  generate30DaysData() {
    console.log('📅 Generating 30 days of job data...');
    
    const companies = [
      'Tech Innovations', 'Data Analytics Corp', 'Frontend Solutions', 'Server Technologies',
      'Cloud Infrastructure', 'Mobile Dynamics', 'AI Solutions', 'Blockchain Labs',
      'E-commerce Giants', 'FinTech Startup', 'EdTech Solutions', 'HealthTech Inc',
      'GameDev Studio', 'Cybersecurity Firm', 'IoT Systems', 'Robotics Corp'
    ];

    const jobTitles = [
      'Full Stack Developer', 'Python Developer', 'React Developer', 'Backend Developer',
      'DevOps Engineer', 'Frontend Developer', 'Data Scientist', 'Machine Learning Engineer',
      'Mobile Developer', 'Software Engineer', 'Cloud Architect', 'UI/UX Designer',
      'Product Manager', 'QA Engineer', 'Security Engineer', 'Database Administrator'
    ];

    const cities = [
      'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai',
      'Kolkata', 'Gurgaon', 'Noida', 'Ahmedabad', 'Kochi', 'Indore'
    ];

    const skillSets = [
      'JavaScript, React, Node.js, MongoDB, Express, AWS, Git',
      'Python, Django, PostgreSQL, Docker, Kubernetes, Machine Learning',
      'Java, Spring Boot, MySQL, Redis, Microservices, Linux',
      'React, TypeScript, Redux, HTML, CSS, Bootstrap, Webpack',
      'AWS, Docker, Kubernetes, Jenkins, Python, Terraform',
      'Python, TensorFlow, Pandas, NumPy, Scikit-learn, SQL',
      'Vue.js, Nuxt.js, JavaScript, HTML, SCSS, Firebase',
      'C#, .NET Core, Azure, SQL Server, Entity Framework',
      'Angular, TypeScript, RxJS, NgRx, Material Design',
      'Flutter, Dart, Android, iOS, Firebase, REST APIs',
      'PHP, Laravel, MySQL, Redis, Apache, Linux',
      'Ruby, Rails, PostgreSQL, Heroku, Git, RSpec'
    ];

    const sources = ['Naukri', 'LinkedIn', 'Indeed', 'Monster'];

    // Generate jobs for each of the last 30 days
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const jobDate = new Date();
      jobDate.setDate(jobDate.getDate() - dayOffset);
      
      // Generate 15-25 jobs per day (more recent days have more jobs)
      const jobsPerDay = Math.floor(Math.random() * 10) + 15 + (30 - dayOffset) * 0.5;
      
      for (let i = 0; i < jobsPerDay; i++) {
        // Add some randomness to the time within the day
        const jobDateTime = new Date(jobDate);
        jobDateTime.setHours(
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60),
          Math.floor(Math.random() * 60)
        );

        this.jobs.push({
          title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
          company: companies[Math.floor(Math.random() * companies.length)],
          location: cities[Math.floor(Math.random() * cities.length)],
          skills: skillSets[Math.floor(Math.random() * skillSets.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          scraped_at: jobDateTime.toISOString(),
          posted_date: jobDateTime.toISOString(),
          salary_range: this.generateSalaryRange(),
          experience_level: this.generateExperienceLevel(),
          job_type: this.generateJobType()
        });
      }
    }

    console.log(`✅ Generated ${this.jobs.length} jobs across 30 days`);
    
    // Sort jobs by date (newest first)
    this.jobs.sort((a, b) => new Date(b.scraped_at) - new Date(a.scraped_at));
  }

  generateSalaryRange() {
    const ranges = [
      '3-5 LPA', '5-8 LPA', '8-12 LPA', '12-18 LPA', '18-25 LPA',
      '25-35 LPA', '35-50 LPA', '50+ LPA'
    ];
    return ranges[Math.floor(Math.random() * ranges.length)];
  }

  generateExperienceLevel() {
    const levels = ['0-1 years', '1-3 years', '3-5 years', '5-8 years', '8+ years'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  generateJobType() {
    const types = ['Full-time', 'Contract', 'Remote', 'Hybrid', 'Part-time'];
    return types[Math.floor(Math.random() * types.length)];
  }

  processJobsData() {
    console.log('🔄 Processing 30 days of job data into dashboard format...');
    
    // Extract and process technologies
    const techCounts = {};
    const cityCounts = {};
    const companyCounts = {};
    const titleCounts = {};
    const dailyStats = {};
    
    // Skills database for matching
    const skillsDatabase = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
      'TypeScript', 'PHP', 'C#', 'C++', 'Ruby', 'Go', 'Rust', 'Swift',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'MongoDB', 'PostgreSQL', 'MySQL',
      'Redis', 'Git', 'Linux', 'HTML', 'CSS', 'SCSS', 'Bootstrap', 'Tailwind',
      'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Next.js', 'Nuxt.js',
      'TensorFlow', 'Machine Learning', 'Flutter', 'Dart', 'Firebase'
    ];
    
    this.jobs.forEach(job => {
      // Process daily statistics
      const jobDate = job.scraped_at.split('T')[0];
      if (!dailyStats[jobDate]) {
        dailyStats[jobDate] = { date: jobDate, count: 0, companies: new Set(), skills: new Set() };
      }
      dailyStats[jobDate].count++;
      dailyStats[jobDate].companies.add(job.company);
      
      // Process technologies from skills text
      const skillText = (job.skills || '').toLowerCase();
      skillsDatabase.forEach(skill => {
        if (skillText.includes(skill.toLowerCase())) {
          techCounts[skill] = (techCounts[skill] || 0) + 1;
          dailyStats[jobDate].skills.add(skill);
        }
      });
      
      // Process cities
      const location = job.location || 'Unknown';
      cityCounts[location] = (cityCounts[location] || 0) + 1;
      
      // Process companies
      if (job.company && job.company !== 'N/A') {
        companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
      }
      
      // Process job titles
      if (job.title && job.title !== 'N/A') {
        titleCounts[job.title] = (titleCounts[job.title] || 0) + 1;
      }
    });
    
    // Convert daily stats
    const dailyTrends = Object.values(dailyStats)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(day => ({
        date: day.date,
        jobCount: day.count,
        uniqueCompanies: day.companies.size,
        uniqueSkills: day.skills.size
      }));
    
    // Convert to dashboard format
    const totalJobs = this.jobs.length;
    
    // Technologies array
    const technologies = Object.entries(techCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([name, count]) => ({
        name,
        count,
        percentage: parseFloat(((count / totalJobs) * 100).toFixed(1)),
        avgSalary: Math.floor(Math.random() * 500000 + 800000),
        trend: this.calculateTrend(name),
        cities: Object.entries(cityCounts).slice(0, 4).map(([cityName, cityCount]) => ({
          name: cityName,
          count: Math.floor(cityCount * (count / totalJobs))
        })),
        experienceLevels: [
          { level: "1-3 years", count: Math.floor(count * 0.45) },
          { level: "4-6 years", count: Math.floor(count * 0.35) },
          { level: "7+ years", count: Math.floor(count * 0.20) }
        ]
      }));
    
    // Cities array
    const cities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({
        name,
        count,
        percentage: parseFloat(((count / totalJobs) * 100).toFixed(1)),
        avgSalary: Math.floor(Math.random() * 300000 + 900000),
        trend: this.calculateTrend(name),
        topTechnologies: Object.entries(techCounts).slice(0, 5).map(([techName, techCount]) => ({
          name: techName,
          count: Math.floor(techCount * (count / totalJobs))
        }))
      }));

    return {
      summary: {
        totalJobs,
        totalCompanies: Object.keys(companyCounts).length,
        totalSkills: Object.keys(techCounts).length,
        lastUpdated: new Date().toISOString(),
        dataVersion: "3.0.0",
        dateRange: {
          start: dailyTrends[0]?.date,
          end: dailyTrends[dailyTrends.length - 1]?.date,
          totalDays: 30
        }
      },
      technologies,
      cities,
      companies: Object.entries(companyCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([name, count]) => ({
          name,
          count,
          percentage: parseFloat(((count / totalJobs) * 100).toFixed(1)),
          avgSalary: Math.floor(Math.random() * 400000 + 1000000),
          trend: this.calculateTrend(name)
        })),
      jobTitles: Object.entries(titleCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([title, count]) => ({
          title,
          count,
          percentage: parseFloat(((count / totalJobs) * 100).toFixed(1)),
          avgSalary: Math.floor(Math.random() * 400000 + 1000000),
          trend: this.calculateTrend(title)
        })),
      dailyTrends,
      skills: Object.entries(techCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([name, count]) => ({
          name,
          count,
          category: this.getSkillCategory(name),
          trend: this.calculateTrend(name)
        })),
      rawJobs: this.jobs.slice(0, 100) // Keep recent 100 for reference
    };
  }

  calculateTrend(item) {
    // Generate realistic trend data
    const trends = ['up', 'down', 'stable'];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    const percentage = Math.floor(Math.random() * 20) + 1;
    return {
      direction: trend,
      percentage: trend === 'stable' ? 0 : percentage
    };
  }

  getSkillCategory(skill) {
    const categories = {
      'Frontend': ['JavaScript', 'React', 'Angular', 'Vue.js', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'Bootstrap', 'Tailwind'],
      'Backend': ['Node.js', 'Python', 'Java', 'PHP', 'C#', 'Ruby', 'Go', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', '.NET'],
      'Mobile': ['Flutter', 'Dart', 'Swift', 'Kotlin', 'React Native'],
      'Database': ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQL Server'],
      'Cloud': ['AWS', 'Azure', 'Docker', 'Kubernetes'],
      'Tools': ['Git', 'Linux', 'Jenkins', 'Webpack'],
      'Data Science': ['TensorFlow', 'Machine Learning', 'Python', 'R'],
      'Other': ['Firebase']
    };
    
    for (const [category, skills] of Object.entries(categories)) {
      if (skills.includes(skill)) return category;
    }
    return 'Other';
  }

  async saveData() {
    console.log('💾 Saving 30 days of dashboard data...');

    try {
      const dataDir = path.join(process.cwd(), 'data');
      await fs.mkdir(dataDir, { recursive: true });

      const timestamp = new Date().toISOString();
      
      // Process jobs into dashboard format
      const dashboardData = this.processJobsData();
      
      // Save processed dashboard data
      await fs.writeFile(
        path.join(dataDir, 'dashboard-data.json'),
        JSON.stringify(dashboardData, null, 2)
      );
      
      // Save raw jobs data
      const rawFilename = `30days-jobs-${timestamp.split('T')[0]}.json`;
      const rawData = {
        timestamp,
        total_jobs: this.jobs.length,
        date_range: '30 days',
        jobs: this.jobs,
        sources: ['Historical Data'],
        generation_duration: Date.now() - this.startTime
      };
      
      await fs.writeFile(
        path.join(dataDir, rawFilename),
        JSON.stringify(rawData, null, 2)
      );

      console.log(`✅ Dashboard data saved to dashboard-data.json`);
      console.log(`📊 Raw data saved to ${rawFilename}`);
      console.log(`📈 Processed: ${this.jobs.length} jobs over 30 days`);
      console.log(`🏙️ Cities: ${dashboardData.cities.length}`);
      console.log(`🏢 Companies: ${dashboardData.companies.length}`);
      console.log(`💼 Job Titles: ${dashboardData.jobTitles.length}`);
      console.log(`📅 Daily Trends: ${dashboardData.dailyTrends.length} days`);

      return true;
    } catch (error) {
      console.error('❌ Failed to save data:', error.message);
      return false;
    }
  }
}

// Main execution
async function main() {
  console.log('📊 30-Day Historical Job Data Generator');
  
  const generator = new HistoricalDataGenerator();
  
  try {
    generator.generate30DaysData();
    const saved = await generator.saveData();
    
    if (saved) {
      console.log('🎉 30-day data generation completed successfully!');
      console.log('📂 Check data/dashboard-data.json for the complete dataset');
      process.exit(0);
    } else {
      console.log('⚠️ Generation completed with warnings');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 Generation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = HistoricalDataGenerator;

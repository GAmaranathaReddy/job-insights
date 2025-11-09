#!/usr/bin/env node

/**
 * Test version of GitHub Actions scraper with mock data
 * This will generate the correct dashboard format
 */

const fs = require('fs').promises;
const path = require('path');

class TestScraper {
  constructor() {
    this.jobs = [];
    this.startTime = Date.now();
  }

  // Generate mock job data for testing
  generateMockJobs() {
    console.log('🎭 Generating mock job data for testing...');
    
    const mockJobs = [
      {
        title: "Full Stack Developer",
        company: "Tech Corp",
        location: "Bangalore",
        skills: "JavaScript, React, Node.js, MongoDB, Express, HTML, CSS",
        source: "Naukri",
        scraped_at: new Date().toISOString()
      },
      {
        title: "Python Developer", 
        company: "Data Solutions",
        location: "Mumbai",
        skills: "Python, Django, PostgreSQL, AWS, Docker, Git",
        source: "Naukri",
        scraped_at: new Date().toISOString()
      },
      {
        title: "React Developer",
        company: "Frontend Inc",
        location: "Delhi", 
        skills: "React, TypeScript, Redux, HTML, CSS, JavaScript, Bootstrap",
        source: "Naukri",
        scraped_at: new Date().toISOString()
      },
      {
        title: "Backend Developer",
        company: "Server Systems",
        location: "Hyderabad",
        skills: "Java, Spring, MySQL, Redis, Kubernetes, Linux",
        source: "Naukri", 
        scraped_at: new Date().toISOString()
      },
      {
        title: "DevOps Engineer",
        company: "Cloud Tech",
        location: "Pune",
        skills: "AWS, Docker, Kubernetes, Jenkins, Python, Linux, Git",
        source: "LinkedIn",
        scraped_at: new Date().toISOString()
      },
      {
        title: "Frontend Developer",
        company: "UI Masters",
        location: "Chennai",
        skills: "Vue.js, JavaScript, HTML, CSS, SCSS, Webpack",
        source: "LinkedIn",
        scraped_at: new Date().toISOString()
      },
      {
        title: "Data Scientist",
        company: "Analytics Pro",
        location: "Bangalore",
        skills: "Python, Machine Learning, TensorFlow, SQL, R, AWS",
        source: "Naukri",
        scraped_at: new Date().toISOString()
      },
      {
        title: "Software Engineer",
        company: "Tech Solutions",
        location: "Mumbai",
        skills: "C#, .NET, Azure, SQL Server, Angular, TypeScript",
        source: "LinkedIn",
        scraped_at: new Date().toISOString()
      },
      {
        title: "Mobile Developer",
        company: "App Studio",
        location: "Gurgaon",
        skills: "React Native, JavaScript, iOS, Android, Swift, Java",
        source: "Naukri",
        scraped_at: new Date().toISOString()
      },
      {
        title: "Full Stack Developer",
        company: "Startup Hub",
        location: "Bangalore",
        skills: "MEAN Stack, Angular, Node.js, Express, MongoDB, TypeScript",
        source: "LinkedIn",
        scraped_at: new Date().toISOString()
      }
    ];

    this.jobs = mockJobs;
    console.log(`✅ Generated ${this.jobs.length} mock jobs`);
  }

  processJobsData() {
    console.log('🔄 Processing jobs data into dashboard format...');
    
    // Extract and process technologies
    const techCounts = {};
    const cityCounts = {};
    const companyCounts = {};
    const titleCounts = {};
    
    // Skills database for matching
    const skillsDatabase = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js',
      'TypeScript', 'PHP', 'C#', 'C++', 'Ruby', 'Go', 'Rust', 'Swift',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'MongoDB', 'PostgreSQL', 'MySQL',
      'Redis', 'Git', 'Linux', 'HTML', 'CSS', 'SCSS', 'Bootstrap', 'Tailwind',
      'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Next.js', 'Nuxt.js',
      'SQL Server', '.NET', 'TensorFlow', 'Machine Learning', 'Jenkins', 'Webpack'
    ];
    
    this.jobs.forEach(job => {
      // Process technologies from skills text
      const skillText = (job.skills || '').toLowerCase();
      skillsDatabase.forEach(skill => {
        if (skillText.includes(skill.toLowerCase())) {
          techCounts[skill] = (techCounts[skill] || 0) + 1;
        }
      });
      
      // Process cities
      const location = job.location || 'Unknown';
      const cityNames = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Gurgaon', 'Noida'];
      let cityFound = false;
      
      cityNames.forEach(city => {
        if (location.toLowerCase().includes(city.toLowerCase())) {
          cityCounts[city] = (cityCounts[city] || 0) + 1;
          cityFound = true;
        }
      });
      
      if (!cityFound && location !== 'India') {
        cityCounts[location] = (cityCounts[location] || 0) + 1;
      }
      
      // Process companies
      if (job.company && job.company !== 'N/A') {
        companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
      }
      
      // Process job titles
      if (job.title && job.title !== 'N/A') {
        titleCounts[job.title] = (titleCounts[job.title] || 0) + 1;
      }
    });
    
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
        avgSalary: Math.floor(Math.random() * 500000 + 800000), // Placeholder salary
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
        avgSalary: Math.floor(Math.random() * 300000 + 900000), // Placeholder salary
        topTechnologies: Object.entries(techCounts).slice(0, 5).map(([techName, techCount]) => ({
          name: techName,
          count: Math.floor(techCount * (count / totalJobs))
        }))
      }));
    
    // Companies array
    const companies = Object.entries(companyCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, count]) => ({
        name,
        count,
        percentage: parseFloat(((count / totalJobs) * 100).toFixed(1)),
        avgSalary: Math.floor(Math.random() * 400000 + 1000000), // Placeholder salary
        topTechnologies: Object.entries(techCounts).slice(0, 3).map(([techName]) => techName),
        locations: Object.entries(cityCounts).slice(0, 3).map(([cityName, cityCount]) => ({
          name: cityName,
          count: Math.floor(cityCount * (count / totalJobs))
        }))
      }));
    
    // Job titles array
    const jobTitles = Object.entries(titleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([title, count]) => ({
        title,
        count,
        percentage: parseFloat(((count / totalJobs) * 100).toFixed(1)),
        avgSalary: Math.floor(Math.random() * 400000 + 1000000), // Placeholder salary
        topSkills: Object.entries(techCounts).slice(0, 5).map(([techName]) => techName),
        cities: Object.entries(cityCounts).slice(0, 3).map(([cityName, cityCount]) => ({
          name: cityName,
          count: Math.floor(cityCount * (count / totalJobs))
        }))
      }));
    
    return {
      summary: {
        totalJobs,
        totalCompanies: Object.keys(companyCounts).length,
        totalSkills: Object.keys(techCounts).length,
        lastUpdated: new Date().toISOString(),
        dataVersion: "2.0.0"
      },
      technologies,
      cities,
      companies,
      jobTitles,
      skills: Object.entries(techCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([name, count]) => ({
          name,
          count,
          category: this.getSkillCategory(name)
        })),
      rawJobs: this.jobs // Keep raw data for reference
    };
  }
  
  getSkillCategory(skill) {
    const categories = {
      'Frontend': ['JavaScript', 'React', 'Angular', 'Vue.js', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'Bootstrap', 'Tailwind'],
      'Backend': ['Node.js', 'Python', 'Java', 'PHP', 'C#', 'Ruby', 'Go', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', '.NET'],
      'Database': ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQL Server'],
      'Cloud': ['AWS', 'Azure', 'Docker', 'Kubernetes'],
      'Tools': ['Git', 'Linux', 'Jenkins', 'Webpack'],
      'Data Science': ['TensorFlow', 'Machine Learning']
    };
    
    for (const [category, skills] of Object.entries(categories)) {
      if (skills.includes(skill)) return category;
    }
    return 'Other';
  }

  async saveData() {
    console.log('💾 Saving processed dashboard data...');

    try {
      const dataDir = path.join(process.cwd(), 'data');
      await fs.mkdir(dataDir, { recursive: true });

      const timestamp = new Date().toISOString();
      
      // Process raw jobs into dashboard format
      const dashboardData = this.processJobsData();
      
      // Save raw jobs data
      const rawFilename = `raw-jobs-${timestamp.split('T')[0]}.json`;
      const rawData = {
        timestamp,
        total_jobs: this.jobs.length,
        jobs: this.jobs,
        sources: ['Mock Data'],
        scraping_duration: Date.now() - this.startTime
      };
      
      await fs.writeFile(
        path.join(dataDir, rawFilename),
        JSON.stringify(rawData, null, 2)
      );

      // Save processed dashboard data
      await fs.writeFile(
        path.join(dataDir, 'dashboard-data.json'),
        JSON.stringify(dashboardData, null, 2)
      );
      
      // Also save as downloaded data for reference
      await fs.writeFile(
        path.join(dataDir, 'downloaded-dashboard-data.json'),
        JSON.stringify(dashboardData, null, 2)
      );

      console.log(`✅ Raw data saved to ${rawFilename}`);
      console.log(`📊 Dashboard data saved to dashboard-data.json`);
      console.log(`📈 Processed: ${this.jobs.length} jobs → ${dashboardData.technologies.length} technologies`);
      console.log(`🏙️ Cities found: ${dashboardData.cities.length}`);
      console.log(`🏢 Companies found: ${dashboardData.companies.length}`);

      return true;
    } catch (error) {
      console.error('❌ Failed to save data:', error.message);
      return false;
    }
  }
}

// Main execution
async function main() {
  console.log('🧪 Test Scraper - Generating Dashboard Format Data');
  
  const scraper = new TestScraper();
  
  try {
    scraper.generateMockJobs();
    const saved = await scraper.saveData();
    
    if (saved) {
      console.log('🎉 Test completed successfully!');
      console.log('📂 Check data/dashboard-data.json for the correct format');
      process.exit(0);
    } else {
      console.log('⚠️ Test completed with warnings');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = TestScraper;

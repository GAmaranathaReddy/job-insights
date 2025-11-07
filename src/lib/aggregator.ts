import { JobPosting, DashboardData, TechnologyStats, CityStats, ExperienceStats, JobTitleStats, SkillCategoryStats, SkillCombination } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

export class DataAggregator {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
  }

  async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
      console.log('✅ Created data directory');
    }
  }

  async aggregateJobData(jobs: JobPosting[]): Promise<DashboardData> {
    console.log(`📊 Aggregating data for ${jobs.length} jobs`);

    const technologies = this.aggregateTechnologies(jobs);
    const cities = this.aggregateCities(jobs);
    const experienceLevels = this.aggregateExperience(jobs);
    const jobTitles = this.aggregateJobTitles(jobs);
    const skillCategories = this.aggregateSkillCategories(jobs);
    const skillCombinations = this.analyzeSkillCombinations(jobs);
    const companies = this.aggregateCompanies(jobs);
    const trends = await this.calculateTrends(jobs);

    // Get unique skills count
    const allSkills = new Set(jobs.flatMap(job => job.technologies));

    const dashboardData: DashboardData = {
      summary: {
        totalJobs: jobs.length,
        totalCompanies: new Set(jobs.map(j => j.company)).size,
        totalSkills: allSkills.size,
        lastUpdated: new Date().toISOString(),
        dataVersion: '1.0.0',
      },
      technologies,
      cities,
      experienceLevels,
      jobTitles,
      skillCategories,
      skillCombinations,
      trends,
      companies,
    };

    return dashboardData;
  }

  private aggregateTechnologies(jobs: JobPosting[]): TechnologyStats[] {
    const techCounts = new Map<string, {
      count: number;
      cities: Map<string, number>;
      experiences: Map<string, number>;
      salaries: string[];
    }>();

    // Count technologies
    jobs.forEach(job => {
      job.technologies.forEach(tech => {
        if (!techCounts.has(tech)) {
          techCounts.set(tech, {
            count: 0,
            cities: new Map(),
            experiences: new Map(),
            salaries: []
          });
        }

        const techData = techCounts.get(tech)!;
        techData.count++;

        // Track cities for this technology
        const cityCount = techData.cities.get(job.location) || 0;
        techData.cities.set(job.location, cityCount + 1);

        // Track experience levels
        const expCount = techData.experiences.get(job.experience) || 0;
        techData.experiences.set(job.experience, expCount + 1);

        // Track salaries (if available)
        if (job.salary && job.salary !== 'Not disclosed') {
          techData.salaries.push(job.salary);
        }
      });
    });

    // Convert to TechnologyStats array
    const totalJobs = jobs.length;
    return Array.from(techCounts.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        percentage: Math.round((data.count / totalJobs) * 100 * 100) / 100,
        avgSalary: this.calculateAverageSalary(data.salaries),
        cities: Array.from(data.cities.entries())
          .map(([city, count]) => ({ name: city, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        experienceLevels: Array.from(data.experiences.entries())
          .map(([level, count]) => ({ level, count }))
          .sort((a, b) => b.count - a.count)
      }))
      .sort((a, b) => b.count - a.count);
  }

  private aggregateCities(jobs: JobPosting[]): CityStats[] {
    const cityCounts = new Map<string, {
      count: number;
      technologies: Map<string, number>;
      salaries: string[];
    }>();

    jobs.forEach(job => {
      if (!cityCounts.has(job.location)) {
        cityCounts.set(job.location, {
          count: 0,
          technologies: new Map(),
          salaries: []
        });
      }

      const cityData = cityCounts.get(job.location)!;
      cityData.count++;

      // Track technologies in this city
      job.technologies.forEach(tech => {
        const techCount = cityData.technologies.get(tech) || 0;
        cityData.technologies.set(tech, techCount + 1);
      });

      // Track salaries
      if (job.salary && job.salary !== 'Not disclosed') {
        cityData.salaries.push(job.salary);
      }
    });

    const totalJobs = jobs.length;
    return Array.from(cityCounts.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        percentage: Math.round((data.count / totalJobs) * 100 * 100) / 100,
        avgSalary: this.calculateAverageSalary(data.salaries),
        topTechnologies: Array.from(data.technologies.entries())
          .map(([tech, count]) => ({ name: tech, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      }))
      .sort((a, b) => b.count - a.count);
  }

  private aggregateExperience(jobs: JobPosting[]): ExperienceStats[] {
    const expCounts = new Map<string, {
      count: number;
      technologies: Map<string, number>;
      salaries: string[];
    }>();

    jobs.forEach(job => {
      if (!expCounts.has(job.experience)) {
        expCounts.set(job.experience, {
          count: 0,
          technologies: new Map(),
          salaries: []
        });
      }

      const expData = expCounts.get(job.experience)!;
      expData.count++;

      // Track technologies for this experience level
      job.technologies.forEach(tech => {
        const techCount = expData.technologies.get(tech) || 0;
        expData.technologies.set(tech, techCount + 1);
      });

      // Track salaries
      if (job.salary && job.salary !== 'Not disclosed') {
        expData.salaries.push(job.salary);
      }
    });

    const totalJobs = jobs.length;
    return Array.from(expCounts.entries())
      .map(([level, data]) => ({
        level,
        count: data.count,
        percentage: Math.round((data.count / totalJobs) * 100 * 100) / 100,
        avgSalary: this.calculateAverageSalary(data.salaries),
        topTechnologies: Array.from(data.technologies.entries())
          .map(([tech, count]) => ({ name: tech, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      }))
      .sort((a, b) => b.count - a.count);
  }

  private aggregateJobTitles(jobs: JobPosting[]) {
    const titleCounts = new Map<string, {
      count: number;
      technologies: Map<string, number>;
      companies: Map<string, number>;
      cities: Map<string, number>;
      salaries: string[];
      experiences: string[];
    }>();

    jobs.forEach(job => {
      // Normalize job title
      const normalizedTitle = this.normalizeJobTitle(job.title);

      if (!titleCounts.has(normalizedTitle)) {
        titleCounts.set(normalizedTitle, {
          count: 0,
          technologies: new Map(),
          companies: new Map(),
          cities: new Map(),
          salaries: [],
          experiences: []
        });
      }

      const titleData = titleCounts.get(normalizedTitle)!;
      titleData.count++;

      // Track technologies for this job title
      job.technologies.forEach(tech => {
        const techCount = titleData.technologies.get(tech) || 0;
        titleData.technologies.set(tech, techCount + 1);
      });

      // Track companies
      const companyCount = titleData.companies.get(job.company) || 0;
      titleData.companies.set(job.company, companyCount + 1);

      // Track cities
      const cityCount = titleData.cities.get(job.location) || 0;
      titleData.cities.set(job.location, cityCount + 1);

      // Track salaries and experience
      if (job.salary && job.salary !== 'Not disclosed') {
        titleData.salaries.push(job.salary);
      }
      titleData.experiences.push(job.experience);
    });

    const totalJobs = jobs.length;
    return Array.from(titleCounts.entries())
      .map(([title, data]) => ({
        title,
        count: data.count,
        percentage: Math.round((data.count / totalJobs) * 100 * 100) / 100,
        avgSalary: this.calculateAverageSalary(data.salaries),
        experienceRange: this.getExperienceRange(data.experiences),
        topTechnologies: Array.from(data.technologies.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([tech]) => tech),
        topCompanies: Array.from(data.companies.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([company]) => company),
        topCities: Array.from(data.cities.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([city]) => city)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 job titles
  }

  private normalizeJobTitle(title: string): string {
    // Normalize job titles to group similar ones
    const normalized = title.toLowerCase().trim();

    // Common title mappings
    const titleMappings: { [key: string]: string } = {
      'full stack developer': 'Full Stack Developer',
      'fullstack developer': 'Full Stack Developer',
      'full-stack developer': 'Full Stack Developer',
      'software engineer': 'Software Engineer',
      'software developer': 'Software Engineer',
      'frontend developer': 'Frontend Developer',
      'front-end developer': 'Frontend Developer',
      'front end developer': 'Frontend Developer',
      'backend developer': 'Backend Developer',
      'back-end developer': 'Backend Developer',
      'back end developer': 'Backend Developer',
      'data scientist': 'Data Scientist',
      'devops engineer': 'DevOps Engineer',
      'dev ops engineer': 'DevOps Engineer',
      'mobile app developer': 'Mobile App Developer',
      'mobile application developer': 'Mobile App Developer',
      'ui/ux designer': 'UI/UX Designer',
      'ui ux designer': 'UI/UX Designer',
      'machine learning engineer': 'Machine Learning Engineer',
      'ml engineer': 'Machine Learning Engineer',
      'qa engineer': 'QA Engineer',
      'quality assurance engineer': 'QA Engineer',
      'test engineer': 'QA Engineer',
      'product manager': 'Product Manager',
      'cloud architect': 'Cloud Architect',
      'solutions architect': 'Solutions Architect',
      'technical lead': 'Technical Lead',
      'team lead': 'Team Lead'
    };

    return titleMappings[normalized] || this.capitalizeWords(title);
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }

  private getExperienceRange(experiences: string[]): string {
    // Extract years from experience strings and determine range
    const years = experiences.map(exp => {
      const match = exp.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }).filter(year => year > 0);

    if (years.length === 0) return '1-3 years';

    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    if (minYear === maxYear) {
      return `${minYear} years`;
    }

    return `${minYear}-${maxYear} years`;
  }

  private aggregateCompanies(jobs: JobPosting[]) {
    const companyCounts = new Map<string, {
      count: number;
      technologies: Set<string>;
      locations: Set<string>;
    }>();

    jobs.forEach(job => {
      if (!companyCounts.has(job.company)) {
        companyCounts.set(job.company, {
          count: 0,
          technologies: new Set(),
          locations: new Set()
        });
      }

      const companyData = companyCounts.get(job.company)!;
      companyData.count++;
      job.technologies.forEach(tech => companyData.technologies.add(tech));
      companyData.locations.add(job.location);
    });

    return Array.from(companyCounts.entries())
      .map(([name, data]) => ({
        name,
        totalJobs: data.count,
        topTechnologies: Array.from(data.technologies).slice(0, 5),
        locations: Array.from(data.locations).slice(0, 3)
      }))
      .sort((a, b) => b.totalJobs - a.totalJobs)
      .slice(0, 20); // Top 20 companies
  }

  private async calculateTrends(jobs: JobPosting[]) {
    // Load historical data if available
    const historicalData = await this.loadHistoricalData();

    const today = new Date().toISOString().split('T')[0];
    const currentDayData = {
      date: today,
      totalJobs: jobs.length,
      topTechnology: this.getTopTechnology(jobs),
      topCity: this.getTopCity(jobs)
    };

    // Calculate daily trends
    const daily = [...(historicalData.daily || []), currentDayData]
      .slice(-30); // Keep last 30 days

    // Calculate weekly trends
    const weekly = this.calculateWeeklyTrends(daily);

    // Calculate monthly trends
    const monthly = this.calculateMonthlyTrends(daily);

    return { daily, weekly, monthly };
  }

  private getTopTechnology(jobs: JobPosting[]): string {
    const techCounts = new Map<string, number>();
    jobs.forEach(job => {
      job.technologies.forEach(tech => {
        techCounts.set(tech, (techCounts.get(tech) || 0) + 1);
      });
    });

    return Array.from(techCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
  }

  private getTopCity(jobs: JobPosting[]): string {
    const cityCounts = new Map<string, number>();
    jobs.forEach(job => {
      cityCounts.set(job.location, (cityCounts.get(job.location) || 0) + 1);
    });

    return Array.from(cityCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';
  }

  private calculateWeeklyTrends(daily: any[]) {
    const weeks = new Map<string, number>();

    daily.forEach(day => {
      const date = new Date(day.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];

      weeks.set(weekKey, (weeks.get(weekKey) || 0) + day.totalJobs);
    });

    return Array.from(weeks.entries())
      .map(([week, totalJobs], index, arr) => ({
        week,
        totalJobs,
        growth: index > 0 ?
          Math.round(((totalJobs - arr[index - 1][1]) / arr[index - 1][1]) * 100) : 0
      }))
      .slice(-12); // Last 12 weeks
  }

  private calculateMonthlyTrends(daily: any[]) {
    const months = new Map<string, number>();

    daily.forEach(day => {
      const monthKey = day.date.substring(0, 7); // YYYY-MM
      months.set(monthKey, (months.get(monthKey) || 0) + day.totalJobs);
    });

    return Array.from(months.entries())
      .map(([month, totalJobs], index, arr) => ({
        month,
        totalJobs,
        growth: index > 0 ?
          Math.round(((totalJobs - arr[index - 1][1]) / arr[index - 1][1]) * 100) : 0
      }))
      .slice(-6); // Last 6 months
  }

  private calculateAverageSalary(salaries: string[]): number | undefined {
    if (salaries.length === 0) return undefined;

    const numericSalaries = salaries
      .map(s => this.extractSalaryNumber(s))
      .filter(s => s > 0);

    if (numericSalaries.length === 0) return undefined;

    return Math.round(numericSalaries.reduce((a, b) => a + b, 0) / numericSalaries.length);
  }

  private extractSalaryNumber(salary: string): number {
    // Extract numeric values from salary strings
    const matches = salary.match(/[\d,]+/g);
    if (!matches) return 0;

    const numbers = matches.map(m => parseInt(m.replace(/,/g, '')));
    return numbers.length > 0 ? Math.max(...numbers) : 0;
  }

  async saveData(data: DashboardData): Promise<void> {
    await this.ensureDataDirectory();

    const files = [
      { name: 'dashboard-data.json', content: data },
      { name: 'technologies.json', content: data.technologies },
      { name: 'cities.json', content: data.cities },
      { name: 'experience-levels.json', content: data.experienceLevels },
      { name: 'companies.json', content: data.companies },
      { name: 'trends.json', content: data.trends },
      { name: 'summary.json', content: data.summary }
    ];

    await Promise.all(
      files.map(async file => {
        const filePath = path.join(this.dataDir, file.name);
        await fs.writeFile(filePath, JSON.stringify(file.content, null, 2));
        console.log(`✅ Saved ${file.name}`);
      })
    );

    // Update metadata
    await this.updateMetadata(data.summary);
  }

  private async updateMetadata(summary: any): Promise<void> {
    const metadata = {
      lastUpdated: summary.lastUpdated,
      version: summary.dataVersion,
      totalJobs: summary.totalJobs,
      totalCompanies: summary.totalCompanies,
      generatedAt: new Date().toISOString()
    };

    const metadataPath = path.join(this.dataDir, 'metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    console.log('✅ Updated metadata');
  }

  async loadHistoricalData(): Promise<any> {
    try {
      const trendsPath = path.join(this.dataDir, 'trends.json');
      const data = await fs.readFile(trendsPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return { daily: [], weekly: [], monthly: [] };
    }
  }

  async loadDashboardData(): Promise<DashboardData | null> {
    try {
      const dataPath = path.join(this.dataDir, 'dashboard-data.json');
      const data = await fs.readFile(dataPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  private aggregateSkillCategories(jobs: JobPosting[]): SkillCategoryStats[] {
    const skillCategories = {
      'Frontend': ['React', 'Angular', 'Vue.js', 'Vue', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'Next.js'],
      'Backend': ['Node.js', 'Python', 'Java', 'Spring Boot', 'Django', 'Flask', 'C#', '.NET', 'PHP', 'Ruby'],
      'Mobile': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS'],
      'Database': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server'],
      'Cloud': ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes'],
      'Data Science': ['Python', 'R', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas'],
      'DevOps': ['Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform', 'Ansible']
    };

    const categoryStats = Object.entries(skillCategories).map(([category, skills]) => {
      const categoryJobs = jobs.filter(job =>
        job.technologies.some(tech =>
          skills.some(skill => tech.toLowerCase().includes(skill.toLowerCase()))
        )
      );

      const skillCounts = new Map<string, number>();
      categoryJobs.forEach(job => {
        job.technologies.forEach(tech => {
          if (skills.some(skill => tech.toLowerCase().includes(skill.toLowerCase()))) {
            skillCounts.set(tech, (skillCounts.get(tech) || 0) + 1);
          }
        });
      });

      const topSkills = Array.from(skillCounts.entries())
        .map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / categoryJobs.length) * 100 * 100) / 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Calculate demand level based on job count
      const totalJobs = jobs.length;
      const categoryJobCount = categoryJobs.length;
      const demandPercentage = (categoryJobCount / totalJobs) * 100;

      let demandLevel: 'High' | 'Medium' | 'Low' = 'Low';
      if (demandPercentage > 20) demandLevel = 'High';
      else if (demandPercentage > 10) demandLevel = 'Medium';

      return {
        category,
        totalJobs: categoryJobs.length,
        avgSalary: this.calculateAverageSalary(categoryJobs.map(j => j.salary || '').filter(s => s !== 'Not disclosed')),
        topSkills,
        growthTrend: Math.round((Math.random() * 20 - 5) * 100) / 100, // Placeholder for real trend data
        demandLevel
      };
    }).filter(cat => cat.totalJobs > 0);

    return categoryStats.sort((a, b) => b.totalJobs - a.totalJobs);
  }

  private analyzeSkillCombinations(jobs: JobPosting[]): SkillCombination[] {
    const combinationCounts = new Map<string, {
      count: number;
      salaries: string[];
      jobTitles: string[];
    }>();

    jobs.forEach(job => {
      if (job.technologies.length >= 2) {
        // Generate combinations of 2-3 skills
        for (let i = 0; i < job.technologies.length; i++) {
          for (let j = i + 1; j < job.technologies.length; j++) {
            const combo = [job.technologies[i], job.technologies[j]].sort().join(' + ');

            if (!combinationCounts.has(combo)) {
              combinationCounts.set(combo, {
                count: 0,
                salaries: [],
                jobTitles: []
              });
            }

            const comboData = combinationCounts.get(combo)!;
            comboData.count++;
            if (job.salary && job.salary !== 'Not disclosed') {
              comboData.salaries.push(job.salary);
            }
            comboData.jobTitles.push(job.title);
          }
        }
      }
    });

    return Array.from(combinationCounts.entries())
      .map(([skillsStr, data]) => ({
        skills: skillsStr.split(' + '),
        count: data.count,
        avgSalary: this.calculateAverageSalary(data.salaries),
        commonJobTitles: Array.from(new Set(data.jobTitles)).slice(0, 3)
      }))
      .filter(combo => combo.count >= 3) // Only combinations with 3+ occurrences
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 combinations
  }
}
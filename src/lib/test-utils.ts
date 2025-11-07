import { JobPosting, DashboardData } from '@/types';

// Mock data for testing
export const mockJobData: JobPosting[] = [
  {
    id: 'job-001',
    title: 'Senior React Developer',
    company: 'TechCorp India',
    location: 'Bangalore',
    experience: '4-6 years',
    salary: '15-25 LPA',
    description: 'Looking for experienced React developer',
    technologies: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
    source: 'naukri',
    postedDate: '2024-01-15',
    scrapedAt: new Date().toISOString(),
    url: 'https://example.com/job1'
  },
  {
    id: 'job-002',
    title: 'Python Developer',
    company: 'DataTech Solutions',
    location: 'Mumbai',
    experience: '2-4 years',
    salary: '12-18 LPA',
    description: 'Python developer for data analytics',
    technologies: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    source: 'linkedin',
    postedDate: '2024-01-14',
    scrapedAt: new Date().toISOString(),
    url: 'https://example.com/job2'
  },
  {
    id: 'job-003',
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'Delhi',
    experience: '1-3 years',
    salary: '8-15 LPA',
    description: 'Full stack developer for web applications',
    technologies: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    source: 'naukri',
    postedDate: '2024-01-16',
    scrapedAt: new Date().toISOString(),
    url: 'https://example.com/job3'
  }
];

export const mockDashboardData: DashboardData = {
  summary: {
    totalJobs: 1250,
    totalCompanies: 85,
    totalSkills: 87,
    lastUpdated: new Date().toISOString(),
    dataVersion: '1.0.0'
  },
  technologies: [
    {
      name: 'JavaScript',
      count: 340,
      percentage: 27.2,
      avgSalary: 1200000,
      cities: [
        { name: 'Bangalore', count: 120 },
        { name: 'Mumbai', count: 95 },
        { name: 'Delhi', count: 75 }
      ],
      experienceLevels: [
        { level: '1-3 years', count: 150 },
        { level: '4-6 years', count: 120 },
        { level: '7+ years', count: 70 }
      ]
    },
    {
      name: 'Python',
      count: 285,
      percentage: 22.8,
      avgSalary: 1350000,
      cities: [
        { name: 'Bangalore', count: 110 },
        { name: 'Hyderabad', count: 85 },
        { name: 'Mumbai', count: 90 }
      ],
      experienceLevels: [
        { level: '1-3 years', count: 120 },
        { level: '4-6 years', count: 105 },
        { level: '7+ years', count: 60 }
      ]
    },
    {
      name: 'React',
      count: 220,
      percentage: 17.6,
      avgSalary: 1180000,
      cities: [
        { name: 'Bangalore', count: 95 },
        { name: 'Mumbai', count: 70 },
        { name: 'Pune', count: 55 }
      ],
      experienceLevels: [
        { level: '1-3 years', count: 95 },
        { level: '4-6 years', count: 85 },
        { level: '7+ years', count: 40 }
      ]
    }
  ],
  cities: [
    {
      name: 'Bangalore',
      count: 385,
      percentage: 30.8,
      avgSalary: 1275000,
      topTechnologies: [
        { name: 'JavaScript', count: 120 },
        { name: 'Python', count: 110 },
        { name: 'React', count: 95 }
      ]
    },
    {
      name: 'Mumbai',
      count: 245,
      percentage: 19.6,
      avgSalary: 1150000,
      topTechnologies: [
        { name: 'JavaScript', count: 95 },
        { name: 'Python', count: 90 },
        { name: 'React', count: 70 }
      ]
    },
    {
      name: 'Delhi',
      count: 195,
      percentage: 15.6,
      avgSalary: 1100000,
      topTechnologies: [
        { name: 'JavaScript', count: 75 },
        { name: 'Java', count: 65 },
        { name: 'Python', count: 55 }
      ]
    }
  ],
  experienceLevels: [
    {
      level: '1-3 years',
      count: 485,
      percentage: 38.8,
      avgSalary: 950000,
      topTechnologies: [
        { name: 'JavaScript', count: 150 },
        { name: 'Python', count: 120 },
        { name: 'React', count: 95 }
      ]
    },
    {
      level: '4-6 years',
      count: 425,
      percentage: 34.0,
      avgSalary: 1450000,
      topTechnologies: [
        { name: 'JavaScript', count: 120 },
        { name: 'Python', count: 105 },
        { name: 'React', count: 85 }
      ]
    },
    {
      level: '7+ years',
      count: 340,
      percentage: 27.2,
      avgSalary: 1850000,
      topTechnologies: [
        { name: 'Python', count: 70 },
        { name: 'JavaScript', count: 70 },
        { name: 'Java', count: 65 }
      ]
    }
  ],
  trends: {
    daily: [
      { date: '2024-01-10', totalJobs: 45, topTechnology: 'JavaScript', topCity: 'Bangalore' },
      { date: '2024-01-11', totalJobs: 52, topTechnology: 'Python', topCity: 'Mumbai' },
      { date: '2024-01-12', totalJobs: 48, topTechnology: 'React', topCity: 'Bangalore' },
      { date: '2024-01-13', totalJobs: 55, topTechnology: 'JavaScript', topCity: 'Delhi' },
      { date: '2024-01-14', totalJobs: 42, topTechnology: 'Python', topCity: 'Hyderabad' },
      { date: '2024-01-15', totalJobs: 58, topTechnology: 'JavaScript', topCity: 'Bangalore' },
      { date: '2024-01-16', totalJobs: 61, topTechnology: 'React', topCity: 'Mumbai' }
    ],
    weekly: [
      { week: '2024-W01', totalJobs: 285, growth: 8.5 },
      { week: '2024-W02', totalJobs: 310, growth: 8.8 },
      { week: '2024-W03', totalJobs: 295, growth: -4.8 }
    ],
    monthly: [
      { month: '2023-11', totalJobs: 1180, growth: 5.2 },
      { month: '2023-12', totalJobs: 1240, growth: 5.1 },
      { month: '2024-01', totalJobs: 1250, growth: 0.8 }
    ]
  },
  companies: [
    {
      name: 'TCS',
      totalJobs: 85,
      topTechnologies: ['Java', 'JavaScript', 'Python'],
      locations: ['Mumbai', 'Bangalore', 'Chennai']
    },
    {
      name: 'Infosys',
      totalJobs: 72,
      topTechnologies: ['Python', 'React', 'Node.js'],
      locations: ['Bangalore', 'Hyderabad', 'Pune']
    },
    {
      name: 'Wipro',
      totalJobs: 65,
      topTechnologies: ['JavaScript', 'Angular', 'AWS'],
      locations: ['Bangalore', 'Delhi', 'Mumbai']
    }
  ],
  jobTitles: [
    {
      title: 'Software Developer',
      count: 285,
      percentage: 22.8,
      avgSalary: 1200000,
      experienceRange: '2-5 years',
      topTechnologies: ['JavaScript', 'React', 'Node.js'],
      topCompanies: ['TCS', 'Infosys', 'Wipro'],
      topCities: ['Bangalore', 'Mumbai', 'Delhi']
    },
    {
      title: 'Senior Software Engineer',
      count: 195,
      percentage: 15.6,
      avgSalary: 1800000,
      experienceRange: '5-8 years',
      topTechnologies: ['Java', 'Python', 'AWS'],
      topCompanies: ['Microsoft', 'Google', 'Amazon'],
      topCities: ['Bangalore', 'Delhi', 'Hyderabad']
    },
    {
      title: 'Full Stack Developer',
      count: 165,
      percentage: 13.2,
      avgSalary: 1500000,
      experienceRange: '3-6 years',
      topTechnologies: ['React', 'Express', 'MongoDB'],
      topCompanies: ['Flipkart', 'Zomato', 'PayTM'],
      topCities: ['Bangalore', 'Mumbai', 'Chennai']
    }
  ],
  skillCategories: [
    {
      category: 'Frontend',
      totalJobs: 450,
      demandLevel: 'High',
      growthTrend: 12.5,
      avgSalary: 1400000,
      topSkills: [
        { name: 'React', count: 285, percentage: 63.3 },
        { name: 'Angular', count: 195, percentage: 43.3 },
        { name: 'Vue.js', count: 125, percentage: 27.8 }
      ]
    },
    {
      category: 'Backend',
      totalJobs: 380,
      demandLevel: 'High',
      growthTrend: 15.2,
      avgSalary: 1600000,
      topSkills: [
        { name: 'Node.js', count: 225, percentage: 59.2 },
        { name: 'Python', count: 195, percentage: 51.3 },
        { name: 'Java', count: 165, percentage: 43.4 }
      ]
    },
    {
      category: 'Cloud',
      totalJobs: 220,
      demandLevel: 'High',
      growthTrend: 25.8,
      avgSalary: 1900000,
      topSkills: [
        { name: 'AWS', count: 155, percentage: 70.5 },
        { name: 'Azure', count: 98, percentage: 44.5 },
        { name: 'Docker', count: 87, percentage: 39.5 }
      ]
    }
  ],
  skillCombinations: [
    {
      skills: ['React', 'Node.js', 'MongoDB'],
      count: 125,
      avgSalary: 1550000,
      commonJobTitles: ['Full Stack Developer', 'MERN Developer']
    },
    {
      skills: ['Python', 'Django', 'PostgreSQL'],
      count: 98,
      avgSalary: 1650000,
      commonJobTitles: ['Backend Developer', 'Python Developer']
    },
    {
      skills: ['Java', 'Spring Boot', 'MySQL'],
      count: 87,
      avgSalary: 1450000,
      commonJobTitles: ['Java Developer', 'Backend Developer']
    }
  ]
};

// Validation functions
export function validateJobPosting(job: any): job is JobPosting {
  return (
    typeof job.id === 'string' &&
    typeof job.title === 'string' &&
    typeof job.company === 'string' &&
    typeof job.location === 'string' &&
    typeof job.experience === 'string' &&
    Array.isArray(job.technologies) &&
    ['naukri', 'linkedin'].includes(job.source) &&
    typeof job.postedDate === 'string' &&
    typeof job.scrapedAt === 'string'
  );
}

export function validateDashboardData(data: any): data is DashboardData {
  return (
    data &&
    typeof data === 'object' &&
    data.summary &&
    typeof data.summary.totalJobs === 'number' &&
    typeof data.summary.totalCompanies === 'number' &&
    Array.isArray(data.technologies) &&
    Array.isArray(data.cities) &&
    Array.isArray(data.experienceLevels) &&
    data.trends &&
    Array.isArray(data.companies)
  );
}

// Test utilities
export function generateMockJob(overrides: Partial<JobPosting> = {}): JobPosting {
  const baseJob = mockJobData[0];
  return {
    ...baseJob,
    id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    scrapedAt: new Date().toISOString(),
    ...overrides
  };
}

export function generateMockJobs(count: number): JobPosting[] {
  return Array.from({ length: count }, (_, i) =>
    generateMockJob({
      id: `job-${i + 1}`,
      title: `Software Developer ${i + 1}`
    })
  );
}
// Job data types
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary?: string;
  description?: string;
  technologies: string[];
  source: 'naukri' | 'linkedin';
  postedDate: string;
  scrapedAt: string;
  url?: string;
}

// Aggregated data types
export interface TechnologyStats {
  name: string;
  count: number;
  percentage: number;
  avgSalary?: number;
  category?: string;
  growthRate?: number;
  demandLevel?: 'High' | 'Medium' | 'Low';
  cities: CityCount[];
  experienceLevels: ExperienceCount[];
  commonCombinations?: string[];
}

export interface CityStats {
  name: string;
  count: number;
  percentage: number;
  topTechnologies: TechnologyCount[];
  avgSalary?: number;
}

export interface ExperienceStats {
  level: string;
  count: number;
  percentage: number;
  avgSalary?: number;
  topTechnologies: TechnologyCount[];
}

export interface TechnologyCount {
  name: string;
  count: number;
}

export interface CityCount {
  name: string;
  count: number;
}

export interface ExperienceCount {
  level: string;
  count: number;
}

// Dashboard data structure
export interface DashboardData {
  summary: {
    totalJobs: number;
    totalCompanies: number;
    totalSkills: number;
    lastUpdated: string;
    dataVersion: string;
  };
  technologies: TechnologyStats[];
  cities: CityStats[];
  experienceLevels: ExperienceStats[];
  jobTitles: JobTitleStats[];
  skillCategories: SkillCategoryStats[];
  skillCombinations: SkillCombination[];
  trends: {
    daily: DailyTrend[];
    weekly: WeeklyTrend[];
    monthly: MonthlyTrend[];
  };
  companies: CompanyStats[];
}

export interface DailyTrend {
  date: string;
  totalJobs: number;
  topTechnology: string;
  topCity: string;
}

export interface WeeklyTrend {
  week: string;
  totalJobs: number;
  growth: number;
}

export interface MonthlyTrend {
  month: string;
  totalJobs: number;
  growth: number;
}

export interface CompanyStats {
  name: string;
  totalJobs: number;
  topTechnologies: string[];
  locations: string[];
}

export interface JobTitleStats {
  title: string;
  count: number;
  percentage: number;
  avgSalary?: number;
  experienceRange: string;
  topTechnologies: string[];
  topCompanies: string[];
  topCities: string[];
}

export interface SkillCategoryStats {
  category: string;
  totalJobs: number;
  avgSalary?: number;
  topSkills: {
    name: string;
    count: number;
    percentage: number;
  }[];
  growthTrend: number; // percentage change
  demandLevel: 'High' | 'Medium' | 'Low';
}

export interface SkillCombination {
  skills: string[];
  count: number;
  avgSalary?: number;
  commonJobTitles: string[];
}

// Error types
export interface JobFilters {
  technologies: string[];
  cities: string[];
  experienceLevels: string[];
  salaryRange?: {
    min: number;
    max: number;
  };
  companies: string[];
}

// Scraping configuration
export interface ScrapingConfig {
  targets: {
    naukri: {
      enabled: boolean;
      maxPages: number;
      delay: number;
    };
    linkedin: {
      enabled: boolean;
      maxPages: number;
      delay: number;
    };
  };
  technologies: string[];
  cities: string[];
  experienceLevels: string[];
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  version: string;
}

export interface ScrapingResult {
  jobs: JobPosting[];
  summary: {
    totalScraped: number;
    successful: number;
    failed: number;
    duration: number;
  };
  sources: {
    naukri: number;
    linkedin: number;
  };
}
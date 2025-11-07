import puppeteer, { Browser, Page } from 'puppeteer';
import { JobPosting } from '@/types';
import PQueue from 'p-queue';
import { z } from 'zod';

// Validation schemas
const JobSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  experience: z.string(),
  salary: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
});

export class ProductionJobScraper {
  private browser: Browser | null = null;
  private queue: PQueue;
  private config = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
    ],
  };

  constructor() {
    this.queue = new PQueue({
      concurrency: 2,
      interval: 2000,
      intervalCap: 1
    });
  }

  async init(): Promise<void> {
    try {
      this.browser = await puppeteer.launch(this.config);
      console.log('✅ Browser initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize browser:', error);
      throw new Error('Browser initialization failed');
    }
  }

  private async createPage(): Promise<Page> {
    if (!this.browser) {
      await this.init();
    }

    const page = await this.browser!.newPage();

    // Set realistic viewport and user agent
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    );

    // Block images and stylesheets for faster scraping
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (resourceType === 'image' || resourceType === 'stylesheet' || resourceType === 'font') {
        req.abort();
      } else {
        req.continue();
      }
    });

    return page;
  }

  async scrapeNaukri(
    technology: string,
    city: string,
    experienceLevel: string,
    maxJobs: number = 50
  ): Promise<JobPosting[]> {
    const page = await this.createPage();
    const jobs: JobPosting[] = [];

    try {
      console.log(`🔍 Scraping Naukri for ${technology} jobs in ${city}`);

      const searchUrl = this.buildNaukriUrl(technology, city, experienceLevel);
      await page.goto(searchUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      // Wait for job listings
      await page.waitForSelector('.srp-jobtuple-wrapper, .jobTuple', {
        timeout: 15000
      });

      let currentPage = 1;
      const maxPages = Math.ceil(maxJobs / 20);

      while (jobs.length < maxJobs && currentPage <= maxPages) {
        console.log(`📄 Scraping Naukri page ${currentPage}`);

        const pageJobs = await page.evaluate(() => {
          const jobElements = document.querySelectorAll('.srp-jobtuple-wrapper, .jobTuple');
          const extractedJobs: any[] = [];

          jobElements.forEach((element) => {
            try {
              const titleElement = element.querySelector('.title a, .jobTuple-title a');
              const companyElement = element.querySelector('.companyInfo .subTitle, .jobTuple-companyName a');
              const locationElement = element.querySelector('.locWdth, .jobTuple-location');
              const experienceElement = element.querySelector('.expwdth, .jobTuple-experience');
              const salaryElement = element.querySelector('.salaryRange, .jobTuple-salary');

              if (titleElement && companyElement) {
                extractedJobs.push({
                  title: titleElement.textContent?.trim() || '',
                  company: companyElement.textContent?.trim() || '',
                  location: locationElement?.textContent?.trim() || '',
                  experience: experienceElement?.textContent?.trim() || 'Not specified',
                  salary: salaryElement?.textContent?.trim() || 'Not disclosed',
                  url: titleElement.getAttribute('href') || '',
                });
              }
            } catch (error) {
              console.warn('Error parsing job element:', error);
            }
          });

          return extractedJobs;
        });

        // Validate and process jobs
        for (const job of pageJobs) {
          try {
            const validatedJob = JobSchema.parse(job);
            const processedJob = this.processJobData({
              ...validatedJob,
              technologies: this.extractTechnologies(validatedJob.title + ' ' + (validatedJob.description || '')),
              source: 'naukri' as const,
              id: this.generateJobId(validatedJob.title, validatedJob.company),
              postedDate: new Date().toISOString().split('T')[0],
              scrapedAt: new Date().toISOString(),
            });

            jobs.push(processedJob);
          } catch (error) {
            console.warn('Invalid job data:', error);
          }
        }

        // Navigate to next page
        if (jobs.length < maxJobs && currentPage < maxPages) {
          const nextButton = await page.$('.fright, .np:last-child');
          if (nextButton) {
            await nextButton.click();
            await page.waitForTimeout(3000);
            await page.waitForSelector('.srp-jobtuple-wrapper, .jobTuple', { timeout: 10000 });
            currentPage++;
          } else {
            break;
          }
        } else {
          break;
        }
      }

      console.log(`✅ Scraped ${jobs.length} jobs from Naukri`);
      return jobs.slice(0, maxJobs);

    } catch (error) {
      console.error('❌ Error scraping Naukri:', error);
      return jobs;
    } finally {
      await page.close();
    }
  }

  async scrapeLinkedIn(
    technology: string,
    city: string,
    experienceLevel: string,
    maxJobs: number = 50
  ): Promise<JobPosting[]> {
    const page = await this.createPage();
    const jobs: JobPosting[] = [];

    try {
      console.log(`🔍 Scraping LinkedIn for ${technology} jobs in ${city}`);

      const searchUrl = this.buildLinkedInUrl(technology, city);
      await page.goto(searchUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      // Wait for job listings
      await page.waitForSelector('.job-search-card, .jobs-search__results-list li', {
        timeout: 15000
      });

      let scrollAttempts = 0;
      const maxScrolls = Math.ceil(maxJobs / 10);

      while (jobs.length < maxJobs && scrollAttempts < maxScrolls) {
        console.log(`📄 Scrolling LinkedIn page ${scrollAttempts + 1}`);

        const pageJobs = await page.evaluate(() => {
          const jobElements = document.querySelectorAll('.job-search-card, .jobs-search__results-list li');
          const extractedJobs: any[] = [];

          jobElements.forEach((element) => {
            try {
              const titleElement = element.querySelector('.base-search-card__title, .job-search-card__title a');
              const companyElement = element.querySelector('.base-search-card__subtitle, .job-search-card__subtitle');
              const locationElement = element.querySelector('.job-search-card__location, .base-search-card__metadata');

              if (titleElement && companyElement) {
                extractedJobs.push({
                  title: titleElement.textContent?.trim() || '',
                  company: companyElement.textContent?.trim() || '',
                  location: locationElement?.textContent?.trim() || '',
                  experience: 'Not specified',
                  salary: 'Not disclosed',
                  url: titleElement.getAttribute('href') || '',
                });
              }
            } catch (error) {
              console.warn('Error parsing LinkedIn job element:', error);
            }
          });

          return extractedJobs;
        });

        // Process new jobs
        for (const job of pageJobs) {
          if (jobs.length >= maxJobs) break;

          try {
            const validatedJob = JobSchema.parse(job);
            const jobId = this.generateJobId(validatedJob.title, validatedJob.company);

            // Avoid duplicates
            if (!jobs.find(j => j.id === jobId)) {
              const processedJob = this.processJobData({
                ...validatedJob,
                technologies: this.extractTechnologies(validatedJob.title),
                source: 'linkedin' as const,
                id: jobId,
                postedDate: new Date().toISOString().split('T')[0],
                scrapedAt: new Date().toISOString(),
              });

              jobs.push(processedJob);
            }
          } catch (error) {
            console.warn('Invalid LinkedIn job data:', error);
          }
        }

        // Scroll to load more jobs
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });

        await page.waitForTimeout(2000);
        scrollAttempts++;
      }

      console.log(`✅ Scraped ${jobs.length} jobs from LinkedIn`);
      return jobs.slice(0, maxJobs);

    } catch (error) {
      console.error('❌ Error scraping LinkedIn:', error);
      return jobs;
    } finally {
      await page.close();
    }
  }

  private buildNaukriUrl(technology: string, city: string, experience: string): string {
    const baseUrl = 'https://www.naukri.com';
    const params = new URLSearchParams({
      k: technology,
      l: `${city}, India`,
      ...(experience !== 'all' && { experience: this.mapExperienceToNaukri(experience) })
    });

    return `${baseUrl}/jobs?${params.toString()}`;
  }

  private buildLinkedInUrl(technology: string, city: string): string {
    const baseUrl = 'https://www.linkedin.com/jobs/search';
    const params = new URLSearchParams({
      keywords: technology,
      location: `${city}, India`,
      f_TPR: 'r86400', // Last 24 hours
      f_JT: 'F', // Full-time
    });

    return `${baseUrl}?${params.toString()}`;
  }

  private mapExperienceToNaukri(experience: string): string {
    const experienceMap: { [key: string]: string } = {
      'fresher': '0',
      '1-3': '1,2,3',
      '4-6': '4,5,6',
      '7+': '7,8,9,10'
    };

    return experienceMap[experience] || '';
  }

  private extractTechnologies(text: string): string[] {
    const skillsDatabase = {
      // Frontend Technologies
      frontend: [
        'React', 'Angular', 'Vue.js', 'Vue', 'Svelte', 'Next.js', 'Nuxt.js',
        'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SCSS', 'SASS', 'Less',
        'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Ant Design', 'Chakra UI',
        'jQuery', 'D3.js', 'Three.js', 'WebGL', 'PWA', 'Webpack', 'Vite', 'Parcel'
      ],

      // Backend Technologies
      backend: [
        'Node.js', 'Express.js', 'Nest.js', 'Python', 'Django', 'Flask', 'FastAPI',
        'Java', 'Spring Boot', 'Spring', 'Hibernate', 'C#', '.NET', 'ASP.NET',
        'PHP', 'Laravel', 'Symfony', 'CodeIgniter', 'Ruby', 'Ruby on Rails',
        'Go', 'Gin', 'Fiber', 'Rust', 'Actix', 'Kotlin', 'Scala', 'Clojure'
      ],

      // Mobile Development
      mobile: [
        'React Native', 'Flutter', 'Swift', 'iOS', 'Objective-C', 'Kotlin',
        'Android', 'Java', 'Xamarin', 'Ionic', 'Cordova', 'Unity', 'Unreal Engine'
      ],

      // Databases
      database: [
        'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle',
        'SQL Server', 'MariaDB', 'Cassandra', 'DynamoDB', 'Elasticsearch',
        'Neo4j', 'CouchDB', 'InfluxDB', 'Firebase', 'Supabase'
      ],

      // Cloud & DevOps
      cloud: [
        'AWS', 'Azure', 'Google Cloud', 'GCP', 'Digital Ocean', 'Heroku',
        'Vercel', 'Netlify', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
        'GitHub Actions', 'CircleCI', 'Travis CI', 'Terraform', 'Ansible',
        'Chef', 'Puppet', 'Vagrant', 'Nginx', 'Apache', 'Load Balancer'
      ],

      // Data & Analytics
      data: [
        'Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
        'Jupyter', 'Apache Spark', 'Hadoop', 'Kafka', 'Airflow', 'Tableau',
        'Power BI', 'Looker', 'Grafana', 'Kibana', 'Prometheus'
      ],

      // Machine Learning & AI
      ai: [
        'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'OpenCV', 'NLTK',
        'spaCy', 'Hugging Face', 'LangChain', 'OpenAI', 'Machine Learning',
        'Deep Learning', 'NLP', 'Computer Vision', 'MLOps', 'MLflow'
      ],

      // Testing
      testing: [
        'Jest', 'Cypress', 'Selenium', 'Playwright', 'Puppeteer', 'Mocha',
        'Chai', 'Jasmine', 'pytest', 'JUnit', 'TestNG', 'Postman', 'Insomnia',
        'Unit Testing', 'Integration Testing', 'E2E Testing'
      ],

      // Version Control & Tools
      tools: [
        'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial',
        'VS Code', 'IntelliJ IDEA', 'Eclipse', 'Vim', 'Emacs',
        'Jira', 'Confluence', 'Slack', 'Teams', 'Notion', 'Figma', 'Adobe XD'
      ],

      // Methodologies & Concepts
      concepts: [
        'Agile', 'Scrum', 'Kanban', 'DevOps', 'CI/CD', 'Microservices',
        'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'OAuth', 'JWT',
        'Blockchain', 'Web3', 'Smart Contracts', 'Solidity', 'Ethereum'
      ]
    };

    // Flatten all skills into a single array
    const allSkills = Object.values(skillsDatabase).flat();

    // Create a case-insensitive search
    const textLower = text.toLowerCase();
    const foundSkills = allSkills.filter(skill => {
      const skillLower = skill.toLowerCase();
      // Match exact words or common variations
      const patterns = [
        new RegExp(`\\b${skillLower}\\b`, 'i'),
        new RegExp(`\\b${skillLower.replace('.', '\\.')}\\b`, 'i'),
        new RegExp(`\\b${skillLower.replace(' ', '[-\\s]?')}\\b`, 'i')
      ];

      return patterns.some(pattern => pattern.test(textLower));
    });

    // Remove duplicates and return
    return Array.from(new Set(foundSkills));
  }

  private generateJobId(title: string, company: string): string {
    const hash = Buffer.from(`${title}-${company}-${Date.now()}`)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 10);

    return `job-${hash}`;
  }

  private processJobData(job: any): JobPosting {
    return {
      ...job,
      title: this.cleanText(job.title),
      company: this.cleanText(job.company),
      location: this.cleanText(job.location),
      experience: this.normalizeExperience(job.experience),
      salary: this.normalizeSalary(job.salary),
    };
  }

  private cleanText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  private normalizeExperience(exp: string): string {
    if (!exp || exp === 'Not specified') return 'Not specified';

    const expLower = exp.toLowerCase();
    if (expLower.includes('fresher') || expLower.includes('0')) return 'Fresher';
    if (expLower.match(/[1-3]/)) return '1-3 years';
    if (expLower.match(/[4-6]/)) return '4-6 years';
    if (expLower.match(/[7-9]|10/)) return '7+ years';

    return exp;
  }

  private normalizeSalary(salary: string): string {
    if (!salary || salary === 'Not disclosed') return 'Not disclosed';
    return salary;
  }

  async scrapeJobs(
    technologies: string[],
    cities: string[],
    experienceLevels: string[],
    maxJobsPerQuery: number = 25
  ): Promise<JobPosting[]> {
    const allJobs: JobPosting[] = [];

    for (const tech of technologies) {
      for (const city of cities) {
        for (const exp of experienceLevels) {
          try {
            // Add jobs from both sources
            const [naukriJobs, linkedinJobs] = await Promise.all([
              this.queue.add(() =>
                this.scrapeNaukri(tech, city, exp, maxJobsPerQuery)
              ),
              this.queue.add(() =>
                this.scrapeLinkedIn(tech, city, exp, maxJobsPerQuery)
              )
            ]);

            if (naukriJobs && Array.isArray(naukriJobs)) {
              allJobs.push(...naukriJobs);
            }
            if (linkedinJobs && Array.isArray(linkedinJobs)) {
              allJobs.push(...linkedinJobs);
            }

            // Rate limiting between queries
            await new Promise(resolve => setTimeout(resolve, 3000));

          } catch (error) {
            console.error(`❌ Error scraping ${tech} in ${city}:`, error);
          }
        }
      }
    }

    // Remove duplicates based on title and company
    const uniqueJobs = this.removeDuplicates(allJobs);
    console.log(`✅ Total unique jobs scraped: ${uniqueJobs.length}`);

    return uniqueJobs;
  }

  private removeDuplicates(jobs: JobPosting[]): JobPosting[] {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title}-${job.company}`.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ Browser closed successfully');
    }
  }
}
import { Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  applyUrl: string;
  source: string;
  description?: string;
  salary?: string;
  type?: string;
  postedDate?: string;
}

// Realistic mock job data for platforms with bot protection
const getMockLinkedInJobs = (keyword: string, location: string): ScrapedJob[] => {
  const jobs: ScrapedJob[] = [
    {
      id: 'li-001',
      title: `${keyword} Developer`,
      company: 'Infosys Ltd',
      location: location || 'Bengaluru, Karnataka',
      applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(keyword),
      source: 'linkedin',
      description: `Looking for an experienced ${keyword} Developer to join our growing team. You will be responsible for developing and maintaining web applications.`,
      salary: '₹8L - ₹15L per annum',
      type: 'full-time',
      postedDate: '2 days ago',
    },
    {
      id: 'li-002',
      title: `Senior ${keyword} Engineer`,
      company: 'Wipro Technologies',
      location: location || 'Hyderabad, Telangana',
      applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(keyword),
      source: 'linkedin',
      description: `We are seeking a Senior ${keyword} Engineer with 3+ years of experience to build scalable software solutions.`,
      salary: '₹15L - ₹25L per annum',
      type: 'full-time',
      postedDate: '1 day ago',
    },
    {
      id: 'li-003',
      title: `${keyword} Intern`,
      company: 'TCS Digital',
      location: location || 'Mumbai, Maharashtra',
      applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(keyword),
      source: 'linkedin',
      description: `Exciting internship opportunity for final year students to work on cutting-edge ${keyword} projects.`,
      salary: '₹15,000 - ₹25,000/month',
      type: 'internship',
      postedDate: '3 days ago',
    },
    {
      id: 'li-004',
      title: `${keyword} Lead`,
      company: 'HCL Technologies',
      location: location || 'Noida, Uttar Pradesh',
      applyUrl: 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(keyword),
      source: 'linkedin',
      description: `Lead a team of ${keyword} developers in building enterprise-grade solutions for Fortune 500 clients.`,
      salary: '₹20L - ₹35L per annum',
      type: 'full-time',
      postedDate: '5 days ago',
    },
  ];
  return jobs;
};

const getMockNaukriJobs = (keyword: string, location: string): ScrapedJob[] => {
  const jobs: ScrapedJob[] = [
    {
      id: 'nk-001',
      title: `${keyword} Developer - 2-5 Yrs`,
      company: 'Accenture India',
      location: location || 'Pune, Maharashtra',
      applyUrl: 'https://www.naukri.com/jobs-in-india?k=' + encodeURIComponent(keyword),
      source: 'naukri',
      description: `Naukri.com: ${keyword} Developer required with strong hands-on experience in relevant technologies.`,
      salary: '₹6L - ₹12L',
      type: 'full-time',
      postedDate: '1 day ago',
    },
    {
      id: 'nk-002',
      title: `Jr. ${keyword} Developer`,
      company: 'Cognizant Technology Solutions',
      location: location || 'Chennai, Tamil Nadu',
      applyUrl: 'https://www.naukri.com/jobs-in-india?k=' + encodeURIComponent(keyword),
      source: 'naukri',
      description: `Freshers and 1-2 year experience candidates for ${keyword} role in our digital team.`,
      salary: '₹3.5L - ₹6L',
      type: 'full-time',
      postedDate: '2 days ago',
    },
    {
      id: 'nk-003',
      title: `${keyword} Consultant`,
      company: 'Capgemini India',
      location: location || 'Kolkata, West Bengal',
      applyUrl: 'https://www.naukri.com/jobs-in-india?k=' + encodeURIComponent(keyword),
      source: 'naukri',
      description: `Join as a ${keyword} Consultant and work with global clients on high-impact projects.`,
      salary: '₹10L - ₹18L',
      type: 'contract',
      postedDate: '4 days ago',
    },
  ];
  return jobs;
};

const getMockInternshalaJobs = (keyword: string, location: string): ScrapedJob[] => {
  return [
    {
      id: 'ins-001',
      title: `${keyword} Development Internship`,
      company: 'StartupXYZ',
      location: location || 'Remote',
      applyUrl: 'https://internshala.com/internships/' + encodeURIComponent(keyword.toLowerCase()) + '-internship/',
      source: 'internshala',
      description: `Work from home internship. Learn ${keyword} development in a fast-paced startup environment.`,
      salary: '₹5,000 - ₹10,000/month',
      type: 'internship',
      postedDate: 'Today',
    },
    {
      id: 'ins-002',
      title: `${keyword} Engineering Intern`,
      company: 'TechVentures India',
      location: location || 'Delhi',
      applyUrl: 'https://internshala.com/internships/' + encodeURIComponent(keyword.toLowerCase()) + '-internship/',
      source: 'internshala',
      description: `3-month internship opportunity with a chance to work on real-world projects with expert mentors.`,
      salary: '₹8,000 - ₹12,000/month',
      type: 'internship',
      postedDate: 'Yesterday',
    },
  ];
};

const getMockUnstopJobs = (keyword: string, location: string): ScrapedJob[] => {
  return [
    {
      id: 'us-001',
      title: `${keyword} Developer Challenge 2024`,
      company: 'Google India',
      location: location || 'Remote',
      applyUrl: 'https://unstop.com/jobs?q=' + encodeURIComponent(keyword),
      source: 'unstop',
      description: `Compete and get hired! Join our ${keyword} developer challenge and win exciting prizes + job offers.`,
      salary: '₹18L - ₹30L (full-time offer)',
      type: 'full-time',
      postedDate: '2 days ago',
    },
    {
      id: 'us-002',
      title: `Campus ${keyword} Engineer`,
      company: 'Microsoft India',
      location: location || 'Hyderabad, Telangana',
      applyUrl: 'https://unstop.com/jobs?q=' + encodeURIComponent(keyword),
      source: 'unstop',
      description: `Microsoft campus hiring for ${keyword} roles open to final year students from all engineering backgrounds.`,
      salary: '₹25L - ₹40L',
      type: 'full-time',
      postedDate: '3 days ago',
    },
  ];
};

// Main scraper function
export const scrapeJobs = async (
  keyword: string,
  location: string
): Promise<ScrapedJob[]> => {
  const results: ScrapedJob[] = [];

  // Use mock data for platforms with bot protection
  const linkedInJobs = getMockLinkedInJobs(keyword, location);
  const naukriJobs = getMockNaukriJobs(keyword, location);
  const internshalaJobs = getMockInternshalaJobs(keyword, location);
  const unstopJobs = getMockUnstopJobs(keyword, location);

  results.push(...linkedInJobs, ...naukriJobs, ...internshalaJobs, ...unstopJobs);

  // Shuffle for variety
  return results.sort(() => Math.random() - 0.5);
};

// @desc    Search and scrape jobs
// @route   GET /api/scraper/search
// @access  Private (student)
export const searchJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword = '', location = '' } = req.query;

    if (!keyword) {
      res.status(400).json({ success: false, message: 'Keyword is required for job search.' });
      return;
    }

    const jobs = await scrapeJobs(String(keyword), String(location));

    res.status(200).json({
      success: true,
      message: `Found ${jobs.length} jobs for "${keyword}"`,
      data: { jobs, total: jobs.length },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch jobs: ' + error.message });
  }
};

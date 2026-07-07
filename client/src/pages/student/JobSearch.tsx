import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Modal from '../../components/ui/Modal';
import { scraperApi } from '../../api/scraper.api';
import { jobsApi } from '../../api/jobs.api';
import { applicationsApi } from '../../api/applications.api';
import { ScrapedJob, Job } from '../../types';
import toast from 'react-hot-toast';
import {
  Search, MapPin, ExternalLink, Briefcase, Building2,
  Send, Loader2, Filter, X, ChevronDown
} from 'lucide-react';

type TabType = 'internal' | 'external';

const SOURCE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  linkedin: { bg: 'rgba(10,102,194,0.2)', text: '#60a5fa', label: 'LinkedIn' },
  naukri: { bg: 'rgba(234,88,12,0.2)', text: '#fb923c', label: 'Naukri' },
  internshala: { bg: 'rgba(34,197,94,0.2)', text: '#4ade80', label: 'Internshala' },
  unstop: { bg: 'rgba(168,85,247,0.2)', text: '#c084fc', label: 'Unstop' },
  internal: { bg: 'rgba(97,114,244,0.2)', text: '#a5b8fc', label: 'Internal' },
};

const JobSearch: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('internal');
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  // Internal jobs state
  const [internalJobs, setInternalJobs] = useState<Job[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalLoaded, setInternalLoaded] = useState(false);

  // External jobs state
  const [scrapedJobs, setScrapedJobs] = useState<ScrapedJob[]>([]);
  const [scrapeLoading, setScrapeLoading] = useState(false);

  // Apply modal
  const [applyModal, setApplyModal] = useState<{ open: boolean; job: Job | ScrapedJob | null; type: 'internal' | 'external' }>({
    open: false, job: null, type: 'internal'
  });
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  // Job detail modal
  const [detailModal, setDetailModal] = useState<{ open: boolean; job: Job | null }>({ open: false, job: null });

  const searchInternal = async () => {
    setInternalLoading(true);
    setInternalLoaded(false);
    try {
      const res = await jobsApi.getAllJobs({ keyword, location, type: jobType || undefined });
      if (res.success && res.data) {
        setInternalJobs(res.data.jobs);
        setInternalLoaded(true);
      }
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setInternalLoading(false);
    }
  };

  const searchExternal = async () => {
    if (!keyword.trim()) {
      toast.error('Please enter a keyword to search');
      return;
    }
    setScrapeLoading(true);
    try {
      const res = await scraperApi.searchJobs({ keyword, location });
      if (res.success && res.data) {
        let jobs = res.data.jobs;
        if (jobType) jobs = jobs.filter(j => j.type === jobType);
        setScrapedJobs(jobs);
        toast.success(`Found ${jobs.length} jobs!`);
      }
    } catch {
      toast.error('Search failed. Please try again.');
    } finally {
      setScrapeLoading(false);
    }
  };

  const handleSearch = () => {
    if (activeTab === 'internal') searchInternal();
    else searchExternal();
  };

  const openApplyModal = (job: Job | ScrapedJob, type: 'internal' | 'external') => {
    setApplyModal({ open: true, job, type });
    setCoverLetter('');
  };

  const handleApply = async () => {
    if (!applyModal.job) return;
    setApplying(true);
    try {
      let payload: any;
      if (applyModal.type === 'internal') {
        const j = applyModal.job as Job;
        payload = { jobId: j._id, jobSource: 'internal', coverLetter };
      } else {
        const j = applyModal.job as ScrapedJob;
        payload = {
          jobSource: j.source,
          externalJobData: {
            title: j.title,
            company: j.company,
            location: j.location,
            applyUrl: j.applyUrl,
            source: j.source,
            description: j.description,
            salary: j.salary,
          },
          coverLetter,
        };
      }
      const res = await applicationsApi.applyToJob(payload);
      if (res.success) {
        toast.success('Application submitted! ✅');
        setApplyModal({ open: false, job: null, type: 'internal' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const getTitle = (job: Job | ScrapedJob) => ('title' in job ? job.title : '');
  const getCompany = (job: Job | ScrapedJob) => ('company' in job ? job.company : '');

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Job Search</h1>
        <p className="text-white/50">Search internal postings or scrape from external platforms</p>
      </div>

      {/* Tab Toggle */}
      <div className="flex rounded-2xl p-1 mb-6 inline-flex" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          onClick={() => setActiveTab('internal')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === 'internal' ? 'text-white' : 'text-white/50 hover:text-white/70'
          }`}
          style={activeTab === 'internal' ? { background: 'linear-gradient(135deg, #6172f4, #f43f9a)' } : {}}
        >
          🏢 Internal Jobs
        </button>
        <button
          onClick={() => setActiveTab('external')}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
            activeTab === 'external' ? 'text-white' : 'text-white/50 hover:text-white/70'
          }`}
          style={activeTab === 'external' ? { background: 'linear-gradient(135deg, #6172f4, #f43f9a)' } : {}}
        >
          🌐 Scrape External
        </button>
      </div>

      {/* Search Bar */}
      <div className="section-card mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={activeTab === 'external' ? 'React Developer, Python, Marketing...' : 'Job title, company, keyword...'}
              className="input-field pl-10"
            />
          </div>
          <div className="relative lg:w-52">
            <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Location (optional)"
              className="input-field pl-10"
            />
          </div>
          <div className="relative lg:w-44">
            <select
              value={jobType}
              onChange={e => setJobType(e.target.value)}
              className="input-field appearance-none pr-8"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>
          <button
            onClick={handleSearch}
            disabled={internalLoading || scrapeLoading}
            className="btn-primary px-8"
          >
            {(internalLoading || scrapeLoading) ? (
              <Loader2 size={16} className="spinner" />
            ) : (
              <Search size={16} />
            )}
            {activeTab === 'external' ? 'Scrape' : 'Search'}
          </button>
        </div>

        {activeTab === 'external' && (
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(SOURCE_COLORS).filter(([k]) => k !== 'internal').map(([key, val]) => (
              <span key={key} className="badge text-xs" style={{ background: val.bg, color: val.text, border: `1px solid ${val.text}30` }}>
                {val.label}
              </span>
            ))}
            <span className="text-white/30 text-xs self-center">· Results from all platforms</span>
          </div>
        )}
      </div>

      {/* Internal Jobs Results */}
      {activeTab === 'internal' && (
        <div>
          {!internalLoaded && !internalLoading && (
            <div className="section-card text-center py-16">
              <Briefcase size={40} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg font-medium mb-2">Ready to search</p>
              <p className="text-white/30 text-sm">Click Search to find internal job postings</p>
            </div>
          )}

          {internalLoading && (
            <div className="section-card text-center py-16">
              <Loader2 size={32} className="text-primary-400 mx-auto mb-4 spinner" />
              <p className="text-white/40">Fetching jobs...</p>
            </div>
          )}

          {internalLoaded && !internalLoading && (
            <div>
              <p className="text-white/50 text-sm mb-4">{internalJobs.length} job{internalJobs.length !== 1 ? 's' : ''} found</p>
              {internalJobs.length === 0 ? (
                <div className="section-card text-center py-16">
                  <Search size={32} className="text-white/20 mx-auto mb-4" />
                  <p className="text-white/40">No jobs found. Try different keywords.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {internalJobs.map(job => (
                    <div key={job._id} className="section-card hover:border-white/20 transition-all group">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white font-semibold text-base group-hover:text-primary-300 transition-colors">{job.title}</h3>
                          <p className="text-white/50 text-sm flex items-center gap-1.5 mt-1">
                            <Building2 size={13} /> {job.company}
                          </p>
                        </div>
                        <span className="badge-blue text-xs flex-shrink-0 ml-2">{job.type}</span>
                      </div>

                      <div className="flex items-center gap-3 text-white/40 text-xs mb-3">
                        <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                        {job.salary && <span>💰 {job.salary}</span>}
                      </div>

                      <p className="text-white/50 text-sm line-clamp-2 mb-4">{job.description}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetailModal({ open: true, job })}
                          className="btn-secondary text-xs px-4 py-2"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => openApplyModal(job, 'internal')}
                          className="btn-primary text-xs px-4 py-2"
                        >
                          <Send size={13} /> Apply Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* External / Scraped Jobs Results */}
      {activeTab === 'external' && (
        <div>
          {scrapedJobs.length === 0 && !scrapeLoading && (
            <div className="section-card text-center py-16">
              <Search size={40} className="text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg font-medium mb-2">Enter a keyword to scrape jobs</p>
              <p className="text-white/30 text-sm">e.g., "React Developer", "Data Analyst", "Marketing"</p>
            </div>
          )}

          {scrapeLoading && (
            <div className="section-card text-center py-16">
              <Loader2 size={32} className="text-primary-400 mx-auto mb-4 spinner" />
              <p className="text-white/40">Scraping jobs from multiple platforms...</p>
              <div className="flex justify-center gap-2 mt-4">
                {['LinkedIn', 'Naukri', 'Internshala', 'Unstop'].map(p => (
                  <span key={p} className="badge-gray text-xs">{p}</span>
                ))}
              </div>
            </div>
          )}

          {!scrapeLoading && scrapedJobs.length > 0 && (
            <div>
              <p className="text-white/50 text-sm mb-4">{scrapedJobs.length} jobs scraped from external platforms</p>
              <div className="section-card overflow-hidden p-0">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Platform</th>
                      <th>Salary</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scrapedJobs.map(job => {
                      const src = SOURCE_COLORS[job.source] || SOURCE_COLORS.internal;
                      return (
                        <tr key={job.id}>
                          <td>
                            <p className="text-white font-medium">{job.title}</p>
                            {job.type && <span className="badge-gray text-xs mt-1">{job.type}</span>}
                          </td>
                          <td className="text-white/70">{job.company}</td>
                          <td className="text-white/60">
                            <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                          </td>
                          <td>
                            <span className="badge text-xs" style={{ background: src.bg, color: src.text, border: `1px solid ${src.text}30` }}>
                              {src.label}
                            </span>
                          </td>
                          <td className="text-white/60 text-xs">{job.salary || '—'}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <a
                                href={job.applyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-secondary text-xs px-3 py-1.5"
                              >
                                <ExternalLink size={12} /> View
                              </a>
                              <button
                                onClick={() => openApplyModal(job, 'external')}
                                className="btn-primary text-xs px-3 py-1.5"
                              >
                                <Send size={12} /> Apply
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={applyModal.open}
        onClose={() => setApplyModal({ open: false, job: null, type: 'internal' })}
        title="Apply for this Position"
      >
        {applyModal.job && (
          <div>
            <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(97,114,244,0.1)', border: '1px solid rgba(97,114,244,0.2)' }}>
              <p className="text-white font-semibold">{getTitle(applyModal.job)}</p>
              <p className="text-white/60 text-sm">{getCompany(applyModal.job)}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Cover Letter <span className="text-white/30">(optional)</span>
              </label>
              <textarea
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                placeholder="Tell the employer why you're a great fit for this role..."
                rows={5}
                className="input-field resize-none"
                maxLength={2000}
              />
              <p className="text-white/30 text-xs mt-1 text-right">{coverLetter.length}/2000</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setApplyModal({ open: false, job: null, type: 'internal' })}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying}
                className="btn-primary flex-1"
              >
                {applying ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Job Detail Modal */}
      <Modal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, job: null })}
        title={detailModal.job?.title || ''}
        maxWidth="max-w-2xl"
      >
        {detailModal.job && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 size={16} className="text-white/40" />
              <span className="text-white/70">{detailModal.job.company}</span>
              <span className="text-white/40">·</span>
              <MapPin size={16} className="text-white/40" />
              <span className="text-white/70">{detailModal.job.location}</span>
              <span className="badge-blue text-xs">{detailModal.job.type}</span>
            </div>
            {detailModal.job.salary && (
              <p className="text-green-400 text-sm font-medium">💰 {detailModal.job.salary}</p>
            )}
            <div>
              <h4 className="text-white font-semibold mb-2">Job Description</h4>
              <p className="text-white/60 text-sm whitespace-pre-wrap leading-relaxed">{detailModal.job.description}</p>
            </div>
            {detailModal.job.requirements?.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2">Requirements</h4>
                <ul className="space-y-1.5">
                  {detailModal.job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-primary-400 mt-0.5">•</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={() => {
                setDetailModal({ open: false, job: null });
                openApplyModal(detailModal.job!, 'internal');
              }}
              className="btn-primary w-full"
            >
              <Send size={16} /> Apply Now
            </button>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default JobSearch;

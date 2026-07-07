import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { applicationsApi } from '../../api/applications.api';
import { jobsApi } from '../../api/jobs.api';
import { Application, Job, StudentStats } from '../../types';
import { Search, FileText, CheckCircle, XCircle, Clock, TrendingUp, Briefcase, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes, jobsRes] = await Promise.all([
          applicationsApi.getStudentStats(),
          applicationsApi.getMyApplications(),
          jobsApi.getAllJobs({ limit: 5 }),
        ]);
        if (statsRes.success && statsRes.data) setStats(statsRes.data);
        if (appsRes.success && appsRes.data) setRecentApps(appsRes.data.applications.slice(0, 5));
        if (jobsRes.success && jobsRes.data) setRecentJobs(jobsRes.data.jobs);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'badge-yellow',
      reviewed: 'badge-blue',
      shortlisted: 'badge-green',
      rejected: 'badge-red',
    };
    return <span className={map[status] || 'badge-gray'}>{status}</span>;
  };

  const getAppJobTitle = (app: Application): string => {
    if (app.jobSource === 'internal') {
      const j = app.jobId as Job;
      return j?.title || 'N/A';
    }
    return app.externalJobData?.title || 'External Job';
  };

  const getAppCompany = (app: Application): string => {
    if (app.jobSource === 'internal') {
      const j = app.jobId as Job;
      return j?.company || 'N/A';
    }
    return app.externalJobData?.company || '—';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 rounded-full border-2 border-primary-400 border-t-transparent spinner" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          Good day, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-white/50">Here's your job search overview</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applied', value: stats?.total || 0, icon: FileText, color: '#6172f4' },
          { label: 'Pending', value: stats?.pending || 0, icon: Clock, color: '#f59e0b' },
          { label: 'Shortlisted', value: stats?.shortlisted || 0, icon: CheckCircle, color: '#22c55e' },
          { label: 'Rejected', value: stats?.rejected || 0, icon: XCircle, color: '#ef4444' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ background: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-lg">Recent Applications</h2>
            <Link to="/student/applications" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="text-center py-10">
              <FileText size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No applications yet</p>
              <Link to="/student/search" className="btn-primary mt-4 text-sm">
                Search Jobs <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApps.map(app => (
                <div key={app._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{getAppJobTitle(app)}</p>
                    <p className="text-white/40 text-xs">{getAppCompany(app)}</p>
                  </div>
                  <div className="ml-3 flex-shrink-0">{statusBadge(app.status)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Job Openings */}
        <div className="section-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-lg">Latest Openings</h2>
            <Link to="/student/search" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1 transition-colors">
              Search all <ArrowRight size={14} />
            </Link>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-10">
              <Briefcase size={32} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/40 text-sm">No jobs available yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map(job => (
                <div key={job._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: 'rgba(97,114,244,0.15)' }}>
                    <Briefcase size={16} className="text-primary-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{job.title}</p>
                    <p className="text-white/40 text-xs">{job.company} · {job.location}</p>
                  </div>
                  <span className="badge-blue text-xs flex-shrink-0">{job.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/student/search" className="section-card hover:border-primary-500/40 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'rgba(97,114,244,0.15)' }}>
            <Search size={22} className="text-primary-400" />
          </div>
          <div>
            <p className="text-white font-semibold">Search & Scrape Jobs</p>
            <p className="text-white/50 text-sm">Find jobs across 4+ platforms</p>
          </div>
          <ArrowRight size={18} className="text-white/30 ml-auto group-hover:text-primary-400 transition-colors" />
        </Link>

        <Link to="/student/applications" className="section-card hover:border-green-500/40 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'rgba(34,197,94,0.1)' }}>
            <TrendingUp size={22} className="text-green-400" />
          </div>
          <div>
            <p className="text-white font-semibold">Track Applications</p>
            <p className="text-white/50 text-sm">View your full application history</p>
          </div>
          <ArrowRight size={18} className="text-white/30 ml-auto group-hover:text-green-400 transition-colors" />
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

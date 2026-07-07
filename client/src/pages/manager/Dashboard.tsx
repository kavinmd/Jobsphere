import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { jobsApi } from '../../api/jobs.api';
import { ManagerStats, Job } from '../../types';
import { Briefcase, Users, PlusCircle, ArrowRight, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          jobsApi.getManagerStats(),
          jobsApi.getMyJobs(),
        ]);
        if (statsRes.success && statsRes.data) setStats(statsRes.data);
        if (jobsRes.success && jobsRes.data) setRecentJobs(jobsRes.data.jobs.slice(0, 5));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">
          Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-white/50">
          {user?.company ? `Managing jobs for ${user.company}` : 'Your hiring dashboard'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Jobs', value: stats?.totalJobs || 0, icon: Briefcase, color: '#6172f4' },
          { label: 'Open Jobs', value: stats?.openJobs || 0, icon: CheckCircle, color: '#22c55e' },
          { label: 'Total Applicants', value: stats?.totalApplicants || 0, icon: Users, color: '#f43f9a' },
          { label: 'Pending Review', value: stats?.pendingApplicants || 0, icon: Clock, color: '#f59e0b' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{label}</p>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link to="/manager/jobs/new" className="section-card hover:border-primary-500/40 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'rgba(97,114,244,0.15)' }}>
            <PlusCircle size={22} className="text-primary-400" />
          </div>
          <div>
            <p className="text-white font-semibold">Post New Job</p>
            <p className="text-white/50 text-sm">Create a new job posting</p>
          </div>
          <ArrowRight size={18} className="text-white/30 ml-auto group-hover:text-primary-400 transition-colors" />
        </Link>

        <Link to="/manager/jobs" className="section-card hover:border-pink-500/40 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
               style={{ background: 'rgba(244,63,154,0.1)' }}>
            <TrendingUp size={22} className="text-pink-400" />
          </div>
          <div>
            <p className="text-white font-semibold">Manage Jobs</p>
            <p className="text-white/50 text-sm">Edit, close, or delete postings</p>
          </div>
          <ArrowRight size={18} className="text-white/30 ml-auto group-hover:text-pink-400 transition-colors" />
        </Link>
      </div>

      {/* Recent Jobs */}
      <div className="section-card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">Recent Job Postings</h2>
          <Link to="/manager/jobs" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-10">
            <Briefcase size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm mb-4">No jobs posted yet</p>
            <Link to="/manager/jobs/new" className="btn-primary">
              <PlusCircle size={16} /> Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map(job => (
                  <tr key={job._id}>
                    <td>
                      <p className="text-white font-medium">{job.title}</p>
                      <p className="text-white/40 text-xs">{job.location}</p>
                    </td>
                    <td><span className="badge-blue text-xs">{job.type}</span></td>
                    <td>
                      <span className={job.status === 'open' ? 'badge-green' : 'badge-red'}>
                        {job.status}
                      </span>
                    </td>
                    <td className="text-white/70">{(job as any).applicationCount || 0}</td>
                    <td className="text-white/50 text-xs">{format(new Date(job.createdAt), 'MMM d, yyyy')}</td>
                    <td>
                      <Link
                        to={`/manager/jobs/${job._id}/applicants`}
                        className="btn-secondary text-xs px-3 py-1.5"
                      >
                        <Users size={12} /> Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;

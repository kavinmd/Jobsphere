import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { applicationsApi } from '../../api/applications.api';
import { Application, Job } from '../../types';
import { FileText, Clock, CheckCircle, XCircle, Eye, MapPin, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'Pending', badge: 'badge-yellow', icon: Clock, color: '#f59e0b' },
  reviewed: { label: 'Reviewed', badge: 'badge-blue', icon: Eye, color: '#6172f4' },
  shortlisted: { label: 'Shortlisted', badge: 'badge-green', icon: CheckCircle, color: '#22c55e' },
  rejected: { label: 'Rejected', badge: 'badge-red', icon: XCircle, color: '#ef4444' },
};

const SOURCE_LABELS: Record<string, string> = {
  internal: '🏢 Internal',
  linkedin: '💼 LinkedIn',
  naukri: '🔵 Naukri',
  internshala: '🟢 Internshala',
  unstop: '🟣 Unstop',
};

const ApplicationHistory: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await applicationsApi.getMyApplications();
        if (res.success && res.data) setApplications(res.data.applications);
      } catch {
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getJobTitle = (app: Application) => {
    if (app.jobSource === 'internal') return (app.jobId as Job)?.title || 'Job (Deleted)';
    return app.externalJobData?.title || 'External Job';
  };

  const getCompany = (app: Application) => {
    if (app.jobSource === 'internal') return (app.jobId as Job)?.company || '—';
    return app.externalJobData?.company || '—';
  };

  const getLocation = (app: Application) => {
    if (app.jobSource === 'internal') return (app.jobId as Job)?.location || '—';
    return app.externalJobData?.location || '—';
  };

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const statCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewed: applications.filter(a => a.status === 'reviewed').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Application History</h1>
        <p className="text-white/50">Track all your job applications in one place</p>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'reviewed', 'shortlisted', 'rejected'].map(status => {
          const count = statCounts[status as keyof typeof statCounts];
          const cfg = status !== 'all' ? STATUS_CONFIG[status] : null;
          const isActive = filter === status;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? 'text-white border-primary-500/50'
                  : 'text-white/50 border-white/10 hover:border-white/20 hover:text-white/70'
              }`}
              style={isActive ? { background: 'linear-gradient(135deg, rgba(97,114,244,0.2), rgba(244,63,154,0.1))' } : {}}
            >
              {cfg && <cfg.icon size={13} style={{ color: isActive ? cfg.color : undefined }} />}
              <span className="capitalize">{status}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="section-card text-center py-20">
          <FileText size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-lg font-medium mb-2">
            {filter === 'all' ? 'No applications yet' : `No ${filter} applications`}
          </p>
          <p className="text-white/30 text-sm">Start applying to jobs from the search page</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => {
            const cfg = STATUS_CONFIG[app.status];
            const Icon = cfg?.icon || Clock;
            return (
              <div key={app._id} className="section-card hover:border-white/20 transition-all">
                <div className="flex items-center gap-4">
                  {/* Status indicator */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background: `${cfg?.color}20` }}>
                    <Icon size={18} style={{ color: cfg?.color }} />
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-white font-semibold">{getJobTitle(app)}</h3>
                        <div className="flex items-center gap-3 mt-1 text-white/50 text-xs">
                          <span className="flex items-center gap-1"><Building2 size={11} />{getCompany(app)}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} />{getLocation(app)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={cfg?.badge}>{cfg?.label}</span>
                        <span className="text-white/30 text-xs">
                          {format(new Date(app.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="badge-gray text-xs">{SOURCE_LABELS[app.jobSource] || app.jobSource}</span>
                      {app.jobSource === 'internal' && (app.jobId as Job)?.type && (
                        <span className="badge-blue text-xs">{(app.jobId as Job).type}</span>
                      )}
                      {app.externalJobData?.applyUrl && (
                        <a
                          href={app.externalJobData.applyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-400 text-xs hover:text-primary-300 transition-colors"
                        >
                          View posting ↗
                        </a>
                      )}
                    </div>

                    {app.notes && (
                      <div className="mt-3 p-3 rounded-lg text-xs text-white/50 italic"
                           style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        📝 Manager note: {app.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApplicationHistory;

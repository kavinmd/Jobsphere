import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { applicationsApi } from '../../api/applications.api';
import toast from 'react-hot-toast';
import { Users, ArrowLeft, Mail, Phone, MapPin, FileText, ChevronDown, Loader2, ExternalLink, Clock, CheckCircle, Eye, XCircle } from 'lucide-react';
import { formatDate } from '../../utils/date';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', cls: 'badge-yellow' },
  { value: 'reviewed', label: 'Reviewed', cls: 'badge-blue' },
  { value: 'shortlisted', label: 'Shortlisted', cls: 'badge-green' },
  { value: 'rejected', label: 'Rejected', cls: 'badge-red' },
];

const STATUS_ICONS = {
  pending: Clock,
  reviewed: Eye,
  shortlisted: CheckCircle,
  rejected: XCircle,
};

const ApplicantTracker = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [notes, setNotes] = useState({});
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await applicationsApi.getJobApplicants(jobId);
        if (res.success && res.data) {
          setApplications(res.data.applications);
          setJob(res.data.job);
          // Init notes
          const notesMap = {};
          res.data.applications.forEach((app) => {
            notesMap[app._id] = app.notes || '';
          });
          setNotes(notesMap);
        }
      } catch (err) {
        toast.error('Failed to load applicants');
        navigate('/manager/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await applicationsApi.updateApplicationStatus(appId, {
        status: newStatus,
        notes: notes[appId],
      });
      setApplications(prev =>
        prev.map(a => (a._id === appId ? { ...a, status: newStatus, notes: notes[appId] } : a))
      );
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filterStatus === 'all'
    ? applications
    : applications.filter(a => a.status === filterStatus);

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
      <button
        onClick={() => navigate('/manager/jobs')}
        className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Applicant Tracker</h1>
        {job && (
          <p className="text-white/50">
            <span className="text-primary-400 font-medium">{job.title}</span> · {job.company} · {job.location}
          </p>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: applications.length, status: 'all' },
          { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, status: 'pending' },
          { label: 'Shortlisted', value: applications.filter(a => a.status === 'shortlisted').length, status: 'shortlisted' },
          { label: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, status: 'rejected' },
        ].map(({ label, value, status }) => (
          <button
            key={label}
            onClick={() => setFilterStatus(status)}
            className={`section-card text-left transition-all hover:border-white/25 ${filterStatus === status ? 'border-primary-500/50' : ''}`}
          >
            <p className="text-white/50 text-xs font-medium mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="section-card text-center py-20">
          <Users size={40} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-lg font-medium mb-2">No applicants yet</p>
          <p className="text-white/30 text-sm">Applications will appear here as students apply</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => {
            const student = app.studentId;
            const StatusIcon = STATUS_ICONS[app.status] || Clock;
            const statusCfg = STATUS_OPTIONS.find(s => s.value === app.status);
            return (
              <div key={app._id} className="section-card">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white flex-shrink-0"
                       style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}>
                    {student?.name?.charAt(0).toUpperCase() || '?'}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-white font-semibold">{student?.name || 'Unknown'}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-white/50 text-xs">
                          {student?.email && (
                            <a href={`mailto:${student.email}`} className="flex items-center gap-1 hover:text-primary-400 transition-colors">
                              <Mail size={11} /> {student.email}
                            </a>
                          )}
                          {student?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={11} /> {student.phone}
                            </span>
                          )}
                          {student?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={11} /> {student.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={statusCfg?.cls || 'badge-gray'}>{statusCfg?.label}</span>
                        <p className="text-white/30 text-xs mt-1">{formatDate(app.createdAt, 'MMM d, yyyy')}</p>
                      </div>
                    </div>

                    {student?.bio && (
                      <p className="text-white/40 text-xs mt-2 line-clamp-2">{student.bio}</p>
                    )}

                    {app.coverLetter && (
                      <div className="mt-3 p-3 rounded-lg"
                           style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-white/30 text-xs font-medium mb-1 flex items-center gap-1.5">
                          <FileText size={11} /> Cover Letter
                        </p>
                        <p className="text-white/55 text-xs leading-relaxed line-clamp-3">{app.coverLetter}</p>
                      </div>
                    )}

                    {student?.resumeUrl && (
                      <a
                        href={student.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-primary-400 text-xs hover:text-primary-300 transition-colors"
                      >
                        <ExternalLink size={12} /> View Resume
                      </a>
                    )}

                    {/* Status Update */}
                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <label className="text-white/50 text-xs font-medium">Update Status:</label>
                        <div className="relative">
                          <select
                            value={app.status}
                            onChange={e => handleStatusChange(app._id, e.target.value)}
                            disabled={updatingId === app._id}
                            className="text-xs px-3 py-1.5 rounded-lg border appearance-none pr-6 cursor-pointer transition-all"
                            style={{ background: 'var(--color-input-bg)', color: 'var(--color-text)', borderColor: 'var(--color-card-border)' }}
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value} style={{ background: 'var(--color-modal-bg)', color: 'var(--color-text)' }}>{opt.label}</option>
                            ))}
                          </select>
                          {updatingId === app._id ? (
                            <Loader2 size={12} className="absolute right-2 top-1/2 -translate-y-1/2 spinner text-primary-400" />
                          ) : (
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-[200px]">
                        <input
                          type="text"
                          value={notes[app._id] || ''}
                          onChange={e => setNotes(prev => ({ ...prev, [app._id]: e.target.value }))}
                          placeholder="Add a note (optional)..."
                          className="input-field text-xs py-1.5"
                          onBlur={() => {
                            if (notes[app._id] !== app.notes) {
                              handleStatusChange(app._id, app.status);
                            }
                          }}
                        />
                      </div>
                    </div>
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

export default ApplicantTracker;

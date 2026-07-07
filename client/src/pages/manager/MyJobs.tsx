import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { jobsApi } from '../../api/jobs.api';
import { Job } from '../../types';
import toast from 'react-hot-toast';
import { PlusCircle, Edit2, Trash2, Users, Briefcase, MapPin, AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import Modal from '../../components/ui/Modal';

const MyJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; job: Job | null }>({ open: false, job: null });
  const [deleting, setDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await jobsApi.getMyJobs();
      if (res.success && res.data) setJobs(res.data.jobs);
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async () => {
    if (!deleteModal.job) return;
    setDeleting(true);
    try {
      await jobsApi.deleteJob(deleteModal.job._id);
      toast.success('Job deleted successfully');
      setDeleteModal({ open: false, job: null });
      fetchJobs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (job: Job) => {
    setStatusUpdating(job._id);
    try {
      const newStatus = job.status === 'open' ? 'closed' : 'open';
      await jobsApi.updateJob(job._id, { status: newStatus });
      toast.success(`Job ${newStatus === 'open' ? 'reopened' : 'closed'}`);
      fetchJobs();
    } catch (err: any) {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(null);
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">My Job Postings</h1>
          <p className="text-white/50">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
        </div>
        <Link to="/manager/jobs/new" className="btn-primary">
          <PlusCircle size={16} /> Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="section-card text-center py-20">
          <Briefcase size={48} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-xl font-medium mb-2">No jobs posted yet</p>
          <p className="text-white/30 text-sm mb-6">Start hiring by posting your first job opening</p>
          <Link to="/manager/jobs/new" className="btn-primary">
            <PlusCircle size={16} /> Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job._id} className="section-card hover:border-white/20 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-2">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{job.title}</h3>
                      <p className="text-white/50 text-sm flex items-center gap-1.5 mt-0.5">
                        <MapPin size={13} /> {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="badge-blue text-xs">{job.type}</span>
                    <span className={job.status === 'open' ? 'badge-green' : 'badge-red'}>
                      {job.status}
                    </span>
                    {job.salary && (
                      <span className="badge-gray text-xs">💰 {job.salary}</span>
                    )}
                    <span className="text-white/30 text-xs">
                      Posted {format(new Date(job.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <p className="text-white/50 text-sm line-clamp-2">{job.description}</p>
                </div>

                {/* Applicant count */}
                <div className="text-center flex-shrink-0">
                  <div className="text-2xl font-black gradient-text">{(job as any).applicationCount || 0}</div>
                  <div className="text-white/40 text-xs">applicants</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <Link
                  to={`/manager/jobs/${job._id}/applicants`}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  <Users size={13} /> View Applicants
                </Link>
                <Link
                  to={`/manager/jobs/${job._id}/edit`}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  <Edit2 size={13} /> Edit
                </Link>
                <button
                  onClick={() => toggleStatus(job)}
                  disabled={statusUpdating === job._id}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  {statusUpdating === job._id ? (
                    <Loader2 size={13} className="spinner" />
                  ) : job.status === 'open' ? (
                    <EyeOff size={13} />
                  ) : (
                    <Eye size={13} />
                  )}
                  {job.status === 'open' ? 'Close Job' : 'Reopen Job'}
                </button>
                <button
                  onClick={() => setDeleteModal({ open: true, job })}
                  className="btn-danger text-xs px-4 py-2 ml-auto"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, job: null })}
        title="Delete Job Posting"
      >
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
               style={{ background: 'rgba(239,68,68,0.15)' }}>
            <AlertTriangle size={28} className="text-red-400" />
          </div>
          <p className="text-white font-semibold mb-2">Are you sure?</p>
          <p className="text-white/50 text-sm mb-6">
            This will permanently delete "<strong className="text-white/80">{deleteModal.job?.title}</strong>" 
            and all associated applications. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteModal({ open: false, job: null })}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger flex-1"
            >
              {deleting ? <Loader2 size={16} className="spinner" /> : <Trash2 size={16} />}
              {deleting ? 'Deleting...' : 'Delete Job'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default MyJobs;

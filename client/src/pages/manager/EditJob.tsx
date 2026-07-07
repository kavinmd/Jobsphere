import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { jobsApi } from '../../api/jobs.api';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, Building2, DollarSign, FileText, List, ChevronDown, Save, Loader2 } from 'lucide-react';

const JOB_TYPES = ['full-time', 'part-time', 'internship', 'contract', 'remote'];

const EditJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    type: 'full-time',
    status: 'open',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await jobsApi.getJobById(id!);
        if (res.success && res.data) {
          const job = res.data.job;
          setForm({
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            requirements: job.requirements.join('\n'),
            salary: job.salary || '',
            type: job.type,
            status: job.status,
          });
        }
      } catch {
        toast.error('Failed to load job');
        navigate('/manager/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await jobsApi.updateJob(id!, form);
      if (res.success) {
        toast.success('Job updated successfully! ✅');
        navigate('/manager/jobs');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update job');
    } finally {
      setSaving(false);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Edit Job Posting</h1>
        <p className="text-white/50">Update the job details below</p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="section-card space-y-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Briefcase size={18} className="text-primary-400" /> Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Job Title <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input name="title" value={form.title} onChange={handleChange} className="input-field pl-10" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Company <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input name="company" value={form.company} onChange={handleChange} className="input-field pl-10" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Location <span className="text-red-400">*</span></label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input name="location" value={form.location} onChange={handleChange} className="input-field pl-10" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Job Type</label>
                <div className="relative">
                  <select name="type" value={form.type} onChange={handleChange} className="input-field appearance-none pr-8">
                    {JOB_TYPES.map(t => <option key={t} value={t} className="bg-gray-900">{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Status</label>
                <div className="relative">
                  <select name="status" value={form.status} onChange={handleChange} className="input-field appearance-none pr-8">
                    <option value="open" className="bg-gray-900">Open</option>
                    <option value="closed" className="bg-gray-900">Closed</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Salary</label>
                <div className="relative">
                  <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input name="salary" value={form.salary} onChange={handleChange} placeholder="₹8L - ₹15L" className="input-field pl-10" />
                </div>
              </div>
            </div>
          </div>

          <div className="section-card space-y-4">
            <h2 className="text-white font-semibold flex items-center gap-2"><FileText size={18} className="text-primary-400" /> Description</h2>
            <textarea name="description" value={form.description} onChange={handleChange} rows={8} className="input-field resize-none" required />
          </div>

          <div className="section-card space-y-4">
            <h2 className="text-white font-semibold flex items-center gap-2"><List size={18} className="text-primary-400" /> Requirements</h2>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} rows={5} placeholder="One requirement per line..." className="input-field resize-none" />
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/manager/jobs')} className="btn-secondary">Cancel</button>
            <button id="edit-job-save" type="submit" disabled={saving} className="btn-primary">
              {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditJob;

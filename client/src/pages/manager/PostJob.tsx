import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { jobsApi } from '../../api/jobs.api';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, Building2, DollarSign, FileText, List, ChevronDown, Send, Loader2 } from 'lucide-react';

const JOB_TYPES = ['full-time', 'part-time', 'internship', 'contract', 'remote'];

const PostJob: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: '',
    type: 'full-time',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.description || !form.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await jobsApi.createJob(form);
      if (res.success) {
        toast.success('Job posted successfully! 🎉');
        navigate('/manager/jobs');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Post a New Job</h1>
        <p className="text-white/50">Fill in the details to create a new job posting</p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="section-card space-y-5">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Briefcase size={18} className="text-primary-400" /> Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Job Title <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="job-title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Developer"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Company <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="job-company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company name"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="job-location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru, Karnataka / Remote"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Job Type <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    id="job-type"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="input-field appearance-none pr-8"
                    required
                  >
                    {JOB_TYPES.map(t => (
                      <option key={t} value={t} className="bg-gray-900">{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Salary / Compensation <span className="text-white/30">(optional)</span>
                </label>
                <div className="relative">
                  <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="job-salary"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="e.g. ₹8L - ₹15L per annum"
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="section-card space-y-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <FileText size={18} className="text-primary-400" /> Job Description
            </h2>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="job-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={8}
                placeholder="Describe the role, responsibilities, what you offer, team culture..."
                className="input-field resize-none"
                required
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="section-card space-y-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <List size={18} className="text-primary-400" /> Requirements
            </h2>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Skills / Requirements <span className="text-white/30">(one per line)</span>
              </label>
              <textarea
                id="job-requirements"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
                rows={5}
                placeholder="React.js&#10;Node.js&#10;TypeScript&#10;2+ years experience"
                className="input-field resize-none"
              />
              <p className="text-white/30 text-xs mt-1">Enter each requirement on a new line</p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/manager/jobs')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              id="post-job-submit"
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;

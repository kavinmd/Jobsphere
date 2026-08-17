import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/users.api';
import toast from 'react-hot-toast';
import { User as UserIcon, Phone, MapPin, FileText, Building2, Lock, Save, Loader2, AlertCircle, KeyRound, ShieldCheck, RefreshCw } from 'lucide-react';

const Profile = () => {
  const { user, updateUser, isManager } = useAuth();
  const [form, setForm] = useState({});
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await usersApi.getProfile();
        if (res.success && res.data) {
          const u = res.data.user;
          setForm({
            name: u.name,
            phone: u.phone || '',
            location: u.location || '',
            bio: u.bio || '',
            resumeUrl: u.resumeUrl || '',
            company: u.company || '',
          });
        }
      } catch {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await usersApi.updateProfile(form);
      if (res.success && res.data) {
        updateUser(res.data.user);
        toast.success('Profile updated successfully! ✅');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setPwSaving(true);
    try {
      const res = await usersApi.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      if (res.success) {
        toast.success('Password changed successfully!');
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwSaving(false);
    }
  };

  const handleForceReset = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setPwSaving(true);
    try {
      const res = await usersApi.forceResetPassword(pwForm.newPassword);
      if (res.success) {
        toast.success('Password reset successfully! 🔐');
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setForgotMode(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setPwSaving(false);
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
        <h1 className="text-3xl font-bold text-white mb-1">My Profile</h1>
        <p className="text-white/50">Manage your personal information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar & Info Card */}
        <div className="section-card text-center lg:col-span-1">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white mx-auto mb-4"
               style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-white font-bold text-xl mb-1">{user?.name}</h2>
          <p className="text-white/50 text-sm mb-3">{user?.email}</p>
          <span className={`badge ${isManager ? 'badge-pink' : 'badge-blue'}`}>
            {isManager ? '👔 Hiring Manager' : '🎓 Student'}
          </span>
          {user?.company && (
            <div className="mt-4 flex items-center justify-center gap-2 text-white/50 text-sm">
              <Building2 size={14} />
              <span>{user.company}</span>
            </div>
          )}
          {user?.location && (
            <div className="mt-2 flex items-center justify-center gap-2 text-white/50 text-sm">
              <MapPin size={14} />
              <span>{user.location}</span>
            </div>
          )}
        </div>

        {/* Edit Profile Form */}
        <div className="section-card lg:col-span-2">
          <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
            <UserIcon size={18} className="text-primary-400" /> Edit Profile
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                <div className="relative">
                  <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="profile-name"
                    name="name"
                    value={form.name || ''}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Phone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="profile-phone"
                    name="phone"
                    value={form.phone || ''}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Location</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="profile-location"
                  name="location"
                  value={form.location || ''}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="City, State"
                />
              </div>
            </div>

            {isManager && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Company</label>
                <div className="relative">
                  <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="profile-company"
                    name="company"
                    value={form.company || ''}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            )}

            {!isManager && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Resume URL</label>
                <div className="relative">
                  <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="profile-resume"
                    name="resumeUrl"
                    value={form.resumeUrl || ''}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Bio</label>
              <textarea
                id="profile-bio"
                name="bio"
                value={form.bio || ''}
                onChange={handleChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
              <p className="text-white/30 text-xs mt-1 text-right">{(form.bio || '').length}/500</p>
            </div>

            <button
              id="profile-save"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="section-card lg:col-span-3">
          {/* Header */}
          <h2 className="text-white font-semibold text-lg mb-5 flex items-center gap-2">
            {forgotMode
              ? <><KeyRound size={18} className="text-amber-500" /> Reset Password</>
              : <><Lock size={18} className="text-primary-400" /> Change Password</>}
          </h2>

          {/* Info banner in forgot mode */}
          {forgotMode && (
            <div className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5 text-sm"
                 style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <ShieldCheck size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#f59e0b' }} />
              <div style={{ color: 'var(--color-text-secondary)' }}>
                <span className="font-semibold" style={{ color: '#d97706' }}>You're already verified.</span>{' '}
                Since you're logged in, your identity is confirmed by your session token —
                you can set a new password directly without the old one.
              </div>
            </div>
          )}

          {forgotMode ? (
            /* ── FORGOT MODE: no current password needed ── */
            <form onSubmit={handleForceReset} className="grid grid-cols-1 md:grid-cols-2 gap-4" autoComplete="off">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white/70" htmlFor="force-new-password">New Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(false);
                      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <Lock size={11} />
                    I remember my password
                  </button>
                </div>
                <input
                  id="force-new-password"
                  name="forceNewPassword"
                  type="password"
                  value={pwForm.newPassword}
                  onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Confirm New Password</label>
                <input
                  id="force-confirm-password"
                  name="forceConfirmPassword"
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <button
                  id="force-reset-submit"
                  type="submit"
                  disabled={pwSaving}
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                >
                  {pwSaving ? <Loader2 size={16} className="spinner" /> : <RefreshCw size={16} />}
                  {pwSaving ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          ) : (
            /* ── NORMAL MODE: verify current password ── */
            <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4" autoComplete="off">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white/70" htmlFor="current-password">Current Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(true);
                      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    style={{ color: '#f59e0b' }}
                  >
                    <AlertCircle size={11} />
                    Forgot current password?
                  </button>
                </div>
                <input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  value={pwForm.currentPassword}
                  onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">New Password</label>
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  value={pwForm.newPassword}
                  onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Confirm New Password</label>
                <input
                  id="confirm-new-password"
                  name="confirmPassword"
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  className="input-field"
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="md:col-span-3">
                <button
                  id="change-password-submit"
                  type="submit"
                  disabled={pwSaving}
                  className="btn-secondary"
                >
                  {pwSaving ? <Loader2 size={16} className="spinner" /> : <Lock size={16} />}
                  {pwSaving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

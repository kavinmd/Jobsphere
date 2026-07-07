import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, User, Building2, MapPin, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'hiring_manager',
    company: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'hiring_manager' || role === 'student') {
      setForm(prev => ({ ...prev, role }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (form.role === 'hiring_manager' && !form.company) {
      toast.error('Company name is required for hiring managers');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        company: form.company || undefined,
      });

      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        toast.success('Account created successfully! 🎉');
        const redirect = res.data.user.role === 'hiring_manager' ? '/manager/dashboard' : '/student/dashboard';
        navigate(redirect);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg, #6172f4, #f43f9a)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-2xl">JobSphere</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/50 text-sm">Join thousands of users on JobSphere</p>
        </div>

        <div className="section-card">
          {/* Role toggle */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, role: 'student' }))}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                form.role === 'student'
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
              style={form.role === 'student' ? { background: 'linear-gradient(135deg, #6172f4, #f43f9a)' } : {}}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, role: 'hiring_manager' }))}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                form.role === 'hiring_manager'
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
              style={form.role === 'hiring_manager' ? { background: 'linear-gradient(135deg, #f43f9a, #e11d48)' } : {}}
            >
              👔 Hiring Manager
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {form.role === 'hiring_manager' && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Company Name</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    id="register-company"
                    name="company"
                    type="text"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your Company Pvt. Ltd."
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="input-field pl-10 pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                  Creating Account...
                </span>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

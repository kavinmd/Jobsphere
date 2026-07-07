import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login(form);
      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}! 🎉`);
        const redirect = res.data.user.role === 'hiring_manager' ? '/manager/dashboard' : '/student/dashboard';
        navigate(redirect);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'student' | 'manager') => {
    setForm({
      email: role === 'student' ? 'student@kalpana.com' : 'manager@kalpana.com',
      password: role === 'student' ? 'Student@123' : 'Manager@123',
    });
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
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/50 text-sm">Sign in to your account to continue</p>
        </div>

        {/* Demo buttons */}
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => fillDemo('student')}
            className="flex-1 text-xs py-2.5 rounded-xl font-medium transition-all border"
            style={{ background: 'rgba(97,114,244,0.1)', borderColor: 'rgba(97,114,244,0.3)', color: '#a5b8fc' }}
          >
            🎓 Demo Student
          </button>
          <button
            type="button"
            onClick={() => fillDemo('manager')}
            className="flex-1 text-xs py-2.5 rounded-xl font-medium transition-all border"
            style={{ background: 'rgba(244,63,154,0.1)', borderColor: 'rgba(244,63,154,0.3)', color: '#f9a8d4' }}
          >
            👔 Demo Manager
          </button>
        </div>

        {/* Form card */}
        <div className="section-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-12"
                  autoComplete="current-password"
                  required
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

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                  Signing In...
                </span>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

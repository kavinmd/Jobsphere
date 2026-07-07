import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search, Briefcase, Users, Shield, Zap, TrendingUp,
  ArrowRight, Star, CheckCircle, Globe
} from 'lucide-react';

const Landing: React.FC = () => {
  const { isAuthenticated, isStudent, isManager } = useAuth();

  const dashboardLink = isManager ? '/manager/dashboard' : '/student/dashboard';

  const features = [
    {
      icon: Search,
      title: 'Smart Job Search',
      desc: 'Search across LinkedIn, Naukri, Internshala, and Unstop in one place.',
      color: '#6172f4',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      desc: 'Secure RBAC ensures students and managers only see what they need.',
      color: '#f43f9a',
    },
    {
      icon: Briefcase,
      title: 'Direct Job Posting',
      desc: 'Hiring managers post and manage jobs directly on the platform.',
      color: '#a855f7',
    },
    {
      icon: Users,
      title: 'Applicant Tracking',
      desc: 'Managers track every applicant, update statuses, and review profiles.',
      color: '#22c55e',
    },
    {
      icon: TrendingUp,
      title: 'Application History',
      desc: 'Students track all applications with real-time status updates.',
      color: '#f59e0b',
    },
    {
      icon: Globe,
      title: 'Multi-Platform Scraping',
      desc: 'Aggregate jobs from 4+ platforms with a single keyword search.',
      color: '#06b6d4',
    },
  ];

  const stats = [
    { value: '4+', label: 'Job Platforms' },
    { value: '2', label: 'User Roles' },
    { value: '100%', label: 'RBAC Secure' },
    { value: '∞', label: 'Opportunities' },
  ];

  return (
    <div className="page-wrapper relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #6172f4, #f43f9a)' }}>
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">JobSphere</span>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to={dashboardLink} className="btn-primary">
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Sign In</Link>
              <Link to="/register" className="btn-primary">Get Started <ArrowRight size={16} /></Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 text-center px-6 py-24 lg:py-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-xs font-semibold"
             style={{ background: 'rgba(97,114,244,0.15)', border: '1px solid rgba(97,114,244,0.3)', color: '#a5b8fc' }}>
          <Star size={12} fill="currentColor" />
          SDE-1 Full Stack Assessment — Kalpana Software Solution
        </div>

        <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
          Find Your Dream Job
          <br />
          <span className="gradient-text">Smarter & Faster</span>
        </h1>

        <p className="text-white/60 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          A unified platform to search and scrape jobs from LinkedIn, Naukri, Internshala, and Unstop —
          while giving hiring managers powerful tools to post and manage openings.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated ? (
            <Link to={dashboardLink} className="btn-primary text-base px-8 py-4">
              Open Dashboard <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register?role=student" className="btn-primary text-base px-8 py-4">
                I'm a Student <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=hiring_manager" className="btn-secondary text-base px-8 py-4">
                I'm a Hiring Manager
              </Link>
            </>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black gradient-text">{value}</div>
              <div className="text-white/50 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 px-6 lg:px-16 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-white/50 text-lg">Built for students and hiring managers alike</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="section-card group hover:border-white/20 transition-all duration-300 cursor-default">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                   style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Two Roles Section */}
      <section className="relative z-10 px-6 lg:px-16 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student card */}
          <div className="section-card relative overflow-hidden" style={{ borderColor: 'rgba(97,114,244,0.3)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                 style={{ background: '#6172f4', transform: 'translate(30%, -30%)' }} />
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-white font-bold text-xl mb-3">For Students</h3>
            <ul className="space-y-2.5 text-white/60 text-sm">
              {[
                'Search & scrape jobs from 4+ platforms',
                'Apply to internal and external postings',
                'Track application history & status',
                'Build and manage your profile',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register?role=student" className="btn-primary mt-6 w-full justify-center">
              Register as Student
            </Link>
          </div>

          {/* Manager card */}
          <div className="section-card relative overflow-hidden" style={{ borderColor: 'rgba(244,63,154,0.3)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                 style={{ background: '#f43f9a', transform: 'translate(30%, -30%)' }} />
            <div className="text-4xl mb-4">👔</div>
            <h3 className="text-white font-bold text-xl mb-3">For Hiring Managers</h3>
            <ul className="space-y-2.5 text-white/60 text-sm">
              {[
                'Post and manage job openings',
                'Edit or close postings anytime',
                'View applicant profiles & details',
                'Update application statuses',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-pink-400 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register?role=hiring_manager" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 cursor-pointer mt-6 w-full"
                  style={{ background: 'linear-gradient(135deg, #f43f9a, #e11d48)' }}>
              Register as Manager
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap size={16} className="text-primary-400" />
          <span className="text-white font-semibold">JobSphere</span>
        </div>
        <p className="text-white/30 text-xs">
          Built for Kalpana Software Solution Pvt. Ltd. SDE-1 Assessment
        </p>
      </footer>
    </div>
  );
};

export default Landing;

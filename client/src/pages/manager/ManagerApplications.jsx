import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { jobsApi } from "../../api/jobs.api";
import { applicationsApi } from "../../api/applications.api";
import toast from "react-hot-toast";
import {
  Users, Mail, Phone, MapPin, FileText, ChevronDown,
  Loader2, ExternalLink, Clock, CheckCircle, Eye,
  XCircle, Briefcase, Filter, ArrowRight, RefreshCw,
} from "lucide-react";
import { formatDate } from "../../utils/date";

const STATUS_OPTIONS = [
  { value: "pending",     label: "Pending",     cls: "badge-yellow" },
  { value: "reviewed",   label: "Reviewed",    cls: "badge-blue"   },
  { value: "shortlisted", label: "Shortlisted", cls: "badge-green"  },
  { value: "rejected",   label: "Rejected",    cls: "badge-red"    },
];

const STATUS_ICONS = {
  pending:     Clock,
  reviewed:    Eye,
  shortlisted: CheckCircle,
  rejected:    XCircle,
};

const ManagerApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs]                 = useState([]);
  const [loading, setLoading]           = useState(true);
  const [updatingId, setUpdatingId]     = useState(null);
  const [notes, setNotes]               = useState({});
  const [filterJob,    setFilterJob]    = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const jobsRes = await jobsApi.getMyJobs();
      if (!jobsRes.success) throw new Error();
      const myJobs = jobsRes.data.jobs;
      setJobs(myJobs);

      const settled = await Promise.allSettled(
        myJobs.map(j => applicationsApi.getJobApplicants(j._id))
      );

      const allApps = [];
      settled.forEach((result, idx) => {
        if (result.status === "fulfilled" && result.value.success) {
          const jobMeta = myJobs[idx];
          result.value.data.applications.forEach(app => {
            allApps.push({ ...app, _jobTitle: jobMeta.title, _jobId: jobMeta._id });
          });
        }
      });

      allApps.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setApplications(allApps);
      const notesMap = {};
      allApps.forEach(a => { notesMap[a._id] = a.notes || ""; });
      setNotes(notesMap);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await applicationsApi.updateApplicationStatus(appId, {
        status: newStatus,
        notes: notes[appId],
      });
      setApplications(prev =>
        prev.map(a => a._id === appId ? { ...a, status: newStatus, notes: notes[appId] } : a)
      );
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = applications.filter(a => {
    if (filterJob    !== "all" && a._jobId  !== filterJob)    return false;
    if (filterStatus !== "all" && a.status  !== filterStatus) return false;
    return true;
  });

  const counts = {
    total:       applications.length,
    pending:     applications.filter(a => a.status === "pending").length,
    shortlisted: applications.filter(a => a.status === "shortlisted").length,
    rejected:    applications.filter(a => a.status === "rejected").length,
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
          <h1 className="text-3xl font-bold text-white mb-1">Applications</h1>
          <p className="text-white/50">All applications received across your job postings</p>
        </div>
        <button onClick={fetchAll} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",       value: counts.total,       status: "all",         color: "#60a5fa" },
          { label: "Pending",     value: counts.pending,     status: "pending",     color: "#fbbf24" },
          { label: "Shortlisted", value: counts.shortlisted, status: "shortlisted", color: "#34d399" },
          { label: "Rejected",    value: counts.rejected,    status: "rejected",    color: "#f87171" },
        ].map(({ label, value, status, color }) => (
          <button
            key={label}
            onClick={() => setFilterStatus(prev => prev === status ? "all" : status)}
            className={"section-card text-left transition-all hover:border-white/25 " + (filterStatus === status ? "border-primary-500/50" : "")}
          >
            <p className="text-white/50 text-xs font-medium mb-1">{label}</p>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
          </button>
        ))}
      </div>

      <div className="section-card mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <Filter size={15} className="text-white/40" />
          <span className="text-white/50 text-sm font-medium">Filter by:</span>
          <div className="relative">
            <select
              value={filterJob}
              onChange={e => setFilterJob(e.target.value)}
              className="input-field text-sm py-1.5 pl-3 pr-8 appearance-none"
              style={{ minWidth: "180px" }}
            >
              <option value="all">All Jobs</option>
              {jobs.map(j => (
                <option key={j._id} value={j._id}>{j.title}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[{ value: "all", label: "All Status" }, ...STATUS_OPTIONS].map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={"px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + (filterStatus === opt.value ? "text-white" : "text-white/40 hover:text-white/70")}
                style={filterStatus === opt.value ? { background: "linear-gradient(135deg,#2563eb,#06b6d4)" } : { background: "rgba(255,255,255,0.05)" }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-white/30 text-xs">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="section-card text-center py-24">
          <Users size={44} className="text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-lg font-semibold mb-2">No applications found</p>
          <p className="text-white/25 text-sm">
            {applications.length === 0
              ? "Applications will appear here once students start applying to your jobs."
              : "Try adjusting the filters above."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => {
            const student    = app.studentId;
            const StatusIcon = STATUS_ICONS[app.status] || Clock;
            const statusCfg  = STATUS_OPTIONS.find(s => s.value === app.status);
            return (
              <div key={app._id} className="section-card hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg" style={{ background: "rgba(37,99,235,0.12)", color: "#93c5fd", border: "1px solid rgba(37,99,235,0.25)" }}>
                    <Briefcase size={11} /> {app._jobTitle}
                  </span>
                  <button
                    onClick={() => navigate("/manager/jobs/" + app._jobId + "/applicants")}
                    className="text-xs text-white/30 hover:text-primary-400 transition-colors flex items-center gap-1"
                  >
                    View all for this job <ArrowRight size={11} />
                  </button>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}>
                    {student?.name?.charAt(0).toUpperCase() || "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <h3 className="text-white font-semibold">{student?.name || "Unknown Student"}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-white/50 text-xs">
                          {student?.email && (
                            <a href={"mailto:" + student.email} className="flex items-center gap-1 hover:text-primary-400 transition-colors">
                              <Mail size={11} /> {student.email}
                            </a>
                          )}
                          {student?.phone && <span className="flex items-center gap-1"><Phone size={11} /> {student.phone}</span>}
                          {student?.location && <span className="flex items-center gap-1"><MapPin size={11} /> {student.location}</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={statusCfg?.cls || "badge-gray"}>
                          <StatusIcon size={11} className="inline mr-1" />{statusCfg?.label}
                        </span>
                        <p className="text-white/30 text-xs mt-1">{formatDate(app.created_at, "MMM d, yyyy")}</p>
                      </div>
                    </div>

                    {student?.bio && <p className="text-white/40 text-xs mt-1 line-clamp-2">{student.bio}</p>}

                    {app.coverLetter && (
                      <div className="mt-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="text-white/30 text-xs font-medium mb-1 flex items-center gap-1.5"><FileText size={11} /> Cover Letter</p>
                        <p className="text-white/55 text-xs leading-relaxed line-clamp-3">{app.coverLetter}</p>
                      </div>
                    )}

                    {student?.resumeUrl && (
                      <a href={student.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-primary-400 text-xs hover:text-primary-300 transition-colors font-medium">
                        <ExternalLink size={12} /> View Resume
                      </a>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/5">
                      <label className="text-white/50 text-xs font-medium">Update Status:</label>
                      <div className="relative">
                        <select
                          value={app.status}
                          onChange={e => handleStatusChange(app._id, e.target.value)}
                          disabled={updatingId === app._id}
                          className="text-xs px-3 py-1.5 rounded-lg border appearance-none pr-7 cursor-pointer transition-all"
                          style={{ background: "var(--color-input-bg)", color: "var(--color-text)", borderColor: "var(--color-card-border)" }}
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} style={{ background: "var(--color-modal-bg)", color: "var(--color-text)" }}>{opt.label}</option>
                          ))}
                        </select>
                        {updatingId === app._id
                          ? <Loader2 size={12} className="absolute right-2 top-1/2 -translate-y-1/2 spinner text-primary-400" />
                          : <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                        }
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <input
                          type="text"
                          value={notes[app._id] || ""}
                          onChange={e => setNotes(prev => ({ ...prev, [app._id]: e.target.value }))}
                          placeholder="Add a note (optional)..."
                          className="input-field text-xs py-1.5 w-full"
                          onBlur={() => { if (notes[app._id] !== (app.notes || "")) handleStatusChange(app._id, app.status); }}
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

export default ManagerApplications;

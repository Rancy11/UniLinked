import React, { useEffect, useMemo, useState } from 'react';
import API from '../api';

/* ─── tiny inline styles as a self-contained CSS block ─── */
const css = `
.opp-page {
  min-height: calc(100vh - 68px);
  background: linear-gradient(160deg,#eef2ff 0%,#f5f6fa 40%,#faf9ff 100%);
  padding-bottom: 60px;
  animation: oppFade .4s ease both;
}
@keyframes oppFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── Hero ── */
.opp-hero {
  background: linear-gradient(135deg,#667eea 0%,#764ba2 55%,#8b5cf6 100%);
  background-size: 200% 200%;
  animation: oppGrad 10s ease infinite;
  padding: 28px 20px 72px;
  border-radius: 0 0 32px 32px;
  position: relative; overflow: hidden;
  box-shadow: 0 16px 48px rgba(102,126,234,.35);
}
@keyframes oppGrad {
  0%,100% { background-position:0% 50% }
  50%     { background-position:100% 50% }
}
.opp-hero::before {
  content:''; position:absolute;
  width:400px; height:400px;
  background:rgba(255,255,255,.06);
  border-radius:50%;
  top:-160px; right:-80px;
  animation:heroBlob 14s ease-in-out infinite;
}
@keyframes heroBlob {
  0%,100%{transform:translate(0,0) scale(1)}
  50%{transform:translate(-20px,20px) scale(1.05)}
}
.opp-hero-inner {
  max-width:1160px; margin:0 auto;
  position:relative; z-index:1;
}
.opp-hero h1 {
  font-size:2rem; font-weight:900;
  color:#fff; margin:0 0 6px;
  letter-spacing:-.03em;
  text-shadow:0 4px 16px rgba(0,0,0,.3);
}
.opp-hero p {
  color:rgba(255,255,255,.72);
  font-size:15px; margin:0;
}

/* ── Filter card (floats over hero) ── */
.opp-filters {
  max-width:1160px; margin:-40px auto 24px;
  padding:0 20px;
}
.opp-filters-card {
  background:rgba(255,255,255,.98);
  border:1px solid #e0e7ff;
  border-radius:20px;
  padding:18px 20px;
  box-shadow:0 20px 50px rgba(102,126,234,.16), 0 4px 12px rgba(0,0,0,.05);
  display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end;
  animation:filterRise .45s cubic-bezier(.22,1,.36,1) .1s both;
}
@keyframes filterRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

.opp-filter-group { display:flex; flex-direction:column; gap:5px; min-width:140px; flex:1; }
.opp-filter-group label {
  font-size:11px; font-weight:700;
  color:#9ca3af; text-transform:uppercase; letter-spacing:.06em;
}
.opp-filter-group select,
.opp-filter-group input {
  padding:9px 14px;
  border:1.5px solid #e0e7ff;
  border-radius:50px;
  font-size:13.5px; font-family:inherit;
  background:#fbfdff; color:#1a1a2e;
  outline:none;
  transition:border-color .2s, box-shadow .2s, transform .15s;
}
.opp-filter-group select:focus,
.opp-filter-group input:focus {
  border-color:#667eea;
  box-shadow:0 0 0 4px rgba(102,126,234,.12);
  transform:translateY(-1px);
}
.opp-filter-btn {
  padding:10px 24px;
  background:linear-gradient(135deg,#667eea,#764ba2);
  color:#fff; border:none;
  border-radius:50px;
  font-size:14px; font-weight:700;
  font-family:inherit; cursor:pointer;
  box-shadow:0 6px 18px rgba(102,126,234,.35);
  transition:all .22s ease;
  white-space:nowrap; align-self:flex-end;
  height:40px;
}
.opp-filter-btn:hover {
  transform:translateY(-2px);
  box-shadow:0 10px 26px rgba(102,126,234,.45);
}

/* ── Layout ── */
.opp-layout {
  max-width:1160px; margin:0 auto;
  padding:0 20px;
  display:grid;
  grid-template-columns:340px 1fr;
  gap:20px;
}
@media(max-width:860px){ .opp-layout{grid-template-columns:1fr;} }

/* ── Jobs List (left column) ── */
.opp-list { display:flex; flex-direction:column; gap:12px; }

.opp-job-card {
  background:#fff;
  border:1.5px solid #e5e7eb;
  border-radius:16px;
  padding:16px 18px;
  cursor:pointer;
  transition:all .22s cubic-bezier(.4,0,.2,1);
  animation:cardIn .4s ease both;
  position:relative; overflow:hidden;
}
@keyframes cardIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.opp-job-card:hover {
  border-color:#c7d2fe;
  box-shadow:0 6px 22px rgba(102,126,234,.14);
  transform:translateY(-2px);
}
.opp-job-card.selected {
  border-color:#667eea;
  background:linear-gradient(135deg,#f0f3ff,#eef2ff);
  box-shadow:0 6px 24px rgba(102,126,234,.2);
}
.opp-job-card.selected::before {
  content:'';
  position:absolute; left:0; top:0; bottom:0;
  width:4px;
  background:linear-gradient(135deg,#667eea,#764ba2);
  border-radius:4px 0 0 4px;
}

.opp-job-top { display:flex; align-items:flex-start; gap:12px; }
.opp-job-icon {
  width:44px; height:44px; border-radius:12px;
  background:linear-gradient(135deg,#eef2ff,#e0e7ff);
  display:flex; align-items:center; justify-content:center;
  font-size:20px; flex-shrink:0;
}
.opp-job-info { flex:1; min-width:0; }
.opp-job-title {
  font-size:14.5px; font-weight:800;
  color:#1a1a2e; margin:0 0 2px;
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
}
.opp-job-company {
  font-size:12.5px; color:#6b7280; font-weight:500;
}
.opp-job-meta {
  display:flex; gap:6px; flex-wrap:wrap; margin-top:10px;
}
.opp-pill {
  display:inline-flex; align-items:center; gap:3px;
  padding:3px 10px; border-radius:50px;
  font-size:11.5px; font-weight:600;
  letter-spacing:.01em;
}
.opp-pill-type {
  background:#eef2ff; color:#4338ca;
  border:1px solid #c7d2fe;
}
.opp-pill-field {
  background:#f0fdf4; color:#166534;
  border:1px solid #bbf7d0;
}
.opp-pill-loc {
  background:#fafafa; color:#6b7280;
  border:1px solid #e5e7eb;
}
.opp-pill-pkg {
  background:#fff7ed; color:#c2410c;
  border:1px solid #fed7aa;
  font-weight:700;
}

.opp-empty {
  text-align:center; padding:48px 24px;
  background:#fff; border-radius:18px;
  border:1px dashed #e0e7ff;
  color:#9ca3af; font-size:15px;
}
.opp-empty p { margin:8px 0 0; font-size:13px; }

/* ── Detail + Post Form (right column) ── */
.opp-right { display:flex; flex-direction:column; gap:20px; }

/* Job Detail Card */
.opp-detail-card {
  background:#fff;
  border:1px solid rgba(102,126,234,.1);
  border-radius:20px;
  box-shadow:0 4px 20px rgba(102,126,234,.1);
  overflow:hidden;
  animation:cardIn .4s ease both;
}
.opp-detail-header {
  background:linear-gradient(135deg,#667eea,#764ba2);
  padding:24px 26px;
  display:flex; align-items:flex-start; gap:16px;
}
.opp-detail-icon {
  width:56px; height:56px; border-radius:14px;
  background:rgba(255,255,255,.2);
  display:flex; align-items:center; justify-content:center;
  font-size:26px; flex-shrink:0; border:2px solid rgba(255,255,255,.3);
}
.opp-detail-title {
  font-size:20px; font-weight:900;
  color:#fff; margin:0 0 4px;
  letter-spacing:-.3px;
}
.opp-detail-company {
  color:rgba(255,255,255,.8);
  font-size:14px; font-weight:500;
}
.opp-detail-body { padding:24px 26px; }
.opp-detail-pills {
  display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;
}
.opp-detail-section { margin-bottom:20px; }
.opp-detail-section h4 {
  font-size:11px; font-weight:800;
  color:#9ca3af; text-transform:uppercase;
  letter-spacing:.07em; margin:0 0 10px;
}
.opp-detail-section p {
  color:#374151; font-size:14.5px; line-height:1.7;
  margin:0;
}
.opp-tags { display:flex; flex-wrap:wrap; gap:7px; }
.opp-tag {
  padding:4px 12px; border-radius:50px;
  background:#f3f4f6; color:#374151;
  font-size:12px; font-weight:600;
  border:1px solid #e5e7eb;
}
.opp-detail-footer {
  padding:16px 26px;
  border-top:1px solid #f1f5f9;
  background:#f8f9ff;
  display:flex; gap:10px; flex-wrap:wrap; align-items:center;
  justify-content:space-between;
}
.opp-apply-btn {
  padding:12px 28px;
  background:linear-gradient(135deg,#10b981,#059669);
  color:#fff; border:none;
  border-radius:12px;
  font-size:15px; font-weight:700;
  font-family:inherit; cursor:pointer;
  box-shadow:0 4px 16px rgba(16,185,129,.32);
  transition:all .22s ease;
}
.opp-apply-btn:hover {
  transform:translateY(-2px);
  box-shadow:0 8px 24px rgba(16,185,129,.42);
}
.opp-owner-btns { display:flex; gap:8px; }
.opp-edit-btn {
  padding:10px 18px;
  background:#fff; color:#667eea;
  border:1.5px solid #c7d2fe;
  border-radius:10px; font-size:13px;
  font-weight:700; font-family:inherit;
  cursor:pointer; transition:all .2s ease;
}
.opp-edit-btn:hover {
  background:#eef2ff; border-color:#667eea;
  transform:translateY(-1px);
}
.opp-delete-btn {
  padding:10px 18px;
  background:#fff; color:#dc2626;
  border:1.5px solid #fecaca;
  border-radius:10px; font-size:13px;
  font-weight:700; font-family:inherit;
  cursor:pointer; transition:all .2s ease;
}
.opp-delete-btn:hover {
  background:#fee2e2; border-color:#dc2626;
  transform:translateY(-1px);
}
.opp-no-select {
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  padding:60px 24px;
  background:#fff; border-radius:20px;
  border:1px dashed #e0e7ff;
  color:#9ca3af; font-size:15px; text-align:center;
  gap:8px;
}
.opp-no-select span { font-size:40px; }

/* Post Job Form */
.opp-post-card {
  background:#fff;
  border:1px solid rgba(102,126,234,.1);
  border-radius:20px;
  box-shadow:0 4px 20px rgba(102,126,234,.08);
  overflow:hidden;
}
.opp-post-header {
  background:linear-gradient(135deg,#f0f3ff,#e8edff);
  padding:18px 24px;
  border-bottom:1px solid #e0e7ff;
}
.opp-post-header h3 {
  font-size:16px; font-weight:800;
  color:#1a1a2e; margin:0 0 3px;
}
.opp-post-header p {
  font-size:12.5px; color:#6b7280; margin:0;
}
.opp-post-body { padding:20px 24px; }
.opp-form-grid {
  display:grid; grid-template-columns:1fr 1fr;
  gap:12px; margin-bottom:12px;
}
@media(max-width:600px){ .opp-form-grid{grid-template-columns:1fr;} }
.opp-form-group { display:flex; flex-direction:column; gap:5px; }
.opp-form-group.full { grid-column:1/-1; }
.opp-form-group label {
  font-size:11px; font-weight:700;
  color:#9ca3af; text-transform:uppercase; letter-spacing:.06em;
}
.opp-form-group input,
.opp-form-group select,
.opp-form-group textarea {
  padding:11px 14px;
  border:1.5px solid #e5e7eb;
  border-radius:12px;
  font-size:14px; font-family:inherit;
  background:#f9fafc; color:#1a1a2e;
  outline:none;
  transition:all .22s ease;
}
.opp-form-group input::placeholder,
.opp-form-group textarea::placeholder { color:#9ca3af; }
.opp-form-group input:focus,
.opp-form-group select:focus,
.opp-form-group textarea:focus {
  border-color:#667eea;
  background:#fff;
  box-shadow:0 0 0 4px rgba(102,126,234,.1);
}
.opp-form-group textarea { resize:vertical; min-height:90px; line-height:1.55; }
.opp-post-submit {
  width:100%; padding:13px 24px;
  background:linear-gradient(135deg,#667eea,#764ba2);
  color:#fff; border:none;
  border-radius:13px;
  font-size:15px; font-weight:700;
  font-family:inherit; cursor:pointer;
  box-shadow:0 4px 16px rgba(102,126,234,.32);
  transition:all .22s ease;
  margin-top:4px;
}
.opp-post-submit:hover:not(:disabled) {
  transform:translateY(-2px);
  box-shadow:0 10px 28px rgba(102,126,234,.44);
}
.opp-post-submit:disabled {
  opacity:.55; cursor:not-allowed; transform:none;
}
.opp-locked {
  display:flex; align-items:center; gap:8px;
  padding:12px 16px;
  background:#fffbeb; border:1px solid #fde68a;
  border-radius:12px; color:#92400e;
  font-size:13.5px; font-weight:500;
  margin-bottom:14px;
}
.opp-error {
  padding:11px 16px;
  background:#fef2f2; border:1px solid #fecaca;
  border-radius:12px; color:#dc2626;
  font-size:13.5px; margin-bottom:12px;
}
`;

/* ─── field icons by domain ─── */
const fieldIcon = { IT: '💻', Marketing: '📣', Finance: '💰', Design: '🎨', Education: '🎓', HR: '🤝' };
const typeIcon  = { 'Full-Time': '⏰', 'Part-Time': '🕐', Internship: '🚀' };

const Opportunities = () => {
  const [user,      setUser]      = useState(null);
  const [jobs,      setJobs]      = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [filters,   setFilters]   = useState({ location:'', jobType:'', field:'' });
  const [editing,   setEditing]   = useState(false);

  const canPost = useMemo(() => user && (user.role === 'alumni' || user.role === 'Alumni'), [user]);
  const isOwner = useMemo(() =>
    selected && user && selected.postedBy && String(selected.postedBy._id) === String(user.id),
    [selected, user]
  );

  const emptyJob = { title:'', company:'', package:'', location:'', field:'IT', jobType:'Full-Time', tags:'', description:'' };
  const [newJob,  setNewJob]  = useState(emptyJob);
  const [editJob, setEditJob] = useState(emptyJob);

  useEffect(() => {
    API.get('/auth/me').then(r => setUser(r.data)).catch(() => setUser(null));
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  const fetchJobs = async () => {
    setLoading(true); setError('');
    try {
      const params = {};
      if (filters.location) params.location = filters.location;
      if (filters.jobType)  params.jobType  = filters.jobType;
      if (filters.field)    params.field    = filters.field;
      const res = await API.get('/opportunities', { params });
      setJobs(res.data);
      if (!selected && res.data.length) setSelected(res.data[0]);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    const resumeUrl = window.prompt('Enter your resume URL');
    if (!resumeUrl) return;
    try {
      await API.post(`/opportunities/${selected._id}/apply`, { resumeUrl });
      alert('Application submitted!');
    } catch (e) { alert(e.response?.data?.message || 'Failed to apply'); }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!canPost) return alert('Only alumni can post jobs.');
    try {
      const res = await API.post('/opportunities', {
        ...newJob, tags: newJob.tags.split(',').map(t=>t.trim()).filter(Boolean)
      });
      setJobs(prev => [res.data, ...prev]);
      setSelected(res.data);
      setNewJob(emptyJob);
    } catch (e) { alert(e.response?.data?.message || 'Failed to post job'); }
  };

  const beginEdit = () => {
    if (!selected) return;
    setEditJob({
      title: selected.title||'', company: selected.company||'',
      package: selected.package||'', location: selected.location||'',
      jobType: selected.jobType||'Full-Time',
      tags: Array.isArray(selected.tags) ? selected.tags.join(', ') : '',
      description: selected.description||'',
    });
    setEditing(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/opportunities/${selected._id}`, {
        ...editJob, tags: editJob.tags.split(',').map(t=>t.trim()).filter(Boolean)
      });
      setJobs(prev => prev.map(j => j._id === res.data._id ? res.data : j));
      setSelected(res.data);
      setEditing(false);
    } catch (e) { alert(e.response?.data?.message || 'Failed to update job'); }
  };

  const deleteJob = async () => {
    if (!selected || !window.confirm('Delete this job?')) return;
    try {
      await API.delete(`/opportunities/${selected._id}`);
      const remaining = jobs.filter(j => j._id !== selected._id);
      setJobs(remaining);
      setSelected(remaining[0] || null);
      setEditing(false);
    } catch (e) { alert(e.response?.data?.message || 'Failed to delete job'); }
  };

  return (
    <>
      <style>{css}</style>
      <div className="opp-page">

        {/* ── Hero ── */}
        <div className="opp-hero">
          <div className="opp-hero-inner">
            <h1>💼 Opportunities</h1>
            <p>Discover jobs & internships shared by alumni — tailored for you</p>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="opp-filters">
          <div className="opp-filters-card">
            <div className="opp-filter-group">
              <label>Domain</label>
              <select value={filters.field} onChange={e=>setFilters({...filters, field:e.target.value})}>
                <option value="">All Domains</option>
                {['IT','Marketing','Finance','Design','Education','HR'].map(f=>(
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="opp-filter-group">
              <label>Job Type</label>
              <select value={filters.jobType} onChange={e=>setFilters({...filters, jobType:e.target.value})}>
                <option value="">All Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className="opp-filter-group">
              <label>Location</label>
              <input placeholder="e.g. Bangalore" value={filters.location}
                onChange={e=>setFilters({...filters, location:e.target.value})}
                onKeyDown={e=>e.key==='Enter' && fetchJobs()}
              />
            </div>
            <button className="opp-filter-btn" onClick={fetchJobs}>🔍 Search</button>
          </div>
        </div>

        {error && <div className="opp-error" style={{maxWidth:1160,margin:'0 auto 16px',padding:'0 20px'}}>{error}</div>}

        {/* ── Main Layout ── */}
        <div className="opp-layout">

          {/* LEFT: jobs list */}
          <div className="opp-list">
            {loading ? (
              <div className="opp-empty">Loading jobs…</div>
            ) : jobs.length === 0 ? (
              <div className="opp-empty">
                <span style={{fontSize:36}}>📭</span>
                <p>No opportunities yet.<br/>Check back soon!</p>
              </div>
            ) : (
              jobs.map((job, i) => (
                <div
                  key={job._id}
                  className={`opp-job-card${selected?._id === job._id ? ' selected' : ''}`}
                  style={{animationDelay:`${i*0.05}s`}}
                  onClick={() => { setSelected(job); setEditing(false); }}
                >
                  <div className="opp-job-top">
                    <div className="opp-job-icon">{fieldIcon[job.field] || '💼'}</div>
                    <div className="opp-job-info">
                      <div className="opp-job-title">{job.title}</div>
                      <div className="opp-job-company">{job.company}</div>
                    </div>
                  </div>
                  <div className="opp-job-meta">
                    {job.jobType  && <span className="opp-pill opp-pill-type">{typeIcon[job.jobType]} {job.jobType}</span>}
                    {job.field    && <span className="opp-pill opp-pill-field">{job.field}</span>}
                    {job.location && <span className="opp-pill opp-pill-loc">📍 {job.location}</span>}
                    {job.package  && <span className="opp-pill opp-pill-pkg">💰 {job.package}</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: detail + post form */}
          <div className="opp-right">

            {/* Job Detail */}
            {selected ? (
              !editing ? (
                <div className="opp-detail-card">
                  <div className="opp-detail-header">
                    <div className="opp-detail-icon">{fieldIcon[selected.field] || '💼'}</div>
                    <div>
                      <div className="opp-detail-title">{selected.title}</div>
                      <div className="opp-detail-company">{selected.company}</div>
                    </div>
                  </div>
                  <div className="opp-detail-body">
                    <div className="opp-detail-pills">
                      {selected.jobType  && <span className="opp-pill opp-pill-type">{typeIcon[selected.jobType]} {selected.jobType}</span>}
                      {selected.field    && <span className="opp-pill opp-pill-field">{selected.field}</span>}
                      {selected.location && <span className="opp-pill opp-pill-loc">📍 {selected.location}</span>}
                      {selected.package  && <span className="opp-pill opp-pill-pkg">💰 {selected.package}</span>}
                    </div>
                    {selected.description && (
                      <div className="opp-detail-section">
                        <h4>About this role</h4>
                        <p>{selected.description}</p>
                      </div>
                    )}
                    {Array.isArray(selected.tags) && selected.tags.length > 0 && (
                      <div className="opp-detail-section">
                        <h4>Skills &amp; Tags</h4>
                        <div className="opp-tags">
                          {selected.tags.map((t,i) => <span key={i} className="opp-tag">{t}</span>)}
                        </div>
                      </div>
                    )}
                    {selected.postedBy?.name && (
                      <div className="opp-detail-section">
                        <h4>Posted by</h4>
                        <p>🎓 {selected.postedBy.name} {selected.postedBy.university ? `• ${selected.postedBy.university}` : ''}</p>
                      </div>
                    )}
                  </div>
                  <div className="opp-detail-footer">
                    {user && <button className="opp-apply-btn" onClick={handleApply}>✉️ Apply Now</button>}
                    {isOwner && (
                      <div className="opp-owner-btns">
                        <button className="opp-edit-btn" onClick={beginEdit}>✏️ Edit</button>
                        <button className="opp-delete-btn" onClick={deleteJob}>🗑️ Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Edit form */
                <div className="opp-post-card">
                  <div className="opp-post-header">
                    <h3>✏️ Edit Job</h3>
                    <p>Update the details below</p>
                  </div>
                  <div className="opp-post-body">
                    <form onSubmit={saveEdit}>
                      <div className="opp-form-grid">
                        <div className="opp-form-group">
                          <label>Job Title</label>
                          <input value={editJob.title} onChange={e=>setEditJob({...editJob,title:e.target.value})} required />
                        </div>
                        <div className="opp-form-group">
                          <label>Company</label>
                          <input value={editJob.company} onChange={e=>setEditJob({...editJob,company:e.target.value})} required />
                        </div>
                        <div className="opp-form-group">
                          <label>Package</label>
                          <input value={editJob.package} onChange={e=>setEditJob({...editJob,package:e.target.value})} />
                        </div>
                        <div className="opp-form-group">
                          <label>Location</label>
                          <input value={editJob.location} onChange={e=>setEditJob({...editJob,location:e.target.value})} />
                        </div>
                        <div className="opp-form-group">
                          <label>Job Type</label>
                          <select value={editJob.jobType} onChange={e=>setEditJob({...editJob,jobType:e.target.value})}>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Internship">Internship</option>
                          </select>
                        </div>
                        <div className="opp-form-group">
                          <label>Tags (comma-separated)</label>
                          <input placeholder="React, Node.js, SQL" value={editJob.tags} onChange={e=>setEditJob({...editJob,tags:e.target.value})} />
                        </div>
                        <div className="opp-form-group full">
                          <label>Description</label>
                          <textarea rows={4} value={editJob.description} onChange={e=>setEditJob({...editJob,description:e.target.value})} />
                        </div>
                      </div>
                      <div style={{display:'flex',gap:10}}>
                        <button type="submit" className="opp-post-submit" style={{flex:1}}>✓ Save Changes</button>
                        <button type="button" onClick={()=>setEditing(false)} style={{flex:1,padding:'13px',background:'#f3f4f6',border:'1.5px solid #e5e7eb',borderRadius:13,fontWeight:700,fontFamily:'inherit',cursor:'pointer',fontSize:15,color:'#6b7280',transition:'all .2s'}}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )
            ) : (
              <div className="opp-no-select">
                <span>👈</span>
                <p>Select a job from the list to view details</p>
              </div>
            )}

            {/* Post Job Form (alumni only) */}
            <div className="opp-post-card">
              <div className="opp-post-header">
                <h3>🚀 Post a Job</h3>
                <p>Share an opportunity with students</p>
              </div>
              <div className="opp-post-body">
                {!canPost && (
                  <div className="opp-locked">
                    🔒 Only alumni accounts can post job listings
                  </div>
                )}
                <form onSubmit={handlePostJob}>
                  <div className="opp-form-grid">
                    <div className="opp-form-group">
                      <label>Job Title</label>
                      <input placeholder="e.g. Frontend Developer" value={newJob.title}
                        onChange={e=>setNewJob({...newJob,title:e.target.value})} required disabled={!canPost} />
                    </div>
                    <div className="opp-form-group">
                      <label>Company</label>
                      <input placeholder="e.g. Google" value={newJob.company}
                        onChange={e=>setNewJob({...newJob,company:e.target.value})} required disabled={!canPost} />
                    </div>
                    <div className="opp-form-group">
                      <label>Package</label>
                      <input placeholder="e.g. 8 LPA" value={newJob.package}
                        onChange={e=>setNewJob({...newJob,package:e.target.value})} disabled={!canPost} />
                    </div>
                    <div className="opp-form-group">
                      <label>Location</label>
                      <input placeholder="e.g. Bangalore" value={newJob.location}
                        onChange={e=>setNewJob({...newJob,location:e.target.value})} required disabled={!canPost} />
                    </div>
                    <div className="opp-form-group">
                      <label>Domain</label>
                      <select value={newJob.field} onChange={e=>setNewJob({...newJob,field:e.target.value})} disabled={!canPost}>
                        {['IT','Marketing','Finance','Design','Education','HR'].map(f=><option key={f}>{f}</option>)}
                      </select>
                    </div>
                    <div className="opp-form-group">
                      <label>Job Type</label>
                      <select value={newJob.jobType} onChange={e=>setNewJob({...newJob,jobType:e.target.value})} disabled={!canPost}>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                    <div className="opp-form-group">
                      <label>Tags (comma-separated)</label>
                      <input placeholder="React, Node.js, MongoDB" value={newJob.tags}
                        onChange={e=>setNewJob({...newJob,tags:e.target.value})} disabled={!canPost} />
                    </div>
                    <div className="opp-form-group full">
                      <label>Description</label>
                      <textarea rows={4} placeholder="Describe the role, responsibilities, requirements…"
                        value={newJob.description}
                        onChange={e=>setNewJob({...newJob,description:e.target.value})} required disabled={!canPost} />
                    </div>
                  </div>
                  <button type="submit" className="opp-post-submit" disabled={!canPost}>
                    🚀 Post Job
                  </button>
                </form>
              </div>
            </div>

          </div>{/* /opp-right */}
        </div>{/* /opp-layout */}
      </div>
    </>
  );
};

export default Opportunities;
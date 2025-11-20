import React, { useEffect, useMemo, useState } from 'react';
import API from '../api';

const Opportunities = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // filters (Domain, Location, Job Type)
  const [filters, setFilters] = useState({ location: '', jobType: '', field: '' });

  // alumni controls
  const canPost = useMemo(
    () => user && (user.role === 'alumni' || user.role === 'Alumni'),
    [user]
  );
  const isOwner = useMemo(
    () => selected && user && selected.postedBy && String(selected.postedBy._id) === String(user.id),
    [selected, user]
  );

  // post/edit form states
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    package: '',
    location: '',
    field: 'IT',
    jobType: 'Full-Time',
    tags: '',
    description: ''
  });

  const [editing, setEditing] = useState(false);
  const [editJob, setEditJob] = useState({
    title: '', company: '', package: '', location: '', jobType: 'Full-Time', tags: '', description: ''
  });

  const loadUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.location) params.location = filters.location;
      if (filters.jobType) params.jobType = filters.jobType;
      if (filters.field) params.field = filters.field;
      const res = await API.get('/opportunities', { params });
      setJobs(res.data);
      if (!selected && res.data.length) setSelected(res.data[0]);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = async (jobId) => {
    const resumeUrl = window.prompt('Enter your resume URL');
    if (!resumeUrl) return;
    try {
      await API.post(`/opportunities/${jobId}/apply`, { resumeUrl });
      alert('Application submitted');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to apply');
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!canPost) {
      alert('Only alumni are authorized to post jobs.');
      return;
    }
    try {
      const payload = {
        title: newJob.title,
        company: newJob.company,
        package: newJob.package,
        location: newJob.location,
        field: newJob.field,
        jobType: newJob.jobType,
        tags: newJob.tags.split(',').map(t => t.trim()).filter(Boolean),
        description: newJob.description,
      };
      const res = await API.post('/opportunities', payload);
      setJobs(prev => [res.data, ...prev]);
      setSelected(res.data);
      setNewJob({ title: '', company: '', package: '', location: '', field: 'IT', jobType: 'Full-Time', tags: '', description: '' });
      alert('Job posted successfully!');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to post job');
    }
  };

  const beginEdit = () => {
    if (!selected) return;
    setEditJob({
      title: selected.title || '',
      company: selected.company || '',
      package: selected.package || '',
      location: selected.location || '',
      jobType: selected.jobType || 'Full-Time',
      tags: Array.isArray(selected.tags) ? selected.tags.join(', ') : '',
      description: selected.description || '',
    });
    setEditing(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: editJob.title,
        company: editJob.company,
        package: editJob.package,
        location: editJob.location,
        jobType: editJob.jobType,
        tags: editJob.tags.split(',').map(t => t.trim()).filter(Boolean),
        description: editJob.description,
      };
      const res = await API.put(`/opportunities/${selected._id}`, payload);
      setJobs(prev => prev.map(j => (j._id === res.data._id ? res.data : j)));
      setSelected(res.data);
      setEditing(false);
      alert('Job updated');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update job');
    }
  };

  const deleteJob = async () => {
    if (!selected) return;
    if (!window.confirm('Delete this job?')) return;
    try {
      await API.delete(`/opportunities/${selected._id}`);
      setJobs(prev => prev.filter(j => j._id !== selected._id));
      setSelected(null);
      setEditing(false);
      alert('Job deleted');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div>
      <h2>Opportunities</h2>

      {/* Two-column: left post form, right filters + jobs (equal width) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
        {/* Left: Post a Job (alumni only button) */}
        <div>
          <div className="auth-card">
            <div style={{ marginBottom: 8 }}>
              <h3 className="auth-title" style={{ color: '#222' }}>Post a Job</h3>
              <p className="auth-subtitle" style={{ color: '#555' }}>Only alumni can post jobs</p>
            </div>
            <form className="auth-form" onSubmit={handlePostJob}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#000' }}>Job Title</label>
                <input className="form-input" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} required style={{ color: '#000', background: '#fff', border: '1px solid #000' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#000' }}>Company Name</label>
                <input className="form-input" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} required style={{ color: '#000', background: '#fff', border: '1px solid #000' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#000' }}>Package</label>
                <input className="form-input" placeholder="e.g., 8 LPA / 6-10 LPA / $80k" value={newJob.package} onChange={(e) => setNewJob({ ...newJob, package: e.target.value })} required style={{ color: '#000', background: '#fff', border: '1px solid #000' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#000' }}>Location</label>
                <input className="form-input" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} required style={{ color: '#000', background: '#fff', border: '1px solid #000' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#000' }}>Requirement / Domain</label>
                <select className="form-select" value={newJob.field} onChange={(e) => setNewJob({ ...newJob, field: e.target.value })} required style={{ color: '#000', background: '#fff', border: '1px solid #000' }}>
                  <option style={{ color: '#000', background: '#fff' }}>IT</option>
                  <option style={{ color: '#000', background: '#fff' }}>Marketing</option>
                  <option style={{ color: '#000', background: '#fff' }}>Finance</option>
                  <option style={{ color: '#000', background: '#fff' }}>Design</option>
                  <option style={{ color: '#000', background: '#fff' }}>Education</option>
                  <option style={{ color: '#000', background: '#fff' }}>HR</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#000' }}>Job Type</label>
                <select className="form-select" value={newJob.jobType} onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })} required style={{ color: '#000', background: '#fff', border: '1px solid #000' }}>
                  <option value="Full-Time" style={{ color: '#000', background: '#fff' }}>Full-Time</option>
                  <option value="Part-Time" style={{ color: '#000', background: '#fff' }}>Part-Time</option>
                  <option value="Internship" style={{ color: '#000', background: '#fff' }}>Internship</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ color: '#000' }}>Description</label>
                <textarea className="form-textarea" rows="5" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} required style={{ color: '#000', background: '#fff', border: '1px solid #000' }} />
              </div>
              <button type="submit" className="submit-btn" disabled={!canPost} onClick={(e) => {
                if (!canPost) {
                  e.preventDefault();
                  alert('Only alumni are authorized to post jobs.');
                }
              }}>Post Job</button>
            </form>
          </div>
        </div>

        {/* Right: Filters + Jobs */}
        <div>
          {/* Filters */}
          <div className="auth-card" style={{ marginBottom: 12 }}>
            <form className="auth-form" onSubmit={(e) => { e.preventDefault(); fetchJobs(); }}>
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                <select className="form-select" value={filters.field} onChange={(e) => setFilters({ ...filters, field: e.target.value })} style={{ color: '#000', background: '#fff', border: '1px solid #000' }}>
                  <option value="">All Domains</option>
                  <option>IT</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Design</option>
                  <option>Education</option>
                  <option>HR</option>
                </select>
                <select className="form-select" value={filters.jobType} onChange={(e) => setFilters({ ...filters, jobType: e.target.value })} style={{ color: '#000', background: '#fff', border: '1px solid #000' }}>
                  <option value="">All Types</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                </select>
                <input className="form-input" placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} style={{ color: '#000', background: '#fff', border: '1px solid #000' }} />
              </div>
              <div style={{ marginTop: 8 }}>
                <button type="submit" className="submit-btn">Apply Filters</button>
              </div>
            </form>
          </div>
          {/* Jobs list + details */}
          {jobs.length === 0 ? (
            <div className="auth-card" style={{ marginTop: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <h3 className="auth-title" style={{ color: '#222' }}>No opportunities yet</h3>
                <p className="auth-subtitle" style={{ color: '#555' }}>Please check back later.</p>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <div style={{ maxHeight: 520, overflowY: 'auto', paddingRight: 4 }}>
                {jobs.map((job) => (
                  <div key={job._id} className="auth-card" style={{ marginBottom: 12 }}>
                    <div style={{ marginBottom: 8 }}>
                      <h3 className="auth-title" style={{ margin: 0, color: '#222' }}>{job.title}</h3>
                      <p className="auth-subtitle" style={{ margin: 0, color: '#555' }}>{job.company} • {job.package} • {job.location} • {job.jobType}</p>
                    </div>
                    {job.field && (
                      <div style={{ marginBottom: 8 }}>
                        <span className="nav-link" style={{ padding: '2px 10px', borderRadius: 12 }}>{job.field}</span>
                      </div>
                    )}
                    {Array.isArray(job.tags) && job.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {job.tags.map((t, idx) => (<span key={idx} className="nav-link" style={{ padding: '2px 8px', borderRadius: 12 }}>{t}</span>))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message" style={{ marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default Opportunities;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

const css = `
.comm-page {
  min-height: calc(100vh - 68px);
  background: linear-gradient(160deg, #eef2ff 0%, #f5f6fa 40%, #faf9ff 100%);
  padding-bottom: 60px;
  animation: commFade .4s ease both;
}
@keyframes commFade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* Hero */
.comm-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 55%, #8b5cf6 100%);
  background-size: 200% 200%;
  animation: commGrad 10s ease infinite;
  padding: 32px 20px 28px;
  position: relative; overflow: hidden;
  box-shadow: 0 8px 32px rgba(102,126,234,.3);
}
@keyframes commGrad {
  0%,100% { background-position:0% 50% }
  50%     { background-position:100% 50% }
}
.comm-hero::before {
  content:''; position:absolute;
  width:350px; height:350px;
  background:rgba(255,255,255,.06);
  border-radius:50%;
  top:-140px; right:-60px;
}
.comm-hero-inner {
  max-width:1160px; margin:0 auto;
  position:relative; z-index:1;
  display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;
}
.comm-hero h1 {
  font-size:2rem; font-weight:900;
  color:#fff; margin:0 0 6px;
  letter-spacing:-.03em;
  text-shadow:0 4px 16px rgba(0,0,0,.2);
}
.comm-hero p { color:rgba(255,255,255,.75); font-size:15px; margin:0; }
.comm-hero-btn {
  padding:11px 22px;
  background:rgba(255,255,255,.18);
  color:#fff; border:2px solid rgba(255,255,255,.4);
  border-radius:50px;
  font-size:14px; font-weight:700;
  font-family:inherit; cursor:pointer;
  backdrop-filter:blur(8px);
  transition:all .22s ease;
  white-space:nowrap;
  text-decoration:none; display:inline-block;
}
.comm-hero-btn:hover { background:rgba(255,255,255,.28); transform:translateY(-2px); }

/* Main container */
.comm-container {
  max-width:1160px; margin:0 auto;
  padding:28px 20px;
  display:flex; flex-direction:column; gap:24px;
}

/* Filter card */
.comm-filter-card {
  background:#fff;
  border:1px solid rgba(102,126,234,.12);
  border-radius:16px;
  padding:16px 20px;
  box-shadow:0 4px 20px rgba(102,126,234,.08);
  display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end;
}
.comm-filter-group { display:flex; flex-direction:column; gap:4px; min-width:140px; flex:1; }
.comm-filter-group label {
  font-size:11px; font-weight:700;
  color:#9ca3af; text-transform:uppercase; letter-spacing:.06em;
}
.comm-filter-group input {
  padding:9px 14px;
  border:1.5px solid #e0e7ff;
  border-radius:50px;
  font-size:13.5px; font-family:inherit;
  background:#fbfdff; color:#1a1a2e;
  outline:none;
  transition:border-color .2s, box-shadow .2s;
}
.comm-filter-group input:focus {
  border-color:#667eea;
  box-shadow:0 0 0 4px rgba(102,126,234,.1);
}
.comm-search-btn {
  padding:10px 22px;
  background:linear-gradient(135deg,#667eea,#764ba2);
  color:#fff; border:none;
  border-radius:50px;
  font-size:14px; font-weight:700;
  font-family:inherit; cursor:pointer;
  box-shadow:0 4px 14px rgba(102,126,234,.3);
  transition:all .22s ease;
  white-space:nowrap; align-self:flex-end;
  height:40px;
}
.comm-search-btn:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(102,126,234,.4); }

/* Grid */
.comm-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));
  gap:20px;
}
.comm-card {
  background:#fff;
  border:1.5px solid #e5e7eb;
  border-radius:18px;
  overflow:hidden;
  transition:all .25s cubic-bezier(.4,0,.2,1);
  animation:cardIn .4s ease both;
}
@keyframes cardIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.comm-card:hover {
  border-color:#c7d2fe;
  box-shadow:0 8px 28px rgba(102,126,234,.14);
  transform:translateY(-3px);
}
.comm-card-banner {
  height:100px;
  background:linear-gradient(135deg,#eef2ff,#e0e7ff);
  display:flex; align-items:center; justify-content:center;
  color:#667eea; font-size:48px; font-weight:900;
  border-bottom:1px solid #e0e7ff;
}
.comm-card-body { padding:18px 20px; }
.comm-card-top {
  display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;
}
.comm-card-name { font-size:17px; font-weight:700; color:#1a1a2e; line-height:1.3; flex:1; }
.comm-members-badge {
  background:#eef2ff; color:#4338ca;
  font-size:11.5px; font-weight:600;
  padding:3px 10px; border-radius:50px;
  border:1px solid #c7d2fe;
  white-space:nowrap; margin-left:10px;
}
.comm-card-desc {
  color:#555; font-size:13.5px; line-height:1.6;
  display:-webkit-box; -webkit-line-clamp:3;
  -webkit-box-orient:vertical; overflow:hidden;
  min-height:62px; margin-bottom:14px;
}
.comm-card-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px; min-height:26px; }
.comm-tag-dept { background:#e3f2fd; color:#1565c0; font-size:11.5px; font-weight:600; padding:3px 10px; border-radius:50px; }
.comm-tag-batch { background:#f0fdf4; color:#166534; font-size:11.5px; font-weight:600; padding:3px 10px; border-radius:50px; }
.comm-tag-interest { background:#f3e5f5; color:#7b1fa2; font-size:11.5px; font-weight:600; padding:3px 10px; border-radius:50px; }
.comm-view-btn {
  display:block; text-align:center;
  background:linear-gradient(135deg,#667eea,#764ba2);
  color:#fff; padding:10px; border-radius:10px;
  text-decoration:none; font-size:14px; font-weight:700;
  transition:all .2s ease;
  box-shadow:0 3px 12px rgba(102,126,234,.22);
}
.comm-view-btn:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(102,126,234,.32); }

.comm-empty {
  text-align:center; padding:60px 24px;
  background:#fff; border-radius:18px;
  border:1px dashed #e0e7ff;
  color:#9ca3af; grid-column:1/-1;
}
.comm-empty span { font-size:48px; display:block; margin-bottom:12px; }

/* Create form */
.comm-create-card {
  background:#fff;
  border:1px solid rgba(102,126,234,.1);
  border-radius:18px;
  box-shadow:0 4px 20px rgba(102,126,234,.08);
  overflow:hidden;
}
.comm-create-header {
  background:linear-gradient(135deg,#f0f3ff,#e8edff);
  padding:16px 22px; border-bottom:1px solid #e0e7ff;
}
.comm-create-header h3 { font-size:16px; font-weight:800; color:#1a1a2e; margin:0 0 2px; }
.comm-create-header p { font-size:12.5px; color:#6b7280; margin:0; }
.comm-create-body { padding:20px 22px; }
.comm-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
@media(max-width:600px){ .comm-form-grid{grid-template-columns:1fr;} }
.comm-form-group { display:flex; flex-direction:column; gap:5px; }
.comm-form-group.full { grid-column:1/-1; }
.comm-form-group label { font-size:11px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:.06em; }
.comm-form-group input,
.comm-form-group textarea {
  padding:10px 14px; border:1.5px solid #e5e7eb; border-radius:12px;
  font-size:14px; font-family:inherit; background:#f9fafc; color:#1a1a2e;
  outline:none; transition:all .22s ease;
}
.comm-form-group input:focus, .comm-form-group textarea:focus {
  border-color:#667eea; background:#fff; box-shadow:0 0 0 4px rgba(102,126,234,.08);
}
.comm-form-group textarea { resize:vertical; min-height:80px; }
.comm-form-actions { display:flex; gap:10px; margin-top:4px; }
.comm-submit-btn {
  flex:1; padding:12px 24px;
  background:linear-gradient(135deg,#667eea,#764ba2);
  color:#fff; border:none; border-radius:12px;
  font-size:15px; font-weight:700; font-family:inherit; cursor:pointer;
  box-shadow:0 4px 14px rgba(102,126,234,.28); transition:all .22s ease;
}
.comm-submit-btn:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(102,126,234,.38); }
.comm-clear-btn {
  padding:12px 20px; background:#f3f4f6; color:#6b7280;
  border:1.5px solid #e5e7eb; border-radius:12px;
  font-size:15px; font-weight:700; font-family:inherit; cursor:pointer; transition:all .2s;
}
.comm-clear-btn:hover { background:#e5e7eb; }

.comm-alumni-notice {
  background:#eef2ff; border:1px solid #c7d2fe;
  border-radius:12px; padding:12px 16px;
  color:#4338ca; font-size:13.5px; font-weight:500;
  display:flex; align-items:center; gap:8px;
}

.comm-error {
  padding:12px 16px; background:#fef2f2; border:1px solid #fecaca;
  border-radius:12px; color:#dc2626; font-size:13.5px;
  display:flex; align-items:center; gap:8px;
}

@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
`;

const Communities = () => {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ department: '', batch: '', interest: '' });
  const [form, setForm] = useState({ name: '', description: '', department: '', batch: '', interest: '' });

  const isAlumni = user && (user.role?.toLowerCase() === 'alumni');

  useEffect(() => {
    API.get('/auth/me')
      .then(r => setUser(r.data))
      .catch(() => setUser(null))
      .finally(() => setUserLoaded(true));
  }, []);

  useEffect(() => {
    if (userLoaded) fetchCommunities();
    // eslint-disable-next-line
  }, [userLoaded]);

  const fetchCommunities = async () => {
    setLoading(true); setError('');
    try {
      const params = {};
      if (filters.department) params.department = filters.department;
      if (filters.batch) params.batch = filters.batch;
      if (filters.interest) params.interest = filters.interest;
      const res = await API.get('/community', { params });
      setCommunities(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const createCommunity = async (e) => {
    e.preventDefault();
    try {
      await API.post('/community/create', form);
      setForm({ name: '', description: '', department: '', batch: '', interest: '' });
      await fetchCommunities();
      alert('Community created successfully!');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to create community');
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="comm-page">

        {/* Hero */}
        <div className="comm-hero">
          <div className="comm-hero-inner">
            <div>
              <h1>👥 Communities</h1>
              <p>Connect, share and grow with your university network</p>
            </div>
            {isAlumni && (
              <button className="comm-hero-btn"
                onClick={() => document.getElementById('comm-create').scrollIntoView({ behavior: 'smooth' })}>
                + Create Community
              </button>
            )}
          </div>
        </div>

        <div className="comm-container">

          {/* Filters */}
          <div className="comm-filter-card">
            <div className="comm-filter-group">
              <label>Department</label>
              <input placeholder="e.g. Computer Science" value={filters.department}
                onChange={e => setFilters({ ...filters, department: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && fetchCommunities()} />
            </div>
            <div className="comm-filter-group">
              <label>Batch</label>
              <input placeholder="e.g. 2020" value={filters.batch}
                onChange={e => setFilters({ ...filters, batch: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && fetchCommunities()} />
            </div>
            <div className="comm-filter-group">
              <label>Interest</label>
              <input placeholder="e.g. Web Dev" value={filters.interest}
                onChange={e => setFilters({ ...filters, interest: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && fetchCommunities()} />
            </div>
            <button className="comm-search-btn" onClick={fetchCommunities}>🔍 Search</button>
          </div>

          {error && <div className="comm-error"><span>⚠️</span>{error}</div>}

          {/* Communities Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <div style={{ width: 36, height: 36, border: '4px solid #e0e7ff', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <div className="comm-grid">
              {communities.map((community, i) => (
                <div key={community._id} className="comm-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="comm-card-banner">
                    {community.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="comm-card-body">
                    <div className="comm-card-top">
                      <div className="comm-card-name">{community.name}</div>
                      <span className="comm-members-badge">
                        {community.memberCount || 0} {community.memberCount === 1 ? 'Member' : 'Members'}
                      </span>
                    </div>
                    <p className="comm-card-desc">{community.description || 'No description provided.'}</p>
                    <div className="comm-card-tags">
                      {community.department && <span className="comm-tag-dept">{community.department}</span>}
                      {community.batch && <span className="comm-tag-batch">Batch {community.batch}</span>}
                      {community.interest && <span className="comm-tag-interest">{community.interest}</span>}
                    </div>
                    <Link to={`/communities/${community._id}`} className="comm-view-btn">
                      View Community →
                    </Link>
                  </div>
                </div>
              ))}

              {communities.length === 0 && !loading && (
                <div className="comm-empty">
                  <span>👥</span>
                  <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 16, color: '#4338ca' }}>No communities found</p>
                  <p style={{ margin: 0, fontSize: 13 }}>Try adjusting your filters{isAlumni ? ' or create one below' : ''}</p>
                </div>
              )}
            </div>
          )}

          {/* Create Community — alumni only */}
          {isAlumni ? (
            <div id="comm-create" className="comm-create-card">
              <div className="comm-create-header">
                <h3>🚀 Create a New Community</h3>
                <p>Build and grow your alumni community</p>
              </div>
              <div className="comm-create-body">
                <form onSubmit={createCommunity}>
                  <div className="comm-form-grid">
                    <div className="comm-form-group full">
                      <label>Community Name</label>
                      <input placeholder="e.g. CSE Alumni Network" value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="comm-form-group full">
                      <label>Description</label>
                      <textarea rows={3} placeholder="What is this community about?"
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })} required />
                    </div>
                    <div className="comm-form-group">
                      <label>Department</label>
                      <input placeholder="e.g. Computer Science" value={form.department}
                        onChange={e => setForm({ ...form, department: e.target.value })} />
                    </div>
                    <div className="comm-form-group">
                      <label>Batch</label>
                      <input placeholder="e.g. 2023" value={form.batch}
                        onChange={e => setForm({ ...form, batch: e.target.value })} />
                    </div>
                    <div className="comm-form-group">
                      <label>Interest</label>
                      <input placeholder="e.g. Web Development" value={form.interest}
                        onChange={e => setForm({ ...form, interest: e.target.value })} />
                    </div>
                  </div>
                  <div className="comm-form-actions">
                    <button type="button" className="comm-clear-btn"
                      onClick={() => setForm({ name: '', description: '', department: '', batch: '', interest: '' })}>
                      Clear
                    </button>
                    <button type="submit" className="comm-submit-btn">🚀 Create Community</button>
                  </div>
                </form>
              </div>
            </div>
          ) : user ? (
            <div className="comm-alumni-notice">
              🎓 Only alumni can create communities. Students can browse and join existing ones.
            </div>
          ) : null}

        </div>
      </div>
    </>
  );
};

export default Communities;
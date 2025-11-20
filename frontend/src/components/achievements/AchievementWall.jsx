import React, { useEffect, useMemo, useState } from 'react';
import API from '../../api';
import AchievementCard from './AchievementCard';
import AddAchievementModal from './AddAchievementModal';

const departments = ['CSE', 'ECE', 'IT', 'ME', 'CE', 'EE'];

export default function AchievementWall({ user }) {
  const [items, setItems] = useState([]);
  const [top, setTop] = useState([]);
  const [q, setQ] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [type, setType] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const canManage = !!user && String(user.role || '').toLowerCase() === 'alumni';

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (department) params.department = department;
      if (year) params.year = year;
      if (type) params.type = type;
      const [listRes, topRes] = await Promise.all([
        API.get('/achievements', { params }),
        API.get('/achievements/top')
      ]);
      setItems(listRes.data);
      setTop(topRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { const t = setTimeout(fetchAll, 300); return () => clearTimeout(t); }, [q, department, year, type]);

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 8 }, (_, i) => now - i);
  }, []);

  const submitAchievement = async (payload) => {
    try {
      if (editItem && editItem._id) {
        await API.put(`/achievements/${editItem._id}`, payload);
      } else {
        await API.post('/achievements', payload);
      }
      setOpen(false);
      setEditItem(null);
      fetchAll();
    } catch (e) { console.error(e); }
  };

  const like = async (id) => {
    try { await API.post(`/achievements/${id}/like`); fetchAll(); } catch (e) { console.error(e); }
  };

  const congrats = async (id) => {
    try { await API.post(`/achievements/${id}/congrats`); fetchAll(); } catch (e) { console.error(e); }
  };

  const onEdit = (item) => {
    setEditItem(item);
    setOpen(true);
  };

  const onDelete = async (id) => {
    const ok = window.confirm('Delete this achievement?');
    if (!ok) return;
    try { await API.delete(`/achievements/${id}`); fetchAll(); } catch (e) { console.error(e); }
  };

  // Exclude Hall of Fame items from the main list to avoid duplicates
  const topIds = useMemo(() => new Set(top.map((t) => t._id)), [top]);
  const filteredItems = useMemo(() => items.filter((it) => !topIds.has(it._id)), [items, topIds]);

  return (
    <div className="achievements-page">
      <div className="container-narrow">
        <div className="filters-card section">
          <div className="filter-row">
            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="label">Search by name</label>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Riya Sharma" className="input" />
            </div>
            <div>
              <label className="label">Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} className="select">
                <option value="">All</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Year</label>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="select">
                <option value="">All</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="select">
                <option value="">All</option>
                <option value="Placement">Placement</option>
                <option value="Startup">Startup</option>
                <option value="Hackathon">Hackathon</option>
              </select>
            </div>
            {canManage ? (
              <button onClick={() => setOpen(true)} className="btn-primary">+ Add Achievement</button>
            ) : (
              <div style={{ color: '#6b7280', fontSize: 13 }}>Login as Alumni to add your achievement.</div>
            )}
          </div>
        </div>

        <div className="achievements-hero">
          <div className="container-narrow">
            <h1 className="hof-title">Hall of Fame</h1>
            <div className="cards-grid section">
              {top.map((t) => (
                <AchievementCard key={t._id} item={t} onLike={like} onCongrats={congrats} onEdit={onEdit} onDelete={onDelete} canManage={canManage} />
              ))}
            </div>
          </div>
        </div>

        <div className="cards-grid section">
          {loading ? (
            <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6b7280' }}>No achievements found.</div>
          ) : (
            filteredItems.map((item) => (
              <AchievementCard key={item._id} item={item} onLike={like} onCongrats={congrats} onEdit={onEdit} onDelete={onDelete} canManage={canManage} />
            ))
          )}
        </div>
      </div>

      {canManage && (
        <AddAchievementModal open={open} onClose={() => { setOpen(false); setEditItem(null); }} onSubmit={submitAchievement} initialData={editItem} />
      )}
    </div>
  );
}

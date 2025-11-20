import React, { useEffect, useState } from 'react';

export default function AddAchievementModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: '',
    department: '',
    year: new Date().getFullYear(),
    title: '',
    description: '',
    type: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (open) {
      setForm((f) => ({
        ...f,
        ...(initialData || {})
      }));
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, imageUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{initialData ? 'Edit Achievement' : 'Add Achievement'}</h3>
        <form onSubmit={submit} className="modal-grid">
          <div>
            <label className="label">Name</label>
            <input name="name" className="input" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Department</label>
            <input name="department" className="input" value={form.department} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Year</label>
            <input type="number" name="year" className="input" value={form.year} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Type</label>
            <input name="type" className="input" value={form.type} onChange={handleChange} placeholder="Placement/Startup/Hackathon" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label">Title</label>
            <input name="title" className="input" value={form.title} onChange={handleChange} required />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label">Description</label>
            <textarea name="description" className="textarea" value={form.description} onChange={handleChange} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="file" accept="image/*" onChange={handleImage} />
            {form.imageUrl && <img src={form.imageUrl} alt="preview" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />}
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{initialData ? 'Save Changes' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

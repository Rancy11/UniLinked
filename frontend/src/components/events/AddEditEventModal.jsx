import React, { useEffect, useState } from 'react';

export default function AddEditEventModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dateTime: '',
    venue: '',
    organizer: '',
    type: '',
    department: '',
    imageUrl: '',
    isOnline: false,
    onlineLink: '',
    maxRegistrants: ''
  });

  useEffect(() => {
    if (open) {
      setForm({
        title: initialData?.title || '',
        description: initialData?.description || '',
        dateTime: initialData?.dateTime ? new Date(initialData.dateTime).toISOString().slice(0,16) : '',
        venue: initialData?.venue || '',
        organizer: initialData?.organizer || '',
        type: initialData?.type || '',
        department: initialData?.department || '',
        imageUrl: initialData?.imageUrl || '',
        isOnline: initialData?.isOnline || false,
        onlineLink: initialData?.onlineLink || '',
        maxRegistrants: initialData?.maxRegistrants || ''
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ 
      ...f, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
    const payload = { ...form, dateTime: form.dateTime ? new Date(form.dateTime).toISOString() : '' };
    onSubmit(payload);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{initialData ? 'Edit Event' : 'Add Event'}</h3>
        <form onSubmit={submit} className="modal-grid">
          <div>
            <label className="label">Title</label>
            <input className="input" name="title" value={form.title} onChange={handle} required />
          </div>
          <div>
            <label className="label">Organizer</label>
            <input className="input" name="organizer" value={form.organizer} onChange={handle} />
          </div>
          <div>
            <label className="label">Venue</label>
            <input className="input" name="venue" value={form.venue} onChange={handle} />
          </div>
          <div>
            <label className="label">Date & Time</label>
            <input className="input" type="datetime-local" name="dateTime" value={form.dateTime} onChange={handle} required />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="select" name="type" value={form.type} onChange={handle}>
              <option value="">Select</option>
              <option>Workshop</option>
              <option>Webinar</option>
              <option>Competition</option>
              <option>Fest</option>
              <option>Reunion</option>
              <option>Placement</option>
              <option>Seminar</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="label">Department</label>
            <input className="input" name="department" value={form.department} onChange={handle} />
          </div>
          <div>
            <label className="label">Max Registrants</label>
            <input className="input" type="number" name="maxRegistrants" value={form.maxRegistrants} onChange={handle} placeholder="Leave empty for unlimited" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" name="isOnline" checked={form.isOnline} onChange={handle} />
              <span className="label" style={{ margin: 0 }}>Online Event</span>
            </label>
          </div>
          {form.isOnline && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Online Meeting Link</label>
              <input className="input" name="onlineLink" value={form.onlineLink} onChange={handle} placeholder="Zoom, Teams, or other meeting link" />
            </div>
          )}
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="label">Description</label>
            <textarea className="textarea" name="description" value={form.description} onChange={handle} />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
            <input type="file" accept="image/*" onChange={handleImage} />
            {form.imageUrl && <img alt="preview" src={form.imageUrl} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #e5e7eb' }} />}
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{initialData ? 'Save Changes' : 'Add Event'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

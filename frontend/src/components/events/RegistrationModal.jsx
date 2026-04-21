import React, { useState } from 'react';

const modalCss = `
.reg-backdrop {
  position:fixed; inset:0;
  background:rgba(0,0,0,.55);
  backdrop-filter:blur(4px);
  display:flex; align-items:center; justify-content:center;
  z-index:1000; padding:16px;
  animation:regFade .2s ease;
}
@keyframes regFade{from{opacity:0}to{opacity:1}}
.reg-modal {
  background:#fff;
  border-radius:22px;
  width:100%; max-width:560px;
  max-height:90vh; overflow-y:auto;
  box-shadow:0 30px 80px rgba(0,0,0,.25);
  animation:regSlide .25s cubic-bezier(.22,1,.36,1);
}
@keyframes regSlide{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.reg-header {
  background:linear-gradient(135deg,#667eea,#764ba2);
  padding:22px 26px 20px;
  border-radius:22px 22px 0 0;
  position:relative;
}
.reg-header h2 { color:#fff; font-size:20px; font-weight:900; margin:0 0 4px; }
.reg-header h3 { color:rgba(255,255,255,.85); font-size:15px; font-weight:600; margin:0 0 10px; }
.reg-event-meta {
  display:flex; flex-wrap:wrap; gap:8px;
}
.reg-meta-pill {
  background:rgba(255,255,255,.18);
  color:#fff; font-size:12px; font-weight:600;
  padding:4px 12px; border-radius:50px;
  border:1px solid rgba(255,255,255,.25);
}
.reg-close {
  position:absolute; top:16px; right:16px;
  background:rgba(255,255,255,.2); color:#fff;
  border:none; border-radius:50%;
  width:32px; height:32px; font-size:18px;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
  transition:background .2s;
}
.reg-close:hover { background:rgba(255,255,255,.35); }
.reg-body { padding:22px 26px; }
.reg-grid {
  display:grid; grid-template-columns:1fr 1fr;
  gap:14px; margin-bottom:14px;
}
@media(max-width:480px){ .reg-grid{grid-template-columns:1fr;} }
.reg-group { display:flex; flex-direction:column; gap:5px; }
.reg-group.full { grid-column:1/-1; }
.reg-group label {
  font-size:11px; font-weight:700;
  color:#9ca3af; text-transform:uppercase; letter-spacing:.06em;
}
.reg-group input, .reg-group select, .reg-group textarea {
  padding:10px 14px;
  border:1.5px solid #e5e7eb;
  border-radius:12px;
  font-size:14px; font-family:inherit;
  background:#f9fafc; color:#1a1a2e;
  outline:none;
  transition:all .22s ease;
}
.reg-group input:focus, .reg-group select:focus, .reg-group textarea:focus {
  border-color:#667eea;
  background:#fff;
  box-shadow:0 0 0 4px rgba(102,126,234,.1);
}
.reg-group textarea { resize:vertical; min-height:72px; }
.reg-actions {
  display:flex; gap:10px; margin-top:6px;
}
.reg-cancel {
  flex:1; padding:13px;
  background:#f3f4f6; color:#6b7280;
  border:1.5px solid #e5e7eb;
  border-radius:13px; font-size:15px; font-weight:700;
  font-family:inherit; cursor:pointer;
  transition:all .2s;
}
.reg-cancel:hover:not(:disabled) { background:#e5e7eb; }
.reg-submit {
  flex:2; padding:13px;
  background:linear-gradient(135deg,#10b981,#059669);
  color:#fff; border:none;
  border-radius:13px; font-size:15px; font-weight:700;
  font-family:inherit; cursor:pointer;
  box-shadow:0 4px 16px rgba(16,185,129,.28);
  transition:all .22s ease;
}
.reg-submit:hover:not(:disabled) {
  transform:translateY(-2px);
  box-shadow:0 8px 24px rgba(16,185,129,.38);
}
.reg-submit:disabled, .reg-cancel:disabled {
  opacity:.55; cursor:not-allowed; transform:none;
}
`;

export default function RegistrationModal({ open, onClose, onSubmit, event }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', university: '',
    year: '', department: '', expectations: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || !event) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(event._id, form);
      setForm({ name: '', email: '', phone: '', university: '', year: '', department: '', expectations: '' });
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{modalCss}</style>
      <div className="reg-backdrop" onClick={onClose}>
        <div className="reg-modal" onClick={(e) => e.stopPropagation()}>
          <div className="reg-header">
            <button className="reg-close" onClick={onClose}>×</button>
            <h2>🎟️ Event Registration</h2>
            <h3>{event.title}</h3>
            <div className="reg-event-meta">
              <span className="reg-meta-pill">📅 {new Date(event.dateTime).toLocaleString()}</span>
              {event.venue && <span className="reg-meta-pill">📍 {event.venue}</span>}
              {event.organizer && <span className="reg-meta-pill">👤 {event.organizer}</span>}
            </div>
          </div>

          <div className="reg-body">
            <form onSubmit={handleSubmit}>
              <div className="reg-grid">
                <div className="reg-group">
                  <label>Full Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    required placeholder="Your full name" />
                </div>
                <div className="reg-group">
                  <label>Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    required placeholder="your@email.com" />
                </div>
                <div className="reg-group">
                  <label>Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                    required placeholder="+91 98765 43210" />
                </div>
                <div className="reg-group">
                  <label>University / College *</label>
                  <input type="text" name="university" value={form.university} onChange={handleChange}
                    required placeholder="Your institution" />
                </div>
                <div className="reg-group">
                  <label>Year of Study</label>
                  <select name="year" value={form.year} onChange={handleChange}>
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>
                <div className="reg-group">
                  <label>Department</label>
                  <select name="department" value={form.department} onChange={handleChange}>
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="IT">IT</option>
                    <option value="ME">Mechanical</option>
                    <option value="CE">Civil</option>
                    <option value="EE">Electrical</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="reg-group full">
                  <label>Expectations (optional)</label>
                  <textarea name="expectations" value={form.expectations} onChange={handleChange}
                    placeholder="What do you hope to learn or gain from this event?" rows={3} />
                </div>
              </div>
              <div className="reg-actions">
                <button type="button" className="reg-cancel" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="reg-submit" disabled={isSubmitting}>
                  {isSubmitting ? '⏳ Registering...' : '✅ Complete Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
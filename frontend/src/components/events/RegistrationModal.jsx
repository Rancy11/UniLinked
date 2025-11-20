import React, { useState } from 'react';

export default function RegistrationModal({ open, onClose, onSubmit, event }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    year: '',
    department: '',
    expectations: ''
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
      // Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        university: '',
        year: '',
        department: '',
        expectations: ''
      });
      // Parent will handle closing the modal
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      // Always reset submitting state
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="registration-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Register for Event</h2>
          <h3>{event.title}</h3>
          <p className="event-details">
            📅 {new Date(event.dateTime).toLocaleString()} <br />
            📍 {event.venue} <br />
            👤 {event.organizer}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">University/College *</label>
              <input
                type="text"
                name="university"
                value={form.university}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your university"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Year of Study</label>
              <select
                name="year"
                value={form.year}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Department</option>
                <option value="CSE">Computer Science & Engineering</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="IT">Information Technology</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
                <option value="EE">Electrical Engineering</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">What do you expect from this event?</label>
            <textarea
              name="expectations"
              value={form.expectations}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
              placeholder="Share your expectations or any specific topics you'd like to learn about..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-register-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

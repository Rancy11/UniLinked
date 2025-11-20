import React, { useEffect, useMemo, useState } from 'react';
import API from '../../api';
import EventCard from './EventCard';
import EventWithParticipants from './EventWithParticipants';
import AddEditEventModal from './AddEditEventModal';
import RegistrationModal from './RegistrationModal';
import EventDetailsModal from './EventDetailsModal';

const types = ['Workshop', 'Webinar', 'Competition', 'Fest', 'Reunion', 'Placement', 'Seminar', 'Other'];
const departments = ['CSE', 'ECE', 'IT', 'ME', 'CE', 'EE'];

export default function EventsPage({ user }) {
  const [items, setItems] = useState([]);
  const [past, setPast] = useState([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [department, setDepartment] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);

  const canManage = !!user && ['admin', 'teacher', 'alumni'].includes(String(user.role || '').toLowerCase());
  const canSearch = !!user && ['admin', 'teacher', 'student'].includes(String(user.role || '').toLowerCase());
  const canRegister = !!user && ['student', 'alumni'].includes(String(user.role || '').toLowerCase());
  const isStudent = !!user && ['student'].includes(String(user.role || '').toLowerCase());

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (type) params.type = type;
      if (department) params.department = department;
      const [listRes, pastRes] = await Promise.all([
        API.get('/events', { params }),
        API.get('/events/past/all'),
      ]);
      setItems(listRes.data);
      setPast(pastRes.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => { const t = setTimeout(fetchAll, 300); return () => clearTimeout(t); }, [q, type, department]);

  const submitEvent = async (payload) => {
    try {
      if (editItem && editItem._id) {
        const response = await API.put(`/events/${editItem._id}`, payload);
        if (response.data.success) {
          alert(response.data.message || 'Event updated successfully!');
        }
      } else {
        const response = await API.post('/events', payload);
        if (response.data.success) {
          alert(response.data.message || 'Event created successfully!');
        }
      }
      setOpen(false);
      setEditItem(null);
      fetchAll();
    } catch (e) { 
      console.error(e);
      if (e.response?.status === 403) {
        alert('Only admin, teachers, or alumni are allowed to create events.');
      } else {
        alert(e.response?.data?.message || 'An error occurred');
      }
    }
  };

  const onRegister = (id) => {
    const event = items.find(item => item._id === id);
    if (event) {
      setSelectedEvent(event);
      setRegistrationOpen(true);
    }
  };

  const handleRegistrationSubmit = async (eventId, formData) => {
    try {
      const response = await API.post(`/events/${eventId}/register`, formData);
      if (response.data.success) {
        // Close the modal first
        setRegistrationOpen(false);
        setSelectedEvent(null);
        
        // Show success message
        setTimeout(() => {
          alert('🎉 Registration Completed Successfully!\n\nYou will receive a confirmation email shortly.');
        }, 100);
        
        // Refresh the events list
        fetchAll();
        
        // If event details modal is open for the same event, trigger refresh
        if (detailsOpen && selectedEventForDetails?._id === eventId) {
          // The EventDetailsModal will automatically refresh when it detects the registration change
          // We can trigger this by updating the event object
          setSelectedEventForDetails(prev => ({ ...prev, registrants: (prev.registrants || 0) + 1 }));
        }
      }
    } catch (e) {
      console.error(e);
      
      // Close the modal first
      setRegistrationOpen(false);
      setSelectedEvent(null);
      
      // Show error message after modal closes
      setTimeout(() => {
        alert(e.response?.data?.message || 'Registration failed');
      }, 100);
      
      // Don't throw error - let the flow complete
    }
  };
  
  const onLike = async (id) => { try { await API.post(`/events/${id}/like`); fetchAll(); } catch (e) { console.error(e); } };
  const onEdit = (item) => { setEditItem(item); setOpen(true); };
  const onDelete = async (id) => { 
    if (window.confirm('Delete this event?')) { 
      try { 
        const response = await API.delete(`/events/${id}`); 
        if (response.data.success) {
          alert(response.data.message || 'Event deleted successfully!');
        }
        fetchAll(); 
      } catch (e) { 
        console.error(e);
        alert(e.response?.data?.message || 'Delete failed');
      } 
    } 
  };
  
  const onView = (item) => {
    setSelectedEventForDetails(item);
    setDetailsOpen(true);
  };

  const upcoming = useMemo(() => {
    const now = new Date();
    return items.filter((e) => new Date(e.dateTime).getTime() >= now.getTime());
  }, [items]);

  return (
    <div className="events-page">
      <div className="events-hero">
        <div className="container-narrow">
          <h1 className="events-title">Event Management</h1>
        </div>
      </div>

      <div className="container-narrow">
        {/* Floating Filter Bar */}
        <div className="filters-card">
          <div className="filter-row">
            {canSearch && (
              <>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <label className="label">Search</label>
                  <input 
                    className="input" 
                    placeholder="Search by event name" 
                    value={q} 
                    onChange={(e) => setQ(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">All</option>
                    {types.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Department</label>
                  <select className="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="">All</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </>
            )}
            {canManage && (
              <button className="btn-primary" onClick={() => setOpen(true)}>+ Add Event</button>
            )}
            {!canSearch && !canManage && (
              <div style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', width: '100%' }}>
                Login as Student to search events or as Admin/Teacher/Alumni to manage events.
              </div>
            )}
          </div>
        </div>

        {/* Events Grid */}
        <div className="cards-grid" style={{ marginTop: 10 }}>
          {loading ? (
            <div className="events-empty">Loading events...</div>
          ) : upcoming.length === 0 ? (
            <div className="events-empty">
              <h2>No upcoming events</h2>
              <p>No events are currently scheduled. Check back later!</p>
            </div>
          ) : (
            upcoming.map((item) => (
              <EventWithParticipants
                key={item._id} 
                item={item} 
                onRegister={onRegister} 
                onLike={onLike} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                canManage={canManage}
                canRegister={canRegister}
                onView={onView}
                user={user}
                showParticipants={false}
              />
            ))
          )}
        </div>

      </div>

      {/* Role-based access message for non-admin users */}
      {!canManage && user && (
        <div className="access-notice">
          <p>Only admin, teachers, or alumni are allowed to create events.</p>
        </div>
      )}

      {/* Modal for Create/Edit Event */}
      <AddEditEventModal 
        open={open} 
        onClose={() => { setOpen(false); setEditItem(null); }} 
        onSubmit={submitEvent} 
        initialData={editItem} 
      />

      {/* Registration Modal */}
      <RegistrationModal
        open={registrationOpen}
        onClose={() => { setRegistrationOpen(false); setSelectedEvent(null); }}
        onSubmit={handleRegistrationSubmit}
        event={selectedEvent}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        open={detailsOpen}
        onClose={() => { setDetailsOpen(false); setSelectedEventForDetails(null); }}
        event={selectedEventForDetails}
        user={user}
      />
    </div>
  );
}

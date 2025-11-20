import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function EventDetailsModal({ open, onClose, event, user }) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = user && user.role?.toLowerCase() === 'admin';
  const isTeacher = user && user.role?.toLowerCase() === 'teacher';
  const isAlumni = user && user.role?.toLowerCase() === 'alumni';
  const isEventCreator = isAlumni && event?.createdBy && (
    event.createdBy === user.id || 
    event.createdBy.toString() === user.id ||
    event.createdBy._id === user.id ||
    event.createdBy._id?.toString() === user.id
  );
  
  const canViewRegistrations = user && (isAdmin || isTeacher || isEventCreator);

  // Enhanced debug logging
  console.log('EventDetailsModal Debug:', {
    userRole: user?.role,
    userId: user?.id,
    eventCreatedBy: event?.createdBy,
    eventCreatedByType: typeof event?.createdBy,
    canViewRegistrations,
    isAdmin,
    isTeacher,
    isAlumni,
    isEventCreator,
    eventObject: event
  });

  useEffect(() => {
    if (open && event && canViewRegistrations) {
      fetchRegistrations();
    }
  }, [open, event, canViewRegistrations]);

  // Auto-refresh when event registrants count changes
  useEffect(() => {
    if (open && event && canViewRegistrations && event.registrants !== undefined) {
      fetchRegistrations();
    }
  }, [event?.registrants]);

  const fetchRegistrations = async () => {
    if (!event?._id) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await API.get(`/events/${event._id}/participants`);
      // Transform participants data to match existing registration format
      const transformedData = response.data.map(participant => ({
        _id: `participant_${Date.now()}_${Math.random()}`,
        student: {
          name: participant.fullName,
          email: participant.email,
          role: 'student',
          university: participant.university
        },
        registrationData: {
          name: participant.fullName,
          email: participant.email,
          phone: participant.phone,
          university: participant.university,
          year: participant.year,
          department: participant.department
        },
        registeredAt: participant.registeredAt,
        status: participant.status
      }));
      setRegistrations(transformedData);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
      if (err.response?.status === 403) {
        setError('You can only view registrations for events you created');
      } else {
        setError('Failed to load registered students');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open || !event) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatRegistrationDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="event-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Event Header */}
        <div className="event-details-header">
          <h2>{event.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Event Information */}
        <div className="event-details-content">
          <div className="event-info-section">
            <h3>Event Details</h3>
            <div className="event-info-grid">
              <div className="info-item">
                <span className="info-label">📅 Date & Time:</span>
                <span className="info-value">{formatDate(event.dateTime)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📍 Venue:</span>
                <span className="info-value">{event.venue || 'TBD'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">👤 Organizer:</span>
                <span className="info-value">{event.organizer || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">🏷️ Type:</span>
                <span className="info-value">{event.type || 'General'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">🏫 Department:</span>
                <span className="info-value">{event.department || 'All'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">👥 Registrations:</span>
                <span className="info-value">
                  {event.registrants || 0}
                  {event.maxRegistrants ? ` / ${event.maxRegistrants}` : ''}
                </span>
              </div>
            </div>
            
            {event.description && (
              <div className="event-description">
                <h4>Description</h4>
                <p>{event.description}</p>
              </div>
            )}
          </div>

          {/* Debug Section for Alumni */}
          {isAlumni && (
            <div className="debug-section" style={{ background: '#f0f9ff', padding: '12px', margin: '16px 0', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
              <h4 style={{ margin: '0 0 8px', color: '#0c4a6e' }}>Debug Info (Alumni)</h4>
              <p style={{ margin: '4px 0', fontSize: '12px', color: '#0c4a6e' }}>
                Your ID: {user?.id}<br/>
                Event Creator ID: {typeof event?.createdBy === 'object' ? event?.createdBy?._id : event?.createdBy}<br/>
                Creator Object: {JSON.stringify(event?.createdBy)}<br/>
                Can View Registrations: {canViewRegistrations ? 'YES' : 'NO'}<br/>
                Is Event Creator: {isEventCreator ? 'YES' : 'NO'}
              </p>
            </div>
          )}

          {/* Registered Students Section - For Admin/Teacher/Event Creator Alumni */}
          {canViewRegistrations && (
            <div className="registered-students-section">
              <h3>Registered Students</h3>
              {isAlumni && (
                <p className="section-note">You can view registrations for events you created.</p>
              )}
              
              {loading ? (
                <div className="loading-state">Loading registered students...</div>
              ) : error ? (
                <div className="error-state">{error}</div>
              ) : registrations.length === 0 ? (
                <div className="empty-state">
                  <p>No students have registered yet.</p>
                </div>
              ) : (
                <div className="registrations-table-container">
                  <table className="registrations-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Branch/Year</th>
                        <th>Registered At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((registration) => (
                        <tr key={registration._id}>
                          <td className="student-name">
                            {registration.student.name}
                          </td>
                          <td className="student-email">
                            {registration.student.email}
                          </td>
                          <td className="student-branch-year">
                            {registration.registrationData.department && registration.registrationData.year 
                              ? `${registration.registrationData.department} - ${registration.registrationData.year}`
                              : registration.registrationData.department || registration.registrationData.year || 'N/A'
                            }
                          </td>
                          <td className="registration-date">
                            {formatRegistrationDate(registration.registeredAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="registrations-summary">
                    <p>Total Registrations: <strong>{registrations.length}</strong></p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="event-details-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

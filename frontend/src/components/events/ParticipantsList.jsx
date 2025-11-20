import React, { useState, useEffect } from 'react';
import API from '../../api';

const ParticipantsList = React.forwardRef(({ eventId, user, isVisible = true }, ref) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user can view participants
  const canViewParticipants = user && (
    user.role?.toLowerCase() === 'admin' ||
    user.role?.toLowerCase() === 'teacher' ||
    user.role?.toLowerCase() === 'alumni'
  );

  useEffect(() => {
    if (isVisible && eventId && canViewParticipants) {
      fetchParticipants();
    }
  }, [eventId, canViewParticipants, isVisible]);

  const fetchParticipants = async () => {
    if (!eventId) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await API.get(`/events/${eventId}/participants`);
      setParticipants(response.data);
    } catch (err) {
      console.error('Failed to fetch participants:', err);
      if (err.response?.status === 403) {
        setError('You can only view participants for events you created');
      } else {
        setError('Failed to load participants');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh when new registrations come in
  const refreshParticipants = () => {
    if (canViewParticipants && eventId) {
      fetchParticipants();
    }
  };

  // Expose refresh function to parent components
  React.useImperativeHandle(ref, () => ({
    refresh: refreshParticipants
  }));

  if (!isVisible || !canViewParticipants) {
    return null;
  }

  return (
    <div className="participants-list">
      <div className="participants-header">
        <h4>Registered Participants</h4>
        <span className="participants-count">
          {participants.length} registered
        </span>
      </div>

      {loading ? (
        <div className="participants-loading">
          <div className="loading-spinner"></div>
          <span>Loading participants...</span>
        </div>
      ) : error ? (
        <div className="participants-error">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      ) : participants.length === 0 ? (
        <div className="participants-empty">
          <span className="empty-icon">👥</span>
          <span>No participants registered yet</span>
        </div>
      ) : (
        <div className="participants-grid">
          {participants.map((participant, index) => (
            <div key={index} className="participant-card">
              <div className="participant-info">
                <div className="participant-name">
                  <span className="name-icon">👤</span>
                  <strong>{participant.fullName}</strong>
                </div>
                <div className="participant-details">
                  <div className="detail-item">
                    <span className="detail-icon">📧</span>
                    <span>{participant.email}</span>
                  </div>
                  {participant.phone && (
                    <div className="detail-item">
                      <span className="detail-icon">📱</span>
                      <span>{participant.phone}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <span className="detail-icon">🏫</span>
                    <span>{participant.university}</span>
                  </div>
                  {participant.year && participant.department && (
                    <div className="detail-item">
                      <span className="detail-icon">🎓</span>
                      <span>{participant.department} - {participant.year}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="participant-status">
                <span className={`status-badge ${participant.status}`}>
                  {participant.status === 'registered' ? '✅' : '📋'} {participant.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .participants-list {
          margin-top: 20px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .participants-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #e2e8f0;
        }

        .participants-header h4 {
          margin: 0;
          color: #1e293b;
          font-size: 18px;
          font-weight: 600;
        }

        .participants-count {
          background: #3b82f6;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .participants-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: #64748b;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e2e8f0;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 12px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .participants-error {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          color: #dc2626;
          background: #fef2f2;
          border-radius: 8px;
          border: 1px solid #fecaca;
        }

        .error-icon {
          margin-right: 8px;
          font-size: 18px;
        }

        .participants-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: #64748b;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 12px;
          opacity: 0.5;
        }

        .participants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .participant-card {
          background: white;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .participant-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .participant-info {
          margin-bottom: 12px;
        }

        .participant-name {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .name-icon {
          margin-right: 8px;
          font-size: 16px;
        }

        .participant-name strong {
          color: #1e293b;
          font-size: 16px;
        }

        .participant-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #64748b;
        }

        .detail-icon {
          margin-right: 8px;
          width: 16px;
          text-align: center;
        }

        .participant-status {
          display: flex;
          justify-content: flex-end;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.registered {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.attended {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.cancelled {
          background: #fef2f2;
          color: #dc2626;
        }
      `}</style>
    </div>
  );
});

export default ParticipantsList;

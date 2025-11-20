import React, { useState, useRef } from 'react';
import EventCard from './EventCard';
import ParticipantsList from './ParticipantsList';
import API from '../../api';

export default function EventWithParticipants({ 
  item, 
  onRegister, 
  onLike, 
  onEdit, 
  onDelete, 
  canManage, 
  canRegister, 
  onView,
  user,
  showParticipants = false 
}) {
  const participantsRef = useRef();
  const eventCardRef = useRef();
  const [exactCount, setExactCount] = useState(0);

  // Check if user can view participants
  const canViewParticipants = user && (
    user.role?.toLowerCase() === 'admin' ||
    user.role?.toLowerCase() === 'teacher' ||
    (user.role?.toLowerCase() === 'alumni' && item.createdBy && (
      item.createdBy === user.id || 
      item.createdBy.toString() === user.id ||
      item.createdBy._id === user.id ||
      item.createdBy._id?.toString() === user.id
    ))
  );

  // Auto-show participants if user can view them and there are registrants
  const shouldAutoShow = canViewParticipants && (exactCount > 0);
  const [showParticipantsList, setShowParticipantsList] = useState(showParticipants || shouldAutoShow);

  // Fetch exact count from API
  const fetchExactCount = async () => {
    if (!item._id) return;
    try {
      const response = await API.get(`/events/${item._id}/count`);
      setExactCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch exact count:', error);
      setExactCount(0);
    }
  };

  // Enhanced register handler that refreshes participants
  const handleRegister = async (eventId) => {
    if (onRegister) {
      await onRegister(eventId);
      // Auto-show participants list after registration for alumni
      if (canViewParticipants) {
        setShowParticipantsList(true);
      }
      // Refresh exact count and participants list after registration
      await fetchExactCount();
      if (participantsRef.current && participantsRef.current.refresh) {
        participantsRef.current.refresh();
      }
    }
  };

  // Fetch exact count on mount
  React.useEffect(() => {
    fetchExactCount();
  }, [item._id]);

  // Auto-show participants when exact count increases
  React.useEffect(() => {
    if (canViewParticipants && exactCount > 0) {
      setShowParticipantsList(true);
    }
  }, [exactCount, canViewParticipants]);

  // Toggle participants visibility
  const toggleParticipants = () => {
    setShowParticipantsList(!showParticipantsList);
  };

  return (
    <div className="event-with-participants">
      <EventCard
        item={item}
        onRegister={handleRegister}
        onLike={onLike}
        onEdit={onEdit}
        onDelete={onDelete}
        canManage={canManage}
        canRegister={canRegister}
        onView={onView}
      />
      
      {/* Toggle Button for Alumni/Admin/Teacher */}
      {canViewParticipants && (
        <div className="participants-toggle">
          <button 
            className={`toggle-btn ${showParticipantsList ? 'active' : ''}`}
            onClick={toggleParticipants}
          >
            <span className="toggle-icon">
              {showParticipantsList ? '🔽' : '▶️'}
            </span>
            <span className="toggle-text">
              {showParticipantsList ? 'Hide' : 'Show'} Registered Participants
            </span>
            <span className="participants-count-badge">
              {exactCount}
            </span>
          </button>
        </div>
      )}

      {/* Participants List */}
      {canViewParticipants && (
        <ParticipantsList
          ref={participantsRef}
          eventId={item._id}
          user={user}
          isVisible={showParticipantsList}
        />
      )}

      <style jsx>{`
        .event-with-participants {
          margin-bottom: 24px;
        }

        .participants-toggle {
          margin-top: 12px;
          padding: 0 16px;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #475569;
        }

        .toggle-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .toggle-btn.active {
          background: #eff6ff;
          border-color: #3b82f6;
          color: #1e40af;
        }

        .toggle-icon {
          margin-right: 8px;
          font-size: 12px;
          transition: transform 0.2s ease;
        }

        .toggle-text {
          flex: 1;
          text-align: left;
        }

        .participants-count-badge {
          background: #3b82f6;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          min-width: 20px;
          text-align: center;
        }

        .toggle-btn.active .participants-count-badge {
          background: #1e40af;
        }
      `}</style>
    </div>
  );
}

import React, { useMemo, useRef, useState } from 'react';
import ExactCountBadge from './ExactCountBadge';

export default function EventCard({ item, onRegister, onLike, onEdit, onDelete, canManage, canRegister, onView, user }) {
  const countBadgeRef = useRef();
  const likeKey = `event_liked_${item._id}`;
  const [liked, setLiked] = useState(() => localStorage.getItem(likeKey) === 'true');
  const [likeCount, setLikeCount] = useState(item.likes || 0);

  const { days, hours, minutes, isPast } = useMemo(() => {
    const now = new Date();
    const dt = new Date(item.dateTime);
    const diff = dt.getTime() - now.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isPast: true };
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    return { days: d, hours: h, minutes: m, isPast: false };
  }, [item.dateTime]);

  const handleLike = async () => {
    if (liked) return; // prevent double-like without auth
    setLiked(true);
    setLikeCount(prev => prev + 1);
    localStorage.setItem(likeKey, 'true');
    try {
      await onLike(item._id);
    } catch (e) {
      // revert on error
      setLiked(false);
      setLikeCount(prev => prev - 1);
      localStorage.removeItem(likeKey);
    }
  };

  return (
    <div className="event-card">
      {item.imageUrl ? (
        <img className="event-cover" src={item.imageUrl} alt={item.title} />
      ) : (
        <div className="event-cover" />
      )}
      <div className="event-body">
        <h3 className="event-title">{item.title}</h3>
        <div className="event-meta">
          <span>{new Date(item.dateTime).toLocaleString()}</span>
          {item.venue && <span>• {item.venue}</span>}
          {item.organizer && <span>• {item.organizer}</span>}
        </div>
        <div style={{ marginBottom: 8 }}>
          {item.type && <span className="badge" style={{ marginRight: 6 }}>{item.type}</span>}
          {item.department && <span className="badge badge-gray">{item.department}</span>}
          {isPast ? (
            <span className="badge badge-gray" style={{ marginLeft: 6 }}>Completed</span>
          ) : (
            <span className="badge badge-green" style={{ marginLeft: 6 }}>Starts in {days}d {hours}h {minutes}m</span>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <ExactCountBadge
            ref={countBadgeRef}
            eventId={item._id}
            maxCount={item.maxRegistrants}
            size="small"
          />
        </div>
        {item.description && (
          <p className="event-desc">{item.description}</p>
        )}
      </div>
      <div className="event-actions">
        <div className="action-row">
          {!isPast && canRegister && (
            <button className="btn-primary btn-register" onClick={() => onRegister(item._id)}>
              🎟️ Register
            </button>
          )}
          <button className="btn-secondary btn-view" onClick={() => onView(item)}>
            👁️ Details
          </button>
          <button
            className="btn-outline btn-like"
            onClick={handleLike}
            disabled={liked}
            title={liked ? 'Already liked' : 'Like this event'}
            style={{
              opacity: liked ? 0.7 : 1,
              cursor: liked ? 'not-allowed' : 'pointer',
              color: liked ? '#6366f1' : undefined,
              fontWeight: liked ? 700 : undefined,
            }}
          >
            {liked ? '👍' : '👍'} {likeCount}
          </button>
        </div>
        {canManage && (
          <div className="action-row manage-actions">
            <button className="btn-edit" onClick={() => onEdit(item)}>✏️ Edit</button>
            <button className="btn-delete" onClick={() => onDelete(item._id)}>🗑️ Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}
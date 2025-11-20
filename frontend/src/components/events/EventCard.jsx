import React, { useMemo, useRef } from 'react';
import ExactCountBadge from './ExactCountBadge';

export default function EventCard({ item, onRegister, onLike, onEdit, onDelete, canManage, canRegister, onView }) {
  const countBadgeRef = useRef();
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
        
        {/* Exact Count Badge */}
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
              Register
            </button>
          )}
          <button className="btn-secondary btn-view" onClick={() => onView(item)}>
            View Details
          </button>
          <button className="btn-outline btn-like" onClick={() => onLike(item._id)}>
            👍 {item.likes || 0}
          </button>
        </div>
        {canManage && (
          <div className="action-row manage-actions">
            <button className="btn-edit" onClick={() => onEdit(item)}>
              ✏️ Edit
            </button>
            <button className="btn-delete" onClick={() => onDelete(item._id)}>
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

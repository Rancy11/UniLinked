import React from 'react';

export default function AchievementCard({ item, onLike, onCongrats, onEdit, onDelete, canManage }) {
  return (
    <div className="ach-card">
      <div className="ach-card-header">
        <img
          src={item.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.name)}`}
          alt={item.name}
          className="ach-avatar"
        />
        <div>
          <div className="ach-name">{item.name}</div>
          <div className="ach-sub">{item.department} • {item.year}</div>
        </div>
      </div>

      <div className="badges">
        <span className="badge badge-purple">{item.type || 'Achievement'}</span>
        <span className="badge badge-blue">{item.title}</span>
      </div>

      {item.description && (
        <p className="ach-desc">{item.description}</p>
      )}

      <div className="ach-actions">
        <div className="ach-actions-left">
          <button onClick={() => onLike(item._id)} className="btn-like">
            ❤️ Like <span className="count-pill count-like">{item.likes || 0}</span>
          </button>
          <button onClick={() => onCongrats(item._id)} className="btn-congrats">
            🎉 Congratulate <span className="count-pill count-congrats">{item.congrats || 0}</span>
          </button>
        </div>
        {canManage && (
          <div className="ach-actions-right">
            <button onClick={() => onEdit(item)} className="btn-secondary">Edit</button>
            <button onClick={() => onDelete(item._id)} className="btn-danger">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

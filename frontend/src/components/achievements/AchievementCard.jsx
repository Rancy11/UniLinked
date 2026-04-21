import React, { useState } from 'react';

export default function AchievementCard({ item, onLike, onCongrats, onEdit, onDelete, canManage }) {
  const likeKey = `ach_liked_${item._id}`;
  const congratsKey = `ach_congrats_${item._id}`;

  const [liked, setLiked] = useState(() => localStorage.getItem(likeKey) === 'true');
  const [congratulated, setCongratulated] = useState(() => localStorage.getItem(congratsKey) === 'true');

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    localStorage.setItem(likeKey, 'true');
    onLike(item._id);
  };

  const handleCongrats = () => {
    if (congratulated) return;
    setCongratulated(true);
    localStorage.setItem(congratsKey, 'true');
    onCongrats(item._id);
  };

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
          <button
            onClick={handleLike}
            className="btn-like"
            disabled={liked}
            title={liked ? 'Already liked' : 'Like'}
            style={{ opacity: liked ? 0.65 : 1, cursor: liked ? 'not-allowed' : 'pointer' }}
          >
            {liked ? '❤️' : '🤍'} Like <span className="count-pill count-like">{item.likes || 0}</span>
          </button>
          <button
            onClick={handleCongrats}
            className="btn-congrats"
            disabled={congratulated}
            title={congratulated ? 'Already congratulated' : 'Congratulate'}
            style={{ opacity: congratulated ? 0.65 : 1, cursor: congratulated ? 'not-allowed' : 'pointer' }}
          >
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
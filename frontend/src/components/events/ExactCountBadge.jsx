import React, { useState, useEffect } from 'react';
import API from '../../api';

const ExactCountBadge = React.forwardRef(({ eventId, maxCount = null, size = 'medium', onCountChange }, ref) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchExactCount = async () => {
    if (!eventId) return;
    
    try {
      const response = await API.get(`/events/${eventId}/count`);
      const exactCount = response.data.count;
      setCount(exactCount);
      if (onCountChange) {
        onCountChange(exactCount);
      }
    } catch (error) {
      console.error('Failed to fetch exact count:', error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExactCount();
  }, [eventId]);

  // Expose refresh function
  React.useImperativeHandle(ref, () => ({
    refresh: fetchExactCount
  }));

  const getVariant = () => {
    if (maxCount && count >= maxCount) return 'full';
    if (count === 0) return 'empty';
    if (count < 5) return 'low';
    if (count < 20) return 'medium';
    return 'high';
  };

  const variant = getVariant();

  if (loading) {
    return (
      <div className={`exact-count-badge loading ${size}`}>
        <span className="badge-icon">⏳</span>
        <span className="badge-text">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`exact-count-badge ${variant} ${size}`}>
      <span className="badge-icon">👥</span>
      <span className="badge-text">
        {count} Registered
        {maxCount && ` / ${maxCount}`}
      </span>
      
      <style jsx>{`
        .exact-count-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 500;
          font-size: 13px;
          border: 1px solid;
          transition: all 0.2s ease;
        }

        .exact-count-badge.small {
          padding: 4px 8px;
          font-size: 11px;
        }

        .exact-count-badge.large {
          padding: 8px 16px;
          font-size: 14px;
        }

        .badge-icon {
          margin-right: 6px;
          font-size: 14px;
        }

        .exact-count-badge.small .badge-icon {
          font-size: 12px;
          margin-right: 4px;
        }

        .exact-count-badge.large .badge-icon {
          font-size: 16px;
          margin-right: 8px;
        }

        /* Loading state */
        .exact-count-badge.loading {
          background: #f1f5f9;
          color: #64748b;
          border-color: #cbd5e1;
        }

        /* Variants */
        .exact-count-badge.empty {
          background: #f1f5f9;
          color: #64748b;
          border-color: #cbd5e1;
        }

        .exact-count-badge.low {
          background: #fef3c7;
          color: #92400e;
          border-color: #fbbf24;
        }

        .exact-count-badge.medium {
          background: #dbeafe;
          color: #1e40af;
          border-color: #3b82f6;
        }

        .exact-count-badge.high {
          background: #dcfce7;
          color: #166534;
          border-color: #22c55e;
        }

        .exact-count-badge.full {
          background: #fef2f2;
          color: #dc2626;
          border-color: #ef4444;
        }

        .exact-count-badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
});

export default ExactCountBadge;

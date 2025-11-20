import React from 'react';

export default function RegistrationBadge({ count = 0, maxCount = null, size = 'medium' }) {
  const getVariant = () => {
    if (maxCount && count >= maxCount) return 'full';
    if (count === 0) return 'empty';
    if (count < 5) return 'low';
    if (count < 20) return 'medium';
    return 'high';
  };

  const variant = getVariant();

  return (
    <div className={`registration-badge ${variant} ${size}`}>
      <span className="badge-icon">👥</span>
      <span className="badge-text">
        {count} Registered
        {maxCount && ` / ${maxCount}`}
      </span>
      
      <style jsx>{`
        .registration-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 500;
          font-size: 13px;
          border: 1px solid;
          transition: all 0.2s ease;
        }

        .registration-badge.small {
          padding: 4px 8px;
          font-size: 11px;
        }

        .registration-badge.large {
          padding: 8px 16px;
          font-size: 14px;
        }

        .badge-icon {
          margin-right: 6px;
          font-size: 14px;
        }

        .registration-badge.small .badge-icon {
          font-size: 12px;
          margin-right: 4px;
        }

        .registration-badge.large .badge-icon {
          font-size: 16px;
          margin-right: 8px;
        }

        /* Variants */
        .registration-badge.empty {
          background: #f1f5f9;
          color: #64748b;
          border-color: #cbd5e1;
        }

        .registration-badge.low {
          background: #fef3c7;
          color: #92400e;
          border-color: #fbbf24;
        }

        .registration-badge.medium {
          background: #dbeafe;
          color: #1e40af;
          border-color: #3b82f6;
        }

        .registration-badge.high {
          background: #dcfce7;
          color: #166534;
          border-color: #22c55e;
        }

        .registration-badge.full {
          background: #fef2f2;
          color: #dc2626;
          border-color: #ef4444;
        }

        .registration-badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}

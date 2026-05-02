// src/components/bookings/BookingStatusBadge.jsx
import React from 'react';

const STATUS_STYLES = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const STATUS_ICONS = {
  Pending: "⏳",
  Confirmed: "✅",
  Completed: "🎉",
  Cancelled: "❌",
};

export default function BookingStatusBadge({ status, showIcon = true }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  const icon = STATUS_ICONS[status] || "📅";

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${style}`}>
      {showIcon && <span className="text-sm">{icon}</span>}
      <span>{status}</span>
    </div>
  );
}
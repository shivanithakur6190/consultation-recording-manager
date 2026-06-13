import React from 'react';

export const SkeletonLine = ({ width = '100%', height = '1rem', className = '' }) => (
  <div className={`skeleton rounded-md ${className}`} style={{ width, height }} />
);

export const SkeletonCard = () => (
  <div className="glass rounded-2xl p-5 space-y-3">
    <div className="flex items-center justify-between">
      <SkeletonLine width="40%" height="0.9rem" />
      <SkeletonLine width="2rem" height="2rem" className="rounded-full" />
    </div>
    <SkeletonLine width="60%" height="1.8rem" />
    <SkeletonLine width="30%" height="0.8rem" />
  </div>
);

export const SkeletonTableRow = () => (
  <tr className="border-b border-gray-200 dark:border-white/5">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <SkeletonLine height="1rem" />
      </td>
    ))}
  </tr>
);

export const SkeletonRecordingCard = () => (
  <div className="glass rounded-2xl p-4 space-y-3">
    <SkeletonLine height="120px" className="rounded-xl" />
    <SkeletonLine width="70%" height="1rem" />
    <SkeletonLine width="40%" height="0.8rem" />
  </div>
);
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Edit3, Trash2, Video, Music, Sparkles } from 'lucide-react';
import { formatDate, truncate, getMediaType } from '../../utils/helpers';
import { SkeletonTableRow } from '../ui/Skeleton';

const RecordingTable = ({ recordings, loading, onDelete }) => {
  if (loading) {
    return (
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/5 text-left text-xs text-gray-500 dark:text-gray-400">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">AI Summary</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonTableRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
          <Video size={28} className="text-primary dark:text-secondary" />
        </div>
        <h3 className="font-semibold text-text-dark dark:text-textLight mb-1">
          No recordings found
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search or filters, or upload a new recording.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-200 dark:border-white/5 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Client</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">AI Summary</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {recordings.map((rec, idx) => {
            const mediaType = getMediaType(rec.recordingUrl);
            const Icon = mediaType === 'audio' ? Music : Video;
            return (
              <motion.tr
                key={rec._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="border-b border-gray-200/50 dark:border-white/5 hover:bg-gray-100/30 dark:hover:bg-white/5 transition-colors group"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary dark:text-secondary flex-shrink-0">
                      <Icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-text-dark dark:text-textLight">
                      {truncate(rec.title, 40)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                  {rec.clientName}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                  {formatDate(rec.consultationDate)}
                </td>
                <td className="py-3 px-4">
                  {rec.aiSummary ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                      <Sparkles size={11} /> Generated
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-500 font-medium">
                      Pending
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/recordings/${rec._id}`}
                      className="p-2 rounded-lg hover:bg-primary/10 text-primary dark:text-secondary transition-colors"
                      title="View"
                    >
                      <Eye size={15} />
                    </Link>
                    <Link
                      to={`/recordings/${rec._id}/edit`}
                      className="p-2 rounded-lg hover:bg-secondary/10 text-secondary transition-colors"
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </Link>
                    <button
                      onClick={() => onDelete(rec)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RecordingTable;
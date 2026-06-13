import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Music, ArrowUpRight } from 'lucide-react';
import { formatDate, truncate, getMediaType } from '../../utils/helpers';

const RecentUploads = ({ recordings = [] }) => {
  return (
    <div className="glass rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-dark dark:text-textLight">
          Recent Uploads
        </h3>
        <Link
          to="/recordings"
          className="text-xs text-primary dark:text-secondary font-medium hover:underline flex items-center gap-1"
        >
          View all <ArrowUpRight size={12} />
        </Link>
      </div>

      {recordings.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          No recordings uploaded yet.
        </p>
      ) : (
        <div className="space-y-3">
          {recordings.slice(0, 5).map((rec, idx) => {
            const mediaType = getMediaType(rec.recordingUrl);
            const Icon = mediaType === 'audio' ? Music : Video;
            return (
              <motion.div
                key={rec._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/recordings/${rec._id}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-200/40 dark:hover:bg-white/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary dark:text-secondary group-hover:scale-105 transition-transform">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-text-dark dark:text-textLight">
                      {truncate(rec.title, 35)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {rec.clientName} · {formatDate(rec.consultationDate)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentUploads;
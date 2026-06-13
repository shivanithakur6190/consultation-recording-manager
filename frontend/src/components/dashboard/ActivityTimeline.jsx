import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Edit3, Trash2 } from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

const iconMap = {
  upload: { icon: Upload, color: 'text-primary bg-primary/10' },
  summary: { icon: Sparkles, color: 'text-accent bg-accent/10' },
  edit: { icon: Edit3, color: 'text-secondary bg-secondary/10' },
  delete: { icon: Trash2, color: 'text-red-500 bg-red-500/10' },
};

const ActivityTimeline = ({ activities = [] }) => {
  return (
    <div className="glass rounded-2xl p-5 h-full">
      <h3 className="text-base font-semibold mb-4 text-text-dark dark:text-textLight">
        Activity Timeline
      </h3>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          No recent activity.
        </p>
      ) : (
        <div className="relative pl-6 space-y-5">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-300 dark:bg-white/10" />
          {activities.map((act, idx) => {
            const config = iconMap[act.type] || iconMap.upload;
            const Icon = config.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative flex items-start gap-3"
              >
                <div
                  className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center ${config.color}`}
                >
                  <Icon size={12} />
                </div>
                <div>
                  <p className="text-sm text-text-dark dark:text-textLight">
                    {act.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(act.date)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 0, label = '' }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs mb-1.5 text-gray-500 dark:text-gray-400">
          <span>{label}</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className="w-full h-2.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
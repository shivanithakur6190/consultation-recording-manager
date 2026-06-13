import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, size = 40, label = '' }) => {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        className="rounded-full border-4 border-primary/20 border-t-primary"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      {label && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-light dark:bg-background">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-10">{spinner}</div>;
};

export default Loader;
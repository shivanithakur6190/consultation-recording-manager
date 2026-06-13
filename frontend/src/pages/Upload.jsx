import React from 'react';
import { motion } from 'framer-motion';
import UploadForm from '../components/recording/UploadForm';

const Upload = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-text-dark dark:text-textLight">
          Upload Recording
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Add a new consultation recording with details and notes
        </p>
      </motion.div>

      <UploadForm />
    </div>
  );
};

export default Upload;
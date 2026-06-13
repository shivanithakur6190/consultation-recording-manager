import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Mic2 } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-background relative overflow-hidden px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong rounded-3xl p-10 text-center relative z-10 max-w-md"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow mx-auto mb-6">
          <Mic2 size={28} className="text-white" />
        </div>

        <motion.h1
          className="text-7xl font-extrabold gradient-text mb-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          404
        </motion.h1>

        <h2 className="text-xl font-semibold text-text-dark dark:text-textLight mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link to="/dashboard">
          <Button>
            <Home size={16} /> Back to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
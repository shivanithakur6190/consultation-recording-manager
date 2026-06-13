import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="px-4 lg:px-8 py-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/50 dark:border-white/5">
      <p className="flex items-center justify-center gap-1.5">
        © {new Date().getFullYear()} Consultation Recording Manager. Built with{' '}
        <Heart size={12} className="text-accent fill-accent" /> for professionals.
      </p>
    </footer>
  );
};

export default Footer;
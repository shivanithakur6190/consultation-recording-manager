import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, trend, trendUp, gradient }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 relative overflow-hidden group"
    >
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${gradient} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}
      />
      <div className="flex items-center justify-between mb-3 relative z-10">
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <div className={`p-2.5 rounded-xl ${gradient} bg-opacity-20`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-text-dark dark:text-textLight relative z-10">
        {value}
      </h3>
      {trend && (
        <p
          className={`text-xs mt-2 font-medium ${
            trendUp ? 'text-emerald-500' : 'text-red-500'
          } relative z-10`}
        >
          {trendUp ? '↑' : '↓'} {trend}
        </p>
      )}
    </motion.div>
  );
};

export default StatsCard;
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const UploadsAreaChart = ({ data }) => {
  return (
    <div className="glass rounded-2xl p-5 h-full">
      <h3 className="text-base font-semibold mb-4 text-text-dark dark:text-textLight">
        Uploads Over Time
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
          <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: '#1E293B',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#F8FAFC',
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="url(#colorUploads)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const COLORS = ['#6D28D9', '#8B5CF6', '#EC4899', '#06B6D4'];

export const ClientsPieChart = ({ data }) => {
  return (
    <div className="glass rounded-2xl p-5 h-full">
      <h3 className="text-base font-semibold mb-4 text-text-dark dark:text-textLight">
        Recordings by Client
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={85}
            innerRadius={50}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: '#1E293B',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#F8FAFC',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
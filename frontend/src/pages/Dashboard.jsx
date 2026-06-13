import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Users, Sparkles, Clock } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import { UploadsAreaChart, ClientsPieChart } from '../components/dashboard/AnalyticsChart';
import RecentUploads from '../components/dashboard/RecentUploads';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import { SkeletonCard } from '../components/ui/Skeleton';
import { getRecordings } from '../services/recordingService';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRecordings({ limit: 100 });
        setRecordings(res.data || []);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derived stats
  const totalRecordings = recordings.length;
  const uniqueClients = new Set(recordings.map((r) => r.clientName)).size;
  const summarized = recordings.filter((r) => r.aiSummary).length;

  // Uploads over time (group by month)
  const uploadsByMonth = {};
  recordings.forEach((r) => {
    const month = new Date(r.createdAt).toLocaleString('default', {
      month: 'short',
      year: '2-digit',
    });
    uploadsByMonth[month] = (uploadsByMonth[month] || 0) + 1;
  });
  const areaChartData = Object.entries(uploadsByMonth)
    .map(([name, count]) => ({ name, count }))
    .slice(-6);

  // Recordings by client (top 4)
  const clientCounts = {};
  recordings.forEach((r) => {
    clientCounts[r.clientName] = (clientCounts[r.clientName] || 0) + 1;
  });
  const pieChartData = Object.entries(clientCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);

  // Mock activity timeline based on recordings
  const activities = recordings
    .slice(0, 6)
    .map((r) => ({
      type: r.aiSummary ? 'summary' : 'upload',
      message: r.aiSummary
        ? `AI summary generated for "${r.title}"`
        : `New recording "${r.title}" uploaded for ${r.clientName}`,
      date: r.createdAt,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-dark dark:text-textLight">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Overview of your consultation recordings
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Recordings"
            value={totalRecordings}
            icon={Video}
            gradient="bg-primary"
          />
          <StatsCard
            title="Unique Clients"
            value={uniqueClients}
            icon={Users}
            gradient="bg-secondary"
          />
          <StatsCard
            title="AI Summaries"
            value={summarized}
            icon={Sparkles}
            gradient="bg-accent"
          />
          <StatsCard
            title="Pending Summaries"
            value={totalRecordings - summarized}
            icon={Clock}
            gradient="bg-emerald-500"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <UploadsAreaChart data={areaChartData} />
        </div>
        <div>
          <ClientsPieChart data={pieChartData} />
        </div>
      </div>

      {/* Recent Uploads & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentUploads recordings={recordings} />
        <ActivityTimeline activities={activities} />
      </div>
    </div>
  );
};

export default Dashboard;
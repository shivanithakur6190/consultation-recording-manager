import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import RecordingTable from '../components/recording/RecordingTable';
import { getRecordings, deleteRecording } from '../services/recordingService';

const RecordingList = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: '',
    clientName: '',
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchRecordings = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (filters.title) params.title = filters.title;
      if (filters.clientName) params.clientName = filters.clientName;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await getRecordings(params);
      setRecordings(res.data || []);
      setPagination({ page: res.page, totalPages: res.totalPages, total: res.total });
    } catch (err) {
      toast.error('Failed to fetch recordings');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchRecordings(1);
    }, 400);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRecording(deleteTarget._id);
      toast.success('Recording deleted successfully');
      setDeleteTarget(null);
      fetchRecordings(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete recording');
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setFilters({ title: '', clientName: '', startDate: '', endDate: '' });
  };

  const hasActiveFilters =
    filters.title || filters.clientName || filters.startDate || filters.endDate;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-text-dark dark:text-textLight">
            Recordings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {pagination.total} total recording{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/upload">
          <Button>
            <Plus size={16} /> New Recording
          </Button>
        </Link>
      </motion.div>

      {/* Search & Filters */}
      <div className="glass rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by title..."
              value={filters.title}
              onChange={(e) => setFilters({ ...filters, title: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by client name..."
              value={filters.clientName}
              onChange={(e) => setFilters({ ...filters, clientName: e.target.value })}
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            onClick={() => setShowFilters((prev) => !prev)}
            className="whitespace-nowrap"
          >
            <SlidersHorizontal size={16} /> Filters
          </Button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-200 dark:border-white/5"
          >
            <Input
              label="From Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              label="To Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
            {hasActiveFilters && (
              <div className="flex items-end">
                <Button variant="ghost" onClick={clearFilters} size="md">
                  <X size={16} /> Clear All Filters
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Table */}
      <RecordingTable
        recordings={recordings}
        loading={loading}
        onDelete={(rec) => setDeleteTarget(rec)}
      />

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchRecordings(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                p === pagination.page
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                  : 'glass hover:bg-gray-200/50 dark:hover:bg-white/10'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Recording"
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-text-dark dark:text-textLight">
            "{deleteTarget?.title}"
          </span>
          ? This action cannot be undone and the file will be permanently removed.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RecordingList;
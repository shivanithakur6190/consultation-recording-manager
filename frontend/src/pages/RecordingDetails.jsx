import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Sparkles,
  Calendar,
  User,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Loader from '../components/ui/Loader';
import MediaPlayer from '../components/recording/MediaPlayer';
import {
  getRecordingById,
  deleteRecording,
  generateSummary,
} from '../services/recordingService';
import { formatDate, formatDateTime } from '../utils/helpers';

const RecordingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchRecording = async () => {
    setLoading(true);
    try {
      const res = await getRecordingById(id);
      setRecording(res.data);
    } catch (err) {
      toast.error('Recording not found');
      navigate('/recordings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleGenerateSummary = async () => {
    setGenerating(true);
    try {
      const res = await generateSummary(id);
      setRecording((prev) => ({ ...prev, aiSummary: res.data.aiSummary }));
      toast.success('AI summary generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteRecording(id);
      toast.success('Recording deleted successfully');
      navigate('/recordings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete recording');
      setDeleting(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading recording..." />;
  if (!recording) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Link
          to="/recordings"
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-secondary transition-colors"
        >
          <ArrowLeft size={16} /> Back to Recordings
        </Link>
        <div className="flex gap-2">
          <Link to={`/recordings/${id}/edit`}>
            <Button variant="secondary" size="sm">
              <Edit3 size={15} /> Edit
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => setDeleteModal(true)}>
            <Trash2 size={15} /> Delete
          </Button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <h1 className="text-2xl font-bold text-text-dark dark:text-textLight">
          {recording.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <User size={14} /> {recording.clientName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {formatDate(recording.consultationDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <FileText size={14} /> Uploaded {formatDateTime(recording.createdAt)}
          </span>
        </div>
      </motion.div>

      {/* Media Player */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <MediaPlayer url={recording.recordingUrl} title={recording.title} />
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-5"
      >
        <h3 className="text-base font-semibold mb-3 text-text-dark dark:text-textLight">
          Notes / Transcript
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {recording.notes || 'No notes added for this recording.'}
        </p>
      </motion.div>

      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold flex items-center gap-2 text-text-dark dark:text-textLight">
            <Sparkles size={18} className="text-accent" /> AI Summary
          </h3>
          <Button
            size="sm"
            onClick={handleGenerateSummary}
            isLoading={generating}
            disabled={!recording.notes}
          >
            <Sparkles size={14} />
            {recording.aiSummary ? 'Regenerate' : 'Generate Summary'}
          </Button>
        </div>

        {!recording.notes && (
          <p className="text-xs text-amber-500 mb-2">
            Add notes/transcript to this recording to enable AI summary generation.
          </p>
        )}

        {recording.aiSummary ? (
          <div className="rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 p-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {recording.aiSummary}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No AI summary generated yet. Click "Generate Summary" to create one using Gemini AI.
          </p>
        )}
      </motion.div>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Recording">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-text-dark dark:text-textLight">
            "{recording.title}"
          </span>
          ? This action is permanent.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
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

export default RecordingDetails;
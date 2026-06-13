import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Type, User, Calendar, FileText, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { getRecordingById, updateRecording } from '../services/recordingService';

const EditRecording = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    consultationDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRecording = async () => {
      try {
        const res = await getRecordingById(id);
        const rec = res.data;
        setFormData({
          title: rec.title,
          clientName: rec.clientName,
          consultationDate: new Date(rec.consultationDate).toISOString().split('T')[0],
          notes: rec.notes || '',
        });
      } catch (err) {
        toast.error('Recording not found');
        navigate('/recordings');
      } finally {
        setLoading(false);
      }
    };
    fetchRecording();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.clientName) newErrors.clientName = 'Client name is required';
    if (!formData.consultationDate)
      newErrors.consultationDate = 'Consultation date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await updateRecording(id, formData);
      toast.success('Recording updated successfully!');
      navigate(`/recordings/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update recording');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading recording..." />;

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to={`/recordings/${id}`}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-secondary transition-colors mb-2"
        >
          <ArrowLeft size={16} /> Back to Details
        </Link>
        <h1 className="text-2xl font-bold text-text-dark dark:text-textLight">
          Edit Recording
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Update the recording details and notes
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Recording Title"
            icon={Type}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
          />
          <Input
            label="Client Name"
            icon={User}
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            error={errors.clientName}
          />
        </div>

        <Input
          label="Consultation Date"
          type="date"
          icon={Calendar}
          value={formData.consultationDate}
          onChange={(e) =>
            setFormData({ ...formData, consultationDate: e.target.value })
          }
          error={errors.consultationDate}
        />

        <div className="w-full">
          <label className="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-300">
            Notes / Transcript
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <FileText size={18} />
            </div>
            <textarea
              rows={6}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 text-text-dark dark:text-textLight placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link to={`/recordings/${id}`}>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={saving}>
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default EditRecording;
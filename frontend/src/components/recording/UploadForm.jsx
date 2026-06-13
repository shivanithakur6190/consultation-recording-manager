import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, FileText, Type } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import DropZone from './DropZone';
import { createRecording } from '../../services/recordingService';

const UploadForm = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    consultationDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.clientName) newErrors.clientName = 'Client name is required';
    if (!formData.consultationDate)
      newErrors.consultationDate = 'Consultation date is required';
    if (!file) newErrors.file = 'Please select a recording file';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      if (!file) toast.error('Please select a recording file');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('clientName', formData.clientName);
    data.append('consultationDate', formData.consultationDate);
    data.append('notes', formData.notes);
    data.append('recording', file);

    setUploading(true);
    setProgress(0);
    try {
      const res = await createRecording(data, setProgress);
      toast.success('Recording uploaded successfully!');
      navigate(`/recordings/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="glass rounded-2xl p-6 space-y-5 max-w-3xl"
    >
      <DropZone file={file} setFile={setFile} />
      {errors.file && !file && (
        <p className="text-xs text-red-500 -mt-2">{errors.file}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Recording Title"
          icon={Type}
          placeholder="e.g. Initial Consultation - Q3 Review"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
        />
        <Input
          label="Client Name"
          icon={User}
          placeholder="e.g. Acme Corp"
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
          Notes / Transcript (used for AI Summary)
        </label>
        <div className="relative">
          <div className="absolute left-3 top-3 text-gray-400">
            <FileText size={18} />
          </div>
          <textarea
            rows={5}
            placeholder="Add notes, transcript, or discussion points here..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-300 dark:border-white/10 text-text-dark dark:text-textLight placeholder:text-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none"
          />
        </div>
      </div>

      {uploading && <ProgressBar progress={progress} label="Uploading recording..." />}

      <Button type="submit" className="w-full" isLoading={uploading} size="lg">
        Upload Recording
      </Button>
    </motion.form>
  );
};

export default UploadForm;
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, FileVideo, X } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';

const DropZone = ({ file, setFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e, dragState) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragState);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!file ? (
        <motion.div
          onDragEnter={(e) => handleDrag(e, true)}
          onDragOver={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragging
                ? 'border-primary bg-primary/10 scale-[1.02]'
                : 'border-gray-300 dark:border-white/10 hover:border-primary/50 hover:bg-gray-100/30 dark:hover:bg-white/5'
            }
          `}
        >
          <motion.div
            animate={{ y: isDragging ? -5 : 0 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <UploadCloud size={28} className="text-primary dark:text-secondary" />
            </div>
            <div>
              <p className="font-medium text-text-dark dark:text-textLight">
                Drag & drop your recording here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                or click to browse — MP4, MP3, WAV, WEBM (max 200MB)
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary dark:text-secondary flex-shrink-0">
            <FileVideo size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-text-dark dark:text-textLight">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(file.size)} · {file.type || 'unknown type'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default DropZone;
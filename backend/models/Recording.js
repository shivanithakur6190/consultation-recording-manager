const mongoose = require('mongoose');

const recordingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      maxlength: [150, 'Client name cannot exceed 150 characters'],
      index: true,
    },
    consultationDate: {
      type: Date,
      required: [true, 'Consultation date is required'],
      index: true,
    },
    recordingUrl: {
      type: String,
      required: [true, 'Recording URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    resourceType: {
      type: String,
      enum: ['video', 'audio', 'raw'],
      default: 'video',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
      maxlength: [5000, 'Notes cannot exceed 5000 characters'],
    },
    aiSummary: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

// Text index for title and client name search
recordingSchema.index({ title: 'text', clientName: 'text' });

module.exports = mongoose.model('Recording', recordingSchema);
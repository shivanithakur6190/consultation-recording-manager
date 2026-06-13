const Recording = require('../models/Recording');
const asyncHandler = require('../utils/asyncHandler');
const {
  uploadToCloudinary,
  deleteFromCloudinary,
  getResourceType,
} = require('../services/cloudinaryService');
const { generateAISummary } = require('../services/geminiService');
const {
  validateCreateRecording,
  validateUpdateRecording,
} = require('../validations/recordingValidation');

/**
 * @desc    Upload & create a new recording
 * @route   POST /api/recordings
 * @access  Private
 */
const createRecording = asyncHandler(async (req, res) => {
  const { error, value } = validateCreateRecording(req.body);

  if (error) {
    res.status(400);
    throw new Error(error.details.map((d) => d.message).join(', '));
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Recording file is required');
  }

  const { title, clientName, consultationDate, notes } = value;

  // Upload to Cloudinary
  const uploadResult = await uploadToCloudinary(req.file.buffer, req.file.mimetype);

  const recording = await Recording.create({
    title,
    clientName,
    consultationDate,
    notes: notes || '',
    recordingUrl: uploadResult.secure_url,
    cloudinaryPublicId: uploadResult.public_id,
    resourceType: uploadResult.resource_type,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Recording uploaded successfully',
    data: recording,
  });
});

/**
 * @desc    Get all recordings (with search & filter)
 * @route   GET /api/recordings
 * @access  Private
 * Query params:
 *   - title (string)         => search by title (partial, case-insensitive)
 *   - clientName (string)    => search by client name (partial, case-insensitive)
 *   - startDate (ISO date)   => filter consultationDate >= startDate
 *   - endDate (ISO date)     => filter consultationDate <= endDate
 *   - page (number)          => pagination page number (default 1)
 *   - limit (number)         => results per page (default 10)
 */
const getRecordings = asyncHandler(async (req, res) => {
  const { title, clientName, startDate, endDate, page = 1, limit = 10 } = req.query;

  const query = { createdBy: req.user._id };

  if (title) {
    query.title = { $regex: title, $options: 'i' };
  }

  if (clientName) {
    query.clientName = { $regex: clientName, $options: 'i' };
  }

  if (startDate || endDate) {
    query.consultationDate = {};
    if (startDate) {
      query.consultationDate.$gte = new Date(startDate);
    }
    if (endDate) {
      query.consultationDate.$lte = new Date(endDate);
    }
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const [recordings, total] = await Promise.all([
    Recording.find(query)
      .sort({ consultationDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Recording.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: recordings.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    data: recordings,
  });
});

/**
 * @desc    Get single recording by ID
 * @route   GET /api/recordings/:id
 * @access  Private
 */
const getRecordingById = asyncHandler(async (req, res) => {
  const recording = await Recording.findById(req.params.id);

  if (!recording) {
    res.status(404);
    throw new Error('Recording not found');
  }

  if (recording.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this recording');
  }

  res.status(200).json({
    success: true,
    data: recording,
  });
});

/**
 * @desc    Update recording details (title, clientName, date, notes, aiSummary)
 * @route   PUT /api/recordings/:id
 * @access  Private
 */
const updateRecording = asyncHandler(async (req, res) => {
  const { error, value } = validateUpdateRecording(req.body);

  if (error) {
    res.status(400);
    throw new Error(error.details.map((d) => d.message).join(', '));
  }

  const recording = await Recording.findById(req.params.id);

  if (!recording) {
    res.status(404);
    throw new Error('Recording not found');
  }

  if (recording.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this recording');
  }

  Object.keys(value).forEach((key) => {
    recording[key] = value[key];
  });

  await recording.save();

  res.status(200).json({
    success: true,
    message: 'Recording updated successfully',
    data: recording,
  });
});

/**
 * @desc    Delete a recording (and its Cloudinary file)
 * @route   DELETE /api/recordings/:id
 * @access  Private
 */
const deleteRecording = asyncHandler(async (req, res) => {
  const recording = await Recording.findById(req.params.id);

  if (!recording) {
    res.status(404);
    throw new Error('Recording not found');
  }

  if (recording.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this recording');
  }

  // Delete file from Cloudinary
  try {
    await deleteFromCloudinary(recording.cloudinaryPublicId, recording.resourceType);
  } catch (err) {
    console.error('Failed to delete file from Cloudinary:', err.message);
    // Continue with DB deletion even if Cloudinary deletion fails
  }

  await recording.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Recording deleted successfully',
  });
});

/**
 * @desc    Generate AI summary for a recording using Gemini (based on notes)
 * @route   POST /api/recordings/:id/summary
 * @access  Private
 */
// const generateSummary = asyncHandler(async (req, res) => {
//   const recording = await Recording.findById(req.params.id);

//   if (!recording) {
//     res.status(404);
//     throw new Error('Recording not found');
//   }

//   if (recording.createdBy.toString() !== req.user._id.toString()) {
//     res.status(403);
//     throw new Error('Not authorized to access this recording');
//   }

//   const summary = await generateAISummary({
//     title: recording.title,
//     clientName: recording.clientName,
//     notes: recording.notes,
//   });

//   recording.aiSummary = summary;
//   await recording.save();

//   res.status(200).json({
//     success: true,
//     message: 'AI summary generated successfully',
//     data: {
//       _id: recording._id,
//       aiSummary: recording.aiSummary,
//     },
//   });
// });

const generateSummary = asyncHandler(async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);

    if (!recording) {
      res.status(404);
      throw new Error('Recording not found');
    }

    if (recording.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this recording');
    }

    console.log("👉 Notes length:", recording.notes?.length);

    const summary = await generateAISummary({
      title: recording.title,
      clientName: recording.clientName,
      notes: recording.notes,
    });

    recording.aiSummary = summary;
    await recording.save();

    res.status(200).json({
      success: true,
      message: 'AI summary generated successfully',
      data: {
        _id: recording._id,
        aiSummary: recording.aiSummary,
      },
    });

  } catch (error) {
    console.error("❌ GENERATE SUMMARY CONTROLLER ERROR:");
    console.error(error);
    throw error;
  }
});

module.exports = {
  createRecording,
  getRecordings,
  getRecordingById,
  updateRecording,
  deleteRecording,
  generateSummary,
};
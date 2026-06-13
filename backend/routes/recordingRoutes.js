const express = require('express');
const router = express.Router();
const {
  createRecording,
  getRecordings,
  getRecordingById,
  updateRecording,
  deleteRecording,
  generateSummary,
} = require('../controllers/recordingController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes below are protected
router.use(protect);

// @route   POST /api/recordings        - Upload & create recording
// @route   GET  /api/recordings        - Get all recordings (search/filter/pagination)
router
  .route('/')
  .post(upload.single('recording'), createRecording)
  .get(getRecordings);

// @route   POST /api/recordings/:id/summary - Generate AI summary
router.post('/:id/summary', generateSummary);

// @route   GET    /api/recordings/:id  - Get recording by ID
// @route   PUT    /api/recordings/:id  - Update recording
// @route   DELETE /api/recordings/:id  - Delete recording
router
  .route('/:id')
  .get(getRecordingById)
  .put(updateRecording)
  .delete(deleteRecording);

module.exports = router;
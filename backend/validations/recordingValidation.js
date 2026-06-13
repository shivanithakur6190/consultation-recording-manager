const Joi = require('joi');

const createRecordingSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    'string.empty': 'Title is required',
    'string.max': 'Title cannot exceed 200 characters',
  }),
  clientName: Joi.string().trim().min(1).max(150).required().messages({
    'string.empty': 'Client name is required',
    'string.max': 'Client name cannot exceed 150 characters',
  }),
  consultationDate: Joi.date().iso().required().messages({
    'date.base': 'Consultation date must be a valid date',
    'any.required': 'Consultation date is required',
  }),
  notes: Joi.string().trim().max(5000).allow('').optional(),
});

const updateRecordingSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  clientName: Joi.string().trim().min(1).max(150).optional(),
  consultationDate: Joi.date().iso().optional(),
  notes: Joi.string().trim().max(5000).allow('').optional(),
  aiSummary: Joi.string().trim().allow('').optional(),
}).min(1);

const validateCreateRecording = (data) =>
  createRecordingSchema.validate(data, { abortEarly: false });

const validateUpdateRecording = (data) =>
  updateRecordingSchema.validate(data, { abortEarly: false });

module.exports = {
  validateCreateRecording,
  validateUpdateRecording,
};
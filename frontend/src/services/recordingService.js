import api from './api';

export const getRecordings = async (params = {}) => {
  const response = await api.get('/recordings', { params });
  return response.data;
};

export const getRecordingById = async (id) => {
  const response = await api.get(`/recordings/${id}`);
  return response.data;
};

export const createRecording = async (formData, onUploadProgress) => {
  const response = await api.post('/recordings', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        onUploadProgress(percent);
      }
    },
  });
  return response.data;
};

export const updateRecording = async (id, data) => {
  const response = await api.put(`/recordings/${id}`, data);
  return response.data;
};

export const deleteRecording = async (id) => {
  const response = await api.delete(`/recordings/${id}`);
  return response.data;
};

export const generateSummary = async (id) => {
  const response = await api.post(`/recordings/${id}/summary`);
  return response.data;
};
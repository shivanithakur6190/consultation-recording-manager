const cloudinary = require('../config/cloudinary');

/**
 * Determine Cloudinary resource_type based on mimetype
 * @param {string} mimetype
 * @returns {'video' | 'raw'}
 */
const getResourceType = (mimetype) => {
  if (mimetype.startsWith('video/') || mimetype.startsWith('audio/')) {
    return 'video'; // Cloudinary treats audio under 'video' resource type
  }
  return 'raw';
};

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer
 * @param {string} mimetype
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<{secure_url: string, public_id: string, resource_type: string}>}
 */
const uploadToCloudinary = (fileBuffer, mimetype, folder = 'consultation-recordings') => {
  return new Promise((resolve, reject) => {
    const resourceType = getResourceType(mimetype);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        chunk_size: 6 * 1024 * 1024, // 6 MB chunks for large files
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete a file from Cloudinary by public_id
 * @param {string} publicId
 * @param {string} resourceType - 'video' | 'raw' | 'image'
 */
const deleteFromCloudinary = async (publicId, resourceType = 'video') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error.message);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getResourceType,
};
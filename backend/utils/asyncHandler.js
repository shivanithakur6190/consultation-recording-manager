/**
 * Wraps an async route handler and forwards errors to Express error middleware
 * Avoids repetitive try/catch blocks in controllers
 * @param {Function} fn - async (req, res, next) => {}
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
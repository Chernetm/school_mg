// lib/api-error.js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.message = message; // Store the message in the instance
    this.name = 'ApiError';
  }
}

module.exports = ApiError;

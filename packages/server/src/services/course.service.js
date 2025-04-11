const httpStatus = require('http-status');
const { Course } = require('../models');
const ApiError = require('../utils/ApiError');
const { decrypt } = require('../utils/cryptoUtils');
const config = require('../config/config');
const { deleteTemplateById } = require('./template.service');
const { deleteDocumentById } = require('./document.service');

/**
 * Create a course
 * @param {Object} courseBody
 * @returns {Promise<Course>}
 */
const createCourse = async (courseBody) => {
  return await Course.create(courseBody);
};

/**
 * Query for courses
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCourses = async (filter, options) => {
  const courses = await Course.paginate(filter, options);
  return courses;
};

/**
 * Get course by id
 * @param {ObjectId} id
 * @returns {Promise<Course>}
 */
const getCourseById = async (id) => {
  const course = await Course.findById(id).populate({
    path: 'tutorialGroups',
    populate: { path: 'students', select: 'name email' },
  });
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  return course;
};

/**
 * Get API key by course id and model
 * @param {ObjectId} courseId - The ID of the course
 * @param {string} model - The model being used (e.g., "chatgpt", "gemini", "llama3")
 * @returns {Promise<{ course: Course, apiKey: string }>}
 */
const getApiKeyById = async (courseId, model) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Ensure API keys are stored in an object format, e.g.,
  // { openai: "encrypted-key", gemini: "encrypted-key", llama3: "encrypted-key" }
  if (!course.apiKeys || typeof course.apiKeys !== 'object') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid API key structure');
  }

  // Retrieve the encrypted API key for the requested model
  const encryptedApiKey = course.apiKeys[model];

  if (!encryptedApiKey) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `No API key found for model: ${model}`,
    );
  }

  // Decrypt the API key
  const apiKey = decrypt(encryptedApiKey, config.encryption.key);

  return { course, apiKey };
};

/**
 * Update course by id
 * @param {ObjectId} courseId
 * @param {Object} updateBody
 * @returns {Promise<Course>}
 */
const updateCourseById = async (courseId, updateBody) => {
  const course = await Course.findByIdAndUpdate(
    courseId,
    { $set: updateBody }, // Use $set to update only the provided fields
    { new: true }, // Return the updated document
  );

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  return course;
};

/**
 * Delete course by id
 * @param {ObjectId} courseId
 * @returns {Promise<Course>}
 */
const deleteCourseById = async (courseId) => {
  const course = await getCourseById(courseId);

  // Delete all templates associated with the course
  if (course.templates.length > 0) {
    await Promise.all(
      course.templates.map((templateId) =>
        deleteTemplateById(courseId, templateId),
      ),
    );
  }

  // Delete all documents associated with the course
  if (course.documents.length > 0) {
    await Promise.all(
      course.documents.map((documentId) =>
        deleteDocumentById(courseId, documentId),
      ),
    );
  }
  await course.remove();
  return course;
};

/**
 * Get course by whitelisted email
 * @param {string} email
 * @returns {Promise<Course>}
 */
const getCourseByEmail = async (email) => {
  return await Course.findOne({ whitelist: email });
};

module.exports = {
  createCourse,
  queryCourses,
  getCourseById,
  getApiKeyById,
  updateCourseById,
  deleteCourseById,
  getCourseByEmail,
};

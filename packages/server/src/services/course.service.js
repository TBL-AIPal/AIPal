const httpStatus = require('http-status');
const { Course, Template, Document } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a course
 * @param {Object} courseBody
 * @returns {Promise<Course>}
 */
const createCourse = async (courseBody) => {
  return Course.create(courseBody);
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
  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }
  return course;
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
    { new: true } // Return the updated document
  );

  if (!course) {
    throw new Error('Course not found');
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
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Delete all templates associated with the course
  if (course.templates.length > 0) {
    await Template.deleteMany({ _id: { $in: course.templates } });
  }

  // Delete all documents associated with the course
  if (course.documents.length > 0) {
    await Document.deleteMany({ _id: { $in: course.documents } });
  }

  await course.remove();
  return course;
};

module.exports = {
  createCourse,
  queryCourses,
  getCourseById,
  updateCourseById,
  deleteCourseById,
};

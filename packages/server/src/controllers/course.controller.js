const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { courseService } = require('../services');
const config = require('../config/config');
const { encrypt } = require('../utils/cryptoUtils');
const Course = require('../models/course.model');
const User = require('../models/user.model'); // Assuming you have a User model

const createCourse = catchAsync(async (req, res) => {
  const courseData = {
    ...req.body,
    owner: req.user.id,
  };

  // Encrypt API keys if provided
  if (courseData.apiKeys) {
    courseData.apiKeys = {
      gemini: courseData.apiKeys.gemini
        ? encrypt(courseData.apiKeys.gemini, config.encryption.key)
        : '',
      llama: courseData.apiKeys.llama
        ? encrypt(courseData.apiKeys.llama, config.encryption.key)
        : '',
      chatgpt: courseData.apiKeys.chatgpt
        ? encrypt(courseData.apiKeys.chatgpt, config.encryption.key)
        : '',
    };
  }

  const course = await courseService.createCourse(courseData);
  res.status(httpStatus.CREATED).json(course);
});

const getCourses = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin'; // Check if the user is an admin

  // ✅ Block users if their status is not approved
  if (!isAdmin && req.user.status !== 'approved') {
    return res
      .status(403)
      .json({ message: 'Your account is not approved to access courses.' });
  }

  let filter = {};
  if (!isAdmin) {
    filter = {
      $or: [{ owner: userId }, { students: userId }, { staff: userId }],
    };
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await courseService.queryCourses(filter, options);

  // ✅ Ensure result is valid
  if (!result || !result.results) {
    return res.status(404).json({ message: 'No courses found' });
  }

  // ✅ Ensure courses array is valid
  const coursesArray = Array.isArray(result.results) ? result.results : [];

  const courses = coursesArray.map((course) => ({
    id: course._id || '',
    name: course.name || 'Unnamed Course',
    description: course.description || '',
    owner: course.owner || null,
  }));

  res.send({ results: courses, totalResults: result.totalResults || 0 });
});

const getCourse = catchAsync(async (req, res) => {
  const course = await courseService.getCourseById(req.params.courseId);
  res.send(course);
});

const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const updateData = { ...req.body };

  const existingCourse = await Course.findById(courseId);
  if (!existingCourse) {
    throw new Error('Course not found');
  }

  // Encrypt API keys if provided in the request body
  if (updateData.apiKeys) {
    updateData.apiKeys = {
      gemini: updateData.apiKeys.gemini
        ? encrypt(updateData.apiKeys.gemini, config.encryption.key)
        : existingCourse.apiKeys.gemini,
      llama: updateData.apiKeys.llama
        ? encrypt(updateData.apiKeys.llama, config.encryption.key)
        : existingCourse.apiKeys.llama,
      chatgpt: updateData.apiKeys.chatgpt
        ? encrypt(updateData.apiKeys.chatgpt, config.encryption.key)
        : existingCourse.apiKeys.chatgpt,
    };
  }

  const course = await courseService.updateCourseById(courseId, updateData);
  res.send(course);
});

const deleteCourse = catchAsync(async (req, res) => {
  await courseService.deleteCourseById(req.params.courseId);
  res.status(httpStatus.NO_CONTENT).send();
});

// Add a user to the course
const addUserToCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { userId } = req.body; // The ID of the user to add

  // Find the course by courseId
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Ensure the user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Add user to the course's students array
  if (!course.students.includes(userId) && user.role === 'student') {
    course.students.push(userId); // Add user to students
  } else if (!course.staff.includes(userId) && user.role === 'teacher') {
    course.staff.push(userId); // Add user to staff
  } else {
    return res
      .status(400)
      .json({ message: 'User is already part of the course' });
  }

  await course.save(); // Save the updated course

  // Respond with the updated course
  res.status(200).json(course);
});

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  addUserToCourse,
};

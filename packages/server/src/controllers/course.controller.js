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

  courseData.apiKey = encrypt(courseData.apiKey, config.encryption.key);

  const course = await courseService.createCourse(courseData);
  res.status(httpStatus.CREATED).send(course);
});

const getCourses = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === 'admin'; // Check if the user is an admin

  let filter = {};
  if (!isAdmin) {
    // If not an admin, filter by user courses and ensure the user is approved
    filter = {
      $or: [
        { owner: userId },
        { students: userId, "students.status": "approved" }, // Only approved students
        { staff: userId, "staff.status": "approved" }, // Only approved staff
      ],
    };
  }

  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await courseService.queryCourses(filter, options);

  const courses = result.results.map((course) => ({
    id: course._id,
    name: course.name,
    description: course.description,
    owner: course.owner,
  }));

  res.send({ results: courses, ...result });
});

const getCourse = catchAsync(async (req, res) => {
  const course = await courseService.getCourseById(req.params.courseId);
  res.send(course);
});

const updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const updateData = { ...req.body };

  // Encrypt the API key if it exists in the request body
  if (updateData.apiKey) {
    updateData.apiKey = encrypt(updateData.apiKey, config.encryption.key);
  }

  const course = await courseService.updateCourseById(courseId, updateData);
  res.send(course);
});

const deleteCourse = catchAsync(async (req, res) => {
  await courseService.deleteCourseById(req.params.courseId);
  res.status(httpStatus.NO_CONTENT).send();
});

// Add a user to the course
const addUserToCourse = async (req, res) => {
  try {
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
    if (!course.students.includes(userId) && user.role === "student") {
      course.students.push(userId); // Add user to students
      await course.save(); // Save the updated course
    } else if (!course.staff.includes(userId) && user.role === "teacher") {
      course.staff.push(userId); // Add user to staff
      await course.save(); // Save the updated course
    }

    // Respond with the updated course
    return res.status(200).json(course);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  addUserToCourse,
};

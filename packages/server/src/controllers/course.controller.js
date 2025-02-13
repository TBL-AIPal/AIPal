const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { courseService } = require('../services');
const config = require('../config/config');
const { encrypt } = require('../utils/cryptoUtils');

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
  const filter = {
    $or: [{ owner: userId }, { students: userId }, { staff: userId }],
  };

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

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};

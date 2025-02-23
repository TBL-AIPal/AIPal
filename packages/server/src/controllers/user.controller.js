const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const Course = require('../models/course.model');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const courseId = req.query.courseId;

  let result;

  if (courseId) {
    // Find the course by courseId and get the list of students and staff
    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
    }

    // Combine students and staff IDs
    const userIds = [...course.students, ...course.staff];

    // Filter users by student and staff IDs in the course
    result = await userService.queryUsers(
      {
        ...filter,
        _id: { $in: userIds },
      },
      options,
    );
  } else {
    // If no courseId is provided, return all users based on filter and options
    result = await userService.queryUsers(filter, options);
  }

  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};

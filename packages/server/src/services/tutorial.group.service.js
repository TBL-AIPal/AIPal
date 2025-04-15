const httpStatus = require('http-status');
const { TutorialGroup, Course } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a tutorial group
 * @param {ObjectId} courseId - The ID of the course
 * @param {Object} tutorialGroupBody - The tutorial group data
 * @returns {Promise<TutorialGroup>}
 */
const createTutorialGroup = async (courseId, tutorialGroupBody) => {
  // Check if the course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Create the tutorial group
  const tutorialGroup = await TutorialGroup.create({ ...tutorialGroupBody });

  // Add the tutorial group ID to the course's tutorialGroups array
  course.tutorialGroups.push(tutorialGroup.id);
  await course.save();

  return tutorialGroup;
};

/**
 * Replace users in a tutorial group
 * @param {ObjectId} tutorialGroupId - The ID of the tutorial group
 * @param {ObjectId[]} userIds - Complete list of user IDs to set
 * @returns {Promise<TutorialGroup>}
 */
const setUsersInGroup = async (tutorialGroupId, userIds) => {
  const group = await TutorialGroup.findById(tutorialGroupId);
  if (!group) throw new Error('Tutorial group not found');

  group.students = userIds;
  await group.save();

  return group;
};

module.exports = {
  createTutorialGroup,
  setUsersInGroup,
};

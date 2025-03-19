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
 * Add users to a tutorial group
 * @param {ObjectId} tutorialGroupId - The ID of the tutorial group
 * @param {ObjectId[]} userIds - User IDs to add
 * @returns {Promise<TutorialGroup>}
 */
const addUsersToGroup = async (tutorialGroupId, userIds) => {
    const tutorialGroup = await TutorialGroup.findById(tutorialGroupId);
    if (!tutorialGroup) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tutorial group not found');
    }
  
    // Add only new users (avoid duplicates)
    tutorialGroup.students = [...new Set([...tutorialGroup.students, ...userIds])];
  
    await tutorialGroup.save();
    return tutorialGroup;
  };

module.exports = {
    createTutorialGroup,
    addUsersToGroup,
};
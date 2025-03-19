const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { tutorialGroupService } = require('../services');

const createTutorialGroup = catchAsync(async (req, res) => {
  const tutorialGroup = await tutorialGroupService.createTutorialGroup(req.params.courseId, req.body);
  res.status(httpStatus.CREATED).send(tutorialGroup);
});

const addUsersToGroup = catchAsync(async (req, res) => {
  const { tutorialGroupId } = req.params;
  const { userIds } = req.body;

  const updatedGroup = await tutorialGroupService.addUsersToGroup(tutorialGroupId, userIds);
  res.status(httpStatus.OK).json(updatedGroup);
});

module.exports = {
  createTutorialGroup,
  addUsersToGroup,
}
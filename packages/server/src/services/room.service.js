const httpStatus = require('http-status');
const { Room, Course } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a room associated with a course
 * @param {Object} roomBody
 * @returns {Promise<Room>}
 */
const createRoom = async (roomBody) => {
  const room = await Room.create({
    ...roomBody,
  });
  return room;
};

/**
 * Get rooms by course ID
 * @param {ObjectId} courseId
 * @returns {Promise<Room[]>}
 */
const getRoomsByCourseId = async (courseId) => {
  const course = await Course.findById(courseId).populate('rooms');

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Return an empty array if no rooms are found
  return course.rooms.length ? course.rooms : [];
};

/**
 * Get rooms by template ID
 * @param {ObjectId} templateId
 * @returns {Promise<Room[]>}
 */
const getRoomsByTemplateId = async (templateId) => {
  const rooms = await Room.find({ template: templateId });

  // Return an empty array if no rooms are found
  return rooms.length ? rooms : [];
};

/**
 * Get a room by ID
 * @param {ObjectId} roomId
 * @returns {Promise<Room>}
 */
const getRoomById = async (roomId) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  return room;
};

const getRoomsByCourse = async (courseId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error('Course not found');
  }

  // Find all rooms linked to templates in this course
  const rooms = await Room.find({
    template: { $in: course.templates },
  }).populate('template');

  return rooms;
};

/**
 * Update room by ID
 * @param {ObjectId} roomId
 * @param {Object} updateBody
 * @returns {Promise<Room>}
 */
const updateRoomById = async (roomId, updateBody) => {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  Object.assign(room, updateBody);
  await room.save();
  return room;
};

/**
 * Delete a room by ID
 * @param {ObjectId} courseId
 * @param {ObjectId} roomId
 * @returns {Promise<Room>}
 */
const deleteRoomById = async (courseId, roomId) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }

  // Optionally, update the Course to remove the room ID from the rooms array
  await Course.updateOne({ _id: courseId }, { $pull: { rooms: room._id } });

  await room.remove();
  return room;
};

module.exports = {
  createRoom,
  getRoomsByCourseId,
  getRoomsByTemplateId,
  getRoomsByCourse,
  getRoomById,
  updateRoomById,
  deleteRoomById,
};

const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const { roomService } = require('../services');
const ChatMessage = require('../models/chatMessage.model');

const { ObjectId } = mongoose.Types; // Import ObjectId

const createRoom = catchAsync(async (req, res) => {
  const room = await roomService.createRoom(req.body);
  res.status(httpStatus.CREATED).send(room);
});

const getRooms = catchAsync(async (req, res) => {
  const rooms = await roomService.getRooms();
  res.send(rooms);
});

const getRoomsByCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  // Fetch all rooms linked to any template in the course
  const rooms = await roomService.getRoomsByCourse(courseId);
  
  res.send(rooms);
});

const getRoom = catchAsync(async (req, res) => {
  const { courseId, roomId } = req.params;
  if (!courseId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Course ID is required');
  }
  const room = await roomService.getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  res.send(room);
});

const getRoomsByTemplate = catchAsync(async (req, res) => {
  const { templateId } = req.params; // Extract templateId from request parameters
  const rooms = await roomService.getRoomsByTemplateId(ObjectId(templateId)); // Call the service function
  res.send(rooms);
});

const updateRoom = catchAsync(async (req, res) => {
  const room = await roomService.updateRoomById(req.params.roomId, req.body);
  res.send(room);
});

const deleteRoom = catchAsync(async (req, res) => {
  await roomService.deleteRoomById(req.params.roomId);
  res.status(httpStatus.NO_CONTENT).send();
});

// Get all messages for a specific room
const getMessagesByRoom = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const messages = await ChatMessage.find({ roomId }).sort({ timestamp: 1 }); // Sort by oldest first
  res.status(httpStatus.OK).json(messages);
});

// Send a new message in a room
const sendMessage = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const { sender, content } = req.body;

  const newMessage = new ChatMessage({
    roomId,
    sender,
    content,
    timestamp: new Date(),
  });

  await newMessage.save();
  res.status(httpStatus.CREATED).json(newMessage);
});

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  getRoomsByTemplate,
  getRoomsByCourse,
  updateRoom,
  deleteRoom,
  getMessagesByRoom,
  sendMessage,
};

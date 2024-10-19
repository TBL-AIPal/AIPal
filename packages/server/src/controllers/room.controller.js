const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const { roomService } = require('../services');

const { ObjectId } = mongoose.Types; // Import ObjectId

const createRoom = catchAsync(async (req, res) => {
  const room = await roomService.createRoom(req.body);
  res.status(httpStatus.CREATED).send(room);
});

const getRooms = catchAsync(async (req, res) => {
  const rooms = await roomService.getRooms();
  res.send(rooms);
});

const getRoom = catchAsync(async (req, res) => {
  const room = await roomService.getRoomById(req.params.roomId);
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

module.exports = {
  createRoom,
  getRooms,
  getRoom,
  getRoomsByTemplate,
  updateRoom,
  deleteRoom,
};

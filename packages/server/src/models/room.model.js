const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

// Define the room schema
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true, // Ensures room codes are unique
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template', // Reference to the Template model (if applicable)
    },
    allowedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User', 
      default: [],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  },
);

// Add plugin that converts mongoose to json
roomSchema.plugin(toJSON);
roomSchema.plugin(paginate);

/**
 * @typedef Room
 */
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

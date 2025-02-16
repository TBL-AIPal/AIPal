const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    sender: {
      type: String, // Can be a user ID or system identifier
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Auto-generate timestamp
    },
  },
  {
    timestamps: true,
  }
);

// Convert Mongoose object to JSON
chatMessageSchema.set('toJSON', { virtuals: true });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;

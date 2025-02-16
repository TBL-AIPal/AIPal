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
    modelUsed: {
      type: String, // ✅ Store which model was used (e.g., 'chatgpt-direct', 'llama3', 'gemini')
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

chatMessageSchema.set('toJSON', { virtuals: true });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = ChatMessage;

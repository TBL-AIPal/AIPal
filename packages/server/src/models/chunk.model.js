const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * @typedef Chunk
 */
const Chunk = mongoose.model('Chunk', chunkSchema);

module.exports = Chunk;

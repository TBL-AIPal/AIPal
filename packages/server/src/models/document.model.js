const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const documentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
      validate: {
        validator(v) {
          return v && v.length > 0;
        },
      },
    },
    contentType: {
      type: String,
      required: true,
      enum: ['application/pdf'],
    },
    size: {
      type: Number,
      required: true,
      validate: {
        validator(v) {
          return v <= 10 * 1024 * 1024; // Max size of 10 MB
        },
        message: 'File size cannot exceed 10 MB',
      },
    },
    text: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing',
    },
  },
  {
    timestamps: true,
  },
);

// Add plugin that converts mongoose to json
documentSchema.plugin(toJSON);
documentSchema.plugin(paginate);

/**
 * @typedef Document
 */
const Document = mongoose.model('Document', documentSchema);

module.exports = Document;

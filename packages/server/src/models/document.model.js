const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const documentSchema = new mongoose.Schema(
  {
    data: {
      // TODO: replace with GridFS
      type: Buffer,
      required: true,
      validate: {
        validator(v) {
          return v && v.length > 0;
        },
      },
    },
    filename: {
      type: String,
      required: true,
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
          return v <= 10 * 1024 * 1024;
        },
        message: 'File size cannot exceed 10 MB',
      },
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
documentSchema.plugin(toJSON);
documentSchema.plugin(paginate);

/**
 * @typedef Document
 */
const Document = mongoose.model('Document', documentSchema);

module.exports = Document;

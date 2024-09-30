const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Course = require('./course.model');

const documentSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    // TODO: Replace with GridFS if needed
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

// Pre-remove hook to delete this document from the course when deleted
documentSchema.pre('remove', async function (next) {
  const courseId = this.course;
  await Course.updateOne({ _id: courseId }, { $pull: { documents: this._id } });
  next();
});

// Add plugin that converts mongoose to json
documentSchema.plugin(toJSON);
documentSchema.plugin(paginate);

/**
 * @typedef Document
 */
const Document = mongoose.model('Document', documentSchema);

module.exports = Document;

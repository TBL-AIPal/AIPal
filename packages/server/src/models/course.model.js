const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    apiKey: {
      type: String,
      required: true,
      private: true, // used by the toJSON plugin
    },
    llmConstraints: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    whitelist: [{ type: String, default: [] }], // New field for storing whitelisted emails
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document', default: [] }],
    templates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Template', default: [] }],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
courseSchema.plugin(toJSON);
courseSchema.plugin(paginate);

/**
 * @typedef Course
 */
const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

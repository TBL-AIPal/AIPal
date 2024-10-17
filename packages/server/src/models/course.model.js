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
      validate(value) {
        // TODO: Replace validation with real API request validation
        const apiKeyPattern = /^sk-[A-Za-z0-9]{48}$/;
        if (!apiKeyPattern.test(value)) {
          throw new Error('API Key must be valid');
        }
      },
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

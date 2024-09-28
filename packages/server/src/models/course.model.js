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
    },
    llmConstraints: {
      type: [String],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
    template: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Template' }],
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

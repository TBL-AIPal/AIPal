const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    constraints: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
templateSchema.plugin(toJSON);
templateSchema.plugin(paginate);

/**
 * @typedef Template
 */
const Template = mongoose.model('Template', templateSchema);

module.exports = Template;

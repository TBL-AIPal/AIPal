const mongoose = require('mongoose');

const tutorialGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const TutorialGroup = mongoose.model('TutorialGroup', tutorialGroupSchema);

module.exports = TutorialGroup;

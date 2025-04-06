const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Course = require('../../src/models/course.model');
const { userOne, userTwo, staff, admin } = require('./user.fixture');
const { templateOne, templateTwo } = require('./template.fixture');
const { documentOne, documentTwo } = require('./document.fixture');

const courseOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.words(),
  description: faker.lorem.sentences(),
  apiKeys: {
    gemini: `gemini-${faker.string.alphanumeric(48)}`,
    llama: `llama-${faker.string.alphanumeric(48)}`,
    chatgpt: `chatgpt-${faker.string.alphanumeric(48)}`,
  },
  owner: admin._id,
  students: [userOne._id, userTwo._id],
  staff: [staff._id],
  templates: [templateOne._id, templateTwo._id],
  documents: [documentOne._id, documentTwo._id],
  llmConstraints: ['constraint1', 'constraint2'],
};

const courseTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.words(),
  description: faker.lorem.sentences(),
  apiKeys: {
    gemini: `gemini-${faker.string.alphanumeric(48)}`,
    llama: `llama-${faker.string.alphanumeric(48)}`,
    chatgpt: `chatgpt-${faker.string.alphanumeric(48)}`,
  },
  owner: admin._id,
  students: [],
  staff: [],
  templates: [],
  documents: [],
  llmConstraints: [],
};

const insertCourses = async (courses) => {
  await Course.insertMany(courses);
};

module.exports = {
  courseOne,
  courseTwo,
  insertCourses,
};

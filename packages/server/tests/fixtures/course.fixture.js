const mongoose = require('mongoose');
const faker = require('faker');
const Course = require('../../src/models/course.model');
const { userOne, userTwo, staff, admin } = require('./user.fixture');
const { templateOne, templateTwo } = require('./template.fixture');
const { documentOne, documentTwo } = require('./document.fixture');

const courseOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.words(),
  description: faker.lorem.sentences(),
  apiKey: `sk-${faker.random.alphaNumeric(48)}`,
  owner: admin._id,
  students: [userOne._id, userTwo._id],
  staff: [staff._id],
  templates: [templateOne._id, templateTwo._id],
  documents: [documentOne._id, documentTwo._id],
};

const courseTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.words(),
  description: faker.lorem.sentences(),
  apiKey: `sk-${faker.random.alphaNumeric(48)}`,
  owner: admin._id,
  students: [userOne._id],
  staff: [staff._id],
  templates: [],
  documents: [],
};

const insertCourses = async (courses) => {
  await Course.insertMany(courses);
};

module.exports = {
  courseOne,
  courseTwo,
  insertCourses,
};

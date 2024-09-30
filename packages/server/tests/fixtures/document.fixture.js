const mongoose = require('mongoose');
const faker = require('faker');
const Document = require('../../src/models/document.model');
const { courseOne, courseTwo } = require('./course.fixture');

const documentOne = {
  _id: mongoose.Types.ObjectId(),
  data: Buffer.alloc(1024 * 1024 * 10, '.'),
  filename: `${faker.lorem.word()}.pdf`,
  contentType: 'application/pdf',
  size: 1024 * 1024 * 10,
  course: courseOne._id,
};

const documentTwo = {
  _id: mongoose.Types.ObjectId(),
  data: Buffer.alloc(1024 * 1024 * 5, '.'),
  filename: `${faker.lorem.word()}.pdf`,
  contentType: 'application/pdf',
  size: 1024 * 1024 * 5,
  course: courseTwo._id,
};

const documentThree = {
  _id: mongoose.Types.ObjectId(),
  data: Buffer.alloc(1024 * 1024 * 2, '.'),
  filename: `${faker.lorem.word()}.pdf`,
  contentType: 'application/pdf',
  size: 1024 * 1024 * 2,
  course: courseOne._id,
};

const insertDocuments = async (documents) => {
  await Document.insertMany(documents);
};

module.exports = {
  documentOne,
  documentTwo,
  documentThree,
  insertDocuments,
};

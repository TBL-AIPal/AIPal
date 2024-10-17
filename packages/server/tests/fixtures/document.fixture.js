const mongoose = require('mongoose');
const faker = require('faker');
const Document = require('../../src/models/document.model');

const documentOne = {
  _id: mongoose.Types.ObjectId(),
  data: Buffer.alloc(1024 * 1024 * 10, '.'),
  filename: `${faker.lorem.word()}.pdf`,
  contentType: 'application/pdf',
  size: 1024 * 1024 * 10,
};

const documentTwo = {
  _id: mongoose.Types.ObjectId(),
  data: Buffer.alloc(1024 * 1024 * 5, '.'),
  filename: `${faker.lorem.word()}.pdf`,
  contentType: 'application/pdf',
  size: 1024 * 1024 * 5,
};

const documentThree = {
  _id: mongoose.Types.ObjectId(),
  data: Buffer.alloc(1024 * 1024 * 2, '.'),
  filename: `${faker.lorem.word()}.pdf`,
  contentType: 'application/pdf',
  size: 1024 * 1024 * 2,
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

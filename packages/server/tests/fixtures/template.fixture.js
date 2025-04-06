const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Template = require('../../src/models/template.model');
const { documentOne, documentTwo } = require('./document.fixture');

const templateOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.word(),
  constraints: faker.lorem.words().split(' '),
  documents: [documentOne._id, documentTwo._id],
};

const templateTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.word(),
  constraints: faker.lorem.words().split(' '),
  documents: [documentTwo._id],
};

const insertTemplates = async (templates) => {
  await Template.insertMany(templates);
};

module.exports = {
  templateOne,
  templateTwo,
  insertTemplates,
};

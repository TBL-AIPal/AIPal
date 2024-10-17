const mongoose = require('mongoose');
const faker = require('faker');
const Template = require('../../src/models/template.model');

const templateOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.word(),
  constraints: faker.lorem.words().split(' '),
};

const templateTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.lorem.word(),
  constraints: faker.lorem.words().split(' '),
};

const insertTemplates = async (templates) => {
  await Template.insertMany(templates);
};

module.exports = {
  templateOne,
  templateTwo,
  insertTemplates,
};

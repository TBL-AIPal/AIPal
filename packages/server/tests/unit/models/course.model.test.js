const { faker } = require('@faker-js/faker');
const mongoose = require('mongoose');
const { Course, User } = require('../../../src/models');

describe('Course model', () => {
  describe('Course validation', () => {
    let newCourse;
    let owner;

    beforeEach(async () => {
      owner = new User({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'admin',
        courses: [],
      });
      newCourse = {
        name: faker.lorem.words(),
        description: faker.lorem.sentences(),
        apiKeys: {
          gemini: `gemini-${faker.string.alphanumeric(48)}`,
          llama: `llama-${faker.string.alphanumeric(48)}`,
          chatgpt: `chatgpt-${faker.string.alphanumeric(48)}`,
        },
        llmConstraints: [faker.lorem.word()],
        owner: owner._id,
        students: [],
        staff: [],
      };
    });

    test('should correctly validate a valid course', async () => {
      await expect(new Course(newCourse).validate()).resolves.toBeUndefined();
    });
  });

  describe('Course toJSON()', () => {
    test('should not return course api keys when toJSON is called', () => {
      const newCourse = {
        name: faker.lorem.words(),
        apiKeys: {
          gemini: `gemini-${faker.string.alphanumeric(48)}`,
          llama: `llama-${faker.string.alphanumeric(48)}`,
          chatgpt: `chatgpt-${faker.string.alphanumeric(48)}`,
        },
        owner: new mongoose.Types.ObjectId(),
      };
      expect(new Course(newCourse).toJSON()).not.toHaveProperty('apiKeys');
    });
  });
});

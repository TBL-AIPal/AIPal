const faker = require('faker');
const mongoose = require('mongoose');
const { Course, User } = require('../../../src/models');

describe('Course model', () => {
  describe('Course validation', () => {
    let newCourse;
    let owner;

    beforeEach(async () => {
      owner = new User({
        name: faker.name.findName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
        role: 'admin',
        courses: [],
      });

      newCourse = {
        name: faker.lorem.words(),
        description: faker.lorem.sentences(),
        apiKey: `sk-${faker.random.alphaNumeric(48)}`,
        llmConstraints: [faker.lorem.word()],
        owner: owner._id,
        students: [],
        staff: [],
      };
    });

    test('should correctly validate a valid course', async () => {
      await expect(new Course(newCourse).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if apiKey is invalid', async () => {
      newCourse.apiKey = 'invalid-key';
      await expect(new Course(newCourse).validate()).rejects.toThrow();
    });
  });

  describe('Course toJSON()', () => {
    test('should not return course api key when toJSON is called', () => {
      const newCourse = {
        name: faker.lorem.words(),
        apiKey: `sk-${faker.random.alphaNumeric(48)}`,
        owner: new mongoose.Types.ObjectId(),
      };
      expect(new Course(newCourse).toJSON()).not.toHaveProperty('apiKey');
    });
  });
});

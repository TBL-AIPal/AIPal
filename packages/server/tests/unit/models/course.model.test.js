const faker = require('faker');
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
        course: [],
      });

      newCourse = {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        apiKey: `sk-${faker.random.alphaNumeric(48)}`,
        llmConstraints: [faker.lorem.word()],
        owner: owner._id,
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
});

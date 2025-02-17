const faker = require('faker');
const { Template } = require('../../../src/models');

describe('Template model', () => {
  describe('Template validation', () => {
    let newTemplate;

    beforeEach(() => {
      newTemplate = {
        name: faker.commerce.productName(),
        constraints: [faker.lorem.word()],
      };
    });

    test('should correctly validate a valid template', async () => {
      await expect(
        new Template(newTemplate).validate(),
      ).resolves.toBeUndefined();
    });

    test('should throw a validation error if name is missing', async () => {
      delete newTemplate.name;
      await expect(new Template(newTemplate).validate()).rejects.toThrow();
    });

    test('should not throw an error if constraints are not provided', async () => {
      newTemplate.constraints = undefined;
      await expect(
        new Template(newTemplate).validate(),
      ).resolves.toBeUndefined();
    });
  });

  describe('Template toJSON()', () => {
    test('should convert the template to JSON correctly', () => {
      const newTemplate = {
        name: faker.commerce.productName(),
        constraints: [faker.lorem.word()],
      };
      expect(new Template(newTemplate).toJSON()).toMatchObject({
        name: newTemplate.name,
        constraints: newTemplate.constraints,
      });
    });
  });
});

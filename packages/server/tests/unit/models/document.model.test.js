const mongoose = require('mongoose');
const faker = require('faker');
const { Document, Course } = require('../../../src/models');

describe('Document model', () => {
  describe('Document validation', () => {
    let newDocument;
    let course;

    beforeEach(async () => {
      course = new Course({
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        apiKey: `sk-${faker.random.alphaNumeric(48)}`,
        llmConstraints: [faker.lorem.word()],
        owner: new mongoose.Types.ObjectId(),
      });

      newDocument = {
        data: Buffer.from(faker.lorem.paragraph()),
        filename: faker.system.fileName(),
        contentType: 'application/pdf',
        size: 1024, // 1 KB
        course: course._id,
      };
    });

    test('should correctly validate a valid document', async () => {
      await expect(new Document(newDocument).validate()).resolves.toBeUndefined();
    });

    test('should throw a validation error if contentType is invalid', async () => {
      newDocument.contentType = 'image/jpeg';
      await expect(new Document(newDocument).validate()).rejects.toThrow();
    });

    test('should throw a validation error if size exceeds 10 MB', async () => {
      newDocument.size = 11 * 1024 * 1024;
      await expect(new Document(newDocument).validate()).rejects.toThrow('File size cannot exceed 10 MB');
    });
  });

  describe('Document toJSON()', () => {
    test('should convert the document to JSON correctly', () => {
      const newDocument = {
        data: Buffer.from(faker.lorem.paragraph()),
        filename: faker.system.fileName(),
        contentType: 'application/pdf',
        size: 1024,
        course: new mongoose.Types.ObjectId(),
      };

      const documentInstance = new Document(newDocument);
      const json = documentInstance.toJSON();

      expect(json).toMatchObject({
        filename: newDocument.filename,
        contentType: newDocument.contentType,
        size: newDocument.size,
      });
      expect(json).toHaveProperty('data');
    });
  });
});

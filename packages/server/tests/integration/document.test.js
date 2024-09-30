const request = require('supertest');
const path = require('path');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Document } = require('../../src/models');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { courseOne, insertCourses, courseTwo } = require('../fixtures/course.fixture');
const { documentOne, documentTwo, documentThree, insertDocuments } = require('../fixtures/document.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Document routes', () => {
  describe('POST /v1/documents/:courseId', () => {
    test('should return 201 and successfully create new document if data is ok', async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne]);

      const res = await request(app)
        .post(`/v1/documents/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .attach('file', path.resolve(__dirname, 'files', 'testOne.pdf'))
        .expect('Content-Type', /json/)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          filename: 'testOne.pdf',
          contentType: 'application/pdf',
          size: expect.any(Number),
          course: courseOne._id.toString(),
        })
      );

      const dbDocument = await Document.findById(res.body.id);
      expect(dbDocument).toBeDefined();
      expect(dbDocument).toEqual(
        expect.objectContaining({
          filename: 'testOne.pdf',
          contentType: 'application/pdf',
          size: expect.any(Number),
          course: courseOne._id,
        })
      );
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app)
        .post(`/v1/documents/${courseOne._id}`)
        .attach('files', Buffer.alloc(1024 * 1024 * 10, '.'))
        // https://stackoverflow.com/questions/61096108/sending-binary-file-in-express-leads-to-econnaborted
        .set('Connection', 'keep-alive')
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged-in user does not have manageDocuments permission', async () => {
      await insertUsers([userOne]);
      await insertCourses([courseOne]);

      await request(app)
        .post(`/v1/documents/${courseOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .attach('files', Buffer.alloc(1024 * 1024 * 10, '.'))
        // https://stackoverflow.com/questions/61096108/sending-binary-file-in-express-leads-to-econnaborted
        .set('Connection', 'keep-alive')
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if no file is attached', async () => {
      await insertUsers([admin]);

      await request(app)
        .post(`/v1/documents/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({}) // No file attached
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/documents/:courseId', () => {
    test('should return 200 and list documents for the course', async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne, courseTwo]);
      await insertDocuments([documentOne, documentTwo, documentThree]);

      const res = await request(app)
        .get(`/v1/documents/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect('Content-Type', /json/)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            filename: documentOne.filename,
            contentType: documentOne.contentType,
          }),
          expect.objectContaining({
            filename: documentThree.filename,
            contentType: documentThree.contentType,
          }),
        ])
      );
    });

    test('should return 403 error if user does not have permission', async () => {
      await insertUsers([userOne]);
      await insertCourses([courseOne]);

      await request(app)
        .get(`/v1/documents/${courseOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('GET /v1/documents/:courseId/:documentId', () => {
    test('should return 200 and document details', async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne]);
      await insertDocuments([documentOne]);

      const docRes = await request(app)
        .get(`/v1/documents/${courseOne._id}/${documentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect('Content-Type', /json/)
        .expect(httpStatus.OK);

      expect(docRes.body).toEqual(
        expect.objectContaining({
          filename: documentOne.filename,
          contentType: documentOne.contentType,
        })
      );
    });

    test('should return 403 error if user does not have permission', async () => {
      await insertUsers([userOne]);
      await insertCourses([courseOne]);
      await insertDocuments([documentOne]);

      await request(app)
        .get(`/v1/documents/${courseOne._id}/${documentOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe('DELETE /v1/documents/:courseId/:documentId', () => {
    test('should return 204 and delete the document', async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne]);
      await insertDocuments([documentOne]);

      await request(app)
        .delete(`/v1/documents/${courseOne._id}/${documentOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NO_CONTENT);

      const dbDocument = await Document.findById(documentOne._id);
      expect(dbDocument).toBeNull();
    });

    test('should return 403 error if user does not have manageDocuments permission', async () => {
      await insertUsers([userOne]);
      await insertCourses([courseOne]);
      await insertDocuments([documentOne]);

      await request(app)
        .delete(`/v1/documents/${courseOne._id}/${documentOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });
});

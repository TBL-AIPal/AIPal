const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Course } = require('../../src/models');
const { userOne, userTwo, admin, insertUsers } = require('../fixtures/user.fixture');
const { courseOne, courseTwo, insertCourses } = require('../fixtures/course.fixture');
const { userOneAccessToken, userTwoAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Course routes', () => {
  describe('POST /v1/courses', () => {
    let newCourse;

    beforeEach(() => {
      newCourse = {
        name: faker.name.findName(),
        owner: admin._id,
        apiKey: `sk-${faker.random.alphaNumeric(48)}`,
      };
    });

    test('should return 201 and successfully create new course if data is ok', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/courses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newCourse)
        .expect('Content-Type', /json/);

      expect(res.body).not.toHaveProperty('apiKey');
      expect(res.body).toEqual(
        expect.objectContaining({
          name: newCourse.name,
          owner: newCourse.owner.toString(),
        })
      );
      expect(res.body).toEqual({
        id: expect.anything(),
        name: newCourse.name,
        owner: newCourse.owner.toString(),
        documents: [],
        llmConstraints: [],
        staff: [],
        students: [],
        template: [],
      });

      const dbCourse = await Course.findById(res.body.id);
      expect(dbCourse).toBeDefined();
      expect(dbCourse).toEqual(
        expect.objectContaining({
          name: newCourse.name,
          owner: newCourse.owner,
        })
      );
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).post('/v1/courses').send(newCourse).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if logged in user does not have manageCourses permission', async () => {
      await insertUsers([userOne]);
      await request(app)
        .post('/v1/courses')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newCourse)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 400 error if validation fails', async () => {
      await insertUsers([admin]);
      const invalidCourse = { ...newCourse, apiKey: '' };
      await request(app)
        .post('/v1/courses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(invalidCourse)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('GET /v1/courses', () => {
    test('should return 200 and all courses if data is ok', async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne, courseTwo]);
      const res = await request(app)
        .get('/v1/courses')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.results).toBeInstanceOf(Array);
      expect(res.body.results.length).toBe(2);
      expect(res.body.results[0]).toMatchObject({
        id: courseOne._id.toString(),
      });
      expect(res.body.results[1]).toMatchObject({
        id: courseTwo._id.toString(),
      });
    });

    test('should return only courses owned by logged-in user', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertCourses([courseOne, courseTwo]);
      const res = await request(app)
        .get('/v1/courses')
        .set('Authorization', `Bearer ${userTwoAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.results).toBeInstanceOf(Array);
      expect(res.body.results.length).toBe(1);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get('/v1/courses').expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 200 with empty array if no courses found', async () => {
      await insertUsers([userOne]);
      const res = await request(app)
        .get('/v1/courses')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body.results).toBeInstanceOf(Array);
      expect(res.body.results.length).toBe(0);
    });
  });

  describe('GET /v1/courses/:courseId', () => {
    test('should return 200 and course details if data is ok', async () => {
      await insertUsers([admin, userOne, userTwo]);
      await insertCourses([courseOne, courseTwo]);
      const res = await request(app)
        .get(`/v1/courses/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        id: courseOne._id.toString(),
        name: courseOne.name,
        description: courseOne.description,
        owner: courseOne.owner.toString(),
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).get(`/v1/courses/${courseOne._id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 404 error if course is not found', async () => {
      await insertUsers([admin]);
      await request(app)
        .get(`/v1/courses/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /v1/courses/:courseId', () => {
    test('should return 200 and updated course details if data is ok', async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne, courseTwo]);
      const updateData = { name: 'Updated course name' };
      const res = await request(app)
        .patch(`/v1/courses/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateData)
        .expect(httpStatus.OK);

      expect(res.body).toMatchObject({
        id: courseOne._id.toString(),
        name: updateData.name,
      });
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).patch(`/v1/courses/${courseOne._id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user does not have manageCourses permission', async () => {
      await insertUsers([admin, userOne]);
      await insertCourses([courseOne, courseTwo]);
      await request(app)
        .patch(`/v1/courses/${courseOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 error if course is not found', async () => {
      await insertUsers([admin]);
      const updateData = { name: 'Updated course name' };
      await request(app)
        .patch(`/v1/courses/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(updateData)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('DELETE /v1/courses/:courseId', () => {
    test('should return 204 if data is ok', async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne, courseTwo]);
      await request(app)
        .delete(`/v1/courses/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NO_CONTENT);
    });

    test('should return 401 error if access token is missing', async () => {
      await request(app).delete(`/v1/courses/${courseOne._id}`).expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 403 error if user does not have manageCourses permission', async () => {
      await insertUsers([admin, userOne]);
      await insertCourses([courseOne]);
      await request(app)
        .delete(`/v1/courses/${courseOne._id}`)
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 404 error if course is not found', async () => {
      await insertUsers([admin]);
      await request(app)
        .delete(`/v1/courses/${courseOne._id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });
});

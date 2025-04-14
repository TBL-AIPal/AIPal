const request = require("supertest");
const httpStatus = require("http-status");
const app = require("../../src/app");
const setupTestDB = require("../utils/setupTestDB");
const { Template } = require("../../src/models");
const { userOne, admin, insertUsers } = require("../fixtures/user.fixture");
const {
  courseOne,
  courseTwo,
  insertCourses,
} = require("../fixtures/course.fixture");
const {
  templateOne,
  templateTwo,
  insertTemplates,
} = require("../fixtures/template.fixture");
const {
  userOneAccessToken,
  adminAccessToken,
} = require("../fixtures/token.fixture");

setupTestDB();

describe("Template routes", () => {
  describe("POST /v1/courses/:courseId/templates", () => {
    test("should return 201 and successfully create new template if data is valid", async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne]);

      const templateData = {
        name: "Template 1",
        constraints: [
          "This is the first constraint",
          "This is the second constraint",
        ],
      };

      const res = await request(app)
        .post(`/v1/courses/${courseOne._id}/templates`)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(templateData)
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: templateData.name,
          constraints: expect.any(Object),
        }),
      );

      const dbTemplate = await Template.findById(res.body.id);
      expect(dbTemplate).toBeDefined();
      expect(dbTemplate).toMatchObject({
        name: templateData.name,
        constraints: expect.any(Object),
      });
    });

    test("should return 401 error if access token is missing", async () => {
      await request(app)
        .post(`/v1/courses/${courseOne._id}/templates`)
        .send({ name: "Template 1" })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test("should return 403 error if user does not have manageTemplate permission", async () => {
      await insertUsers([userOne]);
      await insertCourses([courseOne]);

      await request(app)
        .post(`/v1/courses/${courseOne._id}/templates`)
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .send({ name: "Template 1" })
        .expect(httpStatus.FORBIDDEN);
    });

    test("should return 400 error if name is missing", async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne]);

      const templateData = {
        constraints: [
          "This is the first constraint",
          "This is the second constraint",
        ],
      };

      await request(app)
        .post(`/v1/courses/${courseOne._id}/templates`)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(templateData)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("GET /v1/courses/:courseId/templates", () => {
    test("should return 200 and list templates for the course", async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne]);
      await insertTemplates([templateOne, templateTwo]);

      const res = await request(app)
        .get(`/v1/courses/${courseOne._id}/templates`)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: templateOne.name,
          }),
          expect.objectContaining({
            name: templateTwo.name,
          }),
        ]),
      );
    });

    // eslint-disable-next-line jest/no-disabled-tests
    test.skip("should return 403 error if user does not have getTemplate permission", async () => {
      await insertUsers([userOne]);
      await insertCourses([courseOne]);
      await insertTemplates([templateOne, templateTwo]);

      await request(app)
        .get(`/v1/courses/${courseOne._id}/templates`)
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });

  describe("GET /v1/courses/:courseId/templates/:templateId", () => {
    test("should return 200 and template details", async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne]);
      await insertTemplates([templateOne, templateTwo]);

      const res = await request(app)
        .get(`/v1/courses/${courseOne._id}/templates/${templateOne._id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: templateOne.name,
        }),
      );
    });

    // eslint-disable-next-line jest/no-disabled-tests
    test.skip("should return 403 error if user does not have permission", async () => {
      await insertUsers([userOne]);
      await insertCourses([courseOne]);
      await insertTemplates([templateOne]);

      await request(app)
        .get(`/v1/courses/${courseOne._id}/templates/${templateOne._id}`)
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });

    test("should return 404 error if template does not exist", async () => {
      await insertUsers([admin]);
      await insertCourses([courseTwo]);

      await request(app)
        .get(`/v1/courses/${courseTwo._id}/templates/60f7eb4b31e23a3668e5b2ad`)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe("PATCH /v1/courses/:courseId/templates/:templateId", () => {
    test("should return 200 and update template data", async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne]);
      await insertTemplates([templateOne, templateTwo]);

      const updateData = {
        name: "Updated Template Name",
      };

      const res = await request(app)
        .patch(`/v1/courses/${courseOne._id}/templates/${templateOne._id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send(updateData)
        .expect(httpStatus.OK);

      expect(res.body).toEqual(
        expect.objectContaining({
          name: updateData.name,
        }),
      );

      const dbTemplate = await Template.findById(templateOne._id);
      expect(dbTemplate.name).toBe(updateData.name);
    });

    test("should return 400 error if update data is invalid", async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne]);
      await insertTemplates([templateOne]);

      await request(app)
        .patch(`/v1/courses/${courseOne._id}/templates/${templateOne._id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .send({ name: "" }) // empty name
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe("DELETE /v1/courses/:courseId/templates/:templateId", () => {
    test("should return 204 and successfully delete template", async () => {
      await insertUsers([admin]);
      await insertCourses([courseOne]);
      await insertTemplates([templateOne, templateTwo]);

      await request(app)
        .delete(`/v1/courses/${courseOne._id}/templates/${templateOne._id}`)
        .set("Authorization", `Bearer ${adminAccessToken}`)
        .expect(httpStatus.NO_CONTENT);

      const dbTemplate = await Template.findById(templateOne._id);
      expect(dbTemplate).toBeNull();
    });

    test("should return 403 error if user does not have manageTemplate permission", async () => {
      await insertUsers([userOne]);
      await insertCourses([courseOne]);
      await insertTemplates([templateOne]);

      await request(app)
        .delete(`/v1/courses/${courseOne._id}/templates/${templateOne._id}`)
        .set("Authorization", `Bearer ${userOneAccessToken}`)
        .expect(httpStatus.FORBIDDEN);
    });
  });
});

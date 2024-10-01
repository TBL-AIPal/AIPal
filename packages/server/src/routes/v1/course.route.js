const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const courseValidation = require('../../validations/course.validation');
const courseController = require('../../controllers/course.controller');
const templateValidation = require('../../validations/template.validation');
const templateController = require('../../controllers/template.controller');
const documentValidation = require('../../validations/document.validation');
const documentController = require('../../controllers/document.controller');
const upload = require('../../middlewares/upload');

const router = express.Router();

router
  .route('/')
  .post(auth('manageCourses'), validate(courseValidation.createCourse), courseController.createCourse)
  .get(auth('getCourses'), validate(courseValidation.getCourses), courseController.getCourses);

router
  .route('/:courseId')
  .get(auth('getCourses'), validate(courseValidation.getCourse), courseController.getCourse)
  .patch(auth('manageCourses'), validate(courseValidation.updateCourse), courseController.updateCourse)
  .delete(auth('manageCourses'), validate(courseValidation.deleteCourse), courseController.deleteCourse);

router
  .route('/:courseId/templates')
  .post(auth('manageTemplates'), validate(templateValidation.createTemplate), templateController.createTemplate)
  .get(auth('getTemplates'), validate(templateValidation.getTemplates), templateController.getTemplates);

router
  .route('/:courseId/templates/:templateId')
  .get(auth('getTemplates'), validate(templateValidation.getTemplate), templateController.getTemplate)
  .patch(auth('manageTemplates'), validate(templateValidation.updateTemplate), templateController.updateTemplate)
  .delete(auth('manageTemplates'), validate(templateValidation.deleteTemplate), templateController.deleteTemplate);

router
  .route('/:courseId/documents')
  .post(
    auth('manageDocuments'),
    upload.single('file'),
    validate(documentValidation.createDocument),
    documentController.createDocument
  )
  .get(auth('getDocuments'), validate(documentValidation.getDocuments), documentController.getDocuments);

router
  .route('/:courseId/documents/:documentId')
  .get(auth('getDocuments'), validate(documentValidation.getDocument), documentController.getDocument)
  .delete(auth('manageDocuments'), validate(documentValidation.getDocument), documentController.deleteDocument);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management and retrieval
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a course
 *     description: Only admins can create courses.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *             example:
 *               title: Introduction to AI
 *               description: A beginner's course on artificial intelligence
 *               category: technology
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Course'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all courses
 *     description: Retrieve a list of courses.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Course title
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Course category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of courses
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     summary: Get a course
 *     description: Retrieve a specific course by its ID.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Course'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a course
 *     description: Only admins can update courses.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *             example:
 *               title: Advanced AI
 *               description: A detailed course on artificial intelligence
 *               category: technology
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Course'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a course
 *     description: Only admins can delete courses.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /courses/{courseId}/templates:
 *   post:
 *     summary: Create a template
 *     description: Only authorized users can create templates for a specific course.
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               constraints:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               name: Course Template 1
 *               constraints: ["Constraint 1", "Constraint 2"]
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Template'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all templates for a course
 *     description: Retrieve a list of templates associated with a specific course.
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Template'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /courses/{courseId}/templates/{templateId}:
 *   get:
 *     summary: Get a specific template
 *     description: Retrieve a specific template by its ID within a course.
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Template'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a template
 *     description: Only authorized users can update a template.
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               constraints:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               name: Updated Template Name
 *               constraints: ["Updated Constraint 1"]
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Template'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a template
 *     description: Only authorized users can delete a template.
 *     tags: [Templates]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *       - in: path
 *         name: templateId
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       "204":
 *         description: No Content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /{courseId}/documents:
 *   post:
 *     summary: Upload a document
 *     description: Allows users with manageDocuments permission to upload a document for a course.
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course to which the document belongs.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload.
 *     responses:
 *       201:
 *         description: Document created successfully.
 *       400:
 *         description: Invalid request data.
 *       403:
 *         description: Forbidden, insufficient permissions.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /{courseId}/documents:
 *   get:
 *     summary: Retrieve documents
 *     description: Allows users with getDocuments permission to retrieve a list of documents for a course.
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course to retrieve documents from.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of documents.
 *       403:
 *         description: Forbidden, insufficient permissions.
 *       404:
 *         description: Course not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /{courseId}/documents/{documentId}:
 *   get:
 *     summary: Retrieve a specific document
 *     description: Allows users with getDocuments permission to retrieve a specific document by ID.
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course that the document belongs to.
 *         schema:
 *           type: string
 *       - in: path
 *         name: documentId
 *         required: true
 *         description: ID of the document to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document retrieved successfully.
 *       404:
 *         description: Document not found.
 *       403:
 *         description: Forbidden, insufficient permissions.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /{courseId}/documents/{documentId}:
 *   delete:
 *     summary: Delete a specific document
 *     description: Allows users with manageDocuments permission to delete a specific document by ID.
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: ID of the course that the document belongs to.
 *         schema:
 *           type: string
 *       - in: path
 *         name: documentId
 *         required: true
 *         description: ID of the document to delete.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Document deleted successfully.
 *       404:
 *         description: Document not found.
 *       403:
 *         description: Forbidden, insufficient permissions.
 *       500:
 *         description: Internal server error.
 */

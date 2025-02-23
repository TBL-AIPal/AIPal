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
// New room controller import
const roomController = require('../../controllers/room.controller');
const roomValidation = require('../../validations/room.validation');

const router = express.Router();

router
  .route('/')
  .post(
    auth('manageCourses'),
    validate(courseValidation.createCourse),
    courseController.createCourse,
  )
  .get(
    auth('getCourses'),
    validate(courseValidation.getCourses),
    courseController.getCourses,
  );

router
  .route('/:courseId')
  .get(
    auth('getCourses'),
    validate(courseValidation.getCourse),
    courseController.getCourse,
  )
  .patch(
    auth('manageCourses'),
    validate(courseValidation.updateCourse),
    courseController.updateCourse,
  )
  .delete(
    auth('manageCourses'),
    validate(courseValidation.deleteCourse),
    courseController.deleteCourse,
  );

router
  .route('/:courseId/templates')
  .post(
    auth('manageTemplates'),
    validate(templateValidation.createTemplate),
    templateController.createTemplate,
  )
  .get(
    auth('getTemplates'),
    validate(templateValidation.getTemplates),
    templateController.getTemplates,
  );

router
  .route('/:courseId/templates/:templateId')
  .get(
    auth('getTemplates'),
    validate(templateValidation.getTemplate),
    templateController.getTemplate,
  )
  .patch(
    auth('manageTemplates'),
    validate(templateValidation.updateTemplate),
    templateController.updateTemplate,
  )
  .delete(
    auth('manageTemplates'),
    validate(templateValidation.deleteTemplate),
    templateController.deleteTemplate,
  );

router
  .route('/:courseId/documents')
  .post(
    auth('manageDocuments'),
    upload.single('file'),
    validate(documentValidation.createDocument),
    documentController.createDocument,
  )
  .get(
    auth('getDocuments'),
    validate(documentValidation.getDocuments),
    documentController.getDocuments,
  );

router
  .route('/:courseId/documents/:documentId')
  .get(
    auth('getDocuments'),
    validate(documentValidation.getDocument),
    documentController.getDocument,
  )
  .delete(
    auth('manageDocuments'),
    validate(documentValidation.getDocument),
    documentController.deleteDocument,
  );

// ✅ Update the route to fetch ALL rooms for a course
router
  .route('/:courseId/rooms')
  .get(auth('getRooms'), validate(roomValidation.getRoomsByCourse), roomController.getRoomsByCourse) // ⬅ New Route
  .post(auth('manageRooms'), validate(roomValidation.createRoom), roomController.createRoom);

router
  .route('/:courseId/templates/:templateId/rooms')
  .get(
    auth('getRooms'),
    validate(roomValidation.getRoomsByTemplate),
    roomController.getRoomsByTemplate,
  );

router
  .route('/:courseId/rooms/:roomId')
  .get(auth('getRooms'), validate(roomValidation.getRoom), roomController.getRoom)
  .patch(auth('manageRooms'), validate(roomValidation.updateRoom), roomController.updateRoom)
  .delete(auth('manageRooms'), validate(roomValidation.deleteRoom), roomController.deleteRoom);

  router
  .route('/:courseId/users')
  .post(
    auth('manageCourses'), // Only allow users with permission to manage courses
    validate(courseValidation.addUserToCourse), // Optional: Validation for the userId (can be added in `courseValidation` file)
    courseController.addUserToCourse // Controller function to handle adding the user
  );

  router
  .route('/:courseId/rooms/:roomId/messages')
  .get(auth('getMessages'), validate(roomValidation.getMessagesByRoom), roomController.getMessagesByRoom)
  .post(auth('sendMessage'), validate(roomValidation.sendMessage), roomController.sendMessage);

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
 *               - name
 *               - apiKey
 *               - owner
 *             properties:
 *               name:
 *                 type: string
 *               apiKey:
 *                 type: string
 *               owner:
 *                 type: string
 *             example:
 *               name: Introduction to AI
 *               description: A beginner's course on artificial intelligence
 *               apiKey: sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 *               owner: 60f6f7f7f7f7f7f7f7f7f7f7
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the course to filter by (optional)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field by which to sort the courses (optional)
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
 *           default: 1
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               apiKey:
 *                 type: string
 *               llmConstraints:
 *                 type: array
 *                 items:
 *                   type: string
 *               owner:
 *                 type: string
 *               students:
 *                 type: array
 *                 items:
 *                   type: string
 *               staff:
 *                 type: array
 *                 items:
 *                   type: string
 *             minProperties: 1
 *             additionalProperties: false
 *             example:
 *               name: Advanced AI
 *               description: A detailed course on artificial intelligence
 *               apiKey: sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 *               llmConstraints: []
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
 * /courses/{courseId}/documents:
 *   post:
 *     summary: Upload a document
 *     description: Allows users with manageDocuments permission to upload a document for a course.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       400:
 *         description: Invalid request data.
 *         $ref: '#/components/responses/BadRequest'
 *       403:
 *         description: Forbidden, insufficient permissions.
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         description: Internal server error.
 *         $ref: '#/components/responses/InternalServerError'
 *   get:
 *     summary: Retrieve documents
 *     description: Allows users with getDocuments permission to retrieve a list of documents for a course.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Document'
 *       403:
 *         description: Forbidden, insufficient permissions.
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         description: Course not found.
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         description: Internal server error.
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /courses/{courseId}/documents/{documentId}:
 *   get:
 *     summary: Retrieve a specific document
 *     description: Allows users with getDocuments permission to retrieve a specific document by ID.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       404:
 *         description: Document not found.
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         description: Forbidden, insufficient permissions.
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         description: Internal server error.
 *         $ref: '#/components/responses/InternalServerError'
 *   delete:
 *     summary: Delete a specific document
 *     description: Allows users with manageDocuments permission to delete a specific document by ID.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
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
 *         $ref: '#/components/responses/NotFound'
 *       403:
 *         description: Forbidden, insufficient permissions.
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         description: Internal server error.
 *         $ref: '#/components/responses/InternalServerError'
 */
/**
 * @swagger
 * /courses/{courseId}/rooms:
 *   post:
 *     summary: Create a room for a course
 *     description: Only authorized users can create rooms for a specific course.
 *     tags: [Rooms]
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
 *               - description
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               code:
 *                 type: string
 *             example:
 *               name: Room A
 *               description: A room equipped with AI learning resources.
 *               code: RA123
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Room'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'

 *   get:
 *     summary: Get all rooms for a course
 *     description: Retrieve a list of rooms associated with a specific course.
 *     tags: [Rooms]
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
 *                     $ref: '#/components/schemas/Room'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /courses/{courseId}/rooms/{roomId}:
 *   get:
 *     summary: Get a specific room
 *     description: Retrieve a specific room by its ID within a course.
 *     tags: [Rooms]
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
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Room'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a room
 *     description: Only authorized users can update a room.
 *     tags: [Rooms]
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
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               code:
 *                 type: string
 *             example:
 *               name: Updated Room A
 *               description: Updated description of Room A.
 *               code: RA456
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Room'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'

 *   delete:
 *     summary: Delete a room
 *     description: Only authorized users can delete a room.
 *     tags: [Rooms]
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
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room ID
 *     responses:
 *       "204":
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
 * /courses/{courseId}/templates/{templateId}/rooms:
 *   get:
 *     summary: Get all rooms for a specific template
 *     description: Retrieve a list of rooms associated with a specific template within a course.
 *     tags: [Rooms]
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
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Room'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

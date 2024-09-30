const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const documentValidation = require('../../validations/document.validation');
const documentController = require('../../controllers/document.controller');
const upload = require('../../middlewares/upload');

const router = express.Router();

router
  .route('/:courseId')
  .post(
    auth('manageDocuments'),
    upload.single('file'),
    validate(documentValidation.createDocument),
    documentController.createDocument
  )
  .get(auth('getDocuments'), validate(documentValidation.getDocuments), documentController.getDocuments);

router
  .route('/:courseId/:documentId')
  .get(auth('getDocuments'), validate(documentValidation.getDocument), documentController.getDocument)
  .delete(auth('manageDocuments'), validate(documentValidation.getDocument), documentController.deleteDocument);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document management and retrieval
 */

/**
 * @swagger
 * /v1/documents/{courseId}:
 *   post:
 *     summary: Upload a document for a course
 *     description: Only users with the 'manageDocuments' permission can upload documents.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       "201":
 *         description: Document successfully uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get all documents for a course
 *     description: Retrieve a list of all documents for a given course. Only users with the 'getDocuments' permission can view documents.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       "200":
 *         description: A list of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Document'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /v1/documents/{courseId}/{documentId}:
 *   get:
 *     summary: Get document details
 *     description: Retrieve details of a specific document by its ID. Only users with the 'getDocuments' permission can view document details.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *       - in: path
 *         name: documentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Document ID
 *     responses:
 *       "200":
 *         description: Document details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Document'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   delete:
 *     summary: Delete a document
 *     description: Only users with the 'manageDocuments' permission can delete a document.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *       - in: path
 *         name: documentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Document ID
 *     responses:
 *       "204":
 *         description: Document deleted successfully
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

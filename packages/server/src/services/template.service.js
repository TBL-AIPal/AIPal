const httpStatus = require('http-status');
const { Template, Course } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a template associated with a course
 * @param {ObjectId} courseId
 * @param {Object} templateBody
 * @returns {Promise<Template>}
 */
const createTemplate = async (courseId, templateBody) => {
  const template = await Template.create({
    ...templateBody,
    course: courseId,
  });

  // Update the course to add the template ID to the templates array
  await Course.updateOne(
    { _id: courseId },
    { $push: { templates: template._id } },
  );

  return template;
};

/**
 * Get templates by course ID
 * @param {ObjectId} courseId
 * @returns {Promise<Template[]>}
 */
const getTemplatesByCourseId = async (courseId) => {
  const course = await Course.findById(courseId).populate('templates');

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Return an empty array if no documents are found
  return course.templates.length ? course.templates : [];
};

/**
 * Get a template by ID
 * @param {ObjectId} templateId
 * @returns {Promise<template>}
 */
const getTemplateById = async (templateId) => {
  const template = await Template.findById(templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Template not found');
  }
  return template;
};

/**
 * Update template by ID
 * @param {ObjectId} templateId
 * @param {Object} updateBody
 * @returns {Promise<Template>}
 */
const updateTemplateById = async (templateId, updateBody) => {
  const template = await getTemplateById(templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Template not found');
  }
  Object.assign(template, updateBody);
  await template.save();
  return template;
};

/**
 * Delete a template by ID
 * @param {ObjectId} courseID
 * @param {ObjectId} templateId
 * @returns {Promise<template>}
 */
const deleteTemplateById = async (courseId, templateId) => {
  const template = await Template.findById(templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Template not found');
  }

  // Delete the course to remove the template ID from the templates array
  await Course.updateOne(
    { _id: courseId },
    { $pull: { templates: template._id } },
  );

  await template.remove();
  return template;
};

module.exports = {
  createTemplate,
  getTemplatesByCourseId,
  getTemplateById,
  updateTemplateById,
  deleteTemplateById,
};

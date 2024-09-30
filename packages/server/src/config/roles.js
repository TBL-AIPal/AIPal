const allRoles = {
  user: ['getCourses'],
  admin: [
    'getUsers',
    'manageUsers',
    'createCourses',
    'getCourses',
    'manageCourses',
    'getDocuments',
    'manageDocuments',
    'getTemplates',
    'manageTemplates',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = { roles, roleRights };

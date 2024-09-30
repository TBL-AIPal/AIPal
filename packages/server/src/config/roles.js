const allRoles = {
  user: ['getCourses'],
  admin: ['getUsers', 'manageUsers', 'createCourses', 'getCourses', 'manageCourses', 'getDocuments', 'manageDocuments'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = { roles, roleRights };

const allRoles = {
  user: ['getCourses', 'createMessage'],
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
    'getRooms',
    'manageRooms',
    'createMessage',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = { roles, roleRights };

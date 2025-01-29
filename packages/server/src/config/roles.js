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
    'getRooms',
    'manageRooms',
  ],
  teacher: [
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
  ],
  student: [
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
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = { roles, roleRights };

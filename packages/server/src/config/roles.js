const allRoles = {
  user: ['getCourses', 'getRooms', 'getMessages'], // Users can view courses, rooms, and messages

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
    'getMessages',  // Admins can read messages
    'sendMessage',  // Admins can send messages
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
    'getMessages',  // Teachers can view messages
    'sendMessage',  // Teachers can send messages
  ],

  student: [
    'getCourses',
    'getRooms',
    'getMessages',  // Students can view messages
    'sendMessage',  // Students can send messages
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = { roles, roleRights };

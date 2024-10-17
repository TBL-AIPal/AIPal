const multer = require('multer');

// Memory storage to keep file in buffer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit (optional)
});

module.exports = upload;

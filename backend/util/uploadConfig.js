const multer = require('multer')
const storage = multer.memoryStorage()

const uploadConfig = { 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and JPEG are allowed'));
    }
    cb(null, true);
  }
}

module.exports = uploadConfig
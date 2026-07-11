const multer = require('multer');
const path = require('path');

// 1. Configure where and how uploaded files are stored
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // all uploaded files go into an "uploads" folder
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // create a unique filename: fieldname-timestamp.extension
    // e.g. image-1699999999999.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

// 2. Only allow image files (jpg, jpeg, png, webp)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValidExtension = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isValidMimeType = allowedTypes.test(file.mimetype);

  if (isValidExtension && isValidMimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
  }
};

// 3. Set up multer with our storage rules, file filter, and a size limit
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = upload;
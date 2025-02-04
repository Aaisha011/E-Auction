
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'Images'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  });
  
  exports.upload = multer({
    storage,
    // limits: { fileSize: '50000000' },
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif|webp|pdf|avif/;
      const mimeType = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      if (mimeType && extname) return cb(null, true);
      cb('Invalid file format. Only images allowed.');
    },
  }).array('image', 10);
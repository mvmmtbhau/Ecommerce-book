var multer = require("multer");

const storage = (route) => {
  return multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = '../server/app/uploads/' + route
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.split(".");
        const newExt = ext[ext.length - 1];
        cb(null, `${Date.now()}.${newExt}`);
      },
  })
}
module.exports = function upload (route) {
  return multer({ storage: storage(route) });
};

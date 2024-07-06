const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/fileUploads/');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = `${uuidv4()}${ext}`;
        cb(null, uniqueSuffix);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls|ppt|pptx)$/)) {
        cb(null, true);
    } else {
        cb(new Error('Please upload valid file types: jpeg, jpg, png, pdf, doc, docx, xlsx, xls, ppt, pptx'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 20 }, // 20 MB limit
    fileFilter: fileFilter,
});

module.exports = upload;

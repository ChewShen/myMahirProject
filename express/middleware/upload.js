const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up temporary storage on disk
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // We will store uploaded files temporarily in an 'uploads' folder
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        // Generate a random UUID filename but keep the original extension (.pdf or .docx)
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 110 * 1024 * 1024 }, // 110 MB limit
    fileFilter: (req, file, cb) => {
        // Only allow PDF and DOCX files
        const allowedMimeTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'));
        }
    }
});

module.exports = upload;
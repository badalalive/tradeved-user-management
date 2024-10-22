import multer, { StorageEngine } from 'multer';
import path from 'path';
import * as fs from 'fs';

// Dynamic storage for images
const imageStorage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = 'uploads/images/'; // Image folder
        fs.mkdir(folder, { recursive: true }, (err) => {
            if (err) {
                return cb(err, folder);
            }
            cb(null, folder);
        });
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Image file filter
const imageFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed.'));
    }
};

// Multer middleware for image uploads
export const uploadImage = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1024 * 1024 * Number(process.env.IMAGE_MAX_SIZE) // Limit image size to 5MB
    },
    fileFilter: imageFileFilter
});

// Dynamic storage for documents
const documentStorage: StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        const folder = 'uploads/documents/'; // Document folder
        fs.mkdir(folder, { recursive: true }, (err) => {
            if (err) {
                return cb(err, folder);
            }
            cb(null, folder);
        });
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Document file filter
const documentFileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedDocumentTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv',
        'application/vnd.ms-excel',
        'application/zip',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (allowedDocumentTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only documents are allowed.'));
    }
};

// Multer middleware for document uploads
export const uploadDocument = multer({
    storage: documentStorage,
    limits: {
        fileSize: 1024 * 1024 * Number(process.env.DOCUMENT_MAX_SIZE) // Limit document size to 10MB
    },
    fileFilter: documentFileFilter
});

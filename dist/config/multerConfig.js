"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocument = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
// Dynamic storage for images
const imageStorage = multer_1.default.diskStorage({
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
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Image file filter
const imageFileFilter = (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only images are allowed.'));
    }
};
// Multer middleware for image uploads
exports.uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    limits: {
        fileSize: 1024 * 1024 * Number(process.env.IMAGE_MAX_SIZE) // Limit image size to 5MB
    },
    fileFilter: imageFileFilter
});
// Dynamic storage for documents
const documentStorage = multer_1.default.diskStorage({
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
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
// Document file filter
const documentFileFilter = (req, file, cb) => {
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
    }
    else {
        cb(new Error('Invalid file type. Only documents are allowed.'));
    }
};
// Multer middleware for document uploads
exports.uploadDocument = (0, multer_1.default)({
    storage: documentStorage,
    limits: {
        fileSize: 1024 * 1024 * Number(process.env.DOCUMENT_MAX_SIZE) // Limit document size to 10MB
    },
    fileFilter: documentFileFilter
});

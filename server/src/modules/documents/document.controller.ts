import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { AuthenticatedRequest } from '../../types/express';
import { storageConfig } from '../../config/storage';
import * as service from './document.service';

const storage = multer.diskStorage({
  destination: storageConfig.localPath,
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: storageConfig.maxFileSizeMB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (storageConfig.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`));
    }
  },
});

export const getByApplication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.getByApplication(req.params.applicationId) }); } catch (err) { next(err); }
};

export const uploadDocument = [
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) { res.status(400).json({ success: false, message: 'No file uploaded' }); return; }
      const data = await service.uploadDocument(req.body, req.file, req.user!.id);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  },
];

export const publicUploadDocument = [
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) { res.status(400).json({ success: false, message: 'No file uploaded' }); return; }
      const data = await service.uploadDocument(req.body, req.file, undefined);
      res.status(201).json({ success: true, data });
    } catch (err) { next(err); }
  },
];

export const verifyDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.verifyDocument(req.params.id, req.user!.id) }); } catch (err) { next(err); }
};

export const rejectDocument = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.rejectDocument(req.params.id, req.body.reason, req.user!.id) }); } catch (err) { next(err); }
};

export const getVersionHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await service.getVersionHistory(req.params.id) }); } catch (err) { next(err); }
};

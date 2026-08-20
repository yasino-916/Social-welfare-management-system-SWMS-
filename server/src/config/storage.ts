import path from 'path';

export const storageConfig = {
  type: process.env.STORAGE_TYPE || 'local',
  localPath: process.env.STORAGE_LOCAL_PATH
    ? path.resolve(process.env.STORAGE_LOCAL_PATH)
    : path.resolve(__dirname, '../../uploads'),
  maxFileSizeMB: 10,
  allowedMimeTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
  ],
  s3: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || '',
    bucket: process.env.AWS_S3_BUCKET || '',
  },
};

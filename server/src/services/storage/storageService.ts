import fs from 'fs';
import path from 'path';
import { storageConfig } from '../../config/storage';

/**
 * Abstract file storage service.
 * Currently backed by local disk. Swap implementation for S3 in production.
 */
export async function saveFile(
  buffer: Buffer,
  filename: string,
  subfolder = ''
): Promise<string> {
  const dir = path.join(storageConfig.localPath, subfolder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

export async function deleteFile(filePath: string): Promise<void> {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

export function getFileUrl(filePath: string): string {
  // Return a relative path for local storage;
  // replace with signed S3 URL in production
  return filePath.replace(storageConfig.localPath, '/uploads');
}

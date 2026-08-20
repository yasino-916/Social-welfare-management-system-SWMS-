import { v4 as uuidv4 } from 'uuid';
import db from '../../config/database';
import { writeAuditLog } from '../../middleware/auditMiddleware';
import { DocumentStatus } from '../../types/enums';

export async function getByApplication(applicationId: string) {
  return db('documents').where({ application_id: applicationId }).orderBy('uploaded_at', 'desc');
}

export async function uploadDocument(
  data: Record<string, unknown>,
  file: Express.Multer.File,
  uploadedBy: string | undefined
) {
  const id = uuidv4();
  await db('documents').insert({
    id,
    application_id: data.application_id,
    person_id: data.person_id,
    document_type: data.document_type,
    document_number: data.document_number,
    file_path: file.path,
    mime_type: file.mimetype,
    status: DocumentStatus.UPLOADED,
    uploaded_by: uploadedBy,
    uploaded_at: new Date(),
  });

  // Save version history (SRS §12)
  await db('document_versions').insert({
    id: uuidv4(),
    document_id: id,
    file_path: file.path,
    mime_type: file.mimetype,
    uploaded_by: uploadedBy,
    uploaded_at: new Date(),
    version: 1,
  });

  await writeAuditLog({ user_id: uploadedBy, action: 'UPLOAD_DOCUMENT', entity_type: 'document', entity_id: id });
  return db('documents').where({ id }).first();
}

export async function verifyDocument(id: string, verifiedBy: string) {
  await db('documents').where({ id }).update({
    status: DocumentStatus.VERIFIED,
    verified_by: verifiedBy,
    verified_at: new Date(),
  });
  await writeAuditLog({ user_id: verifiedBy, action: 'VERIFY_DOCUMENT', entity_type: 'document', entity_id: id });
  return db('documents').where({ id }).first();
}

export async function rejectDocument(id: string, reason: string, rejectedBy: string) {
  await db('documents').where({ id }).update({ status: DocumentStatus.REJECTED });
  await writeAuditLog({ user_id: rejectedBy, action: 'REJECT_DOCUMENT', entity_type: 'document', entity_id: id, reason });
  return db('documents').where({ id }).first();
}

export async function getVersionHistory(documentId: string) {
  return db('document_versions').where({ document_id: documentId }).orderBy('version', 'desc');
}

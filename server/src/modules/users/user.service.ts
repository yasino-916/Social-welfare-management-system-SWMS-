import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import db from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { writeAuditLog } from '../../middleware/auditMiddleware';

export async function listUsers(filters: Record<string, unknown>) {
  const query = db('users').select(
    'id', 'full_name', 'username', 'email', 'phone', 'role',
    'kebele_id', 'is_active', 'created_at'
  );
  if (filters.role) query.where('role', filters.role as string);
  if (filters.kebele_id) query.where('kebele_id', filters.kebele_id as string);
  return query.orderBy('full_name');
}

export async function createUser(
  data: Record<string, unknown>,
  createdBy: string
) {
  const existing = await db('users').where({ username: data.username }).first();
  if (existing) throw new AppError('Username already exists', 409);

  const password_hash = await bcrypt.hash(data.password as string, 12);
  const id = uuidv4();

  const [user] = await db('users')
    .insert({
      id,
      full_name: data.full_name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      password_hash,
      role: data.role,
      kebele_id: data.kebele_id,
      is_active: true,
      created_by: createdBy,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning(['id', 'full_name', 'username', 'role', 'kebele_id', 'is_active', 'created_at']);

  await writeAuditLog({
    user_id: createdBy,
    action: 'CREATE_USER',
    entity_type: 'user',
    entity_id: id,
    new_value: { role: data.role, kebele_id: data.kebele_id },
  });

  return user;
}

export async function getUserById(id: string) {
  const user = await db('users')
    .where({ id })
    .select('id', 'full_name', 'username', 'email', 'phone', 'role', 'kebele_id', 'is_active', 'created_at')
    .first();
  if (!user) throw new AppError('User not found', 404);
  return user;
}

export async function updateUser(
  id: string,
  data: Record<string, unknown>,
  updatedBy: string
) {
  const old = await getUserById(id);
  const allowed: Record<string, unknown> = {};
  if (data.full_name) allowed.full_name = data.full_name;
  if (data.email) allowed.email = data.email;
  if (data.phone) allowed.phone = data.phone;
  allowed.updated_at = new Date();

  await db('users').where({ id }).update(allowed);

  await writeAuditLog({
    user_id: updatedBy,
    action: 'UPDATE_USER',
    entity_type: 'user',
    entity_id: id,
    old_value: old as Record<string, unknown>,
    new_value: allowed,
  });

  return getUserById(id);
}

export async function suspendUser(id: string, suspendedBy: string) {
  await db('users').where({ id }).update({ is_active: false, updated_at: new Date() });
  await writeAuditLog({
    user_id: suspendedBy,
    action: 'SUSPEND_USER',
    entity_type: 'user',
    entity_id: id,
  });
}

export async function assignKebele(
  userId: string,
  kebeleId: string,
  assignedBy: string
) {
  await db('users').where({ id: userId }).update({ kebele_id: kebeleId, updated_at: new Date() });

  // Record assignment history (SRS §24)
  await db('user_kebele_assignments').insert({
    id: uuidv4(),
    user_id: userId,
    kebele_id: kebeleId,
    assigned_by: assignedBy,
    active_from: new Date(),
  });

  await writeAuditLog({
    user_id: assignedBy,
    action: 'ASSIGN_KEBELE',
    entity_type: 'user',
    entity_id: userId,
    new_value: { kebele_id: kebeleId },
  });
}

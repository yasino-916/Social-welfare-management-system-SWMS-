import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../config/database';
import { jwtConfig } from '../../config/jwt';
import { AppError } from '../../middleware/errorHandler';
import { writeAuditLog } from '../../middleware/auditMiddleware';

export async function login(
  username: string,
  password: string
): Promise<{ token: string; user: Record<string, unknown> }> {
  const user = await db('users')
    .where({ username, is_active: true })
    .first();

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const payload = {
    id: user.id,
    role: user.role,
    kebele_id: user.kebele_id,
    full_name: user.full_name,
  };

  const token = jwt.sign(payload, jwtConfig.secret as string, {
    expiresIn: jwtConfig.expiresIn as any,
  });

  await writeAuditLog({
    user_id: user.id,
    role: user.role,
    action: 'LOGIN',
    entity_type: 'user',
    entity_id: user.id,
  });

  const { password_hash: _, ...safeUser } = user;
  return { token, user: safeUser };
}

export async function getUserById(
  id: string
): Promise<Record<string, unknown>> {
  const user = await db('users').where({ id }).first();
  if (!user) throw new AppError('User not found', 404);
  const { password_hash: _, ...safeUser } = user;
  return safeUser;
}

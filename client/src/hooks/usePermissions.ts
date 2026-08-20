import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/enums';

/**
 * Convenience hook for role-based UI logic.
 * Components should still rely on backend enforcement for security.
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role;

  return {
    isSuperAdmin: role === UserRole.SUPER_ADMIN,
    isKebeleAdmin: role === UserRole.KEBELE_ADMIN,
    isFacilitator: role === UserRole.KEBELE_FACILITATOR,
    canMakeFinalDecision: role === UserRole.SUPER_ADMIN,
    canMakeKebeleDecision: role === UserRole.KEBELE_ADMIN || role === UserRole.SUPER_ADMIN,
    canManageUsers: role === UserRole.SUPER_ADMIN,
    canViewAuditLogs: role === UserRole.SUPER_ADMIN || role === UserRole.KEBELE_ADMIN,
    kebeleId: user?.kebele_id,
  };
}

import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '@/hooks/usePermissions';
import clsx from 'clsx';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItem = (to: string, label: string) => ({ to, label });

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const { isSuperAdmin, isKebeleAdmin } = usePermissions();

  const links = [
    navItem('/dashboard', t('nav.dashboard')),
    navItem('/households', t('nav.households')),
    navItem('/applications', t('nav.applications')),
    ...(isKebeleAdmin || isSuperAdmin
      ? [navItem('/applications/kebele-list', t('nav.kebeleList'))]
      : []),
    ...(isSuperAdmin
      ? [navItem('/applications/wereda-review', t('nav.weredaReview'))]
      : []),
    navItem('/beneficiaries', t('nav.beneficiaries')),
    navItem('/support', t('nav.support')),
    navItem('/complaints/admin', t('nav.complaints')),
    navItem('/feedback/admin', t('nav.feedback')),
    navItem('/reports', t('nav.reports')),
    ...(isSuperAdmin
      ? [
          navItem('/users', t('nav.users')),
          navItem('/kebeles', t('nav.kebeles')),
          navItem('/audit', t('nav.audit')),
        ]
      : []),
    navItem('/notifications', t('nav.notifications')),
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-700">
          <p className="font-bold text-sm leading-tight">Wereda Social Welfare</p>
          <p className="text-slate-400 text-xs mt-0.5">Management System</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border',
                  isActive
                    ? 'bg-slate-800 text-white border-slate-500 shadow-sm'
                    : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

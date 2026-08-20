import { useTranslation } from 'react-i18next';

export default function PublicFooter() {
  const { t } = useTranslation();
  return (
    <footer className="bg-white/50 backdrop-blur-md border-t border-slate-200/50 text-slate-500 text-sm font-medium text-center py-8 mt-12 relative z-10 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20 mb-2">
            <span className="text-white font-bold text-xs tracking-wider">WPS</span>
          </div>
          <p className="text-slate-600 font-semibold">&copy; {new Date().getFullYear()} Wereda Poverty Support System</p>
          <p className="text-xs text-slate-400">{t('site.footer', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PublicHeader() {
  const { t, i18n } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-slate-200/50 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
            <span className="text-white font-bold text-sm tracking-wide">WPS</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
              {t('site.title')}
            </p>
            <p className="text-slate-500 text-xs font-medium">{t('site.subtitle')}</p>
          </div>
        </Link>

        <div className="flex items-center gap-5">
          {/* Language toggle */}
          <button
            onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'am' : 'en')}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-all duration-300"
          >
            {i18n.language === 'en' ? 'አማርኛ' : 'English'}
          </button>
          <Link
            to="/login"
            className="btn-primary px-6 shadow-md"
          >
            {t('nav.login')}
          </Link>
        </div>
      </div>
    </header>
  );
}

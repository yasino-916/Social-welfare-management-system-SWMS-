import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ActionCard {
  to: string;
  emoji: string;
  title: string;
  description: string;
  primary?: boolean;
}

export default function PublicHomePage() {
  const { t } = useTranslation();

  const actions: ActionCard[] = [
    {
      to: '/register',
      emoji: '📝',
      title: t('public.register.title'),
      description: t('public.register.description'),
      primary: true,
    },
    {
      to: '/application/status',
      emoji: '🔍',
      title: t('public.status.title'),
      description: t('public.status.description'),
    },
    {
      to: '/feedback',
      emoji: '💬',
      title: t('public.feedback.title'),
      description: t('public.feedback.description'),
    },
    {
      to: '/complaint',
      emoji: '📣',
      title: t('public.complaint.title'),
      description: t('public.complaint.description'),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
      <div className="text-center mb-16 relative">
        <div className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-40" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-300 to-indigo-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
          <span className="block">{t('public.home.heading')}</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t('public.home.subheading')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`glass-panel p-8 flex flex-col sm:flex-row gap-6 items-start hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1 ${
              action.primary ? 'ring-2 ring-blue-500/50 bg-blue-50/40' : 'hover:border-blue-200'
            }`}
          >
            <div className={`p-4 rounded-2xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
              action.primary ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30' : 'bg-slate-100 group-hover:bg-blue-50'
            }`}>
              <span className={`text-4xl ${action.primary ? 'brightness-0 invert' : ''}`}>{action.emoji}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                {action.title}
              </h2>
              <p className="text-slate-600 leading-relaxed">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-20 text-center">
        <p className="text-sm text-slate-500 font-medium">Empowering communities through transparency and support</p>
      </div>
    </div>
  );
}

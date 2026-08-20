import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent relative overflow-hidden">
      <PublicHeader />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

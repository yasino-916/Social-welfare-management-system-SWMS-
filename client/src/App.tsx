import { Routes, Route, Navigate } from 'react-router-dom';

import { UserRole } from './types/enums';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public pages
import PublicHomePage from './pages/public/PublicHomePage';
import RegisterPage from './pages/registration/RegisterPage';
import ApplicationStatusPage from './pages/registration/ApplicationStatusPage';
import FeedbackPage from './pages/public/FeedbackPage';
import ComplaintPage from './pages/public/ComplaintPage';
import ComplaintTrackPage from './pages/public/ComplaintTrackPage';

// Auth
import LoginPage from './pages/auth/LoginPage';

// Admin — shared
import DashboardPage from './pages/admin/DashboardPage';
import NotificationsPage from './pages/notifications/NotificationsPage';

// Users
import UsersPage from './pages/users/UsersPage';

// Kebele / Wereda config
import KebelePage from './pages/admin/wereda/KebelePage';
import WeredaPage from './pages/admin/wereda/WeredaPage';

// Households
import HouseholdsPage from './pages/admin/kebele/HouseholdsPage';
import HouseholdDetailPage from './pages/admin/kebele/HouseholdDetailPage';

// Applications
import ApplicationsPage from './pages/applications/ApplicationsPage';
import ApplicationDetailPage from './pages/applications/ApplicationDetailPage';
import ApplicationReviewPage from './pages/applications/ApplicationReviewPage';
import KebeleSubmittedListPage from './pages/applications/KebeleSubmittedListPage';
import WeredaAuthorizationPage from './pages/applications/WeredaAuthorizationPage';
import AssistedRegistrationPage from './pages/admin/facilitator/AssistedRegistrationPage';

// Beneficiaries
import BeneficiariesPage from './pages/beneficiaries/BeneficiariesPage';
import BeneficiaryDetailPage from './pages/beneficiaries/BeneficiaryDetailPage';

// Support
import SupportProgramsPage from './pages/support/SupportProgramsPage';
import SupportDistributionsPage from './pages/support/SupportDistributionsPage';
import RecordDistributionPage from './pages/support/RecordDistributionPage';

// Complaints (admin)
import ComplaintsAdminPage from './pages/complaints/ComplaintsAdminPage';
import ComplaintDetailPage from './pages/complaints/ComplaintDetailPage';

// Feedback (admin)
import FeedbackAdminPage from './pages/feedback/FeedbackAdminPage';

// Reports
import ReportsPage from './pages/reports/ReportsPage';
import AuditPage from './pages/audit/AuditPage';

// Guards
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

export default function App() {
  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<PublicHomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/application/status" element={<ApplicationStatusPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/complaint" element={<ComplaintPage />} />
        <Route path="/complaint/track" element={<ComplaintTrackPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* ── Admin routes ── */}
      <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Super Admin only */}
        <Route element={<RoleRoute roles={[UserRole.SUPER_ADMIN]} />}>
          <Route path="/users" element={<UsersPage />} />
          <Route path="/wereda" element={<WeredaPage />} />
          <Route path="/kebeles" element={<KebelePage />} />
          <Route path="/applications/wereda-review" element={<WeredaAuthorizationPage />} />
          <Route path="/audit" element={<AuditPage />} />
        </Route>

        {/* Kebele Admin + Super Admin */}
        <Route element={<RoleRoute roles={[UserRole.KEBELE_ADMIN, UserRole.SUPER_ADMIN]} />}>
          <Route path="/applications/:id/review" element={<ApplicationReviewPage />} />
          <Route path="/applications/kebele-list" element={<KebeleSubmittedListPage />} />
          <Route path="/support" element={<SupportDistributionsPage />} />
          <Route path="/support/record" element={<RecordDistributionPage />} />
          <Route path="/complaints/admin" element={<ComplaintsAdminPage />} />
          <Route path="/complaints/admin/:id" element={<ComplaintDetailPage />} />
          <Route path="/feedback/admin" element={<FeedbackAdminPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* Facilitator, Admin, Super Admin */}
        <Route element={<RoleRoute roles={[UserRole.KEBELE_FACILITATOR, UserRole.KEBELE_ADMIN, UserRole.SUPER_ADMIN]} />}>
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route path="/households" element={<HouseholdsPage />} />
          <Route path="/households/:id" element={<HouseholdDetailPage />} />
          <Route path="/beneficiaries" element={<BeneficiariesPage />} />
          <Route path="/beneficiaries/:id" element={<BeneficiaryDetailPage />} />
          <Route path="/support/programs" element={<SupportProgramsPage />} />
          <Route path="/assisted-registration" element={<AssistedRegistrationPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import NewJobPage from './pages/NewJobPage';
import JobHistoryPage from './pages/JobHistoryPage';
import PostReviewPage from './pages/PostReviewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import KanbanBoard from './pages/KanbanBoard';
import StatusPage from './pages/StatusPage';
import SocialStudioPage from './pages/SocialStudioPage';

// Routes are managed using DashboardLayout for internal pages


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  console.log('ProtectedRoute: Checking token...', !!token);
  if (!token) {
    console.log('ProtectedRoute: No token, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="jobs" element={<KanbanBoard />} />
          <Route path="new-job" element={<NewJobPage />} />
          <Route path="social-studio" element={<SocialStudioPage />} />
          <Route path="jobs/:jobId/review" element={<PostReviewPage />} />
          <Route path="history" element={<JobHistoryPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/status/:jobId" element={<StatusPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

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

// Placeholder components (for those not implemented yet)
const PostReview = () => <div className="p-4"><h1>Post Review</h1></div>;
const Analytics = () => <div className="p-4"><h1>Analytics</h1></div>;
const Settings = () => <div className="p-4"><h1>Settings</h1></div>;

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
          <Route path="jobs/:jobId/review" element={<PostReviewPage />} />
          <Route path="history" element={<JobHistoryPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

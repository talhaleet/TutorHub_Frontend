import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// React Query config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

// Public pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import TutorProfilePage from './pages/TutorProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterSuccessPage from "./pages/RegisterSuccessPage";
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import NotFoundPage from './pages/NotFoundPage';

// Student pages
import BookSessionPage from './pages/BookSessionPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import StudentDashboard from './pages/StudentDashboard';
import MyBookingsPage from './pages/MyBookingsPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import ParentDashboard from './pages/ParentDashboard';
import ChildProfilesPage from './pages/ChildProfilesPage';

// Shared pages
import ChatPage from './pages/ChatPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

// Tutor pages
import TutorDashboard from './pages/TutorDashboard';
import TutorProfileEditPage from './pages/TutorProfileEditPage';
import TutorAvailabilityPage from './pages/TutorAvailabilityPage';
import TutorDocumentsPage from './pages/TutorDocumentsPage';
import TutorBookingsPage from './pages/TutorBookingsPage';
import TutorEarningsPage from './pages/TutorEarningsPage';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminTutorApprovalsPage from './pages/AdminTutorApprovalsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminSubjectsPage from './pages/AdminSubjectsPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>

          {/* Public routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/tutor/:id' element={<TutorProfilePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path="/register/success" element={<RegisterSuccessPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password' element={<ResetPasswordPage />} />
          <Route path='/verify-email' element={<VerifyEmailPage />} />

          {/* Authenticated routes */}
          <Route path='/chat' element={
            <ProtectedRoute><ChatPage /></ProtectedRoute>
          } />
          <Route path='/notifications' element={
            <ProtectedRoute><NotificationsPage /></ProtectedRoute>
          } />
          <Route path='/settings' element={
            <ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>
          } />
          <Route path='/dashboard/bookings' element={
            <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
          } />
          <Route path='/payment/:bookingId' element={
            <ProtectedRoute><PaymentPage /></ProtectedRoute>
          } />
          <Route path='/payment/success' element={
            <ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>
          } />
          <Route path='/dashboard/payments' element={
            <ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>
          } />

          {/* Student / Parent */}
          <Route path='/book/:tutorId' element={
            <ProtectedRoute allowedRoles={['Student', 'Parent']}>
              <BookSessionPage />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/student' element={
            <ProtectedRoute allowedRoles={['Student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/parent' element={
            <ProtectedRoute allowedRoles={['Parent']}>
              <ParentDashboard />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/children' element={
            <ProtectedRoute allowedRoles={['Parent']}>
              <ChildProfilesPage />
            </ProtectedRoute>
          } />

          {/* Tutor */}
          <Route path='/dashboard/tutor' element={
            <ProtectedRoute allowedRoles={['Tutor']}>
              <TutorDashboard />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/tutor/profile' element={
            <ProtectedRoute allowedRoles={['Tutor']}>
              <TutorProfileEditPage />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/tutor/availability' element={
            <ProtectedRoute allowedRoles={['Tutor']}>
              <TutorAvailabilityPage />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/tutor/documents' element={
            <ProtectedRoute allowedRoles={['Tutor']}>
              <TutorDocumentsPage />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/tutor/bookings' element={
            <ProtectedRoute allowedRoles={['Tutor']}>
              <TutorBookingsPage />
            </ProtectedRoute>
          } />
          <Route path='/dashboard/tutor/earnings' element={
            <ProtectedRoute allowedRoles={['Tutor']}>
              <TutorEarningsPage />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path='/admin' element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path='/admin/users' element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          } />
          <Route path='/admin/approvals' element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminTutorApprovalsPage />
            </ProtectedRoute>
          } />
          <Route path='/admin/bookings' element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminBookingsPage />
            </ProtectedRoute>
          } />
          <Route path='/admin/analytics' element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminAnalyticsPage />
            </ProtectedRoute>
          } />
          <Route path='/admin/subjects' element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminSubjectsPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path='*' element={<NotFoundPage />} />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
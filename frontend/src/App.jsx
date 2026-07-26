import { Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './layouts/AppLayout'
import CompleteProfilePage from './pages/CompleteProfilePage'
import HomePage from './pages/HomePage'
import LivestreamDetailsPage from './pages/LivestreamDetailsPage'
import LivestreamListPage from './pages/LivestreamListPage'
import LivestreamManagementPage from './pages/LivestreamManagementPage'
import LoginPage from './pages/LoginPage'
import MyLivestreamsPage from './pages/MyLivestreamsPage'
import NotFoundPage from './pages/NotFoundPage'
import QueueManagementPage from './pages/QueueManagementPage'
import StreamerDashboardPage from './pages/StreamerDashboardPage'
import ViewerDashboardPage from './pages/ViewerDashboardPage'

function Page({ children }) {
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Page><HomePage /></Page>} />
      <Route path="/livestreams" element={<Page><LivestreamListPage /></Page>} />
      <Route path="/livestreams/:id" element={<Page><LivestreamDetailsPage /></Page>} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <Page><CompleteProfilePage /></Page>
          </ProtectedRoute>
        }
      />
      <Route
        path="/viewer/dashboard"
        element={
          <ProtectedRoute requireProfile>
            <Page><ViewerDashboardPage /></Page>
          </ProtectedRoute>
        }
      />
      <Route
        path="/streamer/dashboard"
        element={
          <ProtectedRoute role="streamer" requireProfile>
            <Page><StreamerDashboardPage /></Page>
          </ProtectedRoute>
        }
      />
      <Route
        path="/streamer/livestreams"
        element={
          <ProtectedRoute role="streamer" requireProfile>
            <Page><MyLivestreamsPage /></Page>
          </ProtectedRoute>
        }
      />
      <Route
        path="/streamer/livestreams/:id/manage"
        element={
          <ProtectedRoute role="streamer" requireProfile>
            <Page><LivestreamManagementPage /></Page>
          </ProtectedRoute>
        }
      />
      <Route
        path="/streamer/livestreams/:id/queue"
        element={
          <ProtectedRoute role="streamer" requireProfile>
            <Page><QueueManagementPage /></Page>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Page><NotFoundPage /></Page>} />
    </Routes>
  )
}

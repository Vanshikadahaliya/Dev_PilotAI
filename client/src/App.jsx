import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Repositories from './pages/Repositories';
import ReadmeGenerator from './pages/ReadmeGenerator';
import DescriptionGenerator from './pages/DescriptionGenerator';
import PortfolioGenerator from './pages/PortfolioGenerator';
import PRSummarizer from './pages/PRSummarizer';
import BugExplainer from './pages/BugExplainer';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="repos" element={<Repositories />} />
            <Route path="readme" element={<ReadmeGenerator />} />
            <Route path="description" element={<DescriptionGenerator />} />
            <Route path="portfolio" element={<PortfolioGenerator />} />
            <Route path="pr-summary" element={<PRSummarizer />} />
            <Route path="bug-explainer" element={<BugExplainer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

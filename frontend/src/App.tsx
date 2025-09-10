import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation, ErrorBoundary, LoadingSpinner } from './components/common';
import { 
  HomePage, 
  AddTeamMemberPage, 
  CreateTeamPage, 
  AssignToTeamPage, 
  GiveFeedbackPage,
  FeedbackListPage,
  TeamManagementPage
} from './components/pages';
import { ToastProvider } from './contexts/ToastContext';
import { AppDataProvider, useAppData } from './contexts/AppDataContext';
import './styles/globals.css';

const AppContent: React.FC = () => {
  const { loading, error, refreshData } = useAppData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading application data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-2">Failed to load application data</h2>
            <p>{error}</p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-member" element={<AddTeamMemberPage />} />
          <Route path="/create-team" element={<CreateTeamPage />} />
          <Route path="/assign-team" element={<AssignToTeamPage />} />
          <Route path="/give-feedback" element={<GiveFeedbackPage />} />
          <Route path="/feedback-list" element={<FeedbackListPage />} />
          <Route path="/team-management" element={<TeamManagementPage />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppDataProvider>
          <Router>
            <AppContent />
          </Router>
        </AppDataProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
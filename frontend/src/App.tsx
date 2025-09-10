import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation, ErrorBoundary } from './components/common';
import { HomePage, AddTeamMemberPage, CreateTeamPage, AssignToTeamPage, GiveFeedbackPage } from './components/pages';
import './styles/globals.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/add-member" element={<AddTeamMemberPage />} />
              <Route path="/create-team" element={<CreateTeamPage />} />
              <Route path="/assign-team" element={<AssignToTeamPage />} />
              <Route path="/give-feedback" element={<GiveFeedbackPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
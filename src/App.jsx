import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import Calendar from './components/Calendar';
import Kanban from './components/Kanban';
import TodoList from './components/TodoList';
import Timeline from './components/Timeline';
import PomodoroTimer from './components/PomodoroTimer';
import Login from './components/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Navigation from './components/Navigation';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/todo" element={<TodoList />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/pomodoro" element={<PomodoroTimer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <AppContent />
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
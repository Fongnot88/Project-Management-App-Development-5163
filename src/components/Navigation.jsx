import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiCalendar, FiColumns, FiCheckSquare, FiClock, FiTimer, FiLogOut, FiUser } = FiIcons;

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/calendar', icon: FiCalendar, label: 'Calendar' },
    { path: '/kanban', icon: FiColumns, label: 'Kanban' },
    { path: '/todo', icon: FiCheckSquare, label: 'Todo List' },
    { path: '/timeline', icon: FiClock, label: 'Timeline' },
    { path: '/pomodoro', icon: FiTimer, label: 'Pomodoro' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              ProjectPro
            </Link>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center space-x-2 ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                >
                  <SafeIcon icon={item.icon} className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'}
                alt={user?.name}
                className="avatar"
              />
              <span className="text-sharp hidden sm:inline">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="sharp-button text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link flex items-center space-x-2 ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <SafeIcon icon={item.icon} className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
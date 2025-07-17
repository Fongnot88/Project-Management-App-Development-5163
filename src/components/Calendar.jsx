import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiChevronLeft, FiChevronRight, FiCalendar, FiUser, FiClock } = FiIcons;

const Calendar = () => {
  const { projects, tasks } = useProject();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const events = [];
    
    // Add project deadlines
    projects.forEach(project => {
      if (project.dueDate === dateStr) {
        events.push({
          type: 'project',
          title: project.name,
          color: 'bg-blue-500',
          data: project
        });
      }
    });
    
    // Add task deadlines
    tasks.forEach(task => {
      if (task.dueDate === dateStr) {
        events.push({
          type: 'task',
          title: task.title,
          color: 'bg-green-500',
          data: task
        });
      }
    });
    
    return events;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day) => {
    return day &&
           currentDate.getFullYear() === today.getFullYear() &&
           currentDate.getMonth() === today.getMonth() &&
           day === today.getDate();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ปฏิทิน</h1>
        <p className="text-gray-600">ดูกำหนดการโครงการและงานทั้งหมด</p>
      </div>

      <div className="sharp-card p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="sharp-button p-2"
          >
            <SafeIcon icon={FiChevronLeft} className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth(1)}
            className="sharp-button p-2"
          >
            <SafeIcon icon={FiChevronRight} className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center font-medium text-gray-700 bg-gray-50 border border-gray-200">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[120px] p-2 border border-gray-200 ${
                day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
              } ${isToday(day) ? 'bg-blue-50 border-blue-300' : ''}`}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-2 ${
                    isToday(day) ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {day}
                  </div>
                  
                  <div className="space-y-1">
                    {getEventsForDate(day).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`${event.color} text-white text-xs p-1 rounded truncate`}
                        title={event.title}
                      >
                        {event.type === 'project' ? '📋' : '✅'} {event.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="sharp-card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">โครงการที่จะครบกำหนด</h3>
          <div className="space-y-3">
            {projects
              .filter(project => new Date(project.dueDate) >= today)
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 5)
              .map((project) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">{project.name}</p>
                    <p className="text-sm text-gray-600">{project.progress}% เสร็จสิ้น</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{project.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="sharp-card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">งานที่จะครบกำหนด</h3>
          <div className="space-y-3">
            {tasks
              .filter(task => new Date(task.dueDate) >= today)
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .slice(0, 5)
              .map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <span className={`status-badge ${
                      task.status === 'Done' ? 'status-done' :
                      task.status === 'In Progress' ? 'status-progress' :
                      task.status === 'Review' ? 'status-review' : 'status-todo'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
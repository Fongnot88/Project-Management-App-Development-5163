import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUser, FiClock, FiTarget, FiFilter } = FiIcons;

const Timeline = () => {
  const { projects, tasks } = useProject();
  const [selectedProject, setSelectedProject] = useState('all');
  const [timeRange, setTimeRange] = useState('month');

  // Create timeline events from projects and tasks
  const createTimelineEvents = () => {
    const events = [];
    
    // Add project events
    projects.forEach(project => {
      if (selectedProject === 'all' || selectedProject === project.id.toString()) {
        events.push({
          id: `project-${project.id}`,
          type: 'project',
          title: `โครงการ: ${project.name}`,
          date: project.dueDate,
          description: project.description,
          progress: project.progress,
          status: project.status,
          assignee: project.members[0]?.name || 'ไม่ระบุ',
          color: 'bg-blue-500'
        });
      }
    });
    
    // Add task events
    tasks.forEach(task => {
      if (selectedProject === 'all' || selectedProject === task.projectId.toString()) {
        const project = projects.find(p => p.id === task.projectId);
        const assignee = project?.members.find(m => m.id === task.assigneeId);
        
        events.push({
          id: `task-${task.id}`,
          type: 'task',
          title: `งาน: ${task.title}`,
          date: task.dueDate,
          description: project?.name || 'งานส่วนตัว',
          progress: task.status === 'Done' ? 100 : task.status === 'In Progress' ? 50 : 0,
          status: task.status,
          assignee: assignee?.name || 'ไม่ระบุ',
          priority: task.priority,
          color: task.status === 'Done' ? 'bg-green-500' : 
                 task.status === 'In Progress' ? 'bg-yellow-500' : 'bg-gray-500'
        });
      }
    });
    
    // Sort events by date
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const timelineEvents = createTimelineEvents();

  const filterEventsByTimeRange = (events) => {
    const now = new Date();
    const filtered = events.filter(event => {
      const eventDate = new Date(event.date);
      const diffTime = eventDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      switch (timeRange) {
        case 'week':
          return diffDays >= -7 && diffDays <= 7;
        case 'month':
          return diffDays >= -30 && diffDays <= 30;
        case 'quarter':
          return diffDays >= -90 && diffDays <= 90;
        default:
          return true;
      }
    });
    
    return filtered;
  };

  const filteredEvents = filterEventsByTimeRange(timelineEvents);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'text-green-600';
      case 'In Progress': return 'text-blue-600';
      case 'Review': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'border-red-500';
      case 'Medium': return 'border-yellow-500';
      case 'Low': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = (dateString) => {
    return new Date(dateString) < new Date();
  };

  const isToday = (dateString) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return today.toDateString() === eventDate.toDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline</h1>
        <p className="text-gray-600">ติดตามความคืบหน้าของโครงการและงานตามลำดับเวลา</p>
      </div>

      {/* Filters */}
      <div className="sharp-card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">เลือกโครงการ</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="sharp-input w-full"
            >
              <option value="all">ทั้งหมด</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="sharp-input w-full"
            >
              <option value="week">สัปดาห์นี้</option>
              <option value="month">เดือนนี้</option>
              <option value="quarter">ไตรมาสนี้</option>
              <option value="all">ทั้งหมด</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
        
        <div className="space-y-8">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-6">
              {/* Timeline dot */}
              <div className={`relative z-10 w-4 h-4 rounded-full ${event.color} border-4 border-white shadow-lg`}></div>
              
              {/* Event content */}
              <div className="flex-1 min-w-0">
                <div className={`sharp-card p-6 ${event.type === 'task' ? `border-l-4 ${getPriorityColor(event.priority)}` : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                      <p className="text-gray-600 mt-1">{event.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`status-badge ${
                        event.status === 'Done' ? 'status-done' :
                        event.status === 'In Progress' ? 'status-progress' :
                        event.status === 'Review' ? 'status-review' : 'status-todo'
                      }`}>
                        {event.status}
                      </span>
                      
                      {event.type === 'task' && event.priority && (
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${
                          event.priority === 'High' ? 'text-red-600 bg-red-50 border-red-200' :
                          event.priority === 'Medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                          'text-green-600 bg-green-50 border-green-200'
                        }`}>
                          {event.priority}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiUser} className="w-4 h-4" />
                        <span>{event.assignee}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                        <span className={`${
                          isToday(event.date) ? 'text-blue-600 font-medium' :
                          isOverdue(event.date) && event.status !== 'Done' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {formatDate(event.date)}
                          {isToday(event.date) && ' (วันนี้)'}
                          {isOverdue(event.date) && event.status !== 'Done' && ' (เลยกำหนด)'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiTarget} className="w-4 h-4" />
                        <span>{event.progress}%</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${event.color}`}
                      style={{ width: `${event.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">ไม่พบข้อมูลในช่วงเวลาที่เลือก</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
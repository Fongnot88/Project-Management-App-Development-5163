import React from 'react';
import {useParams, Link} from 'react-router-dom';
import {useProject} from '../context/ProjectContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiArrowLeft,
  FiCalendar,
  FiUsers,
  FiTarget,
  FiClock,
  FiUser,
  FiGrid,
  FiList
} = FiIcons;

const ProjectDetail = () => {
  const {id} = useParams();
  const {projects, tasks} = useProject();
  const project = projects.find(p => p.id === parseInt(id));
  const projectTasks = tasks.filter(t => t.projectId === parseInt(id));

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบโครงการ</h2>
          <Link to="/" className="sharp-button bg-blue-600 text-white border-blue-600">
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Review': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStatusBadge = (status) => {
    switch (status) {
      case 'Done': return 'status-done';
      case 'In Progress': return 'status-progress';
      case 'Review': return 'status-review';
      default: return 'status-todo';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="sharp-button mb-4 inline-flex items-center space-x-2">
          <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
          <span>กลับไปหน้าหลัก</span>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex items-center space-x-4">
              <span className={`status-badge ${project.status === 'Done' ? 'status-done' : project.status === 'In Progress' ? 'status-progress' : project.status === 'Review' ? 'status-review' : 'status-todo'}`}>
                {project.status}
              </span>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                <span>กำหนดเสร็จ: {project.dueDate}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 mb-1">{project.progress}%</p>
            <p className="text-sm text-gray-600">ความคืบหน้า</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Image */}
          <div className="sharp-card p-6">
            <img src={project.image} alt={project.name} className="w-full h-64 object-cover rounded-lg border-2 border-gray-200" />
          </div>

          {/* Progress Bar */}
          <div className="sharp-card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ความคืบหน้าโครงการ</h3>
            <div className="progress-bar mb-4">
              <div className={`progress-fill ${getStatusColor(project.status)}`} style={{width: `${project.progress}%`}} />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>เริ่มต้น</span>
              <span>{project.progress}% เสร็จสิ้น</span>
              <span>เสร็จสิ้น</span>
            </div>
          </div>

          {/* Current Tasks */}
          <div className="sharp-card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">งานที่กำลังดำเนินการ</h3>
            <div className="space-y-4">
              {project.currentTasks.map((task, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{task.task}</h4>
                    <span className="text-sm text-gray-500">{task.dueDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">ผู้รับผิดชอบ: {task.assignee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Tasks */}
          <div className="sharp-card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">งานทั้งหมดในโครงการ</h3>
            <div className="space-y-3">
              {projectTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{task.title}</span>
                    <span className={`status-badge ${getTaskStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Project Info */}
          <div className="sharp-card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ข้อมูลโครงการ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTarget} className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">สถานะ: {project.status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">กำหนดเสร็จ: {project.dueDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">สมาชิก: {project.members.length} คน</span>
              </div>
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">ความคืบหน้า: {project.progress}%</span>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="sharp-card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">สมาชิกในทีม</h3>
            <div className="space-y-4">
              {project.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <img src={member.avatar} alt={member.name} className="avatar-large" />
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions - FIXED UI */}
          <div className="sharp-card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">การดำเนินการ</h3>
            <div className="space-y-3">
              <Link to="/kanban" className="sharp-button w-full bg-blue-600 text-white border-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2">
                <SafeIcon icon={FiGrid} className="w-4 h-4" />
                <span>ดูใน Kanban</span>
              </Link>
              <Link to="/timeline" className="sharp-button w-full flex items-center justify-center space-x-2">
                <SafeIcon icon={FiList} className="w-4 h-4" />
                <span>ดู Timeline</span>
              </Link>
              <Link to="/calendar" className="sharp-button w-full flex items-center justify-center space-x-2">
                <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                <span>ดูในปฏิทิน</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
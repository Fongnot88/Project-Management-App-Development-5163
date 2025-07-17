import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiCalendar, FiClock, FiArrowRight, FiTrendingUp, FiTarget, FiActivity } = FiIcons;

const Dashboard = () => {
  const { projects, loading } = useProject();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">กำลังโหลด...</div>
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

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.progress === 100).length;
  const inProgressProjects = projects.filter(p => p.progress > 0 && p.progress < 100).length;
  const averageProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">ภาพรวมโครงการทั้งหมดในบริษัท</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="sharp-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">โครงการทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <SafeIcon icon={FiTarget} className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="sharp-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">กำลังดำเนินการ</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressProjects}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="sharp-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">เสร็จสิ้นแล้ว</p>
              <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="sharp-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">ความคืบหน้าเฉลี่ย</p>
              <p className="text-2xl font-bold text-gray-900">{averageProgress}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">โครงการทั้งหมด</h2>
        <div className="project-grid">
          {projects.map((project) => (
            <div key={project.id} className="sharp-card p-6 hover:shadow-lg transition-shadow fade-in">
              <div className="mb-4">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className={`status-badge ${
                    project.status === 'Done' ? 'status-done' :
                    project.status === 'In Progress' ? 'status-progress' :
                    project.status === 'Review' ? 'status-review' : 'status-todo'
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-sm text-gray-500">{project.progress}%</span>
                </div>

                <div className="progress-bar mb-4">
                  <div
                    className={`progress-fill ${getProgressColor(project.progress)}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">สมาชิกในทีม</span>
                  <span className="text-sm text-gray-500">{project.members.length} คน</span>
                </div>
                <div className="flex -space-x-2">
                  {project.members.slice(0, 3).map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      className="avatar border-2 border-white"
                      title={`${member.name} (${member.role})`}
                    />
                  ))}
                  {project.members.length > 3 && (
                    <div className="avatar bg-gray-100 border-2 border-white flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">+{project.members.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">งานที่กำลังดำเนินการ</h4>
                <div className="space-y-2">
                  {project.currentTasks.slice(0, 2).map((task, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{task.task}</span>
                        <span className="text-xs text-gray-500">{task.dueDate}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">ผู้รับผิดชอบ: {task.assignee}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                  <span>กำหนดเสร็จ: {project.dueDate}</span>
                </div>
              </div>

              <Link
                to={`/project/${project.id}`}
                className="sharp-button w-full bg-blue-600 text-white border-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <span>ดูรายละเอียด</span>
                <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
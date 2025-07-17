import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiCheck, FiX, FiCalendar, FiUser, FiFilter, FiSearch } = FiIcons;

const TodoList = () => {
  const { projects, tasks, updateTask, addTask, deleteTask } = useProject();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    projectId: '',
    assigneeId: user?.id || '',
    priority: 'Medium',
    dueDate: '',
    personal: false
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'my' && task.assigneeId === user?.id) ||
      (filter === 'pending' && task.status !== 'Done') ||
      (filter === 'completed' && task.status === 'Done') ||
      (filter === 'high' && task.priority === 'High');
    
    return matchesSearch && matchesFilter;
  });

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Personal Task';
  };

  const getAssigneeName = (assigneeId) => {
    for (const project of projects) {
      const member = project.members.find(m => m.id === assigneeId);
      if (member) return member.name;
    }
    return 'Unassigned';
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.title) {
      addTask({
        ...newTask,
        status: 'Todo',
        projectId: newTask.projectId ? parseInt(newTask.projectId) : null,
        assigneeId: parseInt(newTask.assigneeId)
      });
      setNewTask({
        title: '',
        projectId: '',
        assigneeId: user?.id || '',
        priority: 'Medium',
        dueDate: '',
        personal: false
      });
      setShowAddForm(false);
    }
  };

  const handleToggleComplete = (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Done' ? 'Todo' : 'Done';
    updateTask(taskId, { status: newStatus });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'Done' ? FiCheck : FiX;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo List</h1>
            <p className="text-gray-600">จัดการงานส่วนตัวและงานในทีม</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="sharp-button bg-blue-600 text-white border-blue-600 hover:bg-blue-700 flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>เพิ่มงานใหม่</span>
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="sharp-card p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">เพิ่มงานใหม่</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่องาน</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="sharp-input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newTask.personal}
                    onChange={(e) => setNewTask({...newTask, personal: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">งานส่วนตัว</span>
                </label>
              </div>
              
              {!newTask.personal && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">โครงการ</label>
                  <select
                    value={newTask.projectId}
                    onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                    className="sharp-input w-full"
                  >
                    <option value="">เลือกโครงการ</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ผู้รับผิดชอบ</label>
                <select
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask({...newTask, assigneeId: e.target.value})}
                  className="sharp-input w-full"
                >
                  <option value={user?.id}>{user?.name} (ตัวเอง)</option>
                  {projects.flatMap(project => 
                    project.members.filter(member => member.id !== user?.id).map(member => (
                      <option key={member.id} value={member.id}>{member.name}</option>
                    ))
                  )}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ความสำคัญ</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  className="sharp-input w-full"
                >
                  <option value="Low">ต่ำ</option>
                  <option value="Medium">ปานกลาง</option>
                  <option value="High">สูง</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">กำหนดเสร็จ</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="sharp-input w-full"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="sharp-button bg-blue-600 text-white border-blue-600 hover:bg-blue-700 flex-1"
                >
                  เพิ่มงาน
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="sharp-button flex-1"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="sharp-card p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ค้นหางาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sharp-input pl-10 w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="sharp-input"
            >
              <option value="all">ทั้งหมด</option>
              <option value="my">งานของฉัน</option>
              <option value="pending">ยังไม่เสร็จ</option>
              <option value="completed">เสร็จแล้ว</option>
              <option value="high">ความสำคัญสูง</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`sharp-card p-4 hover:shadow-lg transition-shadow ${
              task.status === 'Done' ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex items-start space-x-4">
              <button
                onClick={() => handleToggleComplete(task.id, task.status)}
                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.status === 'Done' 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {task.status === 'Done' && <SafeIcon icon={FiCheck} className="w-4 h-4" />}
              </button>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-medium ${
                      task.status === 'Done' ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {getProjectName(task.projectId)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <SafeIcon icon={FiX} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiUser} className="w-4 h-4" />
                    <span>{getAssigneeName(task.assigneeId)}</span>
                  </div>
                  
                  {task.dueDate && (
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{task.dueDate}</span>
                    </div>
                  )}
                  
                  <span className={`status-badge ${
                    task.status === 'Done' ? 'status-done' :
                    task.status === 'In Progress' ? 'status-progress' :
                    task.status === 'Review' ? 'status-review' : 'status-todo'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">ไม่พบงานที่ตรงกับเงื่อนไข</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;
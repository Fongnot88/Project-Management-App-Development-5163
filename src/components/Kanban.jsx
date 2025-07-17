import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiCalendar, FiUser, FiMoreVertical, FiEdit, FiTrash2 } = FiIcons;

const Kanban = () => {
  const { projects, tasks, updateTask, addTask, deleteTask } = useProject();
  const [newTask, setNewTask] = useState({
    title: '',
    projectId: '',
    assigneeId: '',
    priority: 'Medium',
    dueDate: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const columns = [
    { id: 'Todo', title: 'รอดำเนินการ', color: 'bg-gray-100' },
    { id: 'In Progress', title: 'กำลังดำเนินการ', color: 'bg-blue-100' },
    { id: 'Review', title: 'ตรวจสอบ', color: 'bg-yellow-100' },
    { id: 'Done', title: 'เสร็จสิ้น', color: 'bg-green-100' }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'border-l-red-500';
      case 'Medium': return 'border-l-yellow-500';
      case 'Low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
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
    if (newTask.title && newTask.projectId) {
      addTask({
        ...newTask,
        status: 'Todo',
        projectId: parseInt(newTask.projectId),
        assigneeId: parseInt(newTask.assigneeId)
      });
      setNewTask({
        title: '',
        projectId: '',
        assigneeId: '',
        priority: 'Medium',
        dueDate: ''
      });
      setShowAddForm(false);
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('คุณต้องการลบงานนี้หรือไม่?')) {
      deleteTask(taskId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kanban Board</h1>
            <p className="text-gray-600">จัดการงานด้วยระบบ Kanban</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">โครงการ</label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({...newTask, projectId: e.target.value})}
                  className="sharp-input w-full"
                  required
                >
                  <option value="">เลือกโครงการ</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ผู้รับผิดชอบ</label>
                <select
                  value={newTask.assigneeId}
                  onChange={(e) => setNewTask({...newTask, assigneeId: e.target.value})}
                  className="sharp-input w-full"
                >
                  <option value="">เลือกผู้รับผิดชอบ</option>
                  {projects.flatMap(project => 
                    project.members.map(member => (
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

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => (
          <div key={column.id} className={`${column.color} rounded-lg p-4 border-2 border-gray-200`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{column.title}</h3>
              <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
                {getTasksByStatus(column.id).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {getTasksByStatus(column.id).map((task) => (
                <div
                  key={task.id}
                  className={`sharp-card p-4 border-l-4 ${getPriorityColor(task.priority)} hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-600">
                        <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{getProjectName(task.projectId)}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiUser} className="w-3 h-3" />
                      <span>{getAssigneeName(task.assigneeId)}</span>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    
                    <div className="flex space-x-1">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-1 py-0.5"
                      >
                        {columns.map(col => (
                          <option key={col.id} value={col.id}>{col.title}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
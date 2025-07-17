import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with mock data
    const mockProjects = [
      {
        id: 1,
        name: 'E-commerce Platform',
        description: 'Building a modern e-commerce platform with React and Node.js',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop',
        progress: 75,
        dueDate: '2024-03-15',
        status: 'In Progress',
        members: [
          { id: 1, name: 'สมชาย ใจดี', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face', role: 'Project Manager' },
          { id: 2, name: 'สมหญิง รักงาน', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9a6d1e3?w=50&h=50&fit=crop&crop=face', role: 'Frontend Developer' },
          { id: 3, name: 'วิชาญ โค้ดดี', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', role: 'Backend Developer' }
        ],
        currentTasks: [
          { assignee: 'สมหญิง รักงาน', task: 'Shopping Cart UI', dueDate: '2024-02-20' },
          { assignee: 'วิชาญ โค้ดดี', task: 'Payment API Integration', dueDate: '2024-02-22' }
        ]
      },
      {
        id: 2,
        name: 'Mobile Banking App',
        description: 'Secure mobile banking application with biometric authentication',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop',
        progress: 45,
        dueDate: '2024-04-30',
        status: 'In Progress',
        members: [
          { id: 4, name: 'ประยุทธ์ มือโปร', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face', role: 'Mobile Developer' },
          { id: 5, name: 'อรทัย ดีไซน์', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face', role: 'UI/UX Designer' }
        ],
        currentTasks: [
          { assignee: 'ประยุทธ์ มือโปร', task: 'Biometric Authentication', dueDate: '2024-02-25' },
          { assignee: 'อรทัย ดีไซน์', task: 'User Interface Design', dueDate: '2024-02-18' }
        ]
      },
      {
        id: 3,
        name: 'Data Analytics Dashboard',
        description: 'Real-time analytics dashboard for business intelligence',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
        progress: 90,
        dueDate: '2024-02-28',
        status: 'Review',
        members: [
          { id: 6, name: 'ดาต้า วิเคราะห์', avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=50&h=50&fit=crop&crop=face', role: 'Data Analyst' },
          { id: 7, name: 'ชาร์ต กราฟิก', avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=50&h=50&fit=crop&crop=face', role: 'Frontend Developer' }
        ],
        currentTasks: [
          { assignee: 'ดาต้า วิเคราะห์', task: 'Performance Optimization', dueDate: '2024-02-16' },
          { assignee: 'ชาร์ต กราฟิก', task: 'Final UI Polish', dueDate: '2024-02-17' }
        ]
      }
    ];

    const mockTasks = [
      { id: 1, title: 'Design Homepage', projectId: 1, assigneeId: 2, status: 'In Progress', priority: 'High', dueDate: '2024-02-20' },
      { id: 2, title: 'Setup Database', projectId: 1, assigneeId: 3, status: 'Done', priority: 'High', dueDate: '2024-02-15' },
      { id: 3, title: 'User Authentication', projectId: 2, assigneeId: 4, status: 'In Progress', priority: 'Medium', dueDate: '2024-02-25' },
      { id: 4, title: 'Data Visualization', projectId: 3, assigneeId: 6, status: 'Review', priority: 'Low', dueDate: '2024-02-16' }
    ];

    setProjects(mockProjects);
    setTasks(mockTasks);
    setLoading(false);
  }, []);

  const updateProject = (projectId, updates) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    ));
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const value = {
    projects,
    tasks,
    loading,
    updateProject,
    updateTask,
    addTask,
    deleteTask
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
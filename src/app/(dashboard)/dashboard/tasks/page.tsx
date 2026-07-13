"use client";
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await api.patch(`/tasks/${id}/status`, { status: newStatus });
    } catch (error) {
      console.error(error);
      fetchTasks();
    }
  };

  const addTestTask = async () => {
    try {
      await api.post('/tasks', {
        title: 'Follow up with Vikram',
        type: 'CALL',
        priority: 'HIGH',
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Tasks & Follow-ups</h1>
          <p className="text-slate-500 dark:text-slate-400">Stay on top of your daily activities.</p>
        </div>
        <button onClick={addTestTask} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-colors">
          <i className="fas fa-plus mr-2"></i> Add Task
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {tasks.map(task => (
            <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <button 
                onClick={() => handleStatusChange(task.id, task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED')}
                className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                  task.status === 'COMPLETED' 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                }`}
              >
                {task.status === 'COMPLETED' && <i className="fas fa-check text-xs"></i>}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <i className={`fas ${task.type === 'CALL' ? 'fa-phone' : task.type === 'MEETING' ? 'fa-handshake' : 'fa-tasks'}`}></i>
                    {task.type}
                  </span>
                  {task.lead && (
                    <span className="flex items-center gap-1">
                      <i className="fas fa-user text-blue-500/70"></i>
                      {task.lead.customer?.name}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className={new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED' ? 'text-red-500 font-medium' : ''}>
                      <i className="far fa-calendar-alt mr-1"></i>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                  task.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}

          {!loading && tasks.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <i className="fas fa-check-circle text-4xl mb-3 opacity-20"></i>
              <p>You're all caught up! No tasks found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

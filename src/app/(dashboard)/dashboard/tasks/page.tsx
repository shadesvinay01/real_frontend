"use client";
import React, { useState } from 'react';

const TASKS = [
  { id: 1, title: 'Follow up with Vikram Mehta', due: 'Today, 2:00 PM', type: 'Call', status: 'Pending', priority: 'High' },
  { id: 2, title: 'Prepare proposal for DLF Crest', due: 'Tomorrow, 10:00 AM', type: 'Document', status: 'Pending', priority: 'Medium' },
  { id: 3, title: 'Site visit with Neha', due: 'Friday, 4:00 PM', type: 'Meeting', status: 'Pending', priority: 'High' },
  { id: 4, title: 'Update listing photos', due: 'Yesterday', type: 'Admin', status: 'Completed', priority: 'Low' },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState(TASKS);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Tasks & Follow-ups</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your daily activities.</p>
        </div>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
          <i className="fas fa-plus mr-2"></i> New Task
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {tasks.map((task, index) => (
          <div key={task.id} className={`p-4 flex items-center justify-between ${index !== tasks.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''} ${task.status === 'Completed' ? 'opacity-60 bg-slate-50 dark:bg-slate-800/20' : ''}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleTask(task.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status === 'Completed' ? 'border-green-500 bg-green-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}
              >
                {task.status === 'Completed' && <i className="fas fa-check text-xs"></i>}
              </button>
              <div>
                <p className={`font-medium ${task.status === 'Completed' ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>{task.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span><i className="far fa-clock mr-1"></i> {task.due}</span>
                  <span><i className="far fa-folder mr-1"></i> {task.type}</span>
                </div>
              </div>
            </div>
            <div>
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${task.priority === 'High' ? 'bg-red-100 text-red-600' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { Search, Activity, Clock } from 'lucide-react';

const HomePage = () => {
  const tasks = [
    { id: 1, title: 'Upcoming Mentorship Session', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'New Connection Request: Sarah Lee', time: '2 mins ago', type: 'connect' },
    { id: 3, title: 'Review Python Basics Module', time: 'Due Today', type: 'task' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. CENTER SEARCH BAR */}
      <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">What do you want to learn today?</h2>
        <p className="text-gray-500 text-xs mb-4">Search for mentors, skills, or community discussions.</p>
        
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search for Python, React, Career Advice..." 
            className="w-full pl-10 pr-3 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition shadow-sm text-sm"
          />
          <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 text-white px-4 rounded-full font-medium hover:bg-blue-700 transition text-xs">
            Search
          </button>
        </div>
      </div>

      {/* 2. TASK BAR / DASHBOARD WIDGETS */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Daily Overview */}
        <div className="col-span-2 bg-white/90 backdrop-blur rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Activity className="text-blue-500" size={16} />
              Your Daily Tasks
            </h3>
            <button className="text-xs text-blue-600 hover:underline">View All</button>
          </div>
          
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-1.5 h-8 rounded-full 
                    ${task.type === 'meeting' ? 'bg-purple-500' : task.type === 'connect' ? 'bg-green-500' : 'bg-orange-500'}
                  `} />
                  <div>
                    <p className="font-semibold text-gray-800 text-xs">{task.title}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{task.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Clock size={14} />
                  {task.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Connect Panel */}
        <div className="bg-gradient-to-b from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">Grow Network</h3>
            <p className="text-blue-100 text-xs mb-4">Connect with mentors & peers.</p>
            
            <div className="flex -space-x-2 mb-4">
              <img className="w-8 h-8 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="" />
              <img className="w-8 h-8 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="" />
              <img className="w-8 h-8 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mark" alt="" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-white text-blue-600 flex items-center justify-center text-[10px] font-bold">
                +42
              </div>
            </div>
          </div>
          <button className="w-full py-2 bg-white text-blue-700 font-bold rounded-lg hover:bg-opacity-90 transition shadow-sm text-xs">
            Find Connections
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

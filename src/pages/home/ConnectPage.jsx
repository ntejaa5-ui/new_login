import React from 'react';

const ConnectPage = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Connect with Peers</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 transition">
          Invite Friends
        </button>
      </div>
      <p className="text-gray-500 mb-8 text-sm">Discover mentors and learners who share your interests.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Dummy Connection Cards */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition bg-white">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-3 w-24 bg-gray-100 rounded mb-4 animate-pulse"></div>
            <button className="w-full py-2 bg-gray-50 text-blue-600 text-xs font-bold rounded hover:bg-blue-50">
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectPage;

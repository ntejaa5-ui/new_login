import React from 'react';
import { MessageSquare } from 'lucide-react';

const ChatPage = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 h-[600px] flex overflow-hidden">
      {/* Chat Sidebar */}
      <div className="w-1/3 border-r border-gray-100 bg-gray-50 p-4">
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Search chats..." 
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm cursor-pointer flex gap-3 items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                <div className="h-2 w-12 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Main Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
          <MessageSquare size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Your Messages</h3>
        <p className="text-gray-400 text-sm text-center">Select a conversation from the left to start chatting.</p>
      </div>
    </div>
  );
};

export default ChatPage;

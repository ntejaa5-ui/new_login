import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { db } from './firebase'; // Import your config
import { collection, onSnapshot, query } from 'firebase/firestore';

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for real-time updates from Firebase
  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

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
        
        <div className="space-y-2 overflow-y-auto h-[calc(100%-60px)]">
          {loading ? (
            <p className="text-xs text-gray-400 text-center mt-4">Loading chats...</p>
          ) : (
            users.map((user) => (
              <div key={user.id} className="p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm cursor-pointer flex gap-3 items-center transition-all">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center font-bold">
                    {user.name?.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user.lastMessage || "No messages yet"}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Main Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8 text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
          <MessageSquare size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Your Messages</h3>
        <p className="text-gray-400 text-sm">Select a conversation from the left to start chatting.</p>
      </div>
    </div>
  );
};

export default ChatPage;

import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { db } from '../../firebase'; // Adjust path based on where your firebase.js is
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Reference the 'chats' collection in Firestore
    const q = query(collection(db, "chats"), orderBy("lastUpdated", "desc"));

    // 2. Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(chatList);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 h-[600px] flex overflow-hidden">
      {/* Sidebar */}
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
            <div className="text-center text-gray-400 text-xs py-4">Loading conversations...</div>
          ) : conversations.length > 0 ? (
            conversations.map((chat) => (
              <div key={chat.id} className="p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm cursor-pointer flex gap-3 items-center transition-all">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                  {chat.friendlyName ? chat.friendlyName.substring(0, 2).toUpperCase() : 'CH'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {chat.friendlyName || 'Untitled Chat'}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {chat.lastMessage || 'Click to view messages'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-xs py-4">No conversations found.</div>
          )}
        </div>
      </div>

      {/* Main View */}
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

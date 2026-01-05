import React from 'react';
import { HelpCircle, MessageSquare } from 'lucide-react';

const SupportPage = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Help & Support</h2>
      <p className="text-gray-500 mb-8 text-sm">How can we help you today?</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition text-center bg-white">
          <HelpCircle className="mx-auto mb-2 text-blue-500" size={24} />
          <h3 className="font-bold text-sm">FAQs</h3>
        </div>
        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition text-center bg-white">
          <MessageSquare className="mx-auto mb-2 text-green-500" size={24} />
          <h3 className="font-bold text-sm">Live Chat</h3>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4 text-sm">Send us a message</h3>
        <textarea 
          className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500 min-h-[100px]" 
          placeholder="Describe your issue..."
        ></textarea>
        <button className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-black transition">
          Submit Ticket
        </button>
      </div>
    </div>
  );
};

export default SupportPage;

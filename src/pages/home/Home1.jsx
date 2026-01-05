import React, { useState } from 'react';
import { 
  Home as HomeIcon, 
  Users, 
  MessageSquare, 
  HelpCircle, 
  CreditCard, 
  LogOut, 
  Settings, 
  Sparkles, 
  Menu, 
  X,
  Search,
  Activity,
  Clock 
} from 'lucide-react';

// --- Sub-Page Components ---
// In a real project, you can move these into separate files (e.g., HomePage.jsx) 
// and import them. For this preview, they are defined here to ensure it runs correctly.

const HomePage = () => {
  const tasks = [
    { id: 1, title: 'Upcoming Mentorship Session', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'New Connection Request: Sarah Lee', time: '2 mins ago', type: 'connect' },
    { id: 3, title: 'Review Python Basics Module', time: 'Due Today', type: 'task' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-sm border border-gray-100 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-1">What do you want to learn today?</h2>
        <p className="text-gray-500 text-xs mb-4">Search for mentors, skills, or community discussions.</p>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Search for Python, React, Career Advice..." className="w-full pl-10 pr-3 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition shadow-sm text-sm" />
          <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-blue-600 text-white px-4 rounded-full font-medium hover:bg-blue-700 transition text-xs">Search</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white/90 backdrop-blur rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2"><Activity className="text-blue-500" size={16} /> Your Daily Tasks</h3>
            <button className="text-xs text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-8 rounded-full ${task.type === 'meeting' ? 'bg-purple-500' : task.type === 'connect' ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <div>
                    <p className="font-semibold text-gray-800 text-xs">{task.title}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">{task.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs"><Clock size={14} />{task.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-b from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">Grow Network</h3>
            <p className="text-blue-100 text-xs mb-4">Connect with mentors & peers.</p>
            <div className="flex -space-x-2 mb-4">
              <img className="w-8 h-8 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="" />
              <img className="w-8 h-8 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="" />
              <div className="w-8 h-8 rounded-full border-2 border-white bg-white text-blue-600 flex items-center justify-center text-[10px] font-bold">+42</div>
            </div>
          </div>
          <button className="w-full py-2 bg-white text-blue-700 font-bold rounded-lg hover:bg-opacity-90 transition shadow-sm text-xs">Find Connections</button>
        </div>
      </div>
    </div>
  );
};

const ConnectPage = () => (
  <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Connect with Peers</h2>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 transition">Invite Friends</button>
    </div>
    <p className="text-gray-500 mb-8 text-sm">Discover mentors and learners who share your interests.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition bg-white">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <button className="w-full py-2 bg-gray-50 text-blue-600 text-xs font-bold rounded hover:bg-blue-50">Connect</button>
        </div>
      ))}
    </div>
  </div>
);

const ChatPage = () => (
  <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 h-[600px] flex overflow-hidden">
    <div className="w-1/3 border-r border-gray-100 bg-gray-50 p-4">
      <div className="mb-4"><input type="text" placeholder="Search chats..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-blue-500" /></div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm cursor-pointer flex gap-3 items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div><div className="h-3 w-20 bg-gray-200 rounded mb-1"></div><div className="h-2 w-12 bg-gray-100 rounded"></div></div>
          </div>
        ))}
      </div>
    </div>
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500"><MessageSquare size={32} /></div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Your Messages</h3>
      <p className="text-gray-400 text-sm text-center">Select a conversation from the left to start chatting.</p>
    </div>
  </div>
);

const SubscriptionPage = () => (
  <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscription Plans</h2>
    <p className="text-gray-500 mb-8 text-sm">Choose the best plan for your learning journey.</p>
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-xl p-6 flex justify-between items-center hover:border-blue-500 cursor-pointer transition bg-white">
        <div><h3 className="font-bold text-gray-800">Basic Plan</h3><p className="text-xs text-gray-500">Access to community forums</p></div>
        <span className="text-xl font-bold text-gray-800">Free</span>
      </div>
      <div className="border-2 border-blue-500 bg-blue-50/50 rounded-xl p-6 flex justify-between items-center relative">
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">CURRENT</div>
        <div><h3 className="font-bold text-blue-900">Pro Mentorship</h3><p className="text-xs text-blue-600">Weekly sessions & priority support</p></div>
        <div className="text-right"><span className="text-xl font-bold text-blue-900">$29</span><span className="text-xs text-blue-600">/mo</span></div>
      </div>
    </div>
  </div>
);

const SupportPage = () => (
  <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Help & Support</h2>
    <p className="text-gray-500 mb-8 text-sm">How can we help you today?</p>
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition text-center bg-white"><HelpCircle className="mx-auto mb-2 text-blue-500" size={24} /><h3 className="font-bold text-sm">FAQs</h3></div>
      <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition text-center bg-white"><MessageSquare className="mx-auto mb-2 text-green-500" size={24} /><h3 className="font-bold text-sm">Live Chat</h3></div>
    </div>
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <h3 className="font-bold text-gray-800 mb-4 text-sm">Send us a message</h3>
      <textarea className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500 min-h-[100px]" placeholder="Describe your issue..."></textarea>
      <button className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-black transition">Submit Ticket</button>
    </div>
  </div>
);

// --- Main Layout Component ---

const Home = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const toggleStatus = () => setIsOnline(!isOnline);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'connect': return <ConnectPage />;
      case 'chat': return <ChatPage />;
      case 'subscription': return <SubscriptionPage />;
      case 'support': return <SupportPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans text-sm relative overflow-hidden">
      
      {/* Background Watermark */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h1 className="text-9xl font-black text-gray-100 opacity-40 transform -rotate-12 whitespace-nowrap select-none">
          Connect. Learn. Grow.
        </h1>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="h-14 flex items-center justify-center border-b border-gray-100">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ConnectLearnGrow</h1>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center justify-between px-3">
            <span className="text-xs font-medium text-gray-500">Status</span>
            <button onClick={toggleStatus} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none ${isOnline ? 'bg-green-500' : 'bg-gray-300'}`}>
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${isOnline ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>
          <nav className="space-y-1">
            <SidebarItem icon={<HomeIcon size={18} />} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <SidebarItem icon={<Users size={18} />} label="Connect" active={activeTab === 'connect'} onClick={() => setActiveTab('connect')} />
            <SidebarItem icon={<MessageSquare size={18} />} label="Chat" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
            <SidebarItem icon={<CreditCard size={18} />} label="Subscription" active={activeTab === 'subscription'} onClick={() => setActiveTab('subscription')} />
            <SidebarItem icon={<HelpCircle size={18} />} label="Support" active={activeTab === 'support'} onClick={() => setActiveTab('support')} />
          </nav>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden absolute top-4 right-4 text-gray-500"><X size={20} /></button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 flex flex-col h-screen overflow-hidden relative z-10 bg-transparent">
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
            <h2 className="text-base font-semibold text-gray-700 hidden md:block">Welcome back, User!</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-md hover:opacity-90 transition text-xs font-bold">
              <Sparkles size={14} /><span>Ask AI</span>
            </button>
            <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
              <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition" title="Settings"><Settings size={18} /></button>
              <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition" title="Logout"><LogOut size={18} /></button>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 text-xs">JD</div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-xs font-medium ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
    {icon}<span>{label}</span>{active && <div className="ml-auto w-1 h-1 rounded-full bg-blue-600" />}
  </button>
);

export default Home;

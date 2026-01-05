import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Clock, 
  Code, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle,
  BookOpen,
  Plus,
  X,
  Sparkles,
  Loader
} from 'lucide-react';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null); // 'trainer' | 'learner' | null

  const handleBack = () => setSelectedRole(null);

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row font-sans">
        {/* --- TRAINER SIDE --- */}
        <div 
          onClick={() => setSelectedRole('trainer')}
          className="flex-1 bg-blue-50 hover:bg-blue-100 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-10 group border-b md:border-b-0 md:border-r border-gray-200"
        >
          <div className="bg-white p-6 rounded-full shadow-md mb-6 group-hover:scale-110 transition-transform">
            <Briefcase size={48} className="text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">I am a Trainer</h2>
          <p className="text-gray-500 text-center max-w-xs">
            Share your knowledge, mentor others, and grow your professional network.
          </p>
          <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-blue-600 font-semibold">
            Join as Trainer <ArrowRight size={20} />
          </div>
        </div>

        {/* --- LEARNER SIDE --- */}
        <div 
          onClick={() => setSelectedRole('learner')}
          className="flex-1 bg-green-50 hover:bg-green-100 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-10 group"
        >
          <div className="bg-white p-6 rounded-full shadow-md mb-6 group-hover:scale-110 transition-transform">
            <BookOpen size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">I am a Learner</h2>
          <p className="text-gray-500 text-center max-w-xs">
            Find mentors, learn new skills, and accelerate your career path.
          </p>
          <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-green-600 font-semibold">
            Join as Learner <ArrowRight size={20} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 transition-colors duration-500 ${selectedRole === 'trainer' ? 'bg-blue-50' : 'bg-green-50'}`}>
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium"
        >
          <ChevronLeft size={20} /> Back to Selection
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className={`p-6 text-white text-center ${selectedRole === 'trainer' ? 'bg-blue-600' : 'bg-green-600'}`}>
            <h1 className="text-2xl font-bold mb-1">
              {selectedRole === 'trainer' ? 'Trainer Registration' : 'Learner Registration'}
            </h1>
            <p className="opacity-90 text-sm">
              {selectedRole === 'trainer' ? 'Tell us about your expertise' : 'Tell us what you want to achieve'}
            </p>
          </div>

          <div className="p-8">
            {selectedRole === 'trainer' ? <TrainerForm /> : <LearnerForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER: Gemini API Call ---
const callGemini = async (prompt) => {
  const apiKey = ""; // Injected by environment
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
};

// --- ARROW FIELD COMPONENT ---
const ArrowField = ({ label, icon: Icon, children }) => (
  <div className="flex items-start gap-4 mb-6 group">
    <div className="w-1/3 flex flex-col items-end pt-2">
      <span className="font-bold text-gray-700 text-sm md:text-base flex items-center gap-2">
        {label} <Icon size={16} className="text-gray-400" />
      </span>
    </div>
    <div className="pt-2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
      <ArrowRight size={24} />
    </div>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

// --- TRAINER FORM ---
const TrainerForm = () => {
  const [techList, setTechList] = useState([]);
  const [currentTech, setCurrentTech] = useState('');
  const [designation, setDesignation] = useState(''); // Controlled input for AI context
  const [isAiLoading, setIsAiLoading] = useState(false);

  const addTech = (e) => {
    e?.preventDefault();
    if (currentTech.trim() && !techList.includes(currentTech.trim())) {
      setTechList([...techList, currentTech.trim()]);
      setCurrentTech('');
    }
  };

  const removeTech = (techToRemove) => {
    setTechList(techList.filter(t => t !== techToRemove));
  };

  const handleAiSuggest = async () => {
    if (!designation) return alert("Please enter a designation first!");
    
    setIsAiLoading(true);
    const prompt = `List 5 top technical skills or technologies for a "${designation}". Return ONLY the skills separated by commas, no numbering or extra text.`;
    
    const result = await callGemini(prompt);
    
    if (result) {
      const skills = result.split(',').map(s => s.trim());
      // Filter out duplicates that might already be in the list
      const newSkills = skills.filter(s => !techList.includes(s));
      setTechList([...techList, ...newSkills]);
    }
    setIsAiLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Trainer Details Submitted!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <ArrowField label="Full Name" icon={User}>
        <input 
          type="text" 
          placeholder="e.g. Jane Doe"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          required
        />
      </ArrowField>

      <ArrowField label="Designation" icon={Briefcase}>
        <input 
          type="text" 
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="e.g. Senior Software Engineer"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          required
        />
      </ArrowField>

      <ArrowField label="Experience" icon={Clock}>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="5"
            className="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            required
          />
          <span className="text-gray-500">Years</span>
        </div>
      </ArrowField>

      <ArrowField label="Technologies" icon={Code}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={currentTech}
              onChange={(e) => setCurrentTech(e.target.value)}
              placeholder="Add tech (e.g. React, Python)"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onKeyPress={(e) => e.key === 'Enter' && addTech(e)}
            />
            <button 
              onClick={addTech}
              type="button"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* AI Suggestion Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAiSuggest}
              disabled={isAiLoading || !designation}
              className={`
                text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-full transition
                ${isAiLoading 
                  ? 'bg-blue-100 text-blue-400 cursor-wait' 
                  : designation 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow hover:scale-105' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
              `}
            >
              {isAiLoading ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {isAiLoading ? 'Generating...' : 'Auto-fill Skills with Gemini'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {techList.map((tech) => (
              <span key={tech} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                {tech}
                <button type="button" onClick={() => removeTech(tech)} className="hover:text-blue-900">
                  <X size={14} />
                </button>
              </span>
            ))}
            {techList.length === 0 && <span className="text-xs text-gray-400 italic">No technologies added yet.</span>}
          </div>
        </div>
      </ArrowField>

      <div className="mt-8 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2">
          Submit Profile <CheckCircle size={20} />
        </button>
      </div>
    </form>
  );
};

// --- LEARNER FORM ---
const LearnerForm = () => {
  const [interestList, setInterestList] = useState([]);
  const [currentInterest, setCurrentInterest] = useState('');
  const [currentRole, setCurrentRole] = useState(''); // Controlled for AI
  const [isAiLoading, setIsAiLoading] = useState(false);

  const addInterest = (e) => {
    e?.preventDefault();
    if (currentInterest.trim() && !interestList.includes(currentInterest.trim())) {
      setInterestList([...interestList, currentInterest.trim()]);
      setCurrentInterest('');
    }
  };

  const removeInterest = (item) => {
    setInterestList(interestList.filter(i => i !== item));
  };

  const handleAiRecommend = async () => {
    if (!currentRole) return alert("Please enter your current role first!");
    
    setIsAiLoading(true);
    const prompt = `List 5 key skills or study topics for a "${currentRole}" to advance their career. Return ONLY the topics separated by commas, no numbering.`;
    
    const result = await callGemini(prompt);
    
    if (result) {
      const topics = result.split(',').map(s => s.trim());
      const newTopics = topics.filter(t => !interestList.includes(t));
      setInterestList([...interestList, ...newTopics]);
    }
    setIsAiLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Learner Preferences Submitted!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <ArrowField label="Your Name" icon={User}>
        <input 
          type="text" 
          placeholder="e.g. John Smith"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          required
        />
      </ArrowField>

      <ArrowField label="Current Role" icon={Briefcase}>
        <input 
          type="text" 
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          placeholder="e.g. Student / Junior Dev"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          required
        />
      </ArrowField>

      <ArrowField label="To Learn" icon={BookOpen}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={currentInterest}
              onChange={(e) => setCurrentInterest(e.target.value)}
              placeholder="What do you want to learn?"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              onKeyPress={(e) => e.key === 'Enter' && addInterest(e)}
            />
            <button 
              onClick={addInterest}
              type="button"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* AI Suggestion Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAiRecommend}
              disabled={isAiLoading || !currentRole}
              className={`
                text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-full transition
                ${isAiLoading 
                  ? 'bg-green-100 text-green-400 cursor-wait' 
                  : currentRole 
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow hover:scale-105' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
              `}
            >
              {isAiLoading ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
              {isAiLoading ? 'Thinking...' : 'Recommend Learning Path'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {interestList.map((item) => (
              <span key={item} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                {item}
                <button type="button" onClick={() => removeInterest(item)} className="hover:text-green-900">
                  <X size={14} />
                </button>
              </span>
            ))}
            {interestList.length === 0 && <span className="text-xs text-gray-400 italic">Add skills you want to learn.</span>}
          </div>
        </div>
      </ArrowField>

      <div className="mt-8 flex justify-end">
        <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition flex items-center gap-2">
          Start Learning <CheckCircle size={20} />
        </button>
      </div>
    </form>
  );
};

export default RoleSelection;

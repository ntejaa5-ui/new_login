import React, { useState, useEffect } from 'react';
import ChatPage from './pages/home/ChatPage';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Users, 
  MessageSquare, 
  HelpCircle, 
  CreditCard, 
  LogOut, 
  Settings, 
  Sparkles, 
  Search, 
  Activity, 
  Clock, 
  Menu, 
  X, 
  CheckCircle, 
  User, 
  ArrowRight, 
  Smartphone,
  Briefcase,
  BookOpen,
  Plus,
  Loader,
  Code,
  Mail,
  Lock,
  ChevronLeft,
  Globe
} from 'lucide-react';
// Import Firebase Auth
import { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { auth, googleProvider } from './firebase';

// --- HELPER: Gemini API Call ---
const callGemini = async (prompt) => {
  const apiKey = "YOUR_GEMINI_API_KEY"; // Replace with your actual key
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

// --- ROLE SELECTION & VERIFICATION COMPONENTS ---

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

const VerificationStep = ({ onVerified, roleColor = "blue" }) => {
  const [method, setMethod] = useState(null); // 'phone' | 'email' | null
  const [contact, setContact] = useState('');
  const [countryCode, setCountryCode] = useState('+91'); // Default Region
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Firebase specific state
  const [confirmationResult, setConfirmationResult] = useState(null);

  const themeColor = roleColor === 'green' ? 'text-green-600 bg-green-50 border-green-200' : 'text-blue-600 bg-blue-50 border-blue-200';
  const buttonColor = roleColor === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700';

  // --- GOOGLE AUTH ---
  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google User:", user);
      onVerified(user);
    } catch (error) {
      console.error("Google Auth Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- PHONE AUTH CONFIG ---
  useEffect(() => {
    if (method === 'phone') {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response) => {
            // reCAPTCHA solved
          }
        });
      }
    }
  }, [method]);

  // --- SEND OTP (Phone or Email) ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!contact) return;
    setIsLoading(true);

    try {
      if (method === 'phone') {
        // Firebase Phone Auth
        const phoneNumber = `${countryCode}${contact}`;
        const appVerifier = window.recaptchaVerifier;
        
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        setConfirmationResult(confirmation);
        setOtpSent(true);
        alert(`OTP sent to ${phoneNumber}`);
      } else {
        // Email Auth (Custom Backend for "PIN" requirement)
        // Since Firebase client doesn't send "PINs" to email, we call our backend
        /* const response = await fetch('YOUR_BACKEND_URL/api/send-email-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: contact })
        });
        if (!response.ok) throw new Error('Failed to send OTP');
        */
        
        // Simulating Backend Call for Demo
        setTimeout(() => {
          setOtpSent(true);
          alert(`Simulated: OTP '1234' sent to ${contact}. (Implement backend logic for real email PINs)`);
        }, 1500);
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      alert("Failed to send verification code. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- VERIFY OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (method === 'phone') {
        // Verify Firebase Phone OTP
        const result = await confirmationResult.confirm(otp);
        const user = result.user;
        onVerified(user);
      } else {
        // Verify Email PIN (Backend Call)
        /* const response = await fetch('YOUR_BACKEND_URL/api/verify-email-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: contact, otp })
        });
        const data = await response.json();
        if (data.verified) onVerified({ email: contact, uid: data.uid });
        */

        // Simulating Backend Verification
        if (otp === '1234') {
           setTimeout(() => {
             onVerified({ email: contact, uid: 'simulated-email-uid-' + Date.now() });
           }, 1000);
        } else {
          alert("Invalid code. Please enter 1234.");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Verify Error:", error);
      alert("Verification failed. " + error.message);
      setIsLoading(false);
    }
  };

  if (method) {
    return (
      <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800 text-lg">Verify your {method === 'phone' ? 'Phone' : 'Email'}</h3>
          <button 
            type="button"
            onClick={() => { setMethod(null); setOtpSent(false); setContact(''); setConfirmationResult(null); }} 
            className="text-xs text-gray-500 hover:underline flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Back
          </button>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                {method === 'phone' ? 'Region & Number' : 'Email Address'}
              </label>
              
              <div className="flex gap-2">
                {method === 'phone' && (
                  <div className="relative w-1/3">
                     <div className="absolute left-2 top-3.5 text-gray-400 pointer-events-none">
                       <Globe size={16} />
                     </div>
                     <select 
                       value={countryCode}
                       onChange={(e) => setCountryCode(e.target.value)}
                       className="w-full pl-8 pr-2 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                     >
                       <option value="+1">🇺🇸 +1</option>
                       <option value="+91">🇮🇳 +91</option>
                       <option value="+44">🇬🇧 +44</option>
                       <option value="+61">🇦🇺 +61</option>
                     </select>
                  </div>
                )}
                <div className="relative flex-1">
                  <input 
                    type={method === 'phone' ? 'tel' : 'email'} 
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={method === 'phone' ? '98765 43210' : 'you@example.com'}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    {method === 'phone' ? <Smartphone size={18} /> : <Mail size={18} />}
                  </div>
                </div>
              </div>
            </div>
            
            <div id="recaptcha-container"></div>

            <button type="submit" disabled={isLoading} className={`w-full ${buttonColor} text-white font-bold py-3 rounded-lg shadow-md transition flex justify-center items-center gap-2`}>
              {isLoading ? <Loader size={18} className="animate-spin" /> : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
              Enter the code sent to <strong>{method === 'phone' ? `${countryCode} ${contact}` : contact}</strong>
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Verification PIN</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition tracking-widest font-mono text-lg"
                  required
                />
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <Lock size={18} />
                </div>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className={`w-full ${buttonColor} text-white font-bold py-3 rounded-lg shadow-md transition flex justify-center items-center gap-2`}>
              {isLoading ? <Loader size={18} className="animate-spin" /> : 'Verify & Continue'}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8 space-y-5">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-3">
          <User size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Create your Account</h3>
        <p className="text-sm text-gray-5f00">Choose a method to verify your identity.</p>
      </div>

      <button 
        type="button"
        onClick={handleGoogleSignup} 
        disabled={isLoading} 
        className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3 shadow-sm"
      >
        {isLoading ? <Loader size={20} className="animate-spin text-gray-500" /> : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign up with Google
          </>
        )}
      </button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
        <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-500 uppercase font-medium">Or verify with</span></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          type="button"
          onClick={() => setMethod('phone')} 
          className={`flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed hover:border-solid hover:shadow-sm transition font-medium ${themeColor}`}
        >
          <Smartphone size={18} /> Phone
        </button>
        <button 
          type="button"
          onClick={() => setMethod('email')} 
          className={`flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed hover:border-solid hover:shadow-sm transition font-medium ${themeColor}`}
        >
          <Mail size={18} /> Email
        </button>
      </div>
    </div>
  );
};


const TrainerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get basic info passed from Login screen (name, email, uid)
  const { userData } = location.state || {}; 

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state

  const [fullName, setFullName] = useState(userData?.display_name || '');
  const [designation, setDesignation] = useState('');
  const [experience, setExperience] = useState('');
  const [techList, setTechList] = useState([]);
  const [currentTech, setCurrentTech] = useState('');

  // ... (addTech, removeTech, handleAiSuggest functions remain the same) ...
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
    try {
        const prompt = `List 5 top technical skills for ${designation}`;
        // Mock result
        const result = "React, Node.js, AWS, TypeScript, Docker"; 
        if (result) {
          const skills = result.split(',').map(s => s.trim());
          const newSkills = skills.filter(s => !techList.includes(s));
          setTechList([...techList, ...newSkills]);
        }
    } catch (err) {
        console.error("AI Error", err);
    }
    setIsAiLoading(false);
  };

  // --- INTEGRATED SUBMIT FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        alert("Session expired. Please log in again.");
        navigate('/');
        return;
    }

    try {
      // 1. Get a FRESH Token (The one from Login might be stale)
      const token = await currentUser.getIdToken();

      // 2. Prepare Payload matching your Pydantic Model (See Part 2 below)
      const payload = {
        role: 'trainer',
        phone: "", // Optional, add input if needed
        bio: `${designation} with ${experience} years of experience.`, // Basic bio mapping
        // Custom fields (Make sure backend accepts these!)
        designation: designation,
        experience_years: parseInt(experience),
        skills: techList,
        full_name: fullName
      };

      console.log("Sending Payload:", payload);

      // 3. Call the API
      const response = await fetch('https://connectlearngrow23-75285205083.asia-south1.run.app/api/auth/signup', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // <--- Critical for Depends(verify_firebase_token)
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      // 4. Success
      alert('Trainer Profile Created Successfully!');
      navigate('/home');

    } catch (error) {
      console.error("Submission Error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Welcome, {fullName.split(' ')[0]}! 
      </h2>
      
      <form onSubmit={handleSubmit} className="animate-fadeIn">
         {/* ... (Fields: Full Name, Designation, Experience, Technologies) ... */}
         {/* Copy input fields from your previous code here, they are unchanged */}
         
         <ArrowField label="Full Name" icon={User}>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none" 
            required 
          />
        </ArrowField>

        <ArrowField label="Designation" icon={Briefcase}>
          <input 
            type="text" 
            value={designation} 
            onChange={(e) => setDesignation(e.target.value)} 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none" 
            required 
          />
        </ArrowField>

        <ArrowField label="Experience" icon={Clock}>
            <input 
              type="number" 
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-24 px-4 py-2 rounded-lg border border-gray-300 outline-none" 
              required 
            />
        </ArrowField>

        <ArrowField label="Technologies" icon={Code}>
            <div className="space-y-3">
            <div className="flex gap-2">
                <input 
                type="text" 
                value={currentTech} 
                onChange={(e) => setCurrentTech(e.target.value)} 
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 outline-none" 
                onKeyPress={(e) => e.key === 'Enter' && addTech(e)} 
                />
                <button type="button" onClick={addTech} className="bg-gray-100 p-2 rounded-lg"><Plus size={20} /></button>
            </div>
            {/* Skills List display code... */}
            <div className="flex flex-wrap gap-2">
              {techList.map((tech) => (
                <span key={tech} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex gap-1">
                  {tech} <button type="button" onClick={() => removeTech(tech)}><X size={14} /></button>
                </span>
              ))}
            </div>
            </div>
        </ArrowField>

        <div className="mt-8 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-gray-400">
            {isSubmitting ? <Loader className="animate-spin"/> : <CheckCircle size={20} />}
            {isSubmitting ? 'Creating...' : 'Submit Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- LEARNER FORM ---
const LearnerForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Get basic info passed from Login screen
  const { userData } = location.state || {}; 

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Initialize State
  const [fullName, setFullName] = useState(userData?.display_name || '');
  const [currentRole, setCurrentRole] = useState(''); // Maps to 'designation' in DB
  const [interestList, setInterestList] = useState([]); // Maps to 'skills' in DB
  const [currentInterest, setCurrentInterest] = useState('');

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
    try {
        const prompt = `List 5 key skills for a "${currentRole}". Return ONLY the topics separated by commas.`;
        // const result = await callGemini(prompt);
        // Mock result
        const result = "Python, Data Structures, Algorithms, SQL, System Design";
        if (result) {
          const topics = result.split(',').map(s => s.trim());
          const newTopics = topics.filter(t => !interestList.includes(t));
          setInterestList([...interestList, ...newTopics]);
        }
    } catch (err) {
        console.error("AI Error", err);
    }
    setIsAiLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
        alert("Session expired. Please log in again.");
        navigate('/');
        return;
    }

    try {
      // 1. Get Fresh Token
      const token = await currentUser.getIdToken();

      // 2. Prepare Payload
      // We map Learner fields to the same Backend Schema used for Trainers
      const payload = {
        role: 'learner',
        full_name: fullName,
        
        // MAPPING: Learner's "Role" -> Backend "designation"
        designation: currentRole, 
        
        // MAPPING: Learner's "Interests" -> Backend "skills"
        skills: interestList, 

        // Optional/Default values for fields not used by Learners
        experience_years: 0, 
        bio: `Aspiring ${currentRole} interested in ${interestList.join(', ')}`,
        phone: ""
      };

      console.log("Submitting Learner Data:", payload);

      // 3. Call API
      const response = await fetch('https://connectlearngrow23-75285205083.asia-south1.run.app/api/auth/signup', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      alert('Learner Profile Created Successfully!');
      navigate('/home');

    } catch (error) {
      console.error("Submission Error:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">
        Welcome, {fullName.split(' ')[0]}!
      </h2>
      <p className="text-sm text-gray-500 mb-6">Tell us what you want to learn.</p>

      <form onSubmit={handleSubmit} className="animate-fadeIn">
        <ArrowField label="Your Name" icon={User}>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. John Smith" 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" 
            required 
          />
        </ArrowField>
        
        <ArrowField label="Current Role" icon={Briefcase}>
          <input 
            type="text" 
            value={currentRole} 
            onChange={(e) => setCurrentRole(e.target.value)} 
            placeholder="e.g. Student, Junior Dev" 
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" 
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
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none transition" 
                onKeyPress={(e) => e.key === 'Enter' && addInterest(e)} 
              />
              <button type="button" onClick={addInterest} className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition"><Plus size={20} /></button>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={handleAiRecommend} disabled={isAiLoading || !currentRole} className={`text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-full transition ${isAiLoading ? 'bg-green-100 text-green-400 cursor-wait' : currentRole ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow hover:scale-105' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                {isAiLoading ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {isAiLoading ? 'Thinking...' : 'Recommend Path'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interestList.map((item) => (
                <span key={item} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  {item} <button type="button" onClick={() => removeInterest(item)} className="hover:text-green-900"><X size={14} /></button>
                </span>
              ))}
            </div>
          </div>
        </ArrowField>

        <div className="mt-8 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-green-700 transition flex items-center gap-2 disabled:bg-gray-400">
            {isSubmitting ? <Loader className="animate-spin" /> : <CheckCircle size={20} />}
            {isSubmitting ? 'Creating...' : 'Start Learning'}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- MAIN ROLE SELECTION COMPONENT ---
const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null); // 'trainer' | 'learner' | null
  const navigate = useNavigate();

  const handleBack = () => setSelectedRole(null);
  const handleBackToLogin = () => navigate('/login');

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex flex-col md:flex-row font-sans">
        {/* --- TRAINER SIDE --- */}
        <div 
          onClick={() => setSelectedRole('trainer')}
          className="flex-1 bg-blue-50 hover:bg-blue-100 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center p-10 group border-b md:border-b-0 md:border-r border-gray-200 relative"
        >
          <button 
            onClick={(e) => { e.stopPropagation(); handleBackToLogin(); }}
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition font-medium z-10"
          >
            <ChevronLeft size={20} /> Back to Login
          </button>

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

// --- HOME PAGE & OTHER COMPONENTS ---

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

      <div className="grid md:grid-cols-3 gap-4">
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
                  <div className={`w-1.5 h-8 rounded-full ${task.type === 'meeting' ? 'bg-purple-500' : task.type === 'connect' ? 'bg-green-500' : 'bg-orange-500'}`} />
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
          <button className="w-full py-2 bg-white text-blue-700 font-bold rounded-lg hover:bg-opacity-90 transition shadow-sm text-xs">
            Find Connections
          </button>
        </div>
      </div>
    </div>
  );
};

const ConnectPage = () => (
  <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-100 min-h-[500px]">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Connect with Peers</h2>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 transition">
        Invite Friends
      </button>
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


// --- UPDATED CHAT PAGE TO FETCH FROM BACKEND ---
const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // REPLACE WITH YOUR BACKEND URL (Hardcoded for dev/preview)
        // Ensure your backend server is running and accessible
        const response = await fetch('http://localhost:5000/api/chat/list'); 
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error("Error loading chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-100 h-[600px] flex overflow-hidden">
      <div className="w-1/3 border-r border-gray-100 bg-gray-50 p-4">
        <div className="mb-4">
          <input type="text" placeholder="Search chats..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-blue-500" />
        </div>
        <div className="space-y-2">
          {loading ? (
            <div className="text-center text-gray-400 text-xs py-4">Loading conversations...</div>
          ) : conversations.length > 0 ? (
            conversations.map((chat) => (
              <div key={chat.sid} className="p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm cursor-pointer flex gap-3 items-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                  {chat.friendlyName ? chat.friendlyName.substring(0, 2).toUpperCase() : 'CH'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{chat.friendlyName || 'Untitled Chat'}</div>
                  <div className="text-xs text-gray-400">Click to view messages</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-xs py-4">No conversations found.</div>
          )}
        </div>
      </div>
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

const SubscriptionPage = () => (
  <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur rounded-xl p-8 shadow-sm border border-gray-100">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscription Plans</h2>
    <p className="text-gray-500 mb-8 text-sm">Choose the best plan for your learning journey.</p>
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-xl p-6 flex justify-between items-center hover:border-blue-500 cursor-pointer transition bg-white">
        <div>
          <h3 className="font-bold text-gray-800">Basic Plan</h3>
          <p className="text-xs text-gray-500">Access to community forums</p>
        </div>
        <span className="text-xl font-bold text-gray-800">Free</span>
      </div>
      <div className="border-2 border-blue-500 bg-blue-50/50 rounded-xl p-6 flex justify-between items-center relative">
        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">CURRENT</div>
        <div>
          <h3 className="font-bold text-blue-900">Pro Mentorship</h3>
          <p className="text-xs text-blue-600">Weekly sessions & priority support</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-blue-900">$29</span>
          <span className="text-xs text-blue-600">/mo</span>
        </div>
      </div>
    </div>
  </div>
);

const SupportPage = () => (
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
      <textarea className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-blue-500 min-h-[100px]" placeholder="Describe your issue..."></textarea>
      <button className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-lg text-xs font-bold hover:bg-black transition">Submit Ticket</button>
    </div>
  </div>
);

  // --- 5. LOGIN PAGE (Unified Entry) ---

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

   const API_URL ='https://connectlearngrow23-75285205083.asia-south1.run.app';

async function callSignInAPI(token) {
    const res = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          // The backend looks for the token here:
          'Authorization': `Bearer ${token}` 
      },
      // We remove the body. The token in the header contains 
      // all the necessary info (uid, email, etc.)
    });

    if (!res.ok) {
        // It's often safer to parse JSON error details if your backend sends them
        // otherwise fall back to text()
        try {
            const errData = await res.json();
            throw new Error(errData.detail || "Authentication failed");
        } catch (e) {
            throw new Error(await res.text());
        }
    }
    
    return res.json();
  };

  // --- THE "TRAFFIC COP" LOGIC ---
  const handleGoogleContinue = async () => {
    setLoading(true);
    setError('');
    const auth = getAuth();
    try {
      // 1. Google Auth
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      // 2. Send token to Backend to check if user exists/has role
      // In real code: const res = await fetch(`${API_URL}/api/auth/google`, ...)
      const backendData = await callSignInAPI(token);

      console.log("Backend Response:", backendData);

      // 3. Navigate based on Role
      if (!backendData.role) {
          // New User? Go to Onboarding
          navigate('/signup', { 
        state: { userData: backendData } 
    });
      } else {
          // Existing User? Go to Home
          navigate('/home');
      }
    } catch (err) {
      console.error(err);
      setError('Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="mb-8">
           <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-blue-200">
             <Users size={32} />
           </div>
           <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Connect Learn Grow</h1>
           <p className="text-gray-500">Your journey starts here.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

        <button 
          onClick={handleGoogleContinue}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition transform hover:-translate-y-1 shadow-sm flex items-center justify-center gap-3 relative overflow-hidden"
        >
          {loading ? <Loader size={24} className="animate-spin text-blue-600" /> : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span className="text-lg">Continue with Google</span>
            </>
          )}
        </button>

        <p className="mt-8 text-xs text-gray-400">
           By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

// --- HOME LAYOUT COMPONENT ---
const Home = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const toggleStatus = () => setIsOnline(!isOnline);
  const handleLogout = () => navigate('/login');

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
              <button onClick={handleLogout} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition" title="Logout"><LogOut size={18} /></button>
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

// --- APP ENTRY POINT ---
function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root URL to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Routes */}
        <Route path="/login" element={<Login />} />
        {/* ADDED SIGNUP ROUTE */}
        <Route path="/signup" element={<RoleSelection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;

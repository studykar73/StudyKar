import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Check, Sparkles, BookOpen, Star, ArrowRight } from 'lucide-react';
import { ExamType, EXAM_DETAILS, SUBJECT_COLORS } from '../types';

interface OnboardingProps {
  onComplete: (user: { name: string; email: string; currentExam: ExamType }) => void;
  onLogin: (user: { name: string; email: string; currentExam: ExamType; isAdmin?: boolean }) => void;
}

export default function Onboarding({ onComplete, onLogin }: OnboardingProps) {
  const [screen, setScreen] = useState<'welcome' | 'signup' | 'login'>('welcome');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [showExamSheet, setShowExamSheet] = useState(false);
  const [error, setError] = useState('');

  // Log in fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Splash slides data
  const slides = [
    {
      bg: '#FF6B6B', // Warm coral-orange
      title: 'Crack Every Exam.',
      subtitle: 'BCAT • MDCAT • ECAT • IoBM',
      description: 'The ultimate prep platform tailored specifically for Pakistani university admissions.',
      icon: '🏆',
      shape: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
    },
    {
      bg: '#FFD60A', // Electric yellow
      title: 'Learn Smarter.',
      subtitle: 'Video Lectures + Notes',
      description: 'Bite-sized visual lectures from Pakistan\'s top teachers paired with downloadable cheat sheets.',
      icon: '⚡',
      shape: 'ellipse(50% 50% at 50% 50%)',
    },
    {
      bg: '#B8FFE4', // Mint green
      title: 'Track. Practice. Ace.',
      subtitle: 'Your Progress, Your Pace.',
      description: 'Gamified streak tracking, micro-stats dashboards, and real-time conceptual breakdowns.',
      icon: '🎯',
      shape: 'inset(10% 10% 10% 10% round 20% 50% 20% 50%)',
    },
  ];

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setScreen('signup');
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) return setError('Please enter your full name');
    if (!email.trim() || !email.includes('@')) return setError('Please enter a valid email address');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!selectedExam) return setError('Please select an entrance exam');

    // Proceed
    onComplete({
      name: fullName,
      email,
      currentExam: selectedExam,
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !loginEmail.includes('@')) {
      return setError('Please enter a valid email address');
    }
    if (!loginPassword) {
      return setError('Please enter your password');
    }

    // Check Admin Credentials
    if (loginEmail.trim().toLowerCase() === 'studykar73@gmail.com') {
      if (loginPassword === '@StudyKar.pk73') {
        onLogin({
          name: 'StudyKar Admin',
          email: loginEmail.trim(),
          currentExam: 'MDCAT',
          isAdmin: true
        });
        return;
      } else {
        return setError('Incorrect admin password');
      }
    }

    // Since mock login, assign MDCAT by default or detect domain/mock
    let detectedExam: ExamType = 'MDCAT';
    if (loginEmail.toLowerCase().includes('bcat')) detectedExam = 'BCAT';
    else if (loginEmail.toLowerCase().includes('ecat')) detectedExam = 'ECAT';
    else if (loginEmail.toLowerCase().includes('iobm')) detectedExam = 'IoBM';

    onLogin({
      name: loginEmail.split('@')[0].toUpperCase().replace(/\d+/g, '') || 'Sohail Khan',
      email: loginEmail,
      currentExam: detectedExam,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[640px] flex flex-col overflow-hidden font-sans select-none">
      
      {/* ──────────────── SCREEN 1: WELCOME CAROUSEL ──────────────── */}
      {screen === 'welcome' && (
        <div 
          className="flex-1 flex flex-col transition-colors duration-500 overflow-y-auto"
          style={{ backgroundColor: slides[currentSlide].bg, color: '#0A0A0A' }}
        >
          {/* Header Skip */}
          <div className="flex justify-between items-center px-6 pt-5 pb-2">
            <span className="font-display font-extrabold text-lg tracking-wider">STUDYKAR.PK</span>
            <button 
              id="skip-onboarding"
              onClick={() => setScreen('signup')}
              className="text-sm font-bold underline cursor-pointer hover:opacity-80 decoration-2 transition-all"
            >
              Skip
            </button>
          </div>

          {/* Carousel Body */}
          <div className="flex-1 flex flex-col justify-center items-center px-6 py-6 text-center relative">
            
            {/* Background shapes mimicking Image 2 - Neo-brutalist scatter */}
            <div className="absolute top-10 left-10 w-12 h-12 bg-black opacity-10 rounded-full animate-bounce" />
            <div className="absolute bottom-24 right-10 w-16 h-16 bg-white opacity-20 transform rotate-12" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
            <div className="absolute bottom-32 left-12 w-8 h-8 bg-purple-600 opacity-20 rounded-lg transform -rotate-45" />

            {/* Sparkle Emojis / Decorative */}
            <div className="absolute top-4 right-16 text-black/20 text-3xl font-bold font-display">✦</div>
            <div className="absolute top-1/2 left-4 text-black/20 text-4xl font-bold font-display">✦</div>

            {/* Big Graphic Badge */}
            <div className="relative w-56 h-56 flex items-center justify-center mb-8">
              {/* Shadow Container */}
              <div className="absolute w-44 h-44 bg-black border-[3px] border-black rounded-3xl translate-x-3 translate-y-3" />
              {/* Animated Foreground */}
              <motion.div 
                key={currentSlide}
                initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-44 h-44 bg-white border-[3.5px] border-black rounded-3xl flex flex-col items-center justify-center p-4 relative z-10"
              >
                {/* Visual Character (like reference food sticker mascot or big number) */}
                <div className="text-7xl mb-2 filter drop-shadow-[2px_2px_0px_#000000]">{slides[currentSlide].icon}</div>
                <div 
                  className="w-12 h-3 bg-red-400 border-[2px] border-black rounded-full"
                  style={{ backgroundColor: SUBJECT_COLORS.English }}
                />
              </motion.div>
            </div>

            {/* Slide Text Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-md mx-auto"
              >
                <h1 className="text-4xl font-display font-black tracking-tight leading-none uppercase mb-2">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-sm font-display font-black tracking-widest text-black/70 mb-4 inline-block px-3 py-1 border-[2px] border-black bg-white rounded-md uppercase">
                  {slides[currentSlide].subtitle}
                </p>
                <p className="text-sm font-semibold leading-relaxed px-4 text-black/80">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Slide indicators - rectangular pills */}
            <div className="flex gap-2.5 mt-8 justify-center">
              {slides.map((_, i) => (
                <button
                  id={`slide-indicator-${i}`}
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-4.5 rounded-md border-[2px] border-black transition-all duration-300 ${
                    currentSlide === i ? 'w-10 bg-black' : 'w-4.5 bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Fixed Action Section */}
          <div className="px-6 pb-8 pt-4 flex flex-col gap-3.5 bg-white/20 backdrop-blur-xs border-t-[3px] border-black">
            <button
              id="welcome-create-account"
              onClick={() => setScreen('signup')}
              className="w-full h-[52px] bg-white text-black font-display font-black text-base border-[3.5px] border-black rounded-xl cursor-pointer shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_#000] transition-all flex items-center justify-center gap-2"
            >
              CREATE ACCOUNT <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              id="welcome-login"
              onClick={() => setScreen('login')}
              className="w-full h-[52px] bg-black text-white font-display font-black text-base border-[3.5px] border-black rounded-xl cursor-pointer shadow-[4px_4px_0px_rgba(255,255,255,0.4)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_rgba(255,255,255,0.4)] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_rgba(0,0,0,0)] transition-all flex items-center justify-center"
            >
              LOG IN
            </button>
          </div>
        </div>
      )}


      {/* ──────────────── SCREEN 2: SIGN UP ──────────────── */}
      {screen === 'signup' && (
        <div className="flex-1 flex flex-col bg-[#FFD60A] text-[#0A0A0A] overflow-y-auto p-6 relative">
          
          {/* Decorative Sparkle Background elements */}
          <div className="absolute top-4 right-8 text-black/15 text-4xl">✦</div>
          <div className="absolute bottom-1/3 left-2 text-black/15 text-5xl">✦</div>

          <div className="flex justify-between items-center mb-6">
            <span className="font-display font-extrabold text-lg tracking-wider">STUDYKAR.PK</span>
            <button 
              id="back-to-welcome-from-signup"
              onClick={() => setScreen('welcome')}
              className="text-xs font-bold bg-white border-[2px] border-black px-2.5 py-1 rounded-md shadow-[2px_2px_0px_#000]"
            >
              ← Back
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              
              <div className="mb-5 text-center">
                <h2 className="text-3xl font-display font-black uppercase leading-none tracking-tight">
                  JOIN STUDYKAR.PK ✦
                </h2>
                <p className="text-xs font-bold mt-1 text-black/70">
                  Select your board & start custom tracking.
                </p>
              </div>

              {/* White card container with bold border and hard shadow */}
              <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_#000] relative">
                
                {error && (
                  <div className="mb-4 p-2.5 bg-[#FF3F3F] text-white font-bold border-[2px] border-black rounded-lg text-xs flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-xs font-black uppercase mb-1 tracking-wider">Full Name</label>
                    <input
                      id="signup-name-input"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Hammad Siddiqui"
                      className="w-full h-11 px-3.5 border-[2.5px] border-black rounded-xl font-semibold text-sm bg-neutral-50 placeholder-neutral-400 focus:outline-hidden focus:ring-[3px] focus:ring-[#FF6B6B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase mb-1 tracking-wider">Email Address</label>
                    <input
                      id="signup-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. candidate@gmail.com"
                      className="w-full h-11 px-3.5 border-[2.5px] border-black rounded-xl font-semibold text-sm bg-neutral-50 placeholder-neutral-400 focus:outline-hidden focus:ring-[3px] focus:ring-[#FF6B6B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-black uppercase mb-1 tracking-wider">Password</label>
                      <div className="relative">
                        <input
                          id="signup-password-input"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="******"
                          className="w-full h-11 pl-3.5 pr-10 border-[2.5px] border-black rounded-xl font-semibold text-sm bg-neutral-50 placeholder-neutral-400 focus:outline-hidden focus:ring-[3px] focus:ring-[#FF6B6B]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-neutral-500 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase mb-1 tracking-wider">Confirm</label>
                      <input
                        id="signup-confirm-password-input"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="******"
                        className="w-full h-11 px-3.5 border-[2.5px] border-black rounded-xl font-semibold text-sm bg-neutral-50 placeholder-neutral-400 focus:outline-hidden focus:ring-[3px] focus:ring-[#FF6B6B]"
                      />
                    </div>
                  </div>

                  {/* Exam Selector Tappable Row */}
                  <div>
                    <label className="block text-xs font-black uppercase mb-1 tracking-wider">Exam Target</label>
                    <button
                      id="exam-selector-button"
                      type="button"
                      onClick={() => setShowExamSheet(true)}
                      className="w-full h-[46px] px-4 flex items-center justify-between border-[2.5px] border-black rounded-xl text-sm font-black text-left shadow-[2.5px_2.5px_0px_#000] cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]"
                      style={{ 
                        backgroundColor: selectedExam ? EXAM_DETAILS[selectedExam].accentColor : '#B8FFE4',
                      }}
                    >
                      <span className="uppercase">
                        {selectedExam ? `${selectedExam} - ${EXAM_DETAILS[selectedExam].fullName}` : 'Select Your Exam ▾'}
                      </span>
                      <span>▾</span>
                    </button>
                  </div>

                  {/* Start My Journey Submit */}
                  <button
                    id="signup-submit-button"
                    type="submit"
                    className="w-full h-[50px] bg-[#C8F135] text-black font-display font-black text-base border-[3px] border-black rounded-xl cursor-pointer shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_#000] transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    START MY JOURNEY →
                  </button>
                </form>

              </div>

              <div className="text-center mt-6">
                <button
                  id="goto-login-button"
                  onClick={() => setScreen('login')}
                  className="text-xs font-bold underline decoration-2 cursor-pointer hover:opacity-85"
                >
                  Already studying with us? Log In
                </button>
              </div>

            </div>
          </div>

          {/* ─── BOTTOM SHEET EXAM SELECTOR (Glassmorphism Modal) ─── */}
          <AnimatePresence>
            {showExamSheet && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-end justify-center">
                {/* Dismiss backdrop overlay click */}
                <div className="absolute inset-0" onClick={() => setShowExamSheet(false)} />
                
                {/* Interactive Bottom Sheet */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 22, stiffness: 220 }}
                  className="w-full max-w-md bg-neutral-900/90 text-white border-t-[4px] border-black rounded-t-3xl p-6 relative z-10 shadow-[0_-10px_25px_rgba(0,0,0,0.5)] overflow-hidden"
                  style={{ backdropFilter: 'blur(16px)' }}
                >
                  {/* Pull bar */}
                  <div className="w-12 h-1.5 bg-neutral-600 rounded-full mx-auto mb-5" />

                  <h3 className="text-lg font-display font-black uppercase text-[#C8F135] mb-4 text-center">
                    WHICH EXAM ARE YOU PREPARING FOR? ✦
                  </h3>

                  <div className="flex flex-col gap-3 mb-6">
                    {(Object.keys(EXAM_DETAILS) as ExamType[]).map((exam) => (
                      <button
                        id={`select-exam-option-${exam}`}
                        key={exam}
                        onClick={() => setSelectedExam(exam)}
                        className={`w-full text-left p-3.5 rounded-xl border-[2.5px] transition-all flex items-center justify-between cursor-pointer ${
                          selectedExam === exam 
                            ? 'bg-neutral-800 border-white text-white' 
                            : 'bg-neutral-950/40 border-neutral-800 text-neutral-300 hover:border-neutral-600'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Left solid color strip */}
                          <div 
                            className="w-2.5 h-10 rounded-full" 
                            style={{ backgroundColor: EXAM_DETAILS[exam].accentColor }}
                          />
                          <div>
                            <div className="font-display font-black text-base">{exam}</div>
                            <div className="text-xs text-neutral-400 font-medium leading-tight">
                              {EXAM_DETAILS[exam].fullName}
                            </div>
                          </div>
                        </div>

                        {/* Checkbox circular icon */}
                        <div className={`w-6 h-6 rounded-full border-[2px] flex items-center justify-center transition-all ${
                          selectedExam === exam 
                            ? 'bg-green-400 border-black text-black' 
                            : 'border-neutral-600 bg-transparent'
                        }`}>
                          {selectedExam === exam && <Check className="w-4.5 h-4.5 stroke-[3]" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Confirm CTA */}
                  <button
                    id="confirm-exam-selection"
                    onClick={() => {
                      if (selectedExam) setShowExamSheet(false);
                    }}
                    disabled={!selectedExam}
                    className={`w-full h-12 rounded-xl border-[3px] border-black font-display font-black uppercase flex items-center justify-center transition-all shadow-[4px_4px_0px_#000] cursor-pointer ${
                      selectedExam 
                        ? 'bg-[#C8F135] text-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000]' 
                        : 'bg-neutral-700 border-neutral-800 text-neutral-500 cursor-not-allowed shadow-none'
                    }`}
                  >
                    LET'S GO →
                  </button>

                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}


      {/* ──────────────── SCREEN 3: LOG IN ──────────────── */}
      {screen === 'login' && (
        <div className="flex-1 flex flex-col bg-[#B8FFE4] text-[#0A0A0A] overflow-y-auto p-6 relative">
          
          <div className="absolute top-8 left-12 text-black/15 text-4xl">✦</div>
          <div className="absolute bottom-1/4 right-8 text-black/15 text-5xl">✦</div>

          <div className="flex justify-between items-center mb-6">
            <span className="font-display font-extrabold text-lg tracking-wider">STUDYKAR.PK</span>
            <button 
              id="back-to-welcome-from-login"
              onClick={() => setScreen('welcome')}
              className="text-xs font-bold bg-white border-[2px] border-black px-2.5 py-1 rounded-md shadow-[2px_2px_0px_#000]"
            >
              ← Back
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              
              <div className="mb-5 text-center">
                <h2 className="text-3xl font-display font-black uppercase leading-none tracking-tight">
                  WELCOME BACK ✦
                </h2>
                <p className="text-xs font-bold mt-1 text-black/70">
                  Ready to crush your entrance exams?
                </p>
              </div>

              {/* White card container */}
              <div className="bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_#000] relative">
                
                {error && (
                  <div className="mb-4 p-2.5 bg-[#FF3F3F] text-white font-bold border-[2px] border-black rounded-lg text-xs flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase mb-1 tracking-wider">Email Address</label>
                    <input
                      id="login-email-input"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. studykar73@gmail.com"
                      className="w-full h-11 px-3.5 border-[2.5px] border-black rounded-xl font-semibold text-sm bg-neutral-50 placeholder-neutral-400 focus:outline-hidden focus:ring-[3px] focus:ring-[#FF6B6B]"
                    />
                    <div className="text-[10px] text-neutral-500 font-bold mt-1">
                      Tip: Enter any email. Add "bcat", "ecat", or "iobm" to test specific exams.
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-black uppercase tracking-wider">Password</label>
                      <button 
                        type="button" 
                        onClick={() => alert('Mock password reset sent! Real integrations use Firebase Auth.')}
                        className="text-xs font-bold underline cursor-pointer hover:opacity-80"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password-input"
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="******"
                        className="w-full h-11 pl-3.5 pr-10 border-[2.5px] border-black rounded-xl font-semibold text-sm bg-neutral-50 placeholder-neutral-400 focus:outline-hidden focus:ring-[3px] focus:ring-[#FF6B6B]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-3 text-neutral-500 cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Log In Button */}
                  <button
                    id="login-submit-button"
                    type="submit"
                    className="w-full h-[50px] bg-[#FF6FD8] text-black font-display font-black text-base border-[3px] border-black rounded-xl cursor-pointer shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_#000] transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    LOG IN →
                  </button>
                </form>

              </div>

              <div className="text-center mt-6">
                <button
                  id="goto-signup-button"
                  onClick={() => setScreen('signup')}
                  className="text-xs font-bold underline decoration-2 cursor-pointer hover:opacity-85"
                >
                  New here? Create Account
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}

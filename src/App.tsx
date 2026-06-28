import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Sparkles, Star, Award, BookOpen, User, Activity, LogOut, X } from 'lucide-react';

import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Progress from './components/Progress';
import Profile from './components/Profile';
import SubjectDetail from './components/SubjectDetail';
import AdminPanel from './components/AdminPanel';

import { 
  ExamType, 
  SubjectModule, 
  User as UserType, 
  generateMockSubjects, 
  EXAM_SUBJECT_MAPPING,
  Lecture,
  Note
} from './types';

export default function App() {
  // ─── THEME & PERSISTED STATE INITIALIZATIONS ───
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('studykar_theme');
    if (saved) return saved === 'dark';
    // default device detection
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [user, setUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('studykar_user');
    if (saved) {
      const parsed = JSON.parse(saved) as UserType;
      // Completely clean fake progress/streaks from loaded user
      return {
        ...parsed,
        streakDays: 0,
        bestStreak: 0,
        completedLectures: [],
        downloadedNotes: [],
      };
    }
    return null;
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

  const [subjectDeck, setSubjectDeck] = useState<Record<string, SubjectModule>>(() => {
    const saved = localStorage.getItem('studykar_subjects');
    if (saved) {
      const parsed = JSON.parse(saved) as Record<string, SubjectModule>;
      // Filter out any lectures or notes containing old mock IDs or old demo formats
      const cleaned: Record<string, SubjectModule> = {};
      for (const key in parsed) {
        const sub = parsed[key];
        cleaned[key] = {
          ...sub,
          completedChapters: 0, // Starts at 0 progress
          lectures: sub.lectures.filter(l => !l.id.includes('-lec-') && l.id !== 'lec-1' && l.id !== 'lec-2' && l.id !== 'lec-3' && l.id !== 'lec-4' && l.id !== 'lec-5'),
          notes: sub.notes.filter(n => !n.id.includes('-note-') && n.id !== 'note-1' && n.id !== 'note-2' && n.id !== 'note-3')
        };
      }
      return cleaned;
    }
    return generateMockSubjects();
  });

  const [usersList, setUsersList] = useState<UserType[]>(() => {
    const saved = localStorage.getItem('studykar_registered_users');
    if (saved) {
      const parsed = JSON.parse(saved) as UserType[];
      // Completely clean fake/demo users and mock progress from list
      return parsed
        .map(u => ({
          ...u,
          streakDays: 0,
          bestStreak: 0,
          completedLectures: [],
          downloadedNotes: []
        }))
        .filter(u => u.email.toLowerCase() !== 'hammad.sid@gmail.com' && u.email.toLowerCase() !== 'aisha.f@yahoo.com' && u.email.toLowerCase() !== 'bilal.ahmed@outlook.com');
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<'home' | 'progress' | 'profile'>('home');
  const [selectedSubject, setSelectedSubject] = useState<SubjectModule | null>(null);

  // Sync theme changes to local storage & HTML document body
  useEffect(() => {
    localStorage.setItem('studykar_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync user changes to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem('studykar_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('studykar_user');
    }
  }, [user]);

  // Sync subject decks to local storage
  useEffect(() => {
    localStorage.setItem('studykar_subjects', JSON.stringify(subjectDeck));
  }, [subjectDeck]);

  // Sync registered users list
  useEffect(() => {
    localStorage.setItem('studykar_registered_users', JSON.stringify(usersList));
  }, [usersList]);

  // ─── HANDLERS ───
  const handleSignUpComplete = (signUpDetails: { name: string; email: string; currentExam: ExamType }) => {
    const newUser: UserType = {
      name: signUpDetails.name,
      email: signUpDetails.email,
      currentExam: signUpDetails.currentExam,
      streakDays: 0, // Starts at zero progress for all users per Section 6 & 7
      bestStreak: 0,
      joinDate: 'JUNE 2026',
      completedLectures: [],
      downloadedNotes: [],
    };
    setUser(newUser);

    // Save newly registered user to central list if not already present
    setUsersList((prev) => {
      if (prev.some((u) => u.email.toLowerCase() === signUpDetails.email.toLowerCase())) return prev;
      return [...prev, newUser];
    });

    // Reset deck with empty mock content on registration
    setSubjectDeck(generateMockSubjects());
    setActiveTab('home');
  };

  const handleLoginComplete = (loginDetails: { name: string; email: string; currentExam: ExamType; isAdmin?: boolean }) => {
    const loggedUser: UserType = {
      name: loginDetails.name,
      email: loginDetails.email,
      currentExam: loginDetails.currentExam,
      streakDays: 0,
      bestStreak: 0,
      joinDate: 'JUNE 2026',
      completedLectures: [],
      downloadedNotes: [],
      isAdmin: loginDetails.isAdmin,
    };
    setUser(loggedUser);

    if (!loginDetails.isAdmin) {
      // Add or update matching registered student
      setUsersList((prev) => {
        const index = prev.findIndex((u) => u.email.toLowerCase() === loginDetails.email.toLowerCase());
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { ...updated[index], currentExam: loginDetails.currentExam };
          return updated;
        }
        return [...prev, loggedUser];
      });
    }

    // Do NOT reset custom admin additions if logged in as admin or existing student with custom items
    // But if subjectDeck is empty or pristine, initialize it
    const savedDecks = localStorage.getItem('studykar_subjects');
    if (!savedDecks) {
      setSubjectDeck(generateMockSubjects());
    }
    setActiveTab('home');
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const executeLogout = () => {
    setUser(null);
    setSelectedSubject(null);
    setActiveTab('home');
    localStorage.removeItem('studykar_user');
    setShowLogoutConfirm(false);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleChangeExam = (newExam: ExamType) => {
    if (user) {
      setUser({
        ...user,
        currentExam: newExam,
      });
      setSelectedSubject(null);
      setActiveTab('home');
    }
  };

  const handleUpdateUserExam = (userEmail: string, newExam: ExamType) => {
    setUsersList((prev) => 
      prev.map((u) => u.email.toLowerCase() === userEmail.toLowerCase() ? { ...u, currentExam: newExam } : u)
    );
    // If current logged-in user matches, update their exam target too
    if (user && user.email.toLowerCase() === userEmail.toLowerCase()) {
      setUser((prevUser) => prevUser ? { ...prevUser, currentExam: newExam } : null);
    }
  };

  const handleAddLecture = (subjectName: string, lecture: Lecture) => {
    setSubjectDeck((prev) => {
      const updated = { ...prev };
      if (updated[subjectName]) {
        updated[subjectName] = {
          ...updated[subjectName],
          lectures: [...updated[subjectName].lectures, lecture]
        };
      }
      return updated;
    });
  };

  const handleAddNote = (subjectName: string, note: Note) => {
    setSubjectDeck((prev) => {
      const updated = { ...prev };
      if (updated[subjectName]) {
        updated[subjectName] = {
          ...updated[subjectName],
          notes: [...updated[subjectName].notes, note]
        };
      }
      return updated;
    });
  };

  const handleToggleLecturePublish = (subjectName: string, lectureId: string) => {
    setSubjectDeck((prev) => {
      const updated = { ...prev };
      if (updated[subjectName]) {
        updated[subjectName] = {
          ...updated[subjectName],
          lectures: updated[subjectName].lectures.map((l) => 
            l.id === lectureId ? { ...l, published: l.published === false ? true : false } : l
          )
        };
      }
      return updated;
    });
  };

  const handleToggleNotePublish = (subjectName: string, noteId: string) => {
    setSubjectDeck((prev) => {
      const updated = { ...prev };
      if (updated[subjectName]) {
        updated[subjectName] = {
          ...updated[subjectName],
          notes: updated[subjectName].notes.map((n) => 
            n.id === noteId ? { ...n, published: n.published === false ? true : false } : n
          )
        };
      }
      return updated;
    });
  };

  // Interactive Completions - Toggles Watched status on Lecture
  const handleToggleLectureWatched = (lectureId: string) => {
    setSubjectDeck((prevDeck) => {
      const updated = { ...prevDeck };
      
      // Find which subject contains this lecture
      for (const subName in updated) {
        const sub = updated[subName];
        const lectureIndex = sub.lectures.findIndex((l) => l.id === lectureId);
        
        if (lectureIndex !== -1) {
          const updatedLectures = [...sub.lectures];
          const isWatchedNow = !updatedLectures[lectureIndex].watched;
          updatedLectures[lectureIndex] = {
            ...updatedLectures[lectureIndex],
            watched: isWatchedNow,
          };
          
          // Recalculate completed chapters ratio for bento presentation
          const watchedCount = updatedLectures.filter((l) => l.watched).length;
          // Completed chapters is bound to how many lectures watched (e.g. mock math)
          // Increment completed chapters proportionally
          const calculatedChapters = Math.min(
            sub.chaptersCount,
            Math.max(1, Math.round((watchedCount / sub.lectures.length) * sub.chaptersCount))
          );

          updated[subName] = {
            ...sub,
            lectures: updatedLectures,
            completedChapters: calculatedChapters,
          };

          // Also update active selection references in stack view if matching
          if (selectedSubject && selectedSubject.name === sub.name) {
            setSelectedSubject(updated[subName]);
          }
          break;
        }
      }
      return updated;
    });
  };

  // Interactive Completions - Toggles PDF downloaded
  const handleToggleNoteDownloaded = (noteId: string) => {
    setSubjectDeck((prevDeck) => {
      const updated = { ...prevDeck };
      
      for (const subName in updated) {
        const sub = updated[subName];
        const noteIndex = sub.notes.findIndex((n) => n.id === noteId);

        if (noteIndex !== -1) {
          const updatedNotes = [...sub.notes];
          updatedNotes[noteIndex] = {
            ...updatedNotes[noteIndex],
            downloaded: !updatedNotes[noteIndex].downloaded,
          };

          updated[subName] = {
            ...sub,
            notes: updatedNotes,
          };

          if (selectedSubject && selectedSubject.name === sub.name) {
            setSelectedSubject(updated[subName]);
          }
          break;
        }
      }
      return updated;
    });
  };

  // Quick refresh button
  const handleRefreshStats = () => {
    // Randomize some progress briefly to simulate real sync API response
    setSubjectDeck((prevDeck) => {
      const updated = { ...prevDeck };
      for (const subName in updated) {
        const sub = updated[subName];
        // randomize random progress
        const randCompleted = Math.min(sub.chaptersCount, Math.max(1, sub.completedChapters + (Math.random() > 0.6 ? 1 : 0)));
        updated[subName] = {
          ...sub,
          completedChapters: randCompleted,
        };
      }
      alert('🔄 StudyKar database synced successfully! Chapters updated in real-time.');
      return updated;
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F0F0F0] text-black flex flex-col items-center justify-center p-0 md:p-6 overflow-x-hidden relative font-sans">
      
      {/* ─── DESKTOP WALLPAPER ACCENTS (NEO-BRUTALIST ILLUSTRATIVE DETAILS) ─── */}
      <div className="hidden md:block absolute top-10 left-10 text-neutral-400 font-display font-black text-3xl opacity-30 select-none">
        STUDYKAR.PK ✦
      </div>
      <div className="hidden md:block absolute bottom-10 right-10 text-neutral-400 font-display font-black text-xs opacity-20 select-none">
        PAKISTANI COLLEGE ADMISSION ASSISTANT
      </div>
      {/* Scatter sparkle stars in desktop margins */}
      <div className="hidden md:block absolute top-20 right-20 text-[#FFD60A] text-5xl animate-spin select-none opacity-40">✦</div>
      <div className="hidden md:block absolute bottom-24 left-24 text-[#FF6B6B] text-4xl select-none opacity-40">✦</div>

      {/* ─── MAIN PORTABLE PHONE SIMULATOR CONTAINER ─── */}
      <div 
        id="phone-wrapper"
        className="relative w-full md:w-[410px] h-screen md:h-[840px] bg-white dark:bg-[#0B0B0F] md:border-[4.5px] md:border-black md:rounded-[36px] overflow-hidden md:shadow-[10px_10px_0px_#000] flex flex-col transition-all duration-300"
      >
        
        {/* Dynamic Inner Device Core */}
        <div className="flex-1 flex flex-col overflow-hidden relative h-full">
          
          {/* Main Router Logic */}
          {!user ? (
            <Onboarding onComplete={handleSignUpComplete} onLogin={handleLoginComplete} />
          ) : user.isAdmin ? (
            <AdminPanel
              adminEmail={user.email}
              usersList={usersList}
              subjectDeck={subjectDeck}
              isDarkMode={isDarkMode}
              onToggleTheme={handleToggleTheme}
              onLogout={handleLogout}
              onUpdateUserExam={handleUpdateUserExam}
              onAddLecture={handleAddLecture}
              onAddNote={handleAddNote}
              onToggleLecturePublish={handleToggleLecturePublish}
              onToggleNotePublish={handleToggleNotePublish}
            />
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              
              {/* Stack View Overlay (Details Page) */}
              <AnimatePresence>
                {selectedSubject ? (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 240 }}
                    className="absolute inset-0 z-30 flex flex-col h-full"
                  >
                    <SubjectDetail
                      subject={selectedSubject}
                      isDarkMode={isDarkMode}
                      onBack={() => setSelectedSubject(null)}
                      onToggleLectureWatched={handleToggleLectureWatched}
                      onToggleNoteDownloaded={handleToggleNoteDownloaded}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* Core Active Tab View */}
              <div className="flex-1 overflow-hidden relative">
                {activeTab === 'home' && (
                  <Dashboard
                    user={user}
                    subjectDeck={subjectDeck}
                    isDarkMode={isDarkMode}
                    onToggleTheme={handleToggleTheme}
                    onSelectSubject={(subj) => setSelectedSubject(subj)}
                    onRefreshStats={handleRefreshStats}
                  />
                )}

                {activeTab === 'progress' && (
                  <Progress
                    user={user}
                    subjectDeck={subjectDeck}
                    isDarkMode={isDarkMode}
                  />
                )}

                {activeTab === 'profile' && (
                  <Profile
                    user={user}
                    isDarkMode={isDarkMode}
                    onToggleTheme={handleToggleTheme}
                    onChangeExam={handleChangeExam}
                    onLogout={handleLogout}
                  />
                )}
              </div>

              {/* ─── BOTTOM NAVIGATION TAB BAR ─── */}
              <nav 
                id="main-bottom-navigation"
                className={`absolute bottom-0 left-0 right-0 h-18 border-t-[3px] border-black flex items-center justify-around px-2 z-20 select-none ${
                  isDarkMode 
                    ? 'bg-neutral-900 border-neutral-800' 
                    : 'bg-white'
                }`}
              >
                {/* Home tab */}
                <button
                  id="nav-tab-home"
                  onClick={() => {
                    setSelectedSubject(null);
                    setActiveTab('home');
                  }}
                  className="flex flex-col items-center justify-center w-20 h-14 cursor-pointer relative"
                >
                  <div 
                    className={`px-3.5 py-1 rounded-xl transition-all border-[2px] ${
                      activeTab === 'home'
                        ? isDarkMode 
                          ? 'bg-neutral-800 border-white text-white scale-110'
                          : 'bg-[#FFD60A] border-black text-black shadow-[2px_2px_0px_#000] scale-110'
                        : 'bg-transparent border-transparent text-neutral-400'
                    }`}
                  >
                    <span className="text-lg">🏠</span>
                  </div>
                  <span className={`text-[9px] font-black tracking-wider uppercase mt-1 ${
                    activeTab === 'home' ? 'text-neutral-900 dark:text-[#00E5CC]' : 'text-neutral-400'
                  }`}>
                    Home
                  </span>
                </button>

                {/* Progress tab */}
                <button
                  id="nav-tab-progress"
                  onClick={() => {
                    setSelectedSubject(null);
                    setActiveTab('progress');
                  }}
                  className="flex flex-col items-center justify-center w-20 h-14 cursor-pointer relative"
                >
                  <div 
                    className={`px-3.5 py-1 rounded-xl transition-all border-[2px] ${
                      activeTab === 'progress'
                        ? isDarkMode 
                          ? 'bg-neutral-800 border-white text-white scale-110'
                          : 'bg-[#C8F135] border-black text-black shadow-[2px_2px_0px_#000] scale-110'
                        : 'bg-transparent border-transparent text-neutral-400'
                    }`}
                  >
                    <span className="text-lg">📊</span>
                  </div>
                  <span className={`text-[9px] font-black tracking-wider uppercase mt-1 ${
                    activeTab === 'progress' ? 'text-neutral-900 dark:text-[#00E5CC]' : 'text-neutral-400'
                  }`}>
                    Progress
                  </span>
                </button>

                {/* Profile tab */}
                <button
                  id="nav-tab-profile"
                  onClick={() => {
                    setSelectedSubject(null);
                    setActiveTab('profile');
                  }}
                  className="flex flex-col items-center justify-center w-20 h-14 cursor-pointer relative"
                >
                  <div 
                    className={`px-3.5 py-1 rounded-xl transition-all border-[2px] ${
                      activeTab === 'profile'
                        ? isDarkMode 
                          ? 'bg-neutral-800 border-white text-white scale-110'
                          : 'bg-[#FF6FD8] border-black text-black shadow-[2px_2px_0px_#000] scale-110'
                        : 'bg-transparent border-transparent text-neutral-400'
                    }`}
                  >
                    <span className="text-lg">👤</span>
                  </div>
                  <span className={`text-[9px] font-black tracking-wider uppercase mt-1 ${
                    activeTab === 'profile' ? 'text-neutral-900 dark:text-[#00E5CC]' : 'text-neutral-400'
                  }`}>
                    Profile
                  </span>
                </button>

              </nav>

            </div>
          )}

        </div>

      </div>

      {/* ─── CUSTOM LOGOUT CONFIRMATION MODAL (Non-blocking for IFrames) ─── */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-6 select-none">
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="w-full max-w-sm bg-white dark:bg-neutral-900 border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_#000] dark:shadow-[6px_6px_0px_rgba(255,255,255,0.1)] relative"
            >
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="flex flex-col items-center text-center gap-3 text-black dark:text-white">
                <div className="w-12 h-12 bg-[#FF3F3F]/10 text-[#FF3F3F] border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#000]">
                  <LogOut className="w-6 h-6 stroke-[2.5]" />
                </div>

                <h3 className="font-display font-black text-lg text-neutral-900 dark:text-white uppercase mt-1">
                  Are you sure?
                </h3>
                
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold leading-normal">
                  You are logging out of your active StudyKar.pk session. Your current settings and custom decks will remain safe on this device.
                </p>

                <div className="grid grid-cols-2 gap-3 w-full mt-2.5">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="h-10 bg-neutral-100 hover:bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 border-[2.5px] border-black rounded-xl font-display font-black text-xs uppercase cursor-pointer transition-transform active:translate-y-0.5"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={executeLogout}
                    className="h-10 bg-[#FF3F3F] text-white hover:bg-[#E03535] border-[2.5px] border-black rounded-xl font-display font-black text-xs uppercase cursor-pointer shadow-[2px_2px_0px_#000] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.15)] transition-transform active:translate-y-0.5"
                  >
                    Yes, Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

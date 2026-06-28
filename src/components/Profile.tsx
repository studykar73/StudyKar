import { useState } from 'react';
import { Pencil, Settings, Award, Bell, RefreshCw, Smartphone, LogOut, ShieldCheck, Sun, Moon } from 'lucide-react';
import { ExamType, EXAM_DETAILS, SUBJECT_COLORS } from '../types';

interface ProfileProps {
  user: { name: string; email: string; currentExam: ExamType; streakDays: number; bestStreak: number; joinDate: string };
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onChangeExam: (newExam: ExamType) => void;
  onLogout: () => void;
}

export default function Profile({ user, isDarkMode, onToggleTheme, onChangeExam, onLogout }: ProfileProps) {
  const [notifications, setNotifications] = useState(true);
  const [showExamPopup, setShowExamPopup] = useState(false);

  const examDetails = EXAM_DETAILS[user.currentExam];

  const handleEditName = () => {
    alert(`✏️ Editing names is managed securely! For testing, your current name is: ${user.name}`);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24 select-none">
      
      {/* ─── HERO HEADER SECTION WITH PINK/CORAL BG STRIP ─── */}
      <div 
        className="p-6 border-b-[3.5px] border-black text-black text-center relative"
        style={{ backgroundColor: isDarkMode ? '#1A1A2E' : '#FF6FD8' }} // Dark navy or hot pink
      >
        {/* Decorative Stars */}
        <div className="absolute top-4 right-12 text-black/15 text-2xl">✦</div>
        <div className="absolute bottom-4 left-10 text-black/15 text-3xl">✦</div>

        {/* Circular Avatar Placeholder */}
        <div className="relative w-24 h-24 mx-auto mb-3">
          {/* Shadow behind */}
          <div className="absolute inset-0 bg-black border-[3px] border-black rounded-full translate-x-1.5 translate-y-1.5" />
          
          <div className="absolute inset-0 bg-[#FFD60A] border-[3px] border-black rounded-full flex items-center justify-center font-display font-black text-3xl text-black z-10 select-none">
            {user.name.slice(0, 2).toUpperCase()}
          </div>

          {/* Edit icon button */}
          <button
            id="edit-profile-icon"
            onClick={handleEditName}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white border-[2px] border-black rounded-full flex items-center justify-center z-20 cursor-pointer shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
          >
            <Pencil className="w-4.5 h-4.5 text-black stroke-[2.5]" />
          </button>
        </div>

        <h1 className="text-2xl font-display font-black leading-none uppercase text-black dark:text-white mb-1">
          {user.name}
        </h1>
        <p className="text-xs font-mono font-extrabold bg-black text-[#C8F135] px-2.5 py-1 rounded-md w-fit mx-auto border border-[#C8F135]/50 uppercase">
          👩‍🎓 {user.currentExam} STUDENT
        </p>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6">

        {/* ─── INFO CARDS SECTION (BENTO MINI-GRID) ─── */}
        <div>
          <h3 className="text-xs font-display font-black uppercase text-neutral-500 dark:text-neutral-400 mb-2 tracking-widest">
            ✦ ACADEMIC PASSPORT
          </h3>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Cell 1: Target Exam */}
            <div 
              className={`p-3.5 rounded-xl border-[3px] border-black flex flex-col justify-between h-24 relative overflow-hidden ${
                isDarkMode ? 'bg-neutral-900/40 border-neutral-800 text-white' : 'bg-white shadow-[3px_3px_0px_#000]'
              }`}
            >
              <span className="font-mono text-[9px] font-black text-neutral-500 uppercase">Target Exam</span>
              <h4 className="font-display font-black text-base uppercase mt-1 leading-none text-[#FF3F3F]">
                {user.currentExam}
              </h4>
              <p className="text-[10px] font-bold text-neutral-500 line-clamp-1">
                {examDetails.fullName}
              </p>
            </div>

            {/* Cell 2: Member Since */}
            <div 
              className={`p-3.5 rounded-xl border-[3px] border-black flex flex-col justify-between h-24 relative overflow-hidden ${
                isDarkMode ? 'bg-neutral-900/40 border-neutral-800 text-white' : 'bg-white shadow-[3px_3px_0px_#000]'
              }`}
            >
              <span className="font-mono text-[9px] font-black text-neutral-500 uppercase">Registered On</span>
              <h4 className="font-display font-black text-base uppercase mt-1 leading-none text-emerald-500">
                {user.joinDate}
              </h4>
              <p className="text-[10px] font-bold text-neutral-500 line-clamp-1">
                Verified StudyKar Student
              </p>
            </div>

            {/* Cell 3: Total Chapters */}
            <div 
              className={`p-3.5 rounded-xl border-[3px] border-black flex flex-col justify-between h-24 relative overflow-hidden ${
                isDarkMode ? 'bg-neutral-900/40 border-neutral-800 text-white' : 'bg-white shadow-[3px_3px_0px_#000]'
              }`}
            >
              <span className="font-mono text-[9px] font-black text-neutral-500 uppercase">Total Chapters</span>
              <h4 className="font-display font-black text-base uppercase mt-1 leading-none text-[#BF5AF2]">
                12 PER DECK
              </h4>
              <p className="text-[10px] font-bold text-neutral-500 line-clamp-1">
                Standard HEC Curriculum
              </p>
            </div>

            {/* Cell 4: Streak */}
            <div 
              className={`p-3.5 rounded-xl border-[3px] border-black flex flex-col justify-between h-24 relative overflow-hidden ${
                isDarkMode ? 'bg-neutral-900/40 border-neutral-800 text-white' : 'bg-white shadow-[3px_3px_0px_#000]'
              }`}
            >
              <span className="font-mono text-[9px] font-black text-neutral-500 uppercase">Active Streak</span>
              <h4 className="font-display font-black text-base uppercase mt-1 leading-none text-[#FFD60A]">
                {user.streakDays} DAYS 🔥
              </h4>
              <p className="text-[10px] font-bold text-neutral-500 line-clamp-1">
                Best Record: {user.bestStreak} Days
              </p>
            </div>

          </div>
        </div>


        {/* ─── SETTINGS LIST ROWS ─── */}
        <div>
          <h3 className="text-xs font-display font-black uppercase text-neutral-500 dark:text-neutral-400 mb-2 tracking-widest">
            ✦ APP CONFIGURATION
          </h3>

          <div className="border-[3px] border-black dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900/40">
            
            {/* ROW 1: Manual Theme Toggle */}
            <div className="px-4 py-3.5 flex items-center justify-between border-b-[2px] border-black dark:border-neutral-800">
              <span className="font-display font-black text-sm uppercase text-neutral-900 dark:text-white">
                App Theme
              </span>
              
              {/* Custom sun/moon pill toggle */}
              <div className="flex bg-neutral-100 dark:bg-neutral-950/60 p-1 border-[2.5px] border-black rounded-lg">
                <button
                  id="theme-light-toggle-pill"
                  onClick={() => { if (isDarkMode) onToggleTheme(); }}
                  className={`px-3 py-1 text-xs font-black uppercase rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    !isDarkMode 
                      ? 'bg-black text-white' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  id="theme-dark-toggle-pill"
                  onClick={() => { if (!isDarkMode) onToggleTheme(); }}
                  className={`px-3 py-1 text-xs font-black uppercase rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-[#00E5CC] text-black shadow-[1.5px_1.5px_0px_#000]' 
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
              </div>
            </div>

            {/* ROW 2: Notifications Switch */}
            <div className="px-4 py-3.5 flex items-center justify-between border-b-[2px] border-black dark:border-neutral-800">
              <span className="font-display font-black text-sm uppercase text-neutral-900 dark:text-white">
                Streak Reminders
              </span>
              
              <button
                id="toggle-reminders-switch"
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 border-[2.5px] border-black rounded-full transition-all relative cursor-pointer ${
                  notifications ? 'bg-[#C8F135]' : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              >
                <div 
                  className="w-4.5 h-4.5 bg-black rounded-full absolute top-[1px] transition-all"
                  style={{ left: notifications ? '22px' : '2px' }}
                />
              </button>
            </div>

            {/* ROW 3: Change Target Exam (LOCKED FOR STUDENTS) */}
            <div className="px-4 py-4 border-b-[2px] border-black dark:border-neutral-800 bg-amber-50 dark:bg-amber-950/10">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 mb-1.5">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="font-display font-black text-xs uppercase">
                  Exam target locked
                </span>
              </div>
              <p className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 leading-normal">
                Exam locked. Contact StudyKar Admin to request exam change.
              </p>
            </div>

            {/* ROW 4: Version/Info */}
            <div className="px-4 py-3.5 flex items-center justify-between">
              <span className="font-display font-black text-sm uppercase text-neutral-900 dark:text-white">
                Syllabus Version
              </span>
              <span className="font-mono text-xs font-bold text-neutral-500">
                StudyKar.pk-v1.2 (2026 Admissions)
              </span>
            </div>

          </div>
        </div>

        {/* ─── FULL WIDTH LOGOUT BUTTON ─── */}
        <button
          id="logout-action-button"
          onClick={onLogout}
          className="w-full h-12 bg-[#FF3F3F] text-white font-display font-black text-base border-[3px] border-black rounded-xl cursor-pointer shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_#000] transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5 stroke-[3]" /> LOG OUT FROM DEVICE
        </button>

      </div>


      {/* ─── MODAL DIALOG: CHANGE EXAM SELECTOR ─── */}
      {showExamPopup && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-6 select-none">
          <div className="w-full max-w-sm bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_#000] text-black">
            
            <h3 className="font-display font-black text-lg uppercase mb-2 text-center">
              SWITCH ENTRANCE BOARD ✦
            </h3>
            
            <p className="text-xs text-neutral-500 font-bold text-center mb-4">
              Your subjects and progress lists will immediately adjust to matching curriculum criteria.
            </p>

            <div className="flex flex-col gap-2.5 mb-5">
              {(Object.keys(EXAM_DETAILS) as ExamType[]).map((exam) => (
                <button
                  id={`switch-exam-${exam}`}
                  key={exam}
                  onClick={() => {
                    onChangeExam(exam);
                    setShowExamPopup(false);
                  }}
                  className={`w-full text-left p-3 border-[2.5px] border-black rounded-xl font-display font-black uppercase text-xs flex items-center justify-between cursor-pointer ${
                    user.currentExam === exam 
                      ? 'bg-neutral-950 text-[#C8F135]' 
                      : 'bg-neutral-50 hover:bg-neutral-100 text-black'
                  }`}
                >
                  <span>{exam} - {EXAM_DETAILS[exam].fullName}</span>
                  {user.currentExam === exam && <span className="text-green-400">✓</span>}
                </button>
              ))}
            </div>

            <button
              id="close-exam-modal"
              onClick={() => setShowExamPopup(false)}
              className="w-full py-2 bg-neutral-200 hover:bg-neutral-300 border-[2px] border-black rounded-lg font-display font-black text-xs uppercase cursor-pointer"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

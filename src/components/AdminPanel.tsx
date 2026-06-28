import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  LogOut, 
  Users, 
  Settings, 
  BookOpen, 
  Video, 
  FileText, 
  Check, 
  X, 
  Moon, 
  Sun,
  Lock,
  Globe
} from 'lucide-react';
import { 
  ExamType, 
  SubjectType, 
  EXAM_SUBJECT_MAPPING, 
  EXAM_DETAILS, 
  SUBJECT_COLORS, 
  SUBJECT_EMOJIS,
  Lecture, 
  Note, 
  User as UserType, 
  SubjectModule 
} from '../types';

interface AdminPanelProps {
  adminEmail: string;
  usersList: UserType[];
  subjectDeck: Record<string, SubjectModule>;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  onUpdateUserExam: (userEmail: string, newExam: ExamType) => void;
  onAddLecture: (subjectName: string, lecture: Lecture) => void;
  onAddNote: (subjectName: string, note: Note) => void;
  onToggleLecturePublish: (subjectName: string, lectureId: string) => void;
  onToggleNotePublish: (subjectName: string, noteId: string) => void;
}

export default function AdminPanel({
  adminEmail,
  usersList,
  subjectDeck,
  isDarkMode,
  onToggleTheme,
  onLogout,
  onUpdateUserExam,
  onAddLecture,
  onAddNote,
  onToggleLecturePublish,
  onToggleNotePublish,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'users' | 'settings'>('content');
  
  // Tab 1: Content State
  const [selectedExam, setSelectedExam] = useState<ExamType>('MDCAT');
  const examSubjects = EXAM_SUBJECT_MAPPING[selectedExam] || [];
  
  // Handle case where subject list might change when exam changes
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>(examSubjects[0] || 'Biology');
  
  // React to exam change to auto-update selected subject
  React.useEffect(() => {
    const subjects = EXAM_SUBJECT_MAPPING[selectedExam] || [];
    if (subjects.length > 0 && !subjects.includes(selectedSubject)) {
      setSelectedSubject(subjects[0]);
    }
  }, [selectedExam]);

  const [contentSubTab, setContentSubTab] = useState<'videos' | 'notes'>('videos');

  // Form Modals
  const [showAddLectureModal, setShowAddLectureModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  // Form Fields - Lecture
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureDuration, setLectureDuration] = useState('');
  const [lectureVideoUrl, setLectureVideoUrl] = useState('');
  const [lectureDescription, setLectureDescription] = useState('');
  const [lectureIsPremium, setLectureIsPremium] = useState(false);

  // Form Fields - Notes
  const [noteTitle, setNoteTitle] = useState('');
  const [notePdfUrl, setNotePdfUrl] = useState('');
  const [noteSize, setNoteSize] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [noteIsPremium, setNoteIsPremium] = useState(false);

  // User Action States
  const [userToEdit, setUserToEdit] = useState<UserType | null>(null);
  const [showConfirmExamModal, setShowConfirmExamModal] = useState(false);
  const [newSelectedExam, setNewSelectedExam] = useState<ExamType>('MDCAT');

  // Get active items for subject
  const currentSubjectModule = subjectDeck[selectedSubject];
  const lectures = currentSubjectModule?.lectures || [];
  const notes = currentSubjectModule?.notes || [];

  // Submit Lecture
  const handleSaveLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureTitle.trim()) return alert('Please enter lecture title');
    
    const newLecture: Lecture = {
      id: `lec-${Date.now()}`,
      title: lectureTitle,
      duration: lectureDuration || '15:00',
      isPremium: lectureIsPremium,
      watched: false,
      youtubeId: lectureVideoUrl || undefined,
      published: true,
      description: lectureDescription
    };

    onAddLecture(selectedSubject, newLecture);
    
    // Reset
    setLectureTitle('');
    setLectureDuration('');
    setLectureVideoUrl('');
    setLectureDescription('');
    setLectureIsPremium(false);
    setShowAddLectureModal(false);
  };

  // Submit Note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return alert('Please enter note title');

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: noteTitle,
      size: noteSize || '2.5 MB',
      isPremium: noteIsPremium,
      downloaded: false,
      published: true,
      description: noteDescription
    };

    onAddNote(selectedSubject, newNote);

    // Reset
    setNoteTitle('');
    setNotePdfUrl('');
    setNoteSize('');
    setNoteDescription('');
    setNoteIsPremium(false);
    setShowAddNoteModal(false);
  };

  // Switch User Exam Confirmed
  const handleApplyUserExamChange = () => {
    if (userToEdit) {
      onUpdateUserExam(userToEdit.email, newSelectedExam);
      setUserToEdit(null);
      setShowConfirmExamModal(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden ${isDarkMode ? 'bg-[#0B0B0F]' : 'bg-[#FFFBF0]'}`}>
      
      {/* ─── ADMIN BANNER HEADER ─── */}
      <div className="bg-[#BF5AF2] text-black p-5 border-b-[3.5px] border-black select-none relative">
        <div className="absolute top-2 right-4 text-black/20 text-4xl">✦</div>
        <div className="flex justify-between items-center">
          <div>
            <div className="bg-black text-[#C8F135] font-mono text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider w-fit border border-[#C8F135]/40">
              ⚡ CENTRAL ADMIN CONSOLE
            </div>
            <h1 className="text-2xl font-display font-black leading-none uppercase tracking-tight mt-1.5">
              StudyKar.pk Admin
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 bg-white border-[2px] border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#FFD60A] stroke-[2.5]" />
              ) : (
                <Moon className="w-4 h-4 text-black stroke-[2.5]" />
              )}
            </button>
            <button
              onClick={onLogout}
              title="Log Out"
              className="w-9 h-9 bg-[#FF3F3F] text-white border-[2px] border-black rounded-lg flex items-center justify-center shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── TAB CONTENT AREA ─── */}
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        
        {/* TAB 1: CONTENT MANAGEMENT */}
        {activeTab === 'content' && (
          <div className="flex flex-col gap-5">
            
            {/* CASCADING SELECTORS CARD */}
            <div className={`p-4 border-[3px] border-black rounded-xl ${isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white shadow-[4px_4px_0px_#000]'}`}>
              <h2 className="text-xs font-display font-black uppercase text-neutral-500 mb-3 tracking-wider flex items-center gap-1.5">
                <span>📚</span> TARGET CURRICULUM SELECTORS
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {/* Selector 1: Select Exam */}
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1 text-neutral-500">Select Exam</label>
                  <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value as ExamType)}
                    className="w-full bg-white dark:bg-neutral-800 text-black dark:text-white border-[2.5px] border-black rounded-xl p-2.5 text-xs font-display font-black uppercase shadow-[2px_2px_0px_#000] focus:outline-hidden"
                  >
                    <option value="BCAT">BCAT (Business)</option>
                    <option value="MDCAT">MDCAT (Medical)</option>
                    <option value="ECAT">ECAT (Engineering)</option>
                    <option value="IoBM">IoBM Admission</option>
                  </select>
                </div>

                {/* Selector 2: Select Subject */}
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1 text-neutral-500">Select Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value as SubjectType)}
                    className="w-full bg-white dark:bg-neutral-800 text-black dark:text-white border-[2.5px] border-black rounded-xl p-2.5 text-xs font-display font-black uppercase shadow-[2px_2px_0px_#000] focus:outline-hidden"
                  >
                    {examSubjects.map((subName) => (
                      <option key={subName} value={subName}>
                        {SUBJECT_EMOJIS[subName]} {subName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* VIDEO LECTURES / CHAPTER NOTES SUB-TAB PILLS */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setContentSubTab('videos')}
                className={`h-11 border-[3px] border-black rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center gap-2 cursor-pointer ${
                  contentSubTab === 'videos'
                    ? 'bg-black text-white'
                    : isDarkMode 
                      ? 'bg-neutral-900 border-neutral-700 text-neutral-400' 
                      : 'bg-white text-black'
                }`}
              >
                <Video className="w-4 h-4" /> Video Lectures ({lectures.length})
              </button>

              <button
                onClick={() => setContentSubTab('notes')}
                className={`h-11 border-[3px] border-black rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center gap-2 cursor-pointer ${
                  contentSubTab === 'notes'
                    ? 'bg-black text-white'
                    : isDarkMode 
                      ? 'bg-neutral-900 border-neutral-700 text-neutral-400' 
                      : 'bg-white text-black'
                }`}
              >
                <FileText className="w-4 h-4" /> Chapter Notes ({notes.length})
              </button>
            </div>

            {/* LIST OF ITEMS WITH ADD FLOATING ACTION */}
            <div className="flex-1 flex flex-col gap-3.5">
              
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-display font-black uppercase text-neutral-500">
                  {contentSubTab === 'videos' ? 'PUBLISHED LECTURE VIDEOS' : 'PUBLISHED REVISION NOTES'}
                </h3>
                
                {/* TOP-RIGHT FAB BUTTON TO ADD */}
                <button
                  onClick={() => contentSubTab === 'videos' ? setShowAddLectureModal(true) : setShowAddNoteModal(true)}
                  className="bg-[#C8F135] text-black text-xs font-display font-black border-[2px] border-black px-3 py-1.5 rounded-xl shadow-[2.5px_2.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" /> Add {contentSubTab === 'videos' ? 'Lecture' : 'Notes'}
                </button>
              </div>

              {/* VIDEO LECTURES LIST TAB */}
              {contentSubTab === 'videos' && (
                <div className="flex flex-col gap-3">
                  {lectures.length === 0 ? (
                    <div className="p-8 text-center border-[2.5px] border-dashed border-black dark:border-neutral-800 rounded-2xl text-neutral-400 text-xs">
                      No lectures published yet for this module.
                    </div>
                  ) : (
                    lectures.map((lec) => (
                      <div
                        key={lec.id}
                        className={`p-3 rounded-xl border-[2.5px] border-black flex items-center justify-between transition-all ${
                          isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white shadow-[3px_3px_0px_#000]'
                        }`}
                      >
                        <div className="pr-2">
                          <h4 className="font-display font-black text-xs uppercase line-clamp-1 text-neutral-900 dark:text-white leading-tight">
                            {lec.title}
                          </h4>
                          <span className="font-mono text-[9px] text-neutral-400">
                            ⏱️ {lec.duration}m {lec.isPremium ? '• Premium 👑' : '• Open Access'}
                          </span>
                        </div>

                        {/* Toggle published state */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleLecturePublish(selectedSubject, lec.id)}
                            className={`px-2 py-1 text-[9px] font-mono font-black rounded border-[1.5px] border-black cursor-pointer ${
                              lec.published !== false
                                ? 'bg-[#39FF14] text-black'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {lec.published !== false ? 'LIVE' : 'DRAFT'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* CHAPTER NOTES LIST TAB */}
              {contentSubTab === 'notes' && (
                <div className="flex flex-col gap-3">
                  {notes.length === 0 ? (
                    <div className="p-8 text-center border-[2.5px] border-dashed border-black dark:border-neutral-800 rounded-2xl text-neutral-400 text-xs">
                      No chapter notes published yet for this module.
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className={`p-3 rounded-xl border-[2.5px] border-black flex items-center justify-between transition-all ${
                          isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white shadow-[3px_3px_0px_#000]'
                        }`}
                      >
                        <div className="pr-2">
                          <h4 className="font-display font-black text-xs uppercase line-clamp-1 text-neutral-900 dark:text-white leading-tight">
                            {note.title}
                          </h4>
                          <span className="font-mono text-[9px] text-neutral-400">
                            📂 {note.size} {note.isPremium ? '• Premium 👑' : '• Open Access'}
                          </span>
                        </div>

                        {/* Toggle published status */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onToggleNotePublish(selectedSubject, note.id)}
                            className={`px-2 py-1 text-[9px] font-mono font-black rounded border-[1.5px] border-black cursor-pointer ${
                              note.published !== false
                                ? 'bg-[#39FF14] text-black'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
                            }`}
                          >
                            {note.published !== false ? 'LIVE' : 'DRAFT'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-display font-black uppercase text-neutral-500 mb-2">
              REGISTERED STUDYKAR ACADEMIC USERS
            </h3>

            {usersList.length === 0 ? (
              <div className="p-8 text-center border-[2.5px] border-dashed border-black dark:border-neutral-800 rounded-2xl text-neutral-400 text-xs bg-white dark:bg-neutral-900/40">
                No users registered on this browser instance yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {usersList.map((usr) => (
                  <div
                    key={usr.email}
                    onClick={() => {
                      setUserToEdit(usr);
                      setNewSelectedExam(usr.currentExam);
                      setShowConfirmExamModal(true);
                    }}
                    className={`p-3.5 rounded-xl border-[2.5px] border-black transition-all cursor-pointer flex items-center justify-between relative ${
                      isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white shadow-[3.5px_3.5px_0px_#000]'
                    }`}
                  >
                    <div>
                      <h4 className="font-display font-black text-sm uppercase text-neutral-900 dark:text-white leading-tight">
                        {usr.name} {usr.isAdmin ? '👑' : ''}
                      </h4>
                      <p className="text-[10px] font-semibold text-neutral-500 mt-0.5">
                        📧 {usr.email} • Joined {usr.joinDate}
                      </p>
                    </div>

                    {/* Change locked exam badge */}
                    <div className="flex flex-col items-end">
                      <span 
                        className="font-mono text-[10px] font-black border-[1.5px] border-black px-2.5 py-1 rounded-md uppercase"
                        style={{ backgroundColor: EXAM_DETAILS[usr.currentExam]?.accentColor || '#C8F135', color: '#0A0A0A' }}
                      >
                        {usr.currentExam}
                      </span>
                      <span className="text-[8px] font-black text-neutral-400 uppercase mt-1">
                        Tap to change
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADMIN SETTINGS */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-5">
            <h3 className="text-xs font-display font-black uppercase text-neutral-500">
              ADMIN PROFILE CONFIGURATION
            </h3>

            <div className={`p-5 rounded-2xl border-[3.5px] border-black flex flex-col gap-4 ${isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white shadow-[4px_4px_0px_#000]'}`}>
              <div>
                <span className="font-mono text-[9px] font-black text-neutral-500 uppercase">AUTHENTICATED ADMIN EMAIL</span>
                <h4 className="font-display font-black text-lg text-[#BF5AF2] leading-none mt-1">
                  {adminEmail}
                </h4>
              </div>

              <div>
                <span className="font-mono text-[9px] font-black text-neutral-500 uppercase">SYSTEM CLEARANCE LEVEL</span>
                <p className="font-display font-black text-xs text-neutral-800 dark:text-neutral-200 mt-1 uppercase flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-green-400 border border-black rounded-full animate-ping inline-block" />
                  SUPER-ADMIN (ALL PRIVILEGES GRANTED)
                </p>
              </div>

              {/* Theme Selector */}
              <div className="border-t-[2px] border-black dark:border-neutral-800 pt-4 flex items-center justify-between">
                <span className="font-display font-black text-xs uppercase">App Theme Toggle</span>
                <button
                  onClick={onToggleTheme}
                  className="w-10 h-10 bg-white dark:bg-neutral-800 border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-[#FFD60A] stroke-[2.5]" />
                  ) : (
                    <Moon className="w-5 h-5 text-black stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full h-12 bg-[#FF3F3F] text-white font-display font-black text-sm border-[3.5px] border-black rounded-xl cursor-pointer shadow-[4px_4px_0px_#000] flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5 stroke-[2.5]" /> LOG OUT FROM CONSOLE
            </button>
          </div>
        )}

      </div>

      {/* ─── ADMIN BOTTOM TAB BAR ─── */}
      <nav 
        className={`absolute bottom-0 left-0 right-0 h-18 border-t-[3px] border-black flex items-center justify-around px-2 z-20 select-none ${
          isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white'
        }`}
      >
        {/* Content Tab */}
        <button
          onClick={() => setActiveTab('content')}
          className="flex flex-col items-center justify-center w-20 h-14 cursor-pointer"
        >
          <div 
            className={`px-3.5 py-1 rounded-xl transition-all border-[2px] ${
              activeTab === 'content'
                ? isDarkMode 
                  ? 'bg-neutral-800 border-white text-white'
                  : 'bg-[#C8F135] border-black text-black shadow-[2px_2px_0px_#000]'
                : 'bg-transparent border-transparent text-neutral-400'
            }`}
          >
            <span className="text-lg">📚</span>
          </div>
          <span className={`text-[9px] font-black tracking-wider uppercase mt-1 ${
            activeTab === 'content' ? 'text-neutral-900 dark:text-[#00E5CC]' : 'text-neutral-400'
          }`}>
            Content
          </span>
        </button>

        {/* Users Tab */}
        <button
          onClick={() => setActiveTab('users')}
          className="flex flex-col items-center justify-center w-20 h-14 cursor-pointer"
        >
          <div 
            className={`px-3.5 py-1 rounded-xl transition-all border-[2px] ${
              activeTab === 'users'
                ? isDarkMode 
                  ? 'bg-neutral-800 border-white text-white'
                  : 'bg-[#BF5AF2] border-black text-black shadow-[2px_2px_0px_#000]'
                : 'bg-transparent border-transparent text-neutral-400'
            }`}
          >
            <span className="text-lg">👥</span>
          </div>
          <span className={`text-[9px] font-black tracking-wider uppercase mt-1 ${
            activeTab === 'users' ? 'text-neutral-900 dark:text-[#00E5CC]' : 'text-neutral-400'
          }`}>
            Users
          </span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => setActiveTab('settings')}
          className="flex flex-col items-center justify-center w-20 h-14 cursor-pointer"
        >
          <div 
            className={`px-3.5 py-1 rounded-xl transition-all border-[2px] ${
              activeTab === 'settings'
                ? isDarkMode 
                  ? 'bg-neutral-800 border-white text-white'
                  : 'bg-[#FF6FD8] border-black text-black shadow-[2px_2px_0px_#000]'
                : 'bg-transparent border-transparent text-neutral-400'
            }`}
          >
            <span className="text-lg">⚙️</span>
          </div>
          <span className={`text-[9px] font-black tracking-wider uppercase mt-1 ${
            activeTab === 'settings' ? 'text-neutral-900 dark:text-[#00E5CC]' : 'text-neutral-400'
          }`}>
            Settings
          </span>
        </button>
      </nav>

      {/* ─── FORM MODAL: ADD LECTURE ─── */}
      {showAddLectureModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-6 text-black select-none">
          <div className="w-full max-w-sm bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_#000] relative">
            <button 
              onClick={() => setShowAddLectureModal(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-black"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <h3 className="font-display font-black text-base uppercase mb-3 flex items-center gap-1.5">
              <span>📹</span> PUBLISH NEW LECTURE
            </h3>

            <form onSubmit={handleSaveLecture} className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase mb-0.5">Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chemical Equilibrium Masterclass"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  className="w-full h-10 px-3 border-[2.5px] border-black rounded-lg font-semibold text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-0.5">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 18:45"
                    value={lectureDuration}
                    onChange={(e) => setLectureDuration(e.target.value)}
                    className="w-full h-10 px-3 border-[2.5px] border-black rounded-lg font-semibold text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase mb-0.5">Video URL</label>
                  <input
                    type="text"
                    placeholder="e.g. YouTube ID"
                    value={lectureVideoUrl}
                    onChange={(e) => setLectureVideoUrl(e.target.value)}
                    className="w-full h-10 px-3 border-[2.5px] border-black rounded-lg font-semibold text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase mb-0.5">Description (Optional)</label>
                <textarea
                  placeholder="e.g. Covered all previous MDCAT concepts..."
                  value={lectureDescription}
                  onChange={(e) => setLectureDescription(e.target.value)}
                  className="w-full h-16 p-2.5 border-[2.5px] border-black rounded-lg font-semibold text-xs focus:outline-hidden resize-none"
                />
              </div>

              {/* Premium Lock Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="lecture-is-premium"
                  checked={lectureIsPremium}
                  onChange={(e) => setLectureIsPremium(e.target.checked)}
                  className="w-4.5 h-4.5 border-[2px] border-black rounded-md accent-purple-600"
                />
                <label htmlFor="lecture-is-premium" className="text-xs font-black uppercase cursor-pointer flex items-center gap-1">
                  🔒 LOCK UNDER PREMIUM 👑
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#C8F135] text-black font-display font-black text-xs uppercase border-[2.5px] border-black rounded-xl cursor-pointer shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 mt-2"
              >
                PUBLISH TO DECK <Check className="w-4.5 h-4.5 stroke-[3]" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── FORM MODAL: ADD REVISION NOTE ─── */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-6 text-black select-none">
          <div className="w-full max-w-sm bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_#000] relative">
            <button 
              onClick={() => setShowAddNoteModal(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-black"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <h3 className="font-display font-black text-base uppercase mb-3 flex items-center gap-1.5">
              <span>📂</span> PUBLISH SYLLABUS NOTES
            </h3>

            <form onSubmit={handleSaveNote} className="flex flex-col gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase mb-0.5">Chapter Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Formula Cheat Sheet"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full h-10 px-3 border-[2.5px] border-black rounded-lg font-semibold text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-0.5">File Size</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.4 MB"
                    value={noteSize}
                    onChange={(e) => setNoteSize(e.target.value)}
                    className="w-full h-10 px-3 border-[2.5px] border-black rounded-lg font-semibold text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase mb-0.5">PDF Link / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. drive-link"
                    value={notePdfUrl}
                    onChange={(e) => setNotePdfUrl(e.target.value)}
                    className="w-full h-10 px-3 border-[2.5px] border-black rounded-lg font-semibold text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase mb-0.5">Description (Optional)</label>
                <textarea
                  placeholder="e.g. Complete past years formulas included..."
                  value={noteDescription}
                  onChange={(e) => setNoteDescription(e.target.value)}
                  className="w-full h-16 p-2.5 border-[2.5px] border-black rounded-lg font-semibold text-xs focus:outline-hidden resize-none"
                />
              </div>

              {/* Premium Lock Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="note-is-premium"
                  checked={noteIsPremium}
                  onChange={(e) => setNoteIsPremium(e.target.checked)}
                  className="w-4.5 h-4.5 border-[2px] border-black rounded-md accent-purple-600"
                />
                <label htmlFor="note-is-premium" className="text-xs font-black uppercase cursor-pointer flex items-center gap-1">
                  🔒 LOCK UNDER PREMIUM 👑
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-[#C8F135] text-black font-display font-black text-xs uppercase border-[2.5px] border-black rounded-xl cursor-pointer shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 mt-2"
              >
                PUBLISH NOTE <Check className="w-4.5 h-4.5 stroke-[3]" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: CONFIRM USER BOARD EXAM UPDATE ─── */}
      {showConfirmExamModal && userToEdit && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-6 text-black select-none">
          <div className="w-full max-w-sm bg-white border-[3.5px] border-black rounded-2xl p-5 shadow-[6px_6px_0px_#000]">
            
            <h3 className="font-display font-black text-base uppercase mb-1.5 text-center">
              🔒 UPDATE LOCKED EXAM
            </h3>
            
            <p className="text-[11px] text-neutral-500 font-bold text-center mb-4 leading-normal">
              You are updating the locked exam selection for <span className="text-purple-600 font-black">{userToEdit.name}</span>. This affects their subject decks in real-time.
            </p>

            <div className="flex flex-col gap-2.5 mb-5">
              {(['BCAT', 'MDCAT', 'ECAT', 'IoBM'] as ExamType[]).map((exam) => (
                <button
                  key={exam}
                  onClick={() => setNewSelectedExam(exam)}
                  className={`w-full text-left p-3 border-[2.5px] border-black rounded-xl font-display font-black uppercase text-xs flex items-center justify-between cursor-pointer ${
                    newSelectedExam === exam 
                      ? 'bg-neutral-950 text-[#C8F135]' 
                      : 'bg-neutral-50 hover:bg-neutral-100'
                  }`}
                >
                  <span>{exam} - {EXAM_DETAILS[exam].fullName}</span>
                  {newSelectedExam === exam && <span className="text-green-400">✓</span>}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setUserToEdit(null);
                  setShowConfirmExamModal(false);
                }}
                className="py-2.5 bg-neutral-100 hover:bg-neutral-200 border-[2px] border-black rounded-xl font-display font-black text-xs uppercase cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleApplyUserExamChange}
                className="py-2.5 bg-[#C8F135] border-[2px] border-black rounded-xl font-display font-black text-xs uppercase cursor-pointer shadow-[2px_2px_0px_#000]"
              >
                Confirm Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

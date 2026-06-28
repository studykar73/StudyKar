import { ArrowRight, Sparkles, Flame, CheckSquare, Trophy, Moon, Sun, RefreshCw } from 'lucide-react';
import { ExamType, SubjectModule, EXAM_SUBJECT_MAPPING, EXAM_DETAILS, SUBJECT_COLORS } from '../types';

interface DashboardProps {
  user: { name: string; email: string; currentExam: ExamType; streakDays: number; bestStreak: number };
  subjectDeck: Record<string, SubjectModule>;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onSelectSubject: (subject: SubjectModule) => void;
  onRefreshStats: () => void;
}

export default function Dashboard({
  user,
  subjectDeck,
  isDarkMode,
  onToggleTheme,
  onSelectSubject,
  onRefreshStats,
}: DashboardProps) {
  
  // Filter subjects strictly according to exam to subject mapping
  const activeSubjectNames = EXAM_SUBJECT_MAPPING[user.currentExam] || [];
  const subjectsToRender = activeSubjectNames.map((name) => subjectDeck[name]).filter(Boolean);

  // Compute calculated metrics
  const totalChapters = subjectsToRender.reduce((acc, sub) => acc + sub.chaptersCount, 0);
  const completedChapters = subjectsToRender.reduce((acc, sub) => acc + sub.completedChapters, 0);
  const progressPercent = Math.round((completedChapters / totalChapters) * 100) || 0;

  // Custom Bento Cell span layouts based on subject count / type
  const getBentoCellClass = (subjectName: string, exam: ExamType) => {
    if (exam === 'MDCAT') {
      if (subjectName === 'Biology') return 'col-span-2 h-36';
      if (subjectName === 'Logical Reasoning') return 'col-span-2 h-28';
      return 'col-span-1 h-32';
    }
    if (exam === 'IoBM') {
      if (subjectName === 'English') return 'col-span-2 h-34';
      return 'col-span-1 h-32';
    }
    if (exam === 'BCAT') {
      return 'col-span-2 h-34';
    }
    if (exam === 'ECAT') {
      if (subjectName === 'Math') return 'col-span-2 h-34';
      return 'col-span-1 h-32';
    }
    return 'col-span-1 h-32';
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto pb-20 select-none">
      
      {/* ─── DYNAMIC HERO HEADER SECTION ─── */}
      <div 
        className={`p-6 border-b-[3.5px] border-black relative transition-all duration-300 ${
          isDarkMode 
            ? 'bg-neutral-900 text-white' 
            : 'bg-[#FF6B6B] text-[#0A0A0A]' /* Light: bold orange/coral bg */
        }`}
      >
        {/* Decorative ✦ accent scattered in top corners */}
        <div className="absolute top-4 right-16 text-white/30 text-3xl font-bold font-display animate-pulse">✦</div>
        <div className="absolute bottom-2 left-6 text-white/20 text-4xl font-bold font-display">✦</div>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs font-extrabold uppercase bg-black/10 text-white/90 dark:bg-white/10 dark:text-[#C8F135] px-2.5 py-1 rounded-md w-fit border border-white/10">
              ⚡ LIVE PORTAL
            </div>
            
            <h1 className="text-3xl font-display font-black leading-none uppercase tracking-tight mt-2 flex items-center gap-1.5">
              Hey, {user.name} 👋
            </h1>
            
            <p className="text-sm font-bold opacity-90 mt-1 max-w-[85%] font-sans">
              Ready to crush your <span className="underline decoration-2 font-black text-white">{user.currentExam}</span> syllabus?
            </p>
          </div>

          {/* Theme Switch Icon & Profile Avatar Block */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="dashboard-theme-toggle"
              onClick={onToggleTheme}
              className="w-10 h-10 bg-white dark:bg-neutral-800 border-[2.5px] border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_#000] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-[#FFD60A] stroke-[3]" />
              ) : (
                <Moon className="w-5 h-5 text-black stroke-[3]" />
              )}
            </button>

            {/* Profile Avatar Placeholder */}
            <div className="w-10 h-10 bg-[#FFD60A] border-[2.5px] border-black rounded-xl flex items-center justify-center font-display font-black text-black shadow-[3px_3px_0px_#000] uppercase text-sm">
              {user.name.slice(0, 2)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-5">
        
        {/* ─── STREAK BANNER ─── */}
        <div 
          className={`p-4 rounded-xl border-[3px] border-black flex items-center justify-between shadow-[4px_4px_0px_#000] relative overflow-hidden transition-all duration-300 ${
            isDarkMode 
              ? 'bg-neutral-900/40 border-neutral-800 shadow-none' 
              : 'bg-[#B8FFE4]' /* Mint/Aqua */
          }`}
        >
          {/* Subtle neon glow for dark mode */}
          {isDarkMode && <div className="absolute inset-0 border border-emerald-500/20 rounded-xl" />}

          <div className="flex items-center gap-3">
            <div className="text-3xl filter drop-shadow-[1.5px_1.5px_0px_#000] animate-bounce">🔥</div>
            <div>
              <h3 className="font-display font-black text-base uppercase leading-tight text-neutral-900 dark:text-white">
                {user.streakDays} DAY STREAK!
              </h3>
              <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                Consistency is key to entry admission!
              </p>
            </div>
          </div>

          <div className="bg-black text-[#C8F135] font-mono text-xs font-extrabold border-[2px] border-[#C8F135] px-2.5 py-1 rounded-lg">
            BEST: {user.bestStreak} DAYS
          </div>
        </div>

        {/* ─── BENTO SUBJECT GRID TITLES ─── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-display font-black uppercase flex items-center gap-1.5 text-neutral-900 dark:text-white">
              <span>✦</span> SUBJECT MODULES
            </h2>
            <button
              id="refresh-stats-button"
              onClick={onRefreshStats}
              title="Refresh syllabus"
              className="text-xs font-mono font-bold text-[#FF3F3F] hover:underline flex items-center gap-1 cursor-pointer bg-white/10 p-1.5 rounded border border-transparent hover:border-black"
            >
              <RefreshCw className="w-3.5 h-3.5 stroke-[2.5]" /> SYNC
            </button>
          </div>

          {/* Asymmetric Mosaic Bento Grid */}
          <div className="grid grid-cols-2 gap-4">
            {subjectsToRender.map((sub) => {
              const bentoSpan = getBentoCellClass(sub.name, user.currentExam);
              const isCellLarge = bentoSpan.includes('col-span-2');

              return (
                <div
                  id={`bento-cell-${sub.id}`}
                  key={sub.id}
                  onClick={() => onSelectSubject(sub)}
                  className={`p-4 rounded-xl transition-all select-none relative overflow-hidden cursor-pointer flex flex-col justify-between group active:scale-[0.97] transition-all duration-150 ${bentoSpan} ${
                    isDarkMode
                      ? 'bg-neutral-900/50 border-[1.5px] border-neutral-800 text-white shadow-[0_0_12px_rgba(0,0,0,0.5)]'
                      : 'border-[3px] border-black shadow-[4px_4px_0px_#000]'
                  }`}
                  style={{ 
                    backgroundColor: isDarkMode ? undefined : sub.color,
                  }}
                >
                  
                  {/* Subtle Inner Neon/White glow for Dark Mode */}
                  {isDarkMode && (
                    <div 
                      className="absolute top-0 bottom-0 left-0 w-1.5"
                      style={{ backgroundColor: sub.color }}
                    />
                  )}

                  {/* Top Header section inside bento cell */}
                  <div className="flex items-start justify-between">
                    <div>
                      {/* Subtitle */}
                      <span className="font-mono text-[9px] font-black tracking-widest bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded-sm uppercase">
                        Syllabus deck
                      </span>
                      {/* Big Name */}
                      <h3 className="font-display font-black text-base uppercase tracking-tight text-neutral-900 dark:text-white mt-1 leading-none">
                        {sub.name}
                      </h3>
                    </div>

                    {/* Sparkle star / sticker in top right */}
                    <span className="text-xl group-hover:scale-125 transition-all filter drop-shadow-[1px_1px_0px_rgba(0,0,0,0.4)]">
                      {sub.emoji}
                    </span>
                  </div>

                  {/* Mid or Bottom segment inside bento cell */}
                  <div className="mt-2.5">
                    {/* Progress representation */}
                    <div className="flex justify-between items-center text-[10px] font-black text-neutral-900 dark:text-neutral-300 mb-1 font-mono">
                      <span>{sub.completedChapters} / {sub.chaptersCount} Chapters</span>
                      <span>{Math.round((sub.completedChapters / sub.chaptersCount) * 100)}%</span>
                    </div>

                    {/* Horizontal Bar */}
                    <div className="w-full h-2 border-[2px] border-black bg-white rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-black transition-all duration-300" 
                        style={{ 
                          width: `${(sub.completedChapters / sub.chaptersCount) * 100}%`,
                          backgroundColor: isDarkMode ? sub.color : '#000',
                        }}
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* ─── QUICK STATS ROW ─── */}
        <div>
          <h3 className="text-xs font-display font-black uppercase text-neutral-500 dark:text-neutral-400 mb-2.5 tracking-wider">
            ⚡ QUICK ACADEMIC STATS
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Stat 1: Streak */}
            <div 
              className={`p-3 text-center rounded-xl border-[2.5px] border-black transition-all ${
                isDarkMode 
                  ? 'bg-neutral-900/30 border-neutral-800' 
                  : 'bg-[#FFD60A] shadow-[3px_3px_0px_#000]'
              }`}
            >
              <div className="font-mono text-2xl font-black text-neutral-900 dark:text-white leading-none mb-1">
                {user.streakDays}d
              </div>
              <div className="font-display text-[9px] font-extrabold uppercase text-neutral-600 dark:text-neutral-400 tracking-wider">
                🔥 Streak
              </div>
            </div>

            {/* Stat 2: Chapters completed */}
            <div 
              className={`p-3 text-center rounded-xl border-[2.5px] border-black transition-all ${
                isDarkMode 
                  ? 'bg-neutral-900/30 border-neutral-800' 
                  : 'bg-[#C8F135] shadow-[3px_3px_0px_#000]'
              }`}
            >
              <div className="font-mono text-2xl font-black text-neutral-900 dark:text-white leading-none mb-1">
                {completedChapters}
              </div>
              <div className="font-display text-[9px] font-extrabold uppercase text-neutral-600 dark:text-neutral-400 tracking-wider">
                ✅ Ch. Done
              </div>
            </div>

            {/* Stat 3: Avg score */}
            <div 
              className={`p-3 text-center rounded-xl border-[2.5px] border-black transition-all ${
                isDarkMode 
                  ? 'bg-neutral-900/30 border-neutral-800' 
                  : 'bg-[#FF6FD8] shadow-[3px_3px_0px_#000]'
              }`}
            >
              <div className="font-mono text-2xl font-black text-neutral-900 dark:text-white leading-none mb-1">
                {progressPercent}%
              </div>
              <div className="font-display text-[9px] font-extrabold uppercase text-neutral-600 dark:text-neutral-400 tracking-wider">
                🎯 Progress
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

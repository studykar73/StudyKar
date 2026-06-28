import { Sparkles, Activity, Award, CheckCircle } from 'lucide-react';
import { ExamType, SubjectModule, EXAM_SUBJECT_MAPPING, SUBJECT_COLORS } from '../types';

interface ProgressProps {
  user: { name: string; email: string; currentExam: ExamType };
  subjectDeck: Record<string, SubjectModule>;
  isDarkMode: boolean;
}

export default function Progress({ user, subjectDeck, isDarkMode }: ProgressProps) {
  // Filter subjects strictly according to exam to subject mapping
  const activeSubjectNames = EXAM_SUBJECT_MAPPING[user.currentExam] || [];
  const subjectsToRender = activeSubjectNames.map((name) => subjectDeck[name]).filter(Boolean);

  // Math calculated metrics
  const totalChapters = subjectsToRender.reduce((acc, sub) => acc + sub.chaptersCount, 0);
  const completedChapters = subjectsToRender.reduce((acc, sub) => acc + sub.completedChapters, 0);
  const progressPercent = Math.round((completedChapters / totalChapters) * 100) || 0;

  // Real watch duration calculation based on completed lectures
  const watchedLectures = subjectsToRender.flatMap((sub) => sub.lectures.filter((l) => l.watched));
  const totalWatchedMins = watchedLectures.reduce((acc, lec) => {
    const mins = parseInt(lec.duration, 10) || 0;
    return acc + mins;
  }, 0);

  // Distribute real watch minutes across days so empty profile means empty bars
  const weeklyStudyMinutes = [
    { day: 'MON', mins: Math.round(totalWatchedMins * 0.10), color: '#FF6B6B' },
    { day: 'TUE', mins: Math.round(totalWatchedMins * 0.15), color: '#FFD60A' },
    { day: 'WED', mins: Math.round(totalWatchedMins * 0.20), color: '#C8F135' },
    { day: 'THU', mins: Math.round(totalWatchedMins * 0.10), color: '#B8FFE4' },
    { day: 'FRI', mins: Math.round(totalWatchedMins * 0.15), color: '#FF6FD8' },
    { day: 'SAT', mins: Math.round(totalWatchedMins * 0.20), color: '#00E5CC' },
    { day: 'SUN', mins: Math.round(totalWatchedMins * 0.10), color: '#BF5AF2' },
  ];

  const maxMinutes = Math.max(...weeklyStudyMinutes.map((m) => m.mins)) || 1;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24 select-none">
      
      {/* ─── HEADER ─── */}
      <div 
        className={`p-6 border-b-[3.5px] border-black transition-all duration-300 ${
          isDarkMode 
            ? 'bg-neutral-900 text-white' 
            : 'bg-[#FFD60A] text-black' /* Light: bold yellow bg */
        }`}
      >
        <h1 className="text-3xl font-display font-black leading-none uppercase tracking-tight flex items-center gap-2">
          MY PROGRESS 📊
        </h1>
        <p className="text-xs font-bold opacity-80 mt-1 uppercase tracking-wider">
          Realtime syllabus coverage for {user.currentExam}
        </p>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6">

        {/* ─── OVERALL PROGRESS RING CARD ─── */}
        <div 
          className={`p-5 rounded-2xl border-[3.5px] border-black flex flex-col items-center justify-center text-center ${
            isDarkMode 
              ? 'bg-neutral-900/40 border-neutral-800 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)]' 
              : 'bg-white shadow-[6px_6px_0px_#000]'
          }`}
        >
          {/* Radial percentage diagram */}
          <div className="relative w-36 h-36 flex items-center justify-center mb-4">
            
            {/* Background progress track circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke={isDarkMode ? '#262626' : '#E5E7EB'}
                strokeWidth="12"
                fill="transparent"
              />
              {/* Dynamic filled track */}
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke={isDarkMode ? '#00E5CC' : '#FF3F3F'} /* Neon cyan or hot coral red */
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={351.8}
                strokeDashoffset={351.8 - (351.8 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Middle percentage display (Extremely large bold figures like reference image 1) */}
            <div className="absolute flex flex-col items-center">
              <span className="font-mono text-4xl font-black text-neutral-900 dark:text-white">
                {progressPercent}%
              </span>
              <span className="font-display text-[9px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                COVERED
              </span>
            </div>
          </div>

          <h3 className="font-display font-black text-base uppercase leading-tight">
            {user.currentExam} OVERALL PROGRESS
          </h3>
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mt-1 max-w-[80%]">
            You've completed <span className="font-black text-black dark:text-emerald-400">{completedChapters} out of {totalChapters}</span> total chapters. Keep grinding!
          </p>
        </div>


        {/* ─── PER-SUBJECT BREAKDOWN SECTION ─── */}
        <div>
          <h2 className="text-sm font-display font-black uppercase text-neutral-900 dark:text-white mb-3 tracking-widest flex items-center gap-1.5">
            <span>✦</span> SYLLABUS BREAKDOWN
          </h2>

          <div className="flex flex-col gap-3.5">
            {subjectsToRender.map((sub) => {
              const subPercent = Math.round((sub.completedChapters / sub.chaptersCount) * 100) || 0;

              return (
                <div
                  id={`progress-subject-row-${sub.id}`}
                  key={sub.id}
                  className={`rounded-xl border-[3px] border-black p-3.5 flex items-center justify-between relative overflow-hidden ${
                    isDarkMode 
                      ? 'bg-neutral-900/40 border-neutral-800 text-white' 
                      : 'bg-white shadow-[3px_3px_0px_#000]'
                  }`}
                >
                  
                  {/* Left thick bold color strip */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 w-2.5" 
                    style={{ backgroundColor: sub.color }}
                  />

                  <div className="flex-1 pl-4 pr-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-display font-black text-sm uppercase tracking-tight">
                        {sub.name} {sub.emoji}
                      </h4>
                      <span className="font-mono text-xs font-bold text-neutral-500 dark:text-neutral-400">
                        {sub.completedChapters} / {sub.chaptersCount} Chapters
                      </span>
                    </div>

                    {/* Horizontal progress bar */}
                    <div className="w-full h-3 border-[2.5px] border-black bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${subPercent}%`, 
                          backgroundColor: sub.color 
                        }}
                      />
                    </div>
                  </div>

                  {/* Percentage badge in subject color circle */}
                  <div 
                    className="w-11 h-11 rounded-xl border-[2.5px] border-black flex items-center justify-center font-mono text-xs font-black shrink-0 shadow-[2px_2px_0px_#000]"
                    style={{ backgroundColor: sub.color, color: '#0A0A0A' }}
                  >
                    {subPercent}%
                  </div>

                </div>
              );
            })}
          </div>
        </div>


        {/* ─── WEEKLY STUDY TIMELINE (BAR CHART LIKE REFERENCE IMAGE 1) ─── */}
        <div 
          className={`p-4 rounded-xl border-[3px] border-black ${
            isDarkMode 
              ? 'bg-neutral-900/40 border-neutral-800 text-white shadow-none' 
              : 'bg-white shadow-[4px_4px_0px_#000]'
          }`}
        >
          <div className="flex justify-between items-center mb-4 select-none">
            <h3 className="font-display font-black text-sm uppercase text-neutral-900 dark:text-white flex items-center gap-1">
              <span>✦</span> STUDY TIME (THIS WEEK)
            </h3>
            
            <span className="font-mono text-[10px] font-black bg-red-400 text-black border border-black px-2 py-0.5 rounded-md uppercase">
              {totalWatchedMins} mins total
            </span>
          </div>

          {/* Vertical Bar Chart layout mirroring Reference Image 1 exactly */}
          <div className="h-44 flex items-end justify-between px-2 pt-6 relative border-b-[2.5px] border-black dark:border-neutral-800">
            
            {/* Background grid indicators */}
            <div className="absolute top-1/4 left-0 right-0 border-t border-dashed border-neutral-300 dark:border-neutral-800 pointer-events-none" />
            <div className="absolute top-2/4 left-0 right-0 border-t border-dashed border-neutral-300 dark:border-neutral-800 pointer-events-none" />
            <div className="absolute top-3/4 left-0 right-0 border-t border-dashed border-neutral-300 dark:border-neutral-800 pointer-events-none" />

            {weeklyStudyMinutes.map((item) => {
              const barHeight = Math.max(10, Math.round((item.mins / maxMinutes) * 100));

              return (
                <div key={item.day} className="flex flex-col items-center flex-1 group">
                  
                  {/* Tooltip on top */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all absolute -translate-y-8 bg-black text-white text-[10px] font-mono font-black py-0.5 px-2.5 rounded-md border border-[#C8F135]">
                    {item.mins}m
                  </div>

                  {/* Hard outline bar */}
                  <div 
                    className="w-8 rounded-t-md border-[2.5px] border-black transition-all duration-700 hover:scale-105 active:scale-95 cursor-pointer relative"
                    style={{ 
                      height: `${barHeight * 0.9}px`, 
                      backgroundColor: isDarkMode ? undefined : item.color,
                      borderColor: isDarkMode ? item.color : '#000000',
                      boxShadow: isDarkMode ? `0 0 10px ${item.color}50` : '2px 0px 0px #000000',
                    }}
                  >
                    {/* Glowing effect inside dark mode bar */}
                    {isDarkMode && (
                      <div className="absolute inset-0 opacity-80" style={{ backgroundColor: item.color }} />
                    )}
                  </div>

                  <span className="font-mono text-[9px] font-black text-neutral-500 dark:text-neutral-400 mt-2">
                    {item.day}
                  </span>
                </div>
              );
            })}

          </div>
        </div>

      </div>

    </div>
  );
}

import { useState } from 'react';
import { ArrowLeft, Play, Lock, Download, CheckCircle, Sparkles, FileText, Check } from 'lucide-react';
import { SubjectModule, Lecture, Note } from '../types';

interface SubjectDetailProps {
  subject: SubjectModule;
  isDarkMode: boolean;
  onBack: () => void;
  onToggleLectureWatched: (lectureId: string) => void;
  onToggleNoteDownloaded: (noteId: string) => void;
}

export default function SubjectDetail({
  subject,
  isDarkMode,
  onBack,
  onToggleLectureWatched,
  onToggleNoteDownloaded,
}: SubjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'notes'>('videos');
  const [activeVideo, setActiveVideo] = useState<Lecture | null>(null);

  const totalLectures = subject.lectures.length;
  const watchedLectures = subject.lectures.filter((l) => l.watched).length;
  const progressPercent = Math.round((watchedLectures / totalLectures) * 100) || 0;

  // Render a lovely embedded simulation player when a lecture is tapped
  const handleLectureClick = (lec: Lecture) => {
    if (lec.isPremium) {
      alert(`🔒 "${lec.title}" is locked under Premium. Support our server integrations or upgrade to unlock 200+ lectures!`);
      return;
    }
    setActiveVideo(lec);
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-y-auto ${isDarkMode ? 'bg-[#0B0B0F]' : 'bg-[#FFF]'}`}>
      
      {/* ─── STICKY HEADER WITH SUBJECT ACCENT COLOR ─── */}
      <div 
        className="p-5 border-b-[3.5px] border-black text-black select-none relative"
        style={{ backgroundColor: subject.color }}
      >
        {/* Background stars */}
        <div className="absolute top-2 right-12 text-black/15 text-2xl">✦</div>
        <div className="absolute bottom-2 left-1/3 text-black/15 text-3xl">✦</div>

        <div className="flex items-center justify-between mb-3.5">
          <button
            id="back-button-subject-detail"
            onClick={onBack}
            className="w-10 h-10 bg-white border-[2.5px] border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_#000] cursor-pointer transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1.5px_1.5px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_#000]"
          >
            <ArrowLeft className="w-5 h-5 stroke-[3]" />
          </button>

          <div className="bg-white border-[2px] border-black px-3 py-1 rounded-full font-mono text-xs font-extrabold shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
            <span className="text-red-500">🔥</span> {subject.completedChapters}/{subject.chaptersCount} CHS DONE
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-black/60 font-display flex items-center gap-1">
              <span>{subject.emoji}</span> SUBJECT STUDY DECK
            </div>
            <h1 className="text-3xl font-display font-black leading-none uppercase tracking-tight text-black mt-1">
              {subject.name}
            </h1>
          </div>
          
          <div className="bg-black text-[#C8F135] font-mono text-sm font-black border-[2px] border-[#C8F135] px-3 py-1.5 rounded-lg shadow-[3px_3px_0px_#000]">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* ─── VIDEO SIMULATOR PLAYER (IF ACTIVE) ─── */}
      {activeVideo && (
        <div className="border-b-[3.5px] border-black bg-black p-4 select-none">
          <div className="w-full aspect-video bg-neutral-900 border-[3px] border-white rounded-xl relative overflow-hidden flex flex-col justify-between p-4">
            
            {/* Visual simulation screen */}
            <div className="absolute inset-0 bg-radial from-neutral-800 to-black opacity-90 flex flex-col items-center justify-center text-center p-5">
              <div className="w-16 h-16 bg-[#C8F135] border-[3px] border-black rounded-full flex items-center justify-center shadow-[3px_3px_0px_#000] mb-3 animate-pulse">
                <Play className="w-6 h-6 stroke-[3] text-black fill-black translate-x-0.5" />
              </div>
              <p className="text-white font-display font-extrabold text-sm uppercase px-4 leading-tight mb-1">
                Now Streaming Lecture Session
              </p>
              <p className="text-[#00E5CC] font-mono text-xs font-bold">
                {subject.name} • {activeVideo.duration} mins
              </p>
            </div>

            {/* Top controls info */}
            <div className="relative z-10 flex justify-between items-center text-white">
              <span className="bg-red-500 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">
                LIVE COMPILER
              </span>
              <button 
                id="close-simulated-player"
                onClick={() => setActiveVideo(null)} 
                className="text-xs bg-white/20 hover:bg-white/40 border border-white/30 px-2 py-0.5 rounded-md font-bold"
              >
                Close ×
              </button>
            </div>

            {/* Bottom controls title */}
            <div className="relative z-10 text-white flex justify-between items-end">
              <div className="max-w-[75%]">
                <h4 className="font-display font-black text-xs uppercase text-[#FFD60A] line-clamp-1">
                  {activeVideo.title}
                </h4>
                <p className="text-[10px] text-neutral-400 font-medium">StudyKar.pk HD Player 1.0</p>
              </div>
              
              <button
                id="toggle-watch-status-player"
                onClick={() => {
                  onToggleLectureWatched(activeVideo.id);
                  // update current active reference watch status
                  setActiveVideo({ ...activeVideo, watched: !activeVideo.watched });
                }}
                className={`text-[11px] font-black uppercase px-2.5 py-1.5 border-[2px] rounded-lg shadow-[2px_2px_0px_#000] transition-all flex items-center gap-1 ${
                  activeVideo.watched 
                    ? 'bg-green-400 text-black border-black' 
                    : 'bg-[#FF3F3F] text-white border-white shadow-[2px_2px_0px_rgba(255,255,255,0.3)]'
                }`}
              >
                {activeVideo.watched ? <Check className="w-3 h-3 stroke-[3]" /> : null}
                {activeVideo.watched ? 'Watched' : 'Mark Watched'}
              </button>
            </div>

          </div>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        
        {/* ─── TABS NAVIGATOR (NEO-BRUTALIST TAB SYSTEM) ─── */}
        <div className="grid grid-cols-2 gap-3.5 mb-5 select-none">
          <button
            id="tab-video-lectures"
            onClick={() => setActiveTab('videos')}
            className={`h-12 border-[3.5px] border-black rounded-xl font-display font-black text-sm uppercase tracking-wider transition-all shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-black text-white brutalist-button-active'
                : isDarkMode 
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500' 
                  : 'bg-white text-black hover:bg-neutral-50'
            }`}
          >
            <span>📹</span> VIDEO LECTURES
          </button>

          <button
            id="tab-revision-notes"
            onClick={() => setActiveTab('notes')}
            className={`h-12 border-[3.5px] border-black rounded-xl font-display font-black text-sm uppercase tracking-wider transition-all shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-black text-white brutalist-button-active'
                : isDarkMode 
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:border-neutral-500' 
                  : 'bg-white text-black hover:bg-neutral-50'
            }`}
          >
            <span>📄</span> CHAPTER NOTES
          </button>
        </div>

        {/* ─── LECTURES LIST TAB ─── */}
        {activeTab === 'videos' && (
          <div className="flex flex-col gap-3.5 flex-1">
            {subject.lectures.filter(lec => lec.published !== false).length === 0 ? (
              <div className="p-8 text-center border-[2.5px] border-dashed border-black dark:border-neutral-800 rounded-2xl text-neutral-400 text-xs bg-white dark:bg-neutral-900/40">
                No video lectures published yet.
              </div>
            ) : (
              subject.lectures.filter(lec => lec.published !== false).map((lec, index) => {
                const cardBg = isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-black';
                const borderStyles = isDarkMode ? 'border-[1.5px] border-neutral-800 shadow-[0_4px_12px_rgba(0,0,0,0.3)]' : 'border-[3px] border-black shadow-[3px_3px_0px_#000]';

                return (
                  <div
                    id={`lecture-item-${lec.id}`}
                    key={lec.id}
                    onClick={() => handleLectureClick(lec)}
                    className={`p-3.5 rounded-xl transition-all brutalist-card-tap flex items-center justify-between cursor-pointer relative overflow-hidden ${cardBg} ${borderStyles}`}
                  >
                    
                    {/* Subject stripe accent in Dark Mode */}
                    {isDarkMode && (
                      <div className="absolute top-0 bottom-0 left-0 w-1.5" style={{ backgroundColor: subject.color }} />
                    )}

                    <div className="flex items-center gap-3.5 flex-1 pr-2">
                      {/* Thumbnail video block */}
                      <div 
                        className={`w-14 h-14 shrink-0 rounded-lg border-[2px] border-black flex items-center justify-center shadow-[2.5px_2.5px_0px_#000] relative`}
                        style={{ backgroundColor: subject.color }}
                      >
                        {lec.isPremium ? (
                          <Lock className="w-5 h-5 text-black stroke-[2.5]" />
                        ) : (
                          <Play className="w-5 h-5 text-black fill-black translate-x-0.5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-black bg-black/10 text-black/70 dark:bg-white/10 dark:text-white/70 px-1.5 py-0.5 rounded-md">
                            LEC 0{index + 1}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                            ⏱️ {lec.duration}m
                          </span>
                        </div>

                        <h4 className="font-display font-black text-sm uppercase tracking-tight text-neutral-900 dark:text-white mt-1 leading-snug line-clamp-1">
                          {lec.title}
                        </h4>
                      </div>
                    </div>

                    {/* Watch Status or Locked Badge */}
                    <div className="shrink-0 flex items-center">
                      {lec.isPremium ? (
                        <span className="bg-[#FF3F3F] text-white font-mono text-[10px] font-black border-[1.5px] border-black px-2 py-0.5 rounded-md uppercase">
                          PREMIUM 👑
                        </span>
                      ) : (
                        <button
                          id={`watch-toggle-${lec.id}`}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent player auto launch
                            onToggleLectureWatched(lec.id);
                          }}
                          className={`w-9 h-9 rounded-lg border-[2px] border-black flex items-center justify-center transition-all ${
                            lec.watched 
                              ? 'bg-green-400 text-black shadow-[2px_2px_0px_#000]' 
                              : 'bg-white text-neutral-300 hover:border-neutral-500 shadow-[1px_1px_0px_#000]'
                          }`}
                        >
                          <CheckCircle className={`w-5 h-5 ${lec.watched ? 'stroke-[3]' : 'stroke-[1.5]'}`} />
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ─── NOTES LIST TAB ─── */}
        {activeTab === 'notes' && (
          <div className="flex flex-col gap-3.5 flex-1">
            {subject.notes.filter(note => note.published !== false).length === 0 ? (
              <div className="p-8 text-center border-[2.5px] border-dashed border-black dark:border-neutral-800 rounded-2xl text-neutral-400 text-xs bg-white dark:bg-neutral-900/40">
                No chapter notes uploaded yet.
              </div>
            ) : (
              subject.notes.filter(note => note.published !== false).map((note) => {
                const cardBg = isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-white border-black';
                const borderStyles = isDarkMode ? 'border-[1.5px] border-neutral-800' : 'border-[3px] border-black shadow-[3px_3px_0px_#000]';

                return (
                  <div
                    id={`note-item-${note.id}`}
                    key={note.id}
                    onClick={() => {
                      if (note.isPremium) {
                        alert('👑 Premium Handbooks are locked for basic accounts. Upgrade to Premium for 100% textbook support.');
                        return;
                      }
                      onToggleNoteDownloaded(note.id);
                    }}
                    className={`p-3.5 rounded-xl transition-all brutalist-card-tap flex items-center justify-between cursor-pointer relative overflow-hidden ${cardBg} ${borderStyles}`}
                  >
                    {/* Subject stripe in Dark Mode */}
                    {isDarkMode && (
                      <div className="absolute top-0 bottom-0 left-0 w-1.5" style={{ backgroundColor: subject.color }} />
                    )}

                    <div className="flex items-center gap-3.5 flex-1 pr-2">
                      {/* Document icon square block */}
                      <div 
                        className={`w-14 h-14 shrink-0 rounded-lg border-[2px] border-black flex items-center justify-center shadow-[2.5px_2.5px_0px_#000]`}
                        style={{ backgroundColor: subject.color }}
                      >
                        <FileText className="w-6 h-6 text-black stroke-[2.5]" />
                      </div>

                      <div>
                        <span className="font-mono text-[10px] font-extrabold text-[#BF5AF2] dark:text-[#BF5AF2]">
                          📂 PDF SYLLABUS HANDBOOK
                        </span>
                        <h4 className="font-display font-black text-sm uppercase tracking-tight text-neutral-900 dark:text-white mt-1 leading-snug line-clamp-1">
                          {note.title}
                        </h4>
                        <p className="font-mono text-[10px] text-neutral-500 font-bold">
                          📄 File Size: {note.size} {note.isPremium ? '• VIP Chapter' : '• Open Access'}
                        </p>
                      </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="shrink-0">
                      {note.isPremium ? (
                        <span className="bg-purple-600 text-white font-mono text-[10px] font-black border-[1.5px] border-black px-2 py-0.5 rounded-md uppercase">
                          PRO LOCK 🔒
                        </span>
                      ) : (
                        <button
                          id={`download-toggle-${note.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleNoteDownloaded(note.id);
                          }}
                          className={`w-10 h-10 rounded-full border-[2.5px] border-black flex items-center justify-center shadow-[2.5px_2.5px_0px_#000] transition-all cursor-pointer ${
                            note.downloaded 
                              ? 'bg-green-400 text-black' 
                              : 'bg-white hover:bg-neutral-50'
                          }`}
                          style={{ backgroundColor: note.downloaded ? 'rgba(74, 222, 128, 1)' : '#FFF' }}
                        >
                          {note.downloaded ? (
                            <Check className="w-5 h-5 stroke-[3.5]" />
                          ) : (
                            <Download className="w-5 h-5 text-black stroke-[3]" />
                          )}
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

    </div>
  );
}

export type ExamType = 'BCAT' | 'MDCAT' | 'ECAT' | 'IoBM';

export type SubjectType =
  | 'English'
  | 'Math'
  | 'Biology'
  | 'Chemistry'
  | 'Physics'
  | 'Logical Reasoning'
  | 'General Knowledge';

export interface Lecture {
  id: string;
  title: string;
  duration: string;
  isPremium: boolean;
  watched: boolean;
  youtubeId?: string; // for high fidelity preview
  published?: boolean;
  description?: string;
}

export interface Note {
  id: string;
  title: string;
  size: string;
  isPremium: boolean;
  downloaded: boolean;
  published?: boolean;
  description?: string;
}

export interface SubjectModule {
  id: string;
  name: SubjectType;
  color: string;
  chaptersCount: number;
  completedChapters: number;
  lectures: Lecture[];
  notes: Note[];
  emoji: string;
}

export interface User {
  name: string;
  email: string;
  currentExam: ExamType;
  streakDays: number;
  bestStreak: number;
  joinDate: string;
  completedLectures: string[]; // lecture IDs
  downloadedNotes: string[]; // note IDs
  isAdmin?: boolean;
}

// Strict Exam to Subject Mapping
export const EXAM_SUBJECT_MAPPING: Record<ExamType, SubjectType[]> = {
  BCAT: ['English', 'Math'],
  MDCAT: ['Biology', 'Chemistry', 'Physics', 'English', 'Logical Reasoning'],
  ECAT: ['Math', 'Physics', 'Chemistry', 'English'],
  IoBM: ['English', 'Math', 'Logical Reasoning', 'General Knowledge'],
};

// Exam info
export const EXAM_DETAILS: Record<ExamType, { fullName: string; desc: string; accentColor: string }> = {
  BCAT: {
    fullName: 'Business College Admission Test',
    desc: 'Preparation for IBA, CBM & other premier business programs.',
    accentColor: '#FF6B6B',
  },
  MDCAT: {
    fullName: 'Medical & Dental College Admission Test',
    desc: 'National curriculum preparation for public and private medical colleges.',
    accentColor: '#39FF14',
  },
  ECAT: {
    fullName: 'Engineering College Admission Test',
    desc: 'Comprehensive syllabus training for UET, GIKI, NUST, and FAST.',
    accentColor: '#00E5CC',
  },
  IoBM: {
    fullName: 'Institute of Business Management Admission Test',
    desc: 'Specialized prep for IoBM (CBM) degree programs testing.',
    accentColor: '#FF69B4',
  },
};

// Consistent color coding
export const SUBJECT_COLORS: Record<SubjectType, string> = {
  English: '#FFD60A', // electric yellow
  Math: '#FF3F3F', // hot coral red
  Biology: '#39FF14', // neon green
  Chemistry: '#BF5AF2', // electric purple
  Physics: '#00E5CC', // neon cyan
  'Logical Reasoning': '#FF6B35', // bold orange
  'General Knowledge': '#FF69B4', // hot pink
};

export const SUBJECT_EMOJIS: Record<SubjectType, string> = {
  English: '📖',
  Math: '📐',
  Biology: '🧬',
  Chemistry: '🧪',
  Physics: '⚛️',
  'Logical Reasoning': '🧠',
  'General Knowledge': '🌍',
};

// Helper mock content generator - starts completely empty as requested by Section 6 & 7
export const generateMockSubjects = (): Record<SubjectType, SubjectModule> => {
  const subjects: SubjectType[] = [
    'English',
    'Math',
    'Biology',
    'Chemistry',
    'Physics',
    'Logical Reasoning',
    'General Knowledge',
  ];

  const result: Partial<Record<SubjectType, SubjectModule>> = {};

  subjects.forEach((subj) => {
    result[subj] = {
      id: `subj-${subj.toLowerCase().replace(' ', '-')}`,
      name: subj,
      color: SUBJECT_COLORS[subj],
      emoji: SUBJECT_EMOJIS[subj],
      chaptersCount: 12,
      completedChapters: 0, // Starts at 0 progress
      lectures: [], // Starts completely empty
      notes: [], // Starts completely empty
    };
  });

  return result as Record<SubjectType, SubjectModule>;
};

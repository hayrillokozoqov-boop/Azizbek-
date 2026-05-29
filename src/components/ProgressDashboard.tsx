import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Award, 
  BookOpen, 
  Volume2, 
  Gamepad2, 
  Mic, 
  Flame, 
  CheckCircle, 
  Clock, 
  Zap, 
  Target, 
  ArrowRight, 
  Shield, 
  Star, 
  TrendingUp, 
  HelpCircle,
  Sparkles,
  Search,
  BookOpenCheck
} from 'lucide-react';
import { getLevelInfo } from '../App';
import { grammarLessons } from '../data/grammarData';
import { oxfordLevels } from '../data/oxfordDiscoverData';

interface ProgressDashboardProps {
  xpPoints: number;
  streak: number;
  completedLessonsCount: number;
  onNavigateTab: (tab: 'grammar' | 'alphabet' | 'games' | 'lab') => void;
  addXP: (amount: number, reason: string) => void;
}

interface GameStats {
  totalGamesPlayed: number;
  correctAnswers: number;
  highestDuelStreak: number;
  totalGameXp: number;
  lessonsUnlocked: string[];
}

interface GameBadge {
  id: string;
  nameUz: string;
  descUz: string;
  requirementUz: string;
  unlocked: boolean;
  iconType: string;
}

export default function ProgressDashboard({
  xpPoints,
  streak,
  completedLessonsCount,
  onNavigateTab,
  addXP
}: ProgressDashboardProps) {
  // Local active progress states synced on mount & via dispatch storage handler
  const [grammarScores, setGrammarScores] = useState<Record<string, number>>({});
  const [grammarAttempts, setGrammarAttempts] = useState<Record<string, number>>({});
  const [readLessons, setReadLessons] = useState<string[]>([]);
  
  const [gameStats, setGameStats] = useState<GameStats>({
    totalGamesPlayed: 0,
    correctAnswers: 0,
    highestDuelStreak: 0,
    totalGameXp: 0,
    lessonsUnlocked: ['word']
  });

  const [badges, setBadges] = useState<GameBadge[]>([]);
  const [pronunciationBest, setPronunciationBest] = useState<number>(0);
  const [pronunciationAttempts, setPronunciationAttempts] = useState<number>(0);

  const loadAllStats = () => {
    try {
      // 1. Load general grammar highest scores and attempts
      const savedScores = localStorage.getItem('eng_quiz_highest_scores');
      if (savedScores) setGrammarScores(JSON.parse(savedScores));

      const savedAttempts = localStorage.getItem('eng_quiz_attempts');
      if (savedAttempts) setGrammarAttempts(JSON.parse(savedAttempts));

      // 2. Load read grammar lessons
      const savedRead = localStorage.getItem('eng_read_lessons');
      if (savedRead) setReadLessons(JSON.parse(savedRead));

      // 3. Load games stats and badges
      const savedGameStats = localStorage.getItem('eng_games_stats');
      if (savedGameStats) {
        setGameStats(JSON.parse(savedGameStats));
      }

      const savedBadges = localStorage.getItem('eng_games_badges');
      const badgeMap = savedBadges ? JSON.parse(savedBadges) : {};
      const defaultBadges: GameBadge[] = [
        { id: 'badge-first-win', nameUz: 'Birinchi G\'alaba', descUz: 'Ilk bor o\'yin topshirig\'ini tugatganingiz uchun.', requirementUz: 'Istalgan bitta o\'yin bosqichini yakunlash', unlocked: !!badgeMap['badge-first-win'], iconType: 'compass' },
        { id: 'badge-simple-master', nameUz: 'Simple Bilimdoni', descUz: 'Present Simple bo\'yicha o\'yinda yuqori natija.', requirementUz: 'Present Simple savollariga 3 ta to\'g\'ri javob', unlocked: !!badgeMap['badge-simple-master'], iconType: 'shield' },
        { id: 'badge-continuous-pro', nameUz: 'Continuous Tezqor', descUz: 'Present Continuous o\'yinini yakunlaganingiz munosabati bilan.', requirementUz: 'Continuous gaplarini to\'liq xatosiz yig\'ish', unlocked: !!badgeMap['badge-continuous-pro'], iconType: 'flame' },
        { id: 'badge-streak-king', nameUz: 'Zarba Qiroli', descUz: 'Tense Duel o\'yinida kuchli to\'g\'ri ketma-ketlik.', requirementUz: 'Tense Duel o\'yinida 5 ta to\'g\'ri javoblar seriyasi', unlocked: !!badgeMap['badge-streak-king'], iconType: 'zap' },
        { id: 'badge-tense-master', nameUz: 'Zamonlar Qiroli', descUz: 'Mustahkam xotira va grammatika malakasi.', requirementUz: 'Barcha turlar uchun 100+ o\'yin balli to\'plash', unlocked: !!badgeMap['badge-tense-master'], iconType: 'trophy' }
      ];
      setBadges(defaultBadges);

      // 4. Load pronunciation lab stats
      const savedBestPron = localStorage.getItem('eng_pronunciation_best');
      if (savedBestPron) setPronunciationBest(parseInt(savedBestPron, 10));

      const savedAttemptsPron = localStorage.getItem('eng_pronunciation_attempts');
      if (savedAttemptsPron) setPronunciationAttempts(parseInt(savedAttemptsPron, 10));

    } catch (e) {
      console.error('Failed to load stats details on progress dashboard', e);
    }
  };

  useEffect(() => {
    loadAllStats();

    const handleStorageChange = () => {
      loadAllStats();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Level structure
  const levelInfo = getLevelInfo(xpPoints);
  const totalNeededForNext = levelInfo.nextXp - levelInfo.prevXp;
  const currentLevelProgress = xpPoints - levelInfo.prevXp;
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / totalNeededForNext) * 100));

  // Category rates calculation
  const totalLessons = grammarLessons.length;
  const totalReadCount = grammarLessons.filter(l => readLessons.includes(l.id)).length;
  const studyProgressRate = Math.round((totalReadCount / totalLessons) * 100) || 0;

  const grammarPassedCount = grammarLessons.filter(l => (grammarScores[l.id] || 0) >= 80).length;
  const grammarPassRate = Math.round((grammarPassedCount / totalLessons) * 100) || 0;

  const totalOxfordClasses = oxfordLevels.length;
  const oxfordPassedCount = oxfordLevels.filter(lvl => (grammarScores[lvl.id] || 0) >= 80).length;
  const oxfordPassRate = Math.round((oxfordPassedCount / totalOxfordClasses) * 100) || 0;

  // Render Category Icon Map
  const getBadgeIcon = (type: string, unlocked: boolean) => {
    const cls = `w-6 h-6 shrink-0 ${unlocked ? 'text-amber-500' : 'text-slate-400'}`;
    switch (type) {
      case 'compass': return <Target className={cls} />;
      case 'shield': return <Shield className={cls} />;
      case 'flame': return <Flame className={cls} />;
      case 'zap': return <Zap className={cls} />;
      default: return <Trophy className={cls} />;
    }
  };

  return (
    <div id="progress-dashboard-view" className="space-y-6">
      
      {/* SECTION 1: DYNAMIC BENTO PROFILE PROFILE HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile visual badge bento card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white p-6 rounded-3xl border border-indigo-950 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-4xl p-2.5 bg-white/10 rounded-2xl border border-white/10 shadow-inner select-none">
                {levelInfo.level === 5 ? '👑' : '🏅'}
              </span>
              <div>
                <span className="text-[10px] text-indigo-300 font-extrabold tracking-widest uppercase block leading-none">O'QUVCHINING DARAJASI</span>
                <h3 className="text-xl font-black tracking-tight">{levelInfo.title}</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-black inline-block mt-1 uppercase border border-emerald-500/30">
                  Daraja: {levelInfo.level}
                </span>
              </div>
            </div>
            
            <p className="text-[11px] text-indigo-200/90 font-medium leading-relaxed">
              {levelInfo.desc}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-indigo-300 font-extrabold font-mono text-[10px] uppercase">Daraja progressi</span>
              <span className="font-mono font-black">{xpPoints} / {levelInfo.nextXp} XP</span>
            </div>
            <div className="h-3 bg-slate-950 rounded-full p-0.5 overflow-hidden border border-white/5">
              <div 
                className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${levelInfo.color}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-indigo-300/80 font-semibold mt-1">
              Keyingi darajagacha yana <span className="text-white font-black">{levelInfo.nextXp - xpPoints} XP</span> ball kerak
            </p>
          </div>
        </div>

        {/* Dynamic statistics overview with gauges */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-xl shadow-2xs">
              📝
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Darslik o'qilishi</span>
            <span className="text-2xl font-black text-slate-800">{studyProgressRate}%</span>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1 max-w-[80px]">
              <div className="bg-indigo-650 h-full rounded-full" style={{ width: `${studyProgressRate}%` }} />
            </div>
            <span className="text-[9px] text-slate-400 font-bold">{totalReadCount} / {totalLessons} mavzular</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xl shadow-2xs">
              🏆
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Test o'zlashtirish</span>
            <span className="text-2xl font-black text-slate-800">{grammarPassRate}%</span>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1 max-w-[80px]">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${grammarPassRate}%` }} />
            </div>
            <span className="text-[9px] text-slate-400 font-bold">{grammarPassedCount} / {totalLessons} tasi muvaffaqiyatli</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-xl shadow-box">
              🎓
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oxford natijalari</span>
            <span className="text-2xl font-black text-slate-800">{oxfordPassRate}%</span>
            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1 max-w-[80px]">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${oxfordPassRate}%` }} />
            </div>
            <span className="text-[9px] text-slate-400 font-bold">{oxfordPassedCount} / {totalOxfordClasses} sinf darajasi</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/50 flex flex-col items-center text-center space-y-1">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-xl shadow-2xs">
              🔥
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Faol Kunlar</span>
            <span className="text-2xl font-black text-rose-600">{streak} Kun</span>
            <span className="text-[9px] text-rose-400 font-bold block">Kundalik qatnovlar</span>
            <div className="bg-rose-50 border border-rose-100 ring-1 ring-rose-200 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase text-rose-600">
              STREAK CHAQILDI
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 2: THE MAIN SECTION CARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Grammar and Lesson Progress Details (8 columns stack) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Grammar Lessons Mastery Dashboard Card */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-650" />
                  <span>Grammatika va Darslar bo'limi tahlili</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                  Har bir grammatika darsining nazariy materialini o'rganish va imtihon ko'rsatkichlari statusi
                </p>
              </div>
              <button 
                onClick={() => onNavigateTab('grammar')}
                className="text-[10px] font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5 cursor-pointer active:scale-97"
              >
                <span>Darslarga o'tish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lessons table list */}
            <div className="space-y-3">
              {grammarLessons.map(lesson => {
                const isRead = readLessons.includes(lesson.id);
                const score = grammarScores[lesson.id];
                const attempts = grammarAttempts[lesson.id] || 0;
                const hasScore = score !== undefined;

                return (
                  <div 
                    key={lesson.id}
                    className="group bg-slate-50/70 hover:bg-slate-50 border border-slate-200/50 hover:border-slate-300 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-805 tracking-tight group-hover:text-indigo-950">
                          {lesson.title} - {lesson.titleUz}
                        </h4>
                        <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                          isRead ? 'bg-emerald-100 text-emerald-850 border border-emerald-200/50' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {isRead ? "O'qilgan ✓" : "O'qilmagan 📖"}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed max-w-md">
                        {lesson.shortDescUz}
                      </p>
                    </div>

                    <div className="flex items-center space-x-4 self-stretch md:self-auto justify-between border-t md:border-t-0 border-slate-200/40 pt-3 md:pt-0 shrink-0">
                      
                      {/* Score metrics */}
                      <div className="text-right flex items-center space-x-3">
                        <div className="text-center md:text-right">
                          <span className="text-[9px] text-slate-400 font-bold block leading-none">Takrorlangan</span>
                          <span className="text-xs font-black text-slate-700">{attempts} marta</span>
                        </div>
                        
                        <div className="text-center bg-white border border-slate-200/70 p-2 rounded-xl min-w-[70px]">
                          <span className="text-[8px] font-black text-slate-400 block leading-none uppercase tracking-wide">Eng yaxshi</span>
                          <span className={`text-xs font-mono font-black ${
                            hasScore ? (score >= 80 ? 'text-emerald-600' : 'text-amber-500') : 'text-slate-400'
                          }`}>
                            {hasScore ? `${score}%` : 'topshirilmagan'}
                          </span>
                        </div>
                      </div>

                      {/* Direct lesson jump trigger */}
                      <button
                        onClick={() => onNavigateTab('grammar')}
                        className="bg-indigo-600 hover:bg-indigo-700 active:scale-97 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Oxford Discover Graded Classes */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span>Oxford Discover Sinfiy Testlar statusi</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                  1-sinfdan 6-sinfgacha bo'lgan mukammal o'zlashtirish va imtihon ballari
                </p>
              </div>
              <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 scale-95 shrink-0 self-start sm:self-auto">
                20 TALIK RANDOM SAVOL CHIG'IRIG'I
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {oxfordLevels.map((lvl, index) => {
                const score = grammarScores[lvl.id];
                const attempts = grammarAttempts[lvl.id] || 0;
                const hasScore = score !== undefined;

                return (
                  <div 
                    key={lvl.id}
                    className="bg-slate-50/70 border border-slate-200/50 hover:bg-white hover:border-indigo-200 hover:shadow-2xs rounded-2xl p-4 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md">
                          {lvl.gradeUz}
                        </span>
                        {hasScore && (
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                            score >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            Ball: {score}% ⭐
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-slate-800 tracking-tight leading-snug line-clamp-1">
                        {lvl.name}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold italic line-clamp-1">
                        "{lvl.bigQuestionUz}"
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed leading-normal">
                        {lvl.descriptionUz}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase">
                        Sinflar urinishi: <b className="text-slate-700 font-black">{attempts} ta</b>
                      </span>
                      <button
                        onClick={() => onNavigateTab('grammar')}
                        className="text-[9px] font-black uppercase text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-transform duration-200 hover:translate-x-1"
                      >
                        <span>Testni boshlash</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Vocabulary Games and Badges Showcase (4 columns stack) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Games stat widget */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Gamepad2 className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Vocabulary O'yinlari Statikasi</span>
            </h3>

            {/* Quick mini stats grid */}
            <div className="space-y-3">
              
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🎮</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">O'yinlar Soni</span>
                </div>
                <span className="text-sm font-black text-slate-800">{gameStats.totalGamesPlayed} marta</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🎯</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">To'g'ri Javoblar</span>
                </div>
                <span className="text-sm font-black text-slate-800">{gameStats.correctAnswers} ta</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⚡</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Zarbalar ketma-ketligi</span>
                </div>
                <span className="text-sm font-black font-mono text-emerald-600">Max: {gameStats.highestDuelStreak}x</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100/60 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🏅</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">O'yindagi Jami XP</span>
                </div>
                <span className="text-sm font-black text-emerald-800 font-mono">+{gameStats.totalGameXp} XP</span>
              </div>

            </div>

            <button
              onClick={() => onNavigateTab('games')}
              className="w-full text-center py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-97 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all border border-emerald-500/20 shadow-2xs block"
            >
              Mashq va Duel o'ynash 🎮
            </button>
          </div>

          {/* Pronunciation stats */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Mic className="w-4 h-4 text-purple-500" />
              <span>Talaffuz Laboratoriyasi</span>
            </h3>

            <div className="space-y-3">
              
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/60 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🎙️</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ovozli mashqlar</span>
                </div>
                <span className="text-sm font-black text-slate-800">{pronunciationAttempts} marta</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-150 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🎯</span>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Eng yuqori aniqlik</span>
                </div>
                <span className="text-sm font-black font-mono text-indigo-700">{pronunciationBest ? `${pronunciationBest}%` : 'Kutmoqda'}</span>
              </div>

            </div>

            <button
              onClick={() => onNavigateTab('lab')}
              className="w-full text-center py-2.5 bg-indigo-650 hover:bg-indigo-700 active:scale-97 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition-all border border-indigo-500/20 shadow-2xs block"
            >
              Talaffuzni mashq qilish 🎙️
            </button>
          </div>

          {/* Unlocked and Locked Badges Showcase Panel */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Egasiz & Yutilgan Nishonlar</span>
              </h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-500 rounded-md px-1.5 py-0.5">
                {badges.filter(b => b.unlocked).length}/5
              </span>
            </div>

            {/* Badges interactive list */}
            <div className="space-y-3.5 max-h-[380px] overflow-y-auto scrollbar-none pr-1">
              {badges.map(badge => {
                const isOpened = badge.unlocked;

                return (
                  <div 
                    key={badge.id}
                    className={`flex items-start space-x-3 p-3.5 rounded-2xl border transition-all ${
                      isOpened 
                        ? 'bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 text-slate-850' 
                        : 'bg-slate-50/50 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                      isOpened ? 'bg-amber-100 ring-4 ring-amber-500/5' : 'bg-slate-200'
                    }`}>
                      {getBadgeIcon(badge.iconType, isOpened)}
                    </div>
                    
                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-extrabold flex items-center gap-1.5 ${isOpened ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                        <span>{badge.nameUz}</span>
                        {isOpened && <span className="text-[10px] text-amber-600 font-extrabold">Ochilgan ✅</span>}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-normal">
                        {badge.descUz}
                      </p>
                      
                      {!isOpened && (
                        <span className="inline-block bg-slate-200 text-slate-550 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 mt-1 rounded-md">
                          Shart: {badge.requirementUz}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-[9px] text-center text-slate-400 font-bold leading-normal">
              O'yinlarda muvaffaqiyatga erishib nishonlarni oching! Nishon ochilganda qo'shimcha rag'batlantiruvchi +30 XP taqdim etiladi.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

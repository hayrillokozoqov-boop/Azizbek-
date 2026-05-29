/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Volume2, Gamepad2, Mic, Flame, Trophy, GraduationCap, Sparkles, CheckCircle2, Lock, Unlock, AlertCircle, Award, CheckCircle, BarChart2 } from 'lucide-react';
import GrammarQuizzes from './components/GrammarQuizzes';
import AudioAlphabet from './components/AudioAlphabet';
import EducationalGames from './components/EducationalGames';
import PronunciationLab from './components/PronunciationLab';
import AIAgentTrivia from './components/AIAgentTrivia';
import ProgressDashboard from './components/ProgressDashboard';

type ActiveTab = 'dashboard' | 'grammar' | 'alphabet' | 'games' | 'lab';

export interface LevelInfo {
  level: number;
  title: string;
  badge: string;
  nextXp: number;
  prevXp: number;
  color: string;
  desc: string;
}

export const getLevelInfo = (xp: number): LevelInfo => {
  if (xp < 150) {
    return {
      level: 1,
      title: 'Boshlovchi (Novice)',
      badge: '🌟 Boshlovchi',
      prevXp: 0,
      nextXp: 150,
      color: 'from-amber-400 to-amber-600',
      desc: 'Siz sayohatni endi boshladingiz! Dars va o\'yinlardan ball to\'plab yangi darajalarni va yanada qiyin mashqlarni oching!'
    };
  } else if (xp < 350) {
    return {
      level: 2,
      title: 'Bilim Donosi (Diligence)',
      badge: '📚 Bilimdon',
      prevXp: 150,
      nextXp: 350,
      color: 'from-sky-400 to-indigo-600',
      desc: 'Ajoyib! Siz 2-darajaga o\'tdingiz. Yangi mashqlar, "Present Continuous" darslari va sentence builder o\'yini ochildi!'
    };
  } else if (xp < 650) {
    return {
      level: 3,
      title: 'Chaqqon Amaliyotchi (Journeyman)',
      badge: '⚡ Chaqqon',
      prevXp: 350,
      nextXp: 650,
      color: 'from-purple-500 to-indigo-700',
      desc: 'Dahshatli natija! 3-darajada siz darslarni chuqurroq egallab, to\'liq audio she\'rlar talaffuzini ochdingiz!'
    };
  } else if (xp < 1000) {
    return {
      level: 4,
      title: 'Grammatika Ustasi (Expert)',
      badge: '🎓 Usta',
      prevXp: 650,
      nextXp: 1000,
      color: 'from-emerald-400 to-teal-600',
      desc: 'Siz juda yuqori malakaga egasiz! Oxford Discover darajalarining eng qiyinlari va premium mashqlar tayyor.'
    };
  } else {
    return {
      level: 5,
      title: 'Ingliz Tili Afsonasi (Legend)',
      badge: '👑 Afsona',
      prevXp: 1000,
      nextXp: 99999,
      color: 'from-rose-500 to-amber-500',
      desc: 'Siz mutlaq Ingliz tili afsonasisiz! Barcha tenses, o\'yinlar, Oxford sinflari va laboratoriyalar to\'liq ochiq!'
    };
  }
};

interface XpToast {
  id: number;
  amount: number;
  reason: string;
}

export interface DailyQuest {
  id: string; // 'grammar', 'alphabet', 'games', 'lab'
  titleEv: string;
  titleUz: string;
  descUz: string;
  xpBonus: number;
  completed: boolean;
  tabTarget: ActiveTab;
  actionLabel: string;
}

const DEFAULT_QUESTS: DailyQuest[] = [
  { id: 'grammar', titleEv: 'Grammar Champion', titleUz: 'Grammatika & Testlar', descUz: 'Grammatika darsini o\'qing yoki sinf testini yakunlang', xpBonus: 20, completed: false, tabTarget: 'grammar', actionLabel: 'Mavzularga o\'tish 📝' },
  { id: 'alphabet', titleEv: 'Alphabet Explorer', titleUz: 'Audio Alifbo (A-Z)', descUz: 'Harflar yoki misoliy gaplarni ovozli tinglang', xpBonus: 15, completed: false, tabTarget: 'alphabet', actionLabel: 'Tinglashga o\'tish 🔊' },
  { id: 'games', titleEv: 'Tense Warrior', titleUz: 'Qiziqarli O\'yinlar', descUz: 'O\'yinda so\'z yig\'ing yoki duelda jangga kiring', xpBonus: 20, completed: false, tabTarget: 'games', actionLabel: 'O\'yin dahliziga o\'tish 🎮' },
  { id: 'lab', titleEv: 'Eloquence Star', titleUz: 'Talaffuz Laboratoriyasi', descUz: 'She\'r satrini aytib, unga baho oling', xpBonus: 25, completed: false, tabTarget: 'lab', actionLabel: 'Mashg\'ulotga o\'tish 🎙' },
];

const playLevelUpTone = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
    osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.15); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
    osc.frequency.exponentialRampToValueAtTime(1200.00, ctx.currentTime + 0.55); // high chirp
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.9);
  } catch (e) {
    console.log('Audio Context muted', e);
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  // Dashboard indicators stored in client state and synced with localStorage
  const [streak, setStreak] = useState<number>(3); 
  const [xpPoints, setXpPoints] = useState<number>(120);
  const [completedLessons, setCompletedLessons] = useState<number>(1);
  const [xpToasts, setXpToasts] = useState<XpToast[]>([]);
  
  // Daily Quests State initialized with localStorage mapping
  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    try {
      const saved = localStorage.getItem('enguz_quests_status');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_QUESTS;
  });

  // Level-Up celebration state
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [unlockedFeatures, setUnlockedFeatures] = useState<string[]>([]);
  const lastLevelRef = useRef<number>(1);

  // Online active student counter state
  const [onlineCount, setOnlineCount] = useState<number>(Math.floor(Math.random() * 21) + 135); // Initial random between 135 and 155

  useEffect(() => {
    // Attempt load stats from localStorage
    try {
      const savedXp = localStorage.getItem('enguz_xp');
      const savedStreak = localStorage.getItem('enguz_streak');
      const savedLessons = localStorage.getItem('enguz_lessons');

      if (savedXp) {
        const xp = parseInt(savedXp, 10);
        setXpPoints(xp);
        lastLevelRef.current = getLevelInfo(xp).level;
      } else {
        lastLevelRef.current = getLevelInfo(120).level;
      }
      if (savedStreak) setStreak(parseInt(savedStreak, 10));
      if (savedLessons) setCompletedLessons(parseInt(savedLessons, 15));
    } catch (e) {
      console.warn('LocalStorage is blocked or disabled', e);
    }

    // Interactive daily reset checker
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedDate = localStorage.getItem('enguz_quests_date');
      if (savedDate !== today) {
        localStorage.setItem('enguz_quests_date', today);
        localStorage.setItem('enguz_quests_status', JSON.stringify(DEFAULT_QUESTS));
        setQuests(DEFAULT_QUESTS);
      }
    } catch (e) {}

    // Set up window listener for cross-component triggers
    const handleStorageUpdate = () => {
      try {
        const currentXp = parseInt(localStorage.getItem('enguz_xp') || '120', 10);
        if (currentXp !== xpPoints) {
          setXpPoints(currentXp);
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  // Fluctuating student online counter
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
        const nextVal = prev + change;
        return nextVal >= 120 && nextVal <= 170 ? nextVal : prev;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const checkQuestCompletion = (reason: string) => {
    let targetQuestId: string | null = null;
    const lower = reason.toLowerCase();
    
    if (lower.includes('oxford') || lower.includes('grammatika') || lower.includes('test') || lower.includes('srs')) {
      targetQuestId = 'grammar';
    } else if (lower.includes('alifbo') || lower.includes('tinglovchi') || lower.includes('harf') || lower.includes('alphabet')) {
      targetQuestId = 'alphabet';
    } else if (lower.includes('so\'z') || lower.includes('gap tuzish') || lower.includes('tense duel') || lower.includes('o\'yin') || lower.includes('nishon') || lower.includes('games')) {
      targetQuestId = 'games';
    } else if (lower.includes('talaffuz') || lower.includes('she\'r') || lower.includes('phrase') || lower.includes('speaking')) {
      targetQuestId = 'lab';
    }
    
    if (targetQuestId) {
      setQuests(prev => {
        const quest = prev.find(q => q.id === targetQuestId);
        if (quest && !quest.completed) {
          const updated = prev.map(q => q.id === targetQuestId ? { ...q, completed: true } : q);
          try {
            localStorage.setItem('enguz_quests_status', JSON.stringify(updated));
          } catch (e) {}
          
          addXP(quest.xpBonus, `Kundalik reja: "${quest.titleUz}" vazifasi bajarildi! 🌟🎁`);
          
          const allDoneNow = updated.every(q => q.completed);
          if (allDoneNow) {
            setTimeout(() => {
              addXP(50, `Bugungi barcha 4 ta topshiriqlarni yakunlaganligingiz uchun Super Combo Bonus! 🏆👑🦁`);
            }, 1200);
          }
          
          return updated;
        }
        return prev;
      });
    }
  };

  const addXP = (amount: number, reason: string) => {
    setXpPoints(prev => {
      const updated = prev + amount;
      
      const oldLvl = getLevelInfo(prev).level;
      const newLvl = getLevelInfo(updated).level;
      
      if (newLvl > oldLvl) {
        // Prepare list of unlocked details
        const features = [];
        if (newLvl === 2) {
          features.push('Present Continuous tesi va mashqlari 📘');
          features.push('Sentence Builder (Gap tuzish o\'yini) 🎮');
          features.push('Oxford Discover sinfiy testlari 3-4 daraja 🎓');
        } else if (newLvl === 3) {
          features.push('Past Simple (O\'tgan zamon) darslari va testlari 📝');
          features.push('Oxford Level 2 to\'liq audio she\'rlar talaffuzi 🎙️');
          features.push('Oxford Discover sinfiy testlari 5-daraja 🎓');
        } else if (newLvl === 4) {
          features.push('Oxford Discover sinfiy testlari 6-daraja 🎓');
          features.push('Har bir xatodan keyingi tajriba orttirish darsliklari ✨');
        } else {
          features.push('Barcha maxfiy mukofotlar va cheksiz XP bonuslari 👑');
        }
        setUnlockedFeatures(features);
        setShowLevelUpModal(true);
        playLevelUpTone();
      }

      // Add floating toast
      const toastId = Math.random();
      setXpToasts(curr => [...curr, { id: toastId, amount, reason }]);
      setTimeout(() => {
        setXpToasts(curr => curr.filter(t => t.id !== toastId));
      }, 3000);

      try {
        localStorage.setItem('enguz_xp', updated.toString());
      } catch (e) {}
      
      return updated;
    });

    // Check quest milestones outside the direct setXpPoints render flow
    const isQuestBonus = reason.includes("Kundalik reja") || reason.includes("Super Combo");
    if (!isQuestBonus) {
      setTimeout(() => {
        checkQuestCompletion(reason);
      }, 50);
    }
  };

  const incrementCompletedLesson = () => {
    setCompletedLessons(prev => {
      const updated = prev + 1;
      try {
        localStorage.setItem('enguz_lessons', updated.toString());
      } catch (e) {}
      return updated;
    });
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    // Grant tiny XP for exploring tabs
    addXP(5, 'Yangi bo\'limni kashf qilganingiz uchun');
  };

  const levelInfo = getLevelInfo(xpPoints);
  const totalNeededForNext = levelInfo.nextXp - levelInfo.prevXp;
  const currentLevelProgress = xpPoints - levelInfo.prevXp;
  const progressPercent = Math.min(100, Math.round((currentLevelProgress / totalNeededForNext) * 100));

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-indigo-505 selection:text-white pb-14">
      
      {/* Decorative Aurora Header Glow */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-100/50 to-transparent pointer-events-none select-none z-0" />

      {/* FLOATING XP TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none">
        <AnimatePresence>
          {xpToasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="bg-indigo-900 border border-indigo-700/60 text-white rounded-2xl px-5 py-3.5 shadow-xl flex items-center space-x-3 pointer-events-auto"
            >
              <div className="bg-amber-405 text-white bg-amber-500 font-black rounded-full w-8 h-8 flex items-center justify-center text-xs shadow-xs animate-bounce">
                +{toast.amount}
              </div>
              <div>
                <span className="text-[10px] text-indigo-300 font-bold block uppercase leading-none tracking-wider">Ball qo'shildi</span>
                <span className="text-xs font-bold font-sans">{toast.reason}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LEVEL-UP CELEBRATION MODAL */}
      <AnimatePresence>
        {showLevelUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md p-8 bg-white border border-indigo-100 rounded-3xl shadow-2xl text-center space-y-6 overflow-hidden"
            >
              {/* Confetti simulation bubbles */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-200/40 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-200/40 rounded-full blur-2xl" />

              <div className="relative space-y-4">
                <span className="inline-flex items-center justify-center p-4 bg-amber-50 text-amber-500 rounded-full animate-pulse">
                  <Trophy className="w-12 h-12 stroke-[2.5]" />
                </span>
                
                <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                  YANGI DARAJA! 🎉
                </h2>
                
                <p className="text-xs font-extrabold text-amber-600 uppercase tracking-widest leading-none">
                  Tabriklaymiz, siz yangi bosqichga ko'tarildingiz!
                </p>
              </div>

              {/* Display level Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 rounded-2xl border border-indigo-400/50 shadow-md">
                <span className="text-4xl block mb-1">🏅</span>
                <h3 className="text-xl font-black tracking-tight">{levelInfo.title}</h3>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold inline-block mt-2">
                  DARAJA: {levelInfo.level}
                </span>
              </div>

              {/* Lock unlocks detail list */}
              <div className="text-left space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Yangi ochilgan challenge va imkoniyatlar:</h4>
                <div className="space-y-2.5">
                  {unlockedFeatures.map((feat, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <Unlock className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                  {unlockedFeatures.length === 0 && (
                    <div className="text-xs text-slate-500 italic">Prezident sinfi darslari va qo'shimcha bonus mashg'ulotlar!</div>
                  )}
                </div>
              </div>

              <button
                id="close-level-up-modal"
                onClick={() => setShowLevelUpModal(false)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 transition-all text-white font-extrabold text-sm py-4 rounded-2xl shadow-md cursor-pointer uppercase tracking-wider"
              >
                O'rganishni davom ettirish 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10 space-y-6">
        
        {/* APP BRANDING & STATS BOARD */}
        <header className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-xs border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-4">
            <span className="flex items-center justify-center p-3.5 bg-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-200">
              <GraduationCap className="w-8 h-8" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 font-display">
                  Ingliz Tili Akademiyasi
                </h1>
                <span className={`inline-block bg-gradient-to-r ${levelInfo.color} text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs`}>
                  {levelInfo.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Gamifikatsiya darslari, audio alifbo va darajali ingliz tili tizimi
              </p>
              
              {/* Online pulse tracker badge */}
              <div className="flex items-center space-x-2 mt-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100/60 px-2.5 py-1 rounded-full w-fit">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-extrabold tracking-wide font-sans">
                  Onlayn: {onlineCount} o'quvchi ⚡
                </span>
              </div>
            </div>
          </div>

          {/* Gamified Level Progress Board */}
          <div className="flex-1 max-w-md w-full md:px-6 flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-500 flex items-center space-x-1">
                <span>Daraja {levelInfo.level}:</span>
                <span className="font-black text-indigo-700">{levelInfo.title}</span>
              </span>
              <span className="font-bold text-slate-400 font-mono">
                {xpPoints} / {levelInfo.nextXp} XP
              </span>
            </div>
            {/* Visual Level progress tracker */}
            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 p-0.5">
              <motion.div
                className={`absolute top-0.5 left-0.5 bottom-0.5 rounded-full bg-gradient-to-r ${levelInfo.color}`}
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-none">
              Keyingi darajagacha yana <span className="text-indigo-600 font-bold">{levelInfo.nextXp - xpPoints} XP</span> points to'plashingiz kerak.
            </p>
          </div>

          {/* Gamified Progress Side Dashboard */}
          <div className="flex items-center space-x-3 self-stretch md:self-auto justify-between border-t md:border-t-0 border-slate-105 pt-4 md:pt-0 shrink-0">
            
            {/* XP Points */}
            <div className="flex items-center space-x-2 bg-amber-50 border border-amber-100 px-3.5 py-2 rounded-2xl">
              <span className="text-xl">🏆</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 tracking-wider block leading-none">Jami Ball</span>
                <span className="text-sm font-extrabold text-amber-800 font-mono">{xpPoints} XP</span>
              </div>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center space-x-2 bg-rose-50 border border-rose-100 px-3.5 py-2 rounded-2xl">
              <Flame className="w-5 h-5 text-rose-500 fill-current animate-pulse" />
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider block leading-none">Streak</span>
                <span className="text-sm font-extrabold text-rose-800">{streak} Kun</span>
              </div>
            </div>

            {/* Lesson Passed count */}
            <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3.5 py-2 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block leading-none">O'zlashtirildi</span>
                <span className="text-sm font-extrabold text-indigo-800">{completedLessons} Mavzu</span>
              </div>
            </div>

          </div>
        </header>

        {/* DAILY QUESTS & STUDY MASTER - Contemporary Bento Panel */}
        <section id="daily-goals-dashboard" className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden border border-slate-800">
          {/* Subtle atmospheric light effect */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 pb-4 border-b border-indigo-900/35 relative z-10">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-6 h-6 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold ring-1 ring-indigo-400/20 shadow-xs">
                  🎯
                </span>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-indigo-200 font-display">
                  Kunlik o'quv rejangiz & topshiriqlar (Daily Quests)
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">
                Har kuni darslarni va o'yinlarni bajarib, qo'shimcha rag'batlantiruvchi XP ballarini yutib oling!
              </p>
            </div>
            
            {/* Quest Completion Ratio Progress bar */}
            <div className="flex items-center space-x-3 bg-white/5 border border-white/15 px-4 py-2 rounded-2xl shrink-0 self-stretch md:self-auto justify-between md:justify-start">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                Bajarildi: {quests.filter(q => q.completed).length}/4
              </span>
              <div className="w-16 h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800 shrink-0">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${(quests.filter(q => q.completed).length / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quest Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {quests.map(quest => {
              const isDone = quest.completed;
              return (
                <div 
                  key={quest.id}
                  className={`flex flex-col justify-between p-4 rounded-3xl border transition-all duration-200 ${
                    isDone 
                      ? 'bg-emerald-950/15 border-emerald-500/25 text-emerald-100 shadow-inner' 
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-800 text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {quest.titleEv}
                      </span>
                      <span className="text-[10px] font-black text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/10">
                        +{quest.xpBonus} XP 🏅
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="text-[13px] font-extrabold tracking-tight flex items-center gap-2">
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0 mt-0.5" />
                        )}
                        <span>{quest.titleUz}</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-normal">
                        {quest.descUz}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-slate-850 pt-3">
                    {isDone ? (
                      <div className="text-[10px] text-emerald-405 text-emerald-400 font-black text-center py-1.5 bg-emerald-500/10 rounded-xl cursor-default uppercase tracking-wider">
                        Bajarildi ✅
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTabChange(quest.tabTarget)}
                        className="w-full text-center py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-97 border border-indigo-500/20 hover:border-indigo-600 transition-all font-black text-[10px] tracking-wider rounded-xl uppercase text-indigo-50 cursor-pointer"
                      >
                        {quest.actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grand Complete Celebration Banner (when all are done) */}
          {quests.every(q => q.completed) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-4 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-2xl border border-emerald-500/25 flex items-center gap-4"
            >
              <div className="text-3xl animate-bounce select-none">🏆</div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-emerald-300">Tabriklaymiz! Kunlik rejani 100% bajardingiz!</h4>
                <p className="text-[10px] text-emerald-200/85 font-medium mt-0.5 leading-normal">Siz bugun barcha 4 ta yo'nalish bo'yicha mukammal mashg'ulot qildingiz va qo'shimcha +50 XP Combo Bonus ballini yutib oldingiz. Tezlikni pasaytirmang! ✨🐯</p>
              </div>
            </motion.div>
          )}
        </section>

        {/* NAVIGATION TABS BAR (Clean & Premium pill-style layout) */}
        <div className="flex overflow-x-auto pb-1.5 scrollbar-none">
          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 w-full sm:w-auto space-x-1.5 min-w-[720px] sm:min-w-0">
            
            <button
              id="tab-user-dashboard"
              onClick={() => handleTabChange('dashboard')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/20'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>📊 Progress Dashboard</span>
            </button>

            <button
              id="tab-grammar-lessons"
              onClick={() => handleTabChange('grammar')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'grammar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/20'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📘 Grammatika va Testlar</span>
            </button>

            <button
              id="tab-audio-alphabet"
              onClick={() => handleTabChange('alphabet')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'alphabet'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/20'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>🔤 Audio Alifbo (A-Z)</span>
            </button>

            <button
              id="tab-educational-games"
              onClick={() => handleTabChange('games')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'games'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/20'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>🎮 Qiziqarli O'yinlar</span>
            </button>

            <button
              id="tab-pronunciation-lab"
              onClick={() => handleTabChange('lab')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'lab'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/20'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>🎙️ Talaffuz Laboratoriyasi</span>
            </button>

          </div>
        </div>

        {/* WORKSPACE PREVIEW FRAME */}
        <main className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.22 }}
              >
                <ProgressDashboard 
                  xpPoints={xpPoints} 
                  streak={streak} 
                  completedLessonsCount={completedLessons} 
                  onNavigateTab={(tab) => handleTabChange(tab)}
                  addXP={addXP}
                />
              </motion.div>
            )}

            {activeTab === 'grammar' && (
              <motion.div
                key="grammar-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.22 }}
              >
                <GrammarQuizzes xpPoints={xpPoints} addXP={addXP} levelInfo={levelInfo} incrementCompletedLesson={incrementCompletedLesson} />
              </motion.div>
            )}

            {activeTab === 'alphabet' && (
              <motion.div
                key="alphabet-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.22 }}
              >
                <AudioAlphabet addXP={addXP} levelInfo={levelInfo} />
              </motion.div>
            )}

            {activeTab === 'games' && (
              <motion.div
                key="games-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.22 }}
              >
                <EducationalGames addXP={addXP} levelInfo={levelInfo} />
              </motion.div>
            )}

            {activeTab === 'lab' && (
              <motion.div
                key="lab-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.22 }}
              >
                <PronunciationLab addXP={addXP} levelInfo={levelInfo} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* GOOGLE AI STUDIO AGENT TRIVIA & RIDDLES PANEL */}
        <AIAgentTrivia addXP={addXP} onlineCount={onlineCount} />

        {/* SUBTLE EDUCATIONAL MOTIVATOR FOOTER */}
        <footer className="pt-6 border-t border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium select-none">
          <p>© 2026 Ingliz Tili Grammatika va Alifbo Akademiyasi. Barchasi darajali o'yin elementlariga ulangan.</p>
          <div className="flex space-x-1 items-center">
            <span>Sog'lom va quvnoq darslar bilan o'rganing!</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-100" />
          </div>
        </footer>

      </div>
    </div>
  );
}

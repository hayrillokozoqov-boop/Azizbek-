/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  RotateCcw, 
  Volume2, 
  Award, 
  ArrowRight, 
  ArrowLeft, 
  Lightbulb, 
  Trophy, 
  HelpCircle, 
  Lock, 
  Zap, 
  Star, 
  Shield, 
  Flame, 
  Compass, 
  BadgeCheck, 
  Heart, 
  Sparkles,
  Check,
  X
} from 'lucide-react';

// Word Builder Levels focusing on Action Verbs of Present tenses divided into Junior, Senior, and Master tiers
const wordGameTiers = {
  junior: [
    { id: 1, correct: 'PLAY', clueUz: 'O\'ynamoq (Futbol, o\'yin...)', category: 'Harakat' },
    { id: 2, correct: 'GO', clueUz: 'Bormoq (Maktabga, uyga...)', category: 'Harakat' },
    { id: 3, correct: 'LIKE', clueUz: 'Yoqtirmoq / Ma\'qullamoq', category: 'Hissiyot' },
    { id: 4, correct: 'READ', clueUz: 'O\'qimoq (Kitob, gazeta...)', category: 'O\'rganish' },
    { id: 5, correct: 'TAKE', clueUz: 'Olmoq / Qabul qilmoq', category: 'Amal' },
    { id: 6, correct: 'WORK', clueUz: 'Ishlamoq (Ishxonada yoki kompyuterda)', category: 'Amal' }
  ],
  senior: [
    { id: 1, correct: 'LEARN', clueUz: 'O\'rganmoq (Odatda darslarda...)', category: 'Faoliyat' },
    { id: 2, correct: 'SPEAK', clueUz: 'Gapirmoq (Tilda ravon...)', category: 'Muloqot' },
    { id: 3, correct: 'STUDY', clueUz: 'O\'qimoq / Tahsil olmoq', category: 'Ta\'lim' },
    { id: 4, correct: 'WATCH', clueUz: 'Tomosha qilmoq (Televizor...)', category: 'Hordiq' },
    { id: 5, correct: 'WRITE', clueUz: 'Yozmoq (Mashq yoki xat...)', category: 'Ijod' },
    { id: 6, correct: 'TRAVEL', clueUz: 'Sayohat qilmoq (Chet ellarga...)', category: 'Hordiq' }
  ],
  master: [
    { id: 1, correct: 'PRACTICE', clueUz: 'Mashq qilmoq / Amaliyot', category: 'O\'quv' },
    { id: 2, correct: 'CONTINUOUS', clueUz: 'Hozirgi davomli zamon inglizcha nomi', category: 'Atama' },
    { id: 3, correct: 'EXPERIMENT', clueUz: 'Tajriba o\'tkazmoq / Sinovdan o\'tkazmoq', category: 'Ilmiy' },
    { id: 4, correct: 'DIFFERENCE', clueUz: 'Farq / Ikki narsa orasidagi tafovut', category: 'Tafovut' },
    { id: 5, correct: 'EXPLANATION', clueUz: 'Tushuntirish / Darsning batafsil izohi', category: 'Grammatika' },
    { id: 6, correct: 'TEMPORARY', clueUz: 'Vaqtinchalik (Doimiy bo\'lmagan holat)', category: 'Atama' }
  ]
};

// Sentence Builder Levels focusing STRICTLY on Present Simple & Present Continuous tenses under Junior, Senior, and Master tiers
const sentenceGameTiers = {
  junior: [
    { id: 1, correct: 'She plays tennis.', translationUz: 'U tennis o\'ynaydi.', tense: 'Present Simple' },
    { id: 2, correct: 'We drink hot tea.', translationUz: 'Biz issiq choy ichamiz.', tense: 'Present Simple' },
    { id: 3, correct: 'I love learning languages.', translationUz: 'Men tillarni o\'rganishni yaxshi ko\'raman.', tense: 'Present Simple' },
    { id: 4, correct: 'Cats like fresh milk.', translationUz: 'Mushuklar yangi sutni yoqtirishadi.', tense: 'Present Simple' },
    { id: 5, correct: 'The sun shines today.', translationUz: 'Bugun quyosh porlayapti.', tense: 'Present Simple' }
  ],
  senior: [
    { id: 1, correct: 'They are learning English right now.', translationUz: 'Ular ayni damda ingliz tilini o\'rganishyapti.', tense: 'Present Continuous' },
    { id: 2, correct: 'We always drink warm tea in the morning.', translationUz: 'Biz har doim ertalab issiq choy ichamiz.', tense: 'Present Simple' },
    { id: 3, correct: 'I am eating a sweet red apple now.', translationUz: 'Men hozir shirin qizil olma yeyapman.', tense: 'Present Continuous' },
    { id: 4, correct: 'Look, the small bird is singing beautifully.', translationUz: 'Qara, kichkina qushcha chiroyli sayrayapti.', tense: 'Present Continuous' },
    { id: 5, correct: 'He works as a professional doctor today.', translationUz: 'Bugun u professional shifokor bo\'lib ishlaydi.', tense: 'Present Continuous' }
  ],
  master: [
    { id: 1, correct: 'He is always talking loudly in the quiet library.', translationUz: 'U jim-jit kutubxonada doimo baland ovozda gapirib yuradi (g\'ashni keltirib).', tense: 'Present Continuous' },
    { id: 2, correct: 'The international flight departs to London at nine tomorrow.', translationUz: 'Xalqaro reys ertaga to\'qqizda London tomonga jo\'naydi (jadval).', tense: 'Present Simple' },
    { id: 3, correct: 'This fresh strawberry ice cream tastes exceptionally sweet and delicious.', translationUz: 'Bu yangi qulupnayli muzqaymoq favqulodda shirin va mazali ta\'m beryapti (holat).', tense: 'Present Simple' },
    { id: 4, correct: 'I am seriously thinking of purchasing a new sports bicycle.', translationUz: 'Men yangi sport velosipedini sotib olish haqida jiddiy o\'ylayapman (faol o\'ylash).', tense: 'Present Continuous' },
    { id: 5, correct: 'Water boils at one hundred degrees Celsius under normal pressure.', translationUz: 'Suv odatdagi bosim ostida yuz daraja selsiyda qaynaydi (umumiy haqiqat).', tense: 'Present Simple' }
  ]
};

// Tense Duel (Present Simple vs Continuous) - Direct conceptual practice sorted by difficulty tiers
const duelQuestionsTiers = {
  junior: [
    {
      id: 1,
      sentenceWithBlank: "Every day, my father ________ (drink) black coffee.",
      correctAnswer: "drinks",
      options: ["drinks", "is drinking"],
      tense: "Present Simple",
      explanationUz: "\"Every day\" (har kuni) odatiy va takrorlanuvchi harakatni bildiradi, shuning uchun Present Simple (drinks) tanlanadi.",
      clueUz: "Har kuni dadam qora qahva ichadi."
    },
    {
      id: 2,
      sentenceWithBlank: "We ________ (know) the correct answer to your question.",
      correctAnswer: "know",
      options: ["know", "knows"],
      tense: "Present Simple",
      explanationUz: "\"We\" (biz) ko'plik olmoshi bo'lgani uchun va aqliy holat fe'li bo'lganligi sababli 'know' variantini tanlaymiz.",
      clueUz: "Biz sizning savolingizga to'g'ri javobni bilamiz."
    },
    {
      id: 3,
      sentenceWithBlank: "She ________ (speak) English very well.",
      correctAnswer: "speaks",
      options: ["speak", "speaks"],
      tense: "Present Simple",
      explanationUz: "Uchinchi shaxs birlik (He/She/It) uchinchi shaxs uchun fe'lga '-s' qo'shimchasi qo'shiladi.",
      clueUz: "U ingliz tilida juda yaxshi gapiradi."
    },
    {
      id: 4,
      sentenceWithBlank: "They ________ (watch) television in the evening.",
      correctAnswer: "watch",
      options: ["watch", "watches"],
      tense: "Present Simple",
      explanationUz: "Ko'plikdagi uchinchi shaxs (They) uchun fe'l o'zining asosiy shaklida qoladi.",
      clueUz: "Ular kechqurun televizor tomosha qilishadi."
    },
    {
      id: 5,
      sentenceWithBlank: "The train ________ (arrive) on time every single day.",
      correctAnswer: "arrives",
      options: ["arrives", "arrive"],
      tense: "Present Simple",
      explanationUz: "Kundalik doimiy qatnov (The train = it) bo'lganligi sababli uchinchi shaxs birlikda -s qabul qiladi.",
      clueUz: "Poyezd har kuni o'z vaqtida yetib keladi."
    }
  ],
  senior: [
    {
      id: 1,
      sentenceWithBlank: "Look! The tiny bird ________ (fly) over our house.",
      correctAnswer: "is flying",
      options: ["flies", "is flying"],
      tense: "Present Continuous",
      explanationUz: "\"Look!\" (Qara!) so'zi ayni soniyada sodir bo'layotgan aniq ko'z oldimizdagi harakatga ishora qiladi, shuning uchun Present Continuous tanlanadi.",
      clueUz: "Qara! Kichkina qushcha uyimiz tepasidan uchib o'tyapti."
    },
    {
      id: 2,
      sentenceWithBlank: "They usually ________ (play) football on Saturday afternoons.",
      correctAnswer: "play",
      options: ["play", "are playing"],
      tense: "Present Simple",
      explanationUz: "\"Usually\" (odatda) takroriylikni ko'rsatadi, demak, Present Simple oddiy fe'l shakli (play) mos.",
      clueUz: "Ular odatda va muntazam ravishda shanba kunlari futbol o'ynashadi."
    },
    {
      id: 3,
      sentenceWithBlank: "My uncle ________ (repair) his bicycle in the garage right now.",
      correctAnswer: "is repairing",
      options: ["repairs", "is repairing"],
      tense: "Present Continuous",
      explanationUz: "\"Right now\" (aynan hozir) vaqtinchalik davom etayotgan harakatni ifodalaydi.",
      clueUz: "Aynan hozir amakim garajda o'z velosipedini tuzatyapti."
    },
    {
      id: 4,
      sentenceWithBlank: "Listen! The telephone ________ (ring) in the living room.",
      correctAnswer: "is ringing",
      options: ["rings", "is ringing"],
      tense: "Present Continuous",
      explanationUz: "\"Listen!\" (Eshiting!) undovi quloq solishga majbur qilib, aynan hozirgi lahzadagi davomiy harakatga ishora qilmoqda.",
      clueUz: "Quloq soling! Mehmonxonada telefon jiringlayapti."
    },
    {
      id: 5,
      sentenceWithBlank: "Shh! Our teacher ________ (record) an important video lesson now.",
      correctAnswer: "is recording",
      options: ["records", "is recording"],
      tense: "Present Continuous",
      explanationUz: "\"Shh!\" undovi va \"now\" (hozir) ayni damda davom qilayotgan harakatni ifodalaydi.",
      clueUz: "Shsh! Hozir o'qituvchimiz muhim video darslik yozib olyaptilar."
    }
  ],
  master: [
    {
      id: 1,
      sentenceWithBlank: "Be quiet! I ________ (think) of a solution to this difficult math problem.",
      correctAnswer: "am thinking",
      options: ["think", "am thinking"],
      tense: "Present Continuous",
      explanationUz: "Faol o'ylash va miya faoliyati jarayoni ketayotganda (action of thinking), 'think' fe'li Continuous darsligida kelishi to'liq to'g'ri.",
      clueUz: "Tinchlaning! Men hozir qiyin masala yechimi ustida o'ylayapman."
    },
    {
      id: 2,
      sentenceWithBlank: "This milk ________ (taste) sour. Don't drink it.",
      correctAnswer: "tastes",
      options: ["tastes", "is tasting"],
      tense: "Present Simple",
      explanationUz: "\"Taste\" (ta'm berish/ta'mga ega bo'lish) uchinchi shaxsda holat fe'li bo'lganligi sababli davomli zamonda qo'llanila olmaydi.",
      clueUz: "Bu sut achchiq ta'm beryapti (achigan). Ichma."
    },
    {
      id: 3,
      sentenceWithBlank: "Stop shouting! You ________ (always make) silly mistakes in the exam.",
      correctAnswer: "are always making",
      options: ["always make", "are always making"],
      tense: "Present Continuous",
      explanationUz: "Norozilik, qaysarlik yoki asabiylashishni ifodalash uchun 'always' so'zi poeziyada va grammatikada Present Continuous bilan ishlatiladi.",
      clueUz: "Doskani o'chir! Doim imtihonlarda bema'ni xatolar qilaverasan-a."
    },
    {
      id: 4,
      sentenceWithBlank: "Who ________ (this leather bag / belong) to?",
      correctAnswer: "does this leather bag belong",
      options: ["does this leather bag belong", "is this leather bag belonging"],
      tense: "Present Simple",
      explanationUz: "\"Belong\" (tegishli bo'lish) holat fe'li (stative verb) munosabati hisoblanadi, uni aslo continuous zamonda ishlatib bo'lmaydi.",
      clueUz: "Bu charm sumka kimga tegishli?"
    },
    {
      id: 5,
      sentenceWithBlank: "I am sorry, but I ________ (not remember) his phone number.",
      correctAnswer: "don't remember",
      options: ["don't remember", "am not remembering"],
      tense: "Present Simple",
      explanationUz: "\"Remember\" xotira holati fe'li bo'lib, har qanday sharoitda ham davomli shaklda qo'llanilmaydi.",
      clueUz: "Uzr, lekin uning telefon raqamini eslay olmayapman."
    }
  ]
};

// Badge Metadata defining motivational progress states
interface GameBadge {
  id: string;
  nameUz: string;
  descUz: string;
  requirementUz: string;
  unlocked: boolean;
  iconType: 'compass' | 'shield' | 'flame' | 'zap' | 'trophy';
}

interface EducationalGamesProps {
  xpPoints?: number;
  addXP?: (amount: number, reason: string) => void;
  levelInfo?: { level: number };
}

export default function EducationalGames({
  addXP = () => {},
  levelInfo = { level: 1 }
}: EducationalGamesProps) {
  // Navigation states
  const [activeGame, setActiveGame] = useState<'word' | 'sentence' | 'duel' | null>(null);

  // Game Difficulty Selection (Junior, Senior, Master)
  const [gameDifficulty, setGameDifficulty] = useState<'junior' | 'senior' | 'master'>('junior');

  // Dynamic assignment based on selected tier
  const wordGameLevels = wordGameTiers[gameDifficulty];
  const sentenceGameLevels = sentenceGameTiers[gameDifficulty];
  const duelQuestions = duelQuestionsTiers[gameDifficulty];

  // Gamification dashboard variables saved/loaded in localStorage
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('eng_games_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      totalGamesPlayed: 0,
      correctAnswers: 0,
      highestDuelStreak: 0,
      totalGameXp: 0,
      lessonsUnlocked: ['word'] // standard levels unlocked defaults
    };
  });

  const [badges, setBadges] = useState<GameBadge[]>(() => {
    const defaultBadges: GameBadge[] = [
      { id: 'badge-first-win', nameUz: 'Birinchi G\'alaba', descUz: 'Siz ilk bor topshiriqni yakunladingiz.', requirementUz: 'Istalgan bitta o\'yin bosqichini yakunlash', unlocked: false, iconType: 'compass' },
      { id: 'badge-simple-master', nameUz: 'Simple Bilimdoni', descUz: 'Present Simple bo\'yicha o\'yinda yuqori natija.', requirementUz: 'Present Simple savollariga 3 ta to\'g\'ri javob', unlocked: false, iconType: 'shield' },
      { id: 'badge-continuous-pro', nameUz: 'Continuous Tezqor', descUz: 'Present Continuous o\'yinini yakunlaganingiz uchun.', requirementUz: 'Continuous gaplarini to\'liq xatosiz yig\'ish', unlocked: false, iconType: 'flame' },
      { id: 'badge-streak-king', nameUz: 'Zarba Qiroli', descUz: 'Tense duelda kuchli ketma-ketlik.', requirementUz: 'Tense Duel o\'yinida 5 ta to\'g\'ri javoblar seriyasi', unlocked: false, iconType: 'zap' },
      { id: 'badge-tense-master', nameUz: 'Zamonlar Qiroli', descUz: 'Mustahkam xotira va gramatika malakasi.', requirementUz: 'Barcha turlar uchun 100+ o\'yin balli to\'plash', unlocked: false, iconType: 'trophy' }
    ];
    try {
      const saved = localStorage.getItem('eng_games_badges');
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        return defaultBadges.map(b => ({ ...b, unlocked: !!parsed[b.id] }));
      }
    } catch (e) {}
    return defaultBadges;
  });

  // Track state changes to preserve stats
  useEffect(() => {
    try {
      localStorage.setItem('eng_games_stats', JSON.stringify(stats));
    } catch (e) {}
  }, [stats]);

  // Game UI/Sound Effects with AudioNode
  const playSynthesizedTone = (isCorrect: boolean) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (isCorrect) {
        // High upbeat tone sequence
        oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.2); // A5
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.4);
      } else {
        // Flat double buzz tone
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(140, ctx.currentTime);
        oscillator.frequency.setValueAtTime(120, ctx.currentTime + 0.12);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      console.log('Audio disabled in sandbox', e);
    }
  };

  const speakEnglishAudio = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  };

  // Badge trigger utility
  const unlockBadge = (badgeId: string) => {
    setBadges(prev => {
      const updated = prev.map(b => b.id === badgeId ? { ...b, unlocked: true } : b);
      const isAlreadyUnlocked = prev.find(b => b.id === badgeId)?.unlocked;
      
      if (!isAlreadyUnlocked) {
        // Award XP for getting a badge
        addXP(30, `Yangi nishon: "${updated.find(x => x.id === badgeId)?.nameUz}" ochilgani munosabati bilan`);
        // Save back
        try {
          const dict: Record<string, boolean> = {};
          updated.forEach(x => { dict[x.id] = x.unlocked; });
          localStorage.setItem('eng_games_badges', JSON.stringify(dict));
        } catch (e) {}
        
        // Show audio fanfare for unlock
        playSynthesizedTone(true);
      }
      return updated;
    });
  };

  // ------------------------------------
  // GAME 1: WORD BUILDER DEVELOPER STATE
  // ------------------------------------
  const [wordLevelIndex, setWordLevelIndex] = useState(0);
  const [wordScrambled, setWordScrambled] = useState<string[]>([]);
  const [wordBuilt, setWordBuilt] = useState<string[]>([]);
  const [wordCompleted, setWordCompleted] = useState(false);
  const [showWordSuccessMsg, setShowWordSuccessMsg] = useState(false);
  const [wordScore, setWordScore] = useState(0);

  useEffect(() => {
    if (activeGame === 'word' && wordLevelIndex < wordGameLevels.length) {
      const currentWordObj = wordGameLevels[wordLevelIndex];
      const letters = currentWordObj.correct.split('');
      let shuffled = [...letters].sort(() => Math.random() - 0.5);
      while (shuffled.join('') === currentWordObj.correct && letters.length > 2) {
        shuffled = [...letters].sort(() => Math.random() - 0.5);
      }
      setWordScrambled(shuffled);
      setWordBuilt([]);
      setWordCompleted(false);
      setShowWordSuccessMsg(false);
    }
  }, [wordLevelIndex, activeGame]);

  const handleWordLetterClick = (letter: string, idx: number) => {
    if (wordCompleted) return;

    const newBuilt = [...wordBuilt, letter];
    setWordBuilt(newBuilt);

    const newScrambled = [...wordScrambled];
    newScrambled.splice(idx, 1);
    setWordScrambled(newScrambled);

    const targetWord = wordGameLevels[wordLevelIndex].correct;

    if (newBuilt.length === targetWord.length) {
      const finalWord = newBuilt.join('');
      if (finalWord === targetWord) {
        setWordCompleted(true);
        setShowWordSuccessMsg(true);
        setWordScore(prev => prev + 15);
        addXP(15, `So'z Topish: "${targetWord}" so'zini yig'ganingiz uchun`);
        
        // Update global statistic logs
        setStats(prev => ({
          ...prev,
          correctAnswers: prev.correctAnswers + 1,
          totalGameXp: prev.totalGameXp + 15
        }));
        
        // Unlock Novice badge
        unlockBadge('badge-first-win');
        if (wordScore + 15 >= 75) {
          unlockBadge('badge-tense-master');
        }

        playSynthesizedTone(true);
        setTimeout(() => speakEnglishAudio(targetWord), 250);
      } else {
        playSynthesizedTone(false);
        setTimeout(() => {
          // Auto-reset on mistake
          setWordScrambled([...targetWord.split('')].sort(() => Math.random() - 0.5));
          setWordBuilt([]);
        }, 500);
      }
    }
  };

  const handleNextWordLevel = () => {
    if (wordLevelIndex < wordGameLevels.length - 1) {
      setWordLevelIndex(prev => prev + 1);
    } else {
      // Completed all levels!
      setWordCompleted(true);
      setShowWordSuccessMsg(true);
      setStats(prev => ({
        ...prev,
        totalGamesPlayed: prev.totalGamesPlayed + 1
      }));
    }
  };


  // ------------------------------------
  // GAME 2: SENTENCE BUILDER STATE (focused on Present Simple & Present Continuous)
  // ------------------------------------
  const [sentenceLevelIndex, setSentenceLevelIndex] = useState(0);
  const [sentenceScrambled, setSentenceScrambled] = useState<string[]>([]);
  const [sentenceBuilt, setSentenceBuilt] = useState<string[]>([]);
  const [sentenceCompleted, setSentenceCompleted] = useState(false);
  const [showSentenceSuccessMsg, setShowSentenceSuccessMsg] = useState(false);
  const [sentenceScore, setSentenceScore] = useState(0);

  useEffect(() => {
    if (activeGame === 'sentence' && sentenceLevelIndex < sentenceGameLevels.length) {
      const currentSentObj = sentenceGameLevels[sentenceLevelIndex];
      // strip dot, split to words
      const cleanWords = currentSentObj.correct.replace(/[.]/g, '').split(' ');
      let shuffled = [...cleanWords].sort(() => Math.random() - 0.5);
      while (shuffled.join(' ') === cleanWords.join(' ') && cleanWords.length > 2) {
        shuffled = [...cleanWords].sort(() => Math.random() - 0.5);
      }
      setSentenceScrambled(shuffled);
      setSentenceBuilt([]);
      setSentenceCompleted(false);
      setShowSentenceSuccessMsg(false);
    }
  }, [sentenceLevelIndex, activeGame]);

  const handleSentenceWordClick = (word: string, idx: number) => {
    if (sentenceCompleted) return;

    const newBuilt = [...sentenceBuilt, word];
    setSentenceBuilt(newBuilt);

    const newScrambled = [...sentenceScrambled];
    newScrambled.splice(idx, 1);
    setSentenceScrambled(newScrambled);

    const currentSentenceObj = sentenceGameLevels[sentenceLevelIndex];
    const actualTarget = currentSentenceObj.correct.replace(/[.]/g, '');
    const targetWords = actualTarget.split(' ');

    if (newBuilt.length === targetWords.length) {
      const finalSentence = newBuilt.join(' ');
      if (finalSentence === actualTarget) {
        setSentenceCompleted(true);
        setShowSentenceSuccessMsg(true);
        setSentenceScore(prev => prev + 25);
        addXP(25, `Gap Tuzish [${currentSentenceObj.tense}]: To'liq to'g'ri gap shakllantirdingiz`);

        // Stats update
        setStats(prev => ({
          ...prev,
          correctAnswers: prev.correctAnswers + 1,
          totalGameXp: prev.totalGameXp + 25
        }));

        // Badge evaluations based on tense
        unlockBadge('badge-first-win');
        if (currentSentenceObj.tense === 'Present Simple') {
          unlockBadge('badge-simple-master');
        } else if (currentSentenceObj.tense === 'Present Continuous') {
          unlockBadge('badge-continuous-pro');
        }

        if (sentenceScore + 25 >= 100) {
          unlockBadge('badge-tense-master');
        }

        playSynthesizedTone(true);
        setTimeout(() => speakEnglishAudio(currentSentenceObj.correct), 200);
      } else {
        playSynthesizedTone(false);
        setTimeout(() => {
          // reset level on fail
          setSentenceScrambled([...targetWords].sort(() => Math.random() - 0.5));
          setSentenceBuilt([]);
        }, 600);
      }
    }
  };

  const handleNextSentenceLevel = () => {
    if (sentenceLevelIndex < sentenceGameLevels.length - 1) {
      setSentenceLevelIndex(prev => prev + 1);
    } else {
      setSentenceCompleted(true);
      setShowSentenceSuccessMsg(true);
      setStats(prev => ({
        ...prev,
        totalGamesPlayed: prev.totalGamesPlayed + 1
      }));
    }
  };


  // ------------------------------------
  // GAME 3: TENSE DUEL STATE (Present Simple vs Continuous Interactive Battle)
  // ------------------------------------
  const [duelIndex, setDuelIndex] = useState(0);
  const [duelLives, setDuelLives] = useState(3);
  const [duelScore, setDuelScore] = useState(0);
  const [duelStreak, setDuelStreak] = useState(0);
  const [duelFinished, setDuelFinished] = useState(false);
  const [selectedDuelOption, setSelectedDuelOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isOptionCorrect, setIsOptionCorrect] = useState<boolean | null>(null);

  const startTenseDuel = () => {
    setDuelIndex(0);
    setDuelLives(3);
    setDuelScore(0);
    setDuelStreak(0);
    setDuelFinished(false);
    setSelectedDuelOption(null);
    setShowExplanation(false);
    setIsOptionCorrect(null);
    setActiveGame('duel');
  };

  const selectDuelAnswer = (option: string) => {
    if (showExplanation) return; // Prevent double clicking
    
    setSelectedDuelOption(option);
    const question = duelQuestions[duelIndex];
    const checkIsCorrect = option === question.correctAnswer;
    setIsOptionCorrect(checkIsCorrect);
    setShowExplanation(true);
    playSynthesizedTone(checkIsCorrect);

    if (checkIsCorrect) {
      // Calculate dynamic score with streak multipliers!
      const currentMultiplier = duelStreak >= 5 ? 3 : (duelStreak >= 3 ? 2 : 1);
      const pointsEarned = 10 * currentMultiplier;
      setDuelScore(prev => prev + pointsEarned);
      const nextStreak = duelStreak + 1;
      setDuelStreak(nextStreak);
      
      // Update high streak statistic
      if (nextStreak > stats.highestDuelStreak) {
        setStats(prev => ({ ...prev, highestDuelStreak: nextStreak }));
      }

      addXP(pointsEarned, `Tense Duel (+${pointsEarned} XP): ${question.tense} savoliga ${currentMultiplier}x ko'paytiruvchi bilan to'g'ri javob oldingiz`);

      setStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        totalGameXp: prev.totalGameXp + pointsEarned
      }));

      // Unlock badges
      unlockBadge('badge-first-win');
      if (nextStreak >= 5) {
        unlockBadge('badge-streak-king');
      }
      if (question.tense === 'Present Simple') {
        unlockBadge('badge-simple-master');
      }

    } else {
      setDuelStreak(0);
      setDuelLives(prev => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          // Finish game early if lives reach zero
          setTimeout(() => {
            setDuelFinished(true);
            setStats(p => ({ ...p, totalGamesPlayed: p.totalGamesPlayed + 1 }));
          }, 1500);
        }
        return nextLives;
      });
    }

    // Speak English sentence immediately for real physical comprehension
    const spokenSentence = question.sentenceWithBlank.replace("________ (drink)", "drinks")
                                                    .replace("________ (snow)", "is snowing")
                                                    .replace("________ (study)", "am studying")
                                                    .replace("________ (boil)", "boils")
                                                    .replace("________ (sing)", "is singing")
                                                    .replace("________ (play)", "play")
                                                    .replace("________ (sleep)", "is sleeping")
                                                    .replace("________ (speak)", "speaks")
                                                    .replace("________ (cook)", "am cooking")
                                                    .replace("________ (hate)", "hate");
    setTimeout(() => speakEnglishAudio(spokenSentence), 300);
  };

  const handleNextDuel = () => {
    setSelectedDuelOption(null);
    setShowExplanation(false);
    setIsOptionCorrect(null);

    if (duelIndex < duelQuestions.length - 1) {
      setDuelIndex(prev => prev + 1);
    } else {
      setDuelFinished(true);
      setStats(prev => ({
        ...prev,
        totalGamesPlayed: prev.totalGamesPlayed + 1
      }));
      // Grand bonus if finished all 10 questions alive!
      if (duelLives > 0) {
        addXP(50, "Tense Duel: Barcha 10 ta savolni omon qolib muvaffaqiyatli yakunlaganlik uchun bonus");
        unlockBadge('badge-tense-master');
      }
    }
  };

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto px-1 sm:px-4 py-2 font-sans select-none">
      
      {/* Visual Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-100 shadow-3xs">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white rounded-2xl shadow-md shadow-indigo-100">
            <Gamepad2 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              Intellectual O'yinlar <span className="text-[10px] bg-indigo-150 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Present Special</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">Present Simple va Continuous zamonlarini qiziqarli o'yinlar bilan amalda mustahkamlang!</p>
          </div>
        </div>

        <div className="flex items-center bg-amber-50 border border-amber-100/50 rounded-2xl px-4 py-2 text-amber-800 space-x-2.5">
          <Trophy className="w-5 h-5 text-amber-500" />
          <div className="text-left leading-none">
            <div className="text-[9px] text-amber-700 font-extrabold tracking-wider uppercase">Amaliy Ball:</div>
            <div className="text-sm font-black font-mono mt-0.5">{stats.totalGameXp} Ball (XP)</div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* GAME CENTRAL HUB SELECTION */}
        {!activeGame && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* LEFT COLUMN: ACTIVE GAMES LIST */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              {/* Difficulty Level Switcher for Games */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-5 shadow-sm space-y-3 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🎮</span>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-100">O'YINLAR QIYINLIK DARAJASI (GAME DIFFICULTY)</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Siz tanlagan darajaga qarab o'yinlar qiyinlashadi/osonlashadi</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-indigo-500/35 text-indigo-300">
                    FAOL: {gameDifficulty === 'junior' ? 'Junior 👶' : gameDifficulty === 'senior' ? 'Senior ⚡' : 'Master 👑'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 bg-slate-800/50 p-1 w-full rounded-2xl border border-slate-700/60">
                  {([
                    { key: 'junior', label: 'Junior (Oson) 👶', activeCls: 'bg-indigo-600 text-white shadow-sm' },
                    { key: 'senior', label: 'Senior (O\'rta) ⚡', activeCls: 'bg-amber-600 text-white shadow-sm' },
                    { key: 'master', label: 'Master (Qiyin) 👑', activeCls: 'bg-rose-600 text-white shadow-sm' }
                  ] as const).map(({ key, label, activeCls }) => {
                    const isActive = gameDifficulty === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setGameDifficulty(key);
                          // Reset current active states when changing tier to prevent out-of-bounds on next clicks
                          setWordLevelIndex(0);
                          setSentenceLevelIndex(0);
                          setDuelIndex(0);
                        }}
                        className={`py-2 px-1 rounded-xl text-xs font-black transition-all duration-150 cursor-pointer ${
                          isActive 
                            ? activeCls 
                            : 'text-slate-400 hover:text-white hover:bg-slate-750/30'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-xs font-black text-slate-400 tracking-widest uppercase px-1">O'yin Rejimlari:</div>
              
              {/* Game Card 1: Tense Duel */}
              <div 
                className="bg-white rounded-3xl p-5 border border-indigo-100 hover:border-indigo-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-3xs group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-4 bg-gradient-to-tr from-rose-500 to-amber-500 text-white rounded-2xl shadow-sm text-center font-bold relative overflow-hidden flex-shrink-0">
                    <span className="text-2xl">⚔️</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-black text-slate-800 group-hover:text-indigo-650 transition-colors">Tense Duel (Zamonlar Jangi)</h3>
                      <span className="bg-amber-100 text-amber-800 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">Mashhur ⚡</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1 pr-6 leading-relaxed">
                      Present Simple va Present Continuous zamonlarini solishtirish tizimi. Hayotlarni asrab qolgan holda, berilgan vaqt kalitlari bo'yicha to'g'ri fe'l shaklini tanlang.
                    </p>
                    <div className="flex items-center space-x-3 mt-3 text-[10px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1 text-slate-500"><Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> 3ta Hayot</span>
                      <span>•</span>
                      <span className="text-amber-600 font-extrabold flex items-center gap-0.5">🏆 Ketma-ket 2x/3x XP Ko'paytirgich!</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={startTenseDuel}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shrink-0 shadow-xs hover:shadow transition-all w-full sm:w-auto text-center cursor-pointer active:scale-95 flex items-center justify-center space-x-1"
                >
                  <span>Chaqiruv (Start)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Game Card 2: Sentence Builder - Present version */}
              <div 
                className="bg-white rounded-3xl p-5 border border-slate-100 hover:border-indigo-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-3xs group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-4 bg-indigo-50 text-indigo-700 rounded-2xl font-bold flex-shrink-0 text-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-black text-slate-800 group-hover:text-indigo-650 transition-colors">Sentence Builder (Gap Quruvchi)</h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">8-Bosqich</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1 pr-6 leading-relaxed">
                      Parchalangan elementlardan to'g'ri grammatik inglizcha gap yarating. Gaplar to'liq ravishda Present Simple va Present Continuous zamon mustahkamligi uchun tuzilgan.
                    </p>
                    <div className="flex items-center space-x-3 mt-3 text-[10px] text-slate-400 font-bold">
                      <span className="text-indigo-600 font-extrabold">Har bir gap uchun: +25 XP</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSentenceLevelIndex(0);
                    setSentenceScore(0);
                    setActiveGame('sentence');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-5 py-3 rounded-2xl shrink-0 transition-all w-full sm:w-auto text-center cursor-pointer active:scale-95"
                >
                  Tuzishni boshlash
                </button>
              </div>

              {/* Game Card 3: Word Builder - Action Verbs */}
              <div 
                className="bg-white rounded-3xl p-5 border border-slate-100 hover:border-indigo-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-3xs group"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl font-bold flex-shrink-0 text-center">
                    <span className="text-2xl">🔤</span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 group-hover:text-indigo-650 transition-colors">Word Builder (So'z Sirlari)</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 pr-6 leading-relaxed">
                      Zamonlarda ishlatiladigan ko'p takrorlanuvchi inglizcha harakat fe'llarini harflarini yig'ib toping. Tez va oson so'z boyligi oshirish usuli.
                    </p>
                    <div className="flex items-center space-x-3 mt-3 text-[10px] text-slate-400 font-bold">
                      <span className="text-amber-600 font-extrabold">Har bir topilgan so'z: +15 XP</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setWordLevelIndex(0);
                    setWordScore(0);
                    setActiveGame('word');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-5 py-3 rounded-2xl shrink-0 transition-all w-full sm:w-auto text-center cursor-pointer active:scale-95"
                >
                  So'zni yig'ish
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: PROGRESS TRACKING CARD (Badges & Stats) */}
            <div className="lg:col-span-4 space-y-5">
              
              {/* STATS MINI-PANEL */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider">O'yinchi Statistikasi</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">To'liq O'yinlar:</div>
                    <div className="text-base font-black mt-1 font-mono">{stats.totalGamesPlayed} marta</div>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Eng ketma-ket (Streak):</div>
                    <div className="text-base font-black mt-1 text-amber-400 font-mono">⚡ {stats.highestDuelStreak}</div>
                  </div>

                  <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50 col-span-2 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase">To'g'ri Topilganlar:</div>
                      <div className="text-sm font-black mt-0.5 text-emerald-400 font-mono">{stats.correctAnswers} ball</div>
                    </div>
                    <span className="text-xl">🎯</span>
                  </div>
                </div>
              </div>

              {/* UNLOCKED BADGES TRACKER */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-3xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">Mukofot Nishonlari</h4>
                  </div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full">
                    {badges.filter(b => b.unlocked).length} / {badges.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {badges.map(b => {
                    // Decide badge icons dynamically
                    let badgeIcon = <Compass className="w-4 h-4 text-slate-400" />;
                    if (b.iconType === 'shield') badgeIcon = <Shield className="w-4 h-4 text-emerald-500" />;
                    if (b.iconType === 'flame') badgeIcon = <Flame className="w-4 h-4 text-red-500 fill-red-500" />;
                    if (b.iconType === 'zap') badgeIcon = <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />;
                    if (b.iconType === 'trophy') badgeIcon = <Trophy className="w-4 h-4 text-yellow-500 fill-yellow-500" />;

                    return (
                      <div 
                        key={b.id} 
                        className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all ${
                          b.unlocked 
                            ? 'bg-emerald-50/40 border-emerald-100 font-semibold' 
                            : 'bg-slate-50/50 border-slate-100 opacity-60'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl ${b.unlocked ? 'bg-white shadow-2xs' : 'bg-slate-100'}`}>
                          {b.unlocked ? badgeIcon : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5 justify-between">
                            <span className={`text-[11px] font-black leading-none truncate ${b.unlocked ? 'text-indigo-950' : 'text-slate-500'}`}>
                              {b.nameUz}
                            </span>
                            {b.unlocked && <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                          </div>
                          <p className="text-[9px] text-slate-400 leading-none mt-1 truncate">{b.descUz}</p>
                          <p className="text-[8px] text-indigo-805/70 font-medium font-mono leading-none mt-1 truncate">Shart: {b.requirementUz}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* GAME 1 SCREEN: WORD BUILDER */}
        {activeGame === 'word' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100 max-w-2xl mx-auto flex flex-col justify-between"
          >
            <div>
              {/* Navigation and Score Head */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
                <button 
                  onClick={() => setActiveGame(null)}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ortga</span>
                </button>

                <div className="flex items-center space-x-2.5">
                  <div className="flex items-center bg-indigo-50 text-indigo-700 font-extrabold px-3 py-1 rounded-xl text-[10px] space-x-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Hisob: {wordScore} XP</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 font-mono">
                    VERB {wordLevelIndex + 1} / {wordGameLevels.length}
                  </span>
                </div>
              </div>

              {wordLevelIndex < wordGameLevels.length ? (
                <div className="space-y-6">
                  {/* Word Quest display info clue */}
                  <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-150 text-center space-y-1.5">
                    <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      Mavzu fe'l: {wordGameLevels[wordLevelIndex].category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-indigo-950 pt-1">
                      "{wordGameLevels[wordLevelIndex].clueUz}"
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold">Harflarni to'g'ri tartibda bosing:</p>
                  </div>

                  {/* Guess slot frame */}
                  <div className="border-2 border-dashed border-indigo-100 bg-indigo-50/10 rounded-2xl p-4 min-h-[76px] flex flex-wrap gap-2.5 justify-center items-center">
                    {wordBuilt.length === 0 ? (
                      <span className="text-slate-400 text-xs italic font-medium">Bu yerda siz bosgan harflar yoziladi...</span>
                    ) : (
                      wordBuilt.map((char, index) => (
                        <motion.span 
                          key={index}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-11 h-11 flex items-center justify-center bg-indigo-600 text-white font-black rounded-xl text-xl shadow-md shadow-indigo-100"
                        >
                          {char}
                        </motion.span>
                      ))
                    )}
                  </div>

                  {/* Scrambled selection keys */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider text-center">Harflarni Tanlash</span>
                    <div className="flex flex-wrap gap-2.5 justify-center pt-1.5">
                      {wordScrambled.map((char, index) => (
                        <motion.button
                          key={`${char}-${index}`}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => handleWordLetterClick(char, index)}
                          className="w-12 h-12 flex items-center justify-center bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-400 text-slate-800 font-black rounded-xl text-lg shadow-3xs cursor-pointer select-none active:scale-95"
                        >
                          {char}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Reset action keys */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => {
                        const targetWord = wordGameLevels[wordLevelIndex].correct;
                        setWordScrambled([...targetWord.split('')].sort(() => Math.random() - 0.5));
                        setWordBuilt([]);
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-[10px] rounded-lg cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Tozalamoq (Reset)</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Word guess success dialog sheet */}
            <AnimatePresence>
              {showWordSuccessMsg && wordLevelIndex < wordGameLevels.length && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-50 rounded-2xl border border-emerald-100/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mt-6"
                >
                  <div className="flex items-center space-x-3 text-center sm:text-left">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <h5 className="text-emerald-950 font-black text-xs sm:text-sm">Ofarin! To'g'ri topdingiz!</h5>
                      <span className="text-[11px] text-emerald-800 font-semibold font-mono">
                        {wordGameLevels[wordLevelIndex].correct} = {wordGameLevels[wordLevelIndex].clueUz}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => speakEnglishAudio(wordGameLevels[wordLevelIndex].correct)}
                      className="bg-emerald-100 hover:bg-emerald-110 text-emerald-800 p-2 rounded-xl transition-all"
                      title="Audio talaffuzini eshitish"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleNextWordLevel}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl text-center shadow-xs transition-colors"
                    >
                      {wordLevelIndex === wordGameLevels.length - 1 ? "Natijani Ko'rish" : "Keyingi ➜"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Complete final state screen */}
            {wordLevelIndex >= wordGameLevels.length && (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                <span className="text-6xl animate-bounce">🏆</span>
                <h3 className="text-xl font-black text-indigo-950">"Word Builder" Tamomlandi!</h3>
                <p className="text-xs text-slate-500 font-medium max-w-sm">Muvaffaqiyatli ravishda so'zlarni xatosiz to'liq terib chiqdingiz va lug'at boyligingizni yangiladingiz.</p>
                
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-5 py-2.5 rounded-2xl text-xs font-black">
                  Siz to'plagan yakuniy ball: +{wordScore} XP
                </div>

                <div className="flex items-center space-x-2 pt-4 w-full max-w-sm">
                  <button 
                    onClick={() => {
                      setWordLevelIndex(0);
                      setWordScore(0);
                      setWordCompleted(false);
                      setShowWordSuccessMsg(false);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Qayta o'ynash
                  </button>
                  <button 
                    onClick={() => setActiveGame(null)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs"
                  >
                    Asosiy Menyu
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* GAME 2 SCREEN: SENTENCE BUILDER */}
        {activeGame === 'sentence' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100 max-w-2xl mx-auto flex flex-col justify-between"
          >
            <div>
              {/* Header Info controls */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
                <button 
                  onClick={() => setActiveGame(null)}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ortga</span>
                </button>

                <div className="flex items-center space-x-2.5">
                  <div className="flex items-center bg-indigo-50 text-indigo-700 font-extrabold px-3 py-1 rounded-xl text-[10px] space-x-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Hisob: {sentenceScore} XP</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 font-mono">
                    GAP {sentenceLevelIndex + 1} / {sentenceGameLevels.length}
                  </span>
                </div>
              </div>

              {sentenceLevelIndex < sentenceGameLevels.length ? (
                <div className="space-y-6">
                  {/* Hint Card presentation */}
                  <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-150 text-center space-y-1">
                    <div className="inline-block bg-indigo-100 text-indigo-800 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Zamon qoidasi: {sentenceGameLevels[sentenceLevelIndex].tense}
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold pt-2 mb-1">Berilgan uzbekcha tarjimaning to'g'ri inglizchasini tuzing:</p>
                    <h3 className="text-base sm:text-lg font-black text-indigo-950 italic">
                      "{sentenceGameLevels[sentenceLevelIndex].translationUz}"
                    </h3>
                  </div>

                  {/* Assembled sentence slots */}
                  <div className="border-2 border-dashed border-indigo-100 bg-indigo-50/10 rounded-2xl p-4 min-h-[82px] flex flex-wrap gap-2 justify-center items-center">
                    {sentenceBuilt.length === 0 ? (
                      <span className="text-slate-400 text-xs italic font-medium">So'zlarni tartib bilan bosing...</span>
                    ) : (
                      sentenceBuilt.map((word, idx) => (
                        <motion.span 
                          key={idx}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-indigo-600 text-white font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-xs"
                        >
                          {word}
                        </motion.span>
                      ))
                    )}
                  </div>

                  {/* Scrambled buttons list */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider text-center">So'z variantlari</span>
                    <div className="flex flex-wrap gap-2.5 justify-center pt-1.5">
                      {sentenceScrambled.map((word, idx) => (
                        <motion.button
                          key={`${word}-${idx}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSentenceWordClick(word, idx)}
                          className="bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-indigo-400 text-slate-800 font-semibold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-3xs cursor-pointer select-none"
                        >
                          {word}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Restart current level */}
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => {
                        const cleanSent = sentenceGameLevels[sentenceLevelIndex].correct.replace(/[.]/g, '');
                        setSentenceScrambled([...cleanSent.split(' ')].sort(() => Math.random() - 0.5));
                        setSentenceBuilt([]);
                      }}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold text-[10px] rounded-lg cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Gapni qaytadan boshlash</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Sentence complete message */}
            <AnimatePresence>
              {showSentenceSuccessMsg && sentenceLevelIndex < sentenceGameLevels.length && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-50 rounded-2xl border border-emerald-100/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mt-6"
                >
                  <div className="flex items-center space-x-3 text-center sm:text-left">
                    <span className="text-2xl">⚡</span>
                    <div>
                      <h5 className="text-emerald-950 font-black text-xs sm:text-sm">Mukammal gap yasaldi!</h5>
                      <span className="text-[11px] text-emerald-800 leading-normal block italic">
                        "{sentenceGameLevels[sentenceLevelIndex].correct}"
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => speakEnglishAudio(sentenceGameLevels[sentenceLevelIndex].correct)}
                      className="bg-emerald-100 hover:bg-emerald-110 text-emerald-800 p-2 rounded-xl"
                      title="Suhbatdosh ovozida tinglash"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleNextSentenceLevel}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                    >
                      {sentenceLevelIndex === sentenceGameLevels.length - 1 ? "Natijani Ko'rish" : "Keyingi ➜"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Complete sentence games view */}
            {sentenceLevelIndex >= sentenceGameLevels.length && (
              <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                <span className="text-6xl animate-pulse">👑</span>
                <h3 className="text-xl font-black text-indigo-950">"Sentence Builder" yakunlandi!</h3>
                <p className="text-xs text-slate-500 font-medium max-w-sm">Present grammatik strukturasidagi eng muhim 8ta murakkab gaplarni xatosiz barpo qila oldingiz.</p>
                
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 px-5 py-2.5 rounded-2xl text-xs font-black">
                  Ushbu turdagi umumiy hisobingiz: +{sentenceScore} XP
                </div>

                <div className="flex items-center space-x-2 pt-4 w-full max-w-sm">
                  <button 
                    onClick={() => {
                      setSentenceLevelIndex(0);
                      setSentenceScore(0);
                      setSentenceCompleted(false);
                      setShowSentenceSuccessMsg(false);
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Qayta urinish
                  </button>
                  <button 
                    onClick={() => setActiveGame(null)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs"
                  >
                    Asosiy Menyu
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* GAME 3 SCREEN: TENSE DUEL BATTLE */}
        {activeGame === 'duel' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-100 max-w-2xl mx-auto flex flex-col justify-between"
          >
            <div>
              {/* Back out button and health bar panel */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
                <button 
                  onClick={() => setActiveGame(null)}
                  className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Chiqish</span>
                </button>

                {/* Health indicator bar */}
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black text-slate-400">Hayotlar:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3].map(h => (
                      <Heart 
                        key={h}
                        className={`w-5 h-5 transition-all ${
                          duelLives >= h 
                            ? 'text-rose-500 fill-rose-500 scale-100 animate-pulse' 
                            : 'text-slate-200 fill-transparent scale-90'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Score panel */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-indigo-50 text-indigo-700 font-extrabold px-3 py-1 rounded-xl text-[10px] space-x-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Hisob: {duelScore} XP</span>
                  </div>
                </div>
              </div>

              {!duelFinished && duelLives > 0 ? (
                <div className="space-y-6">
                  {/* Duel stats indicator */}
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-150 px-4 py-2 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Zamonlar Jangi — Savol {duelIndex + 1} / {duelQuestions.length}
                    </span>
                    
                    {/* Active streak representation */}
                    {duelStreak > 0 && (
                      <div className="flex items-center space-x-1 text-[10px] font-black bg-orange-100 text-orange-850 px-2 py-0.5 rounded-full border border-orange-200">
                        <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                        <span>KOMB: {duelStreak}x ({duelStreak >= 5 ? '3x Ball' : (duelStreak >= 3 ? '2x' : '1x')})</span>
                      </div>
                    )}
                  </div>

                  {/* Current Active Blank Sentence */}
                  <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 relative overflow-hidden shadow-md text-center">
                    <div className="absolute top-2 right-3 flex items-center space-x-1.5 opacity-50">
                      <HelpCircle className="w-3.5 h-3.5 text-white" />
                      <span className="text-[8px] font-bold tracking-wider uppercase">DUN HARAKAT</span>
                    </div>

                    <h4 className="text-sm font-black text-slate-400 leading-none">Gapni eng to'g'ri fe'l bilan to'ldiring:</h4>
                    <p className="text-base sm:text-xl font-black mt-4 text-emerald-300 font-sans tracking-wide leading-relaxed">
                      {duelQuestions[duelIndex].sentenceWithBlank}
                    </p>
                    <p className="text-xs text-slate-400 italic font-semibold mt-3">Tarjimasi: "{duelQuestions[duelIndex].clueUz}"</p>
                  </div>

                  {/* Multi-answer option plates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {duelQuestions[duelIndex].options.map((option, idx) => {
                      const isSelected = selectedDuelOption === option;
                      let optionBg = "bg-white border-slate-200 hover:border-indigo-400";
                      
                      if (showExplanation) {
                        if (option === duelQuestions[duelIndex].correctAnswer) {
                          optionBg = "bg-emerald-50 border-emerald-500 text-emerald-800 font-extrabold";
                        } else if (isSelected) {
                          optionBg = "bg-rose-50 border-rose-500 text-rose-800 font-extrabold";
                        } else {
                          optionBg = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
                        }
                      }

                      return (
                        <motion.button
                          key={idx}
                          id={`duel-option-${idx}`}
                          whileHover={showExplanation ? {} : { scale: 1.02 }}
                          whileTap={showExplanation ? {} : { scale: 0.98 }}
                          onClick={() => selectDuelAnswer(option)}
                          disabled={showExplanation}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all cursor-pointer text-sm font-bold flex items-center justify-between ${optionBg}`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className="bg-slate-100 text-slate-705 px-2.5 py-1 rounded-lg text-xs leading-none uppercase font-mono">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                          </div>

                          {showExplanation && option === duelQuestions[duelIndex].correctAnswer && (
                            <Check className="w-5 h-5 text-emerald-600" />
                          )}
                          {showExplanation && isSelected && option !== duelQuestions[duelIndex].correctAnswer && (
                            <X className="w-5 h-5 text-rose-600" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Tutorial Explanations and continue btn */}
                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-indigo-50/40 rounded-2xl border border-indigo-100 p-4 space-y-3"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-xl">💡</span>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-black text-indigo-950 uppercase">Qoida Tahlili:</span>
                              <span className="bg-indigo-150 text-indigo-800 text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase leading-none">{duelQuestions[duelIndex].tense}</span>
                            </div>
                            <p className="text-[11px] text-slate-650 leading-relaxed font-semibold mt-1">
                              {duelQuestions[duelIndex].explanationUz}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-indigo-100/55">
                          <button
                            onClick={() => speakEnglishAudio(duelQuestions[duelIndex].sentenceWithBlank.replace("________", duelQuestions[duelIndex].correctAnswer))}
                            className="bg-white hover:bg-slate-100 border border-indigo-150 p-2 rounded-xl text-indigo-800 transition-colors flex items-center space-x-1"
                            title="Butun gapni talaffuz qilish"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold">Ovozli eshitish</span>
                          </button>

                          <button
                            onClick={handleNextDuel}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <span>Davom etish</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}

              {/* Loss / Out-of-lives state screen */}
              {duelLives <= 0 && !duelFinished && (
                <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                  <span className="text-6xl animate-pulse">💔</span>
                  <h3 className="text-xl font-black text-rose-900">Mag'lubiyat! Hayotlar Tugadi</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-sm">Hamma xatolaringiz sizni o'rgatuvchi qoidadir. Yana bir marta sinab ko'ring!</p>
                  
                  <div className="bg-slate-50 border border-slate-205 px-5 py-2.5 rounded-2xl text-xs font-black text-slate-700">
                    Siz qayd etgan yakuniy hisob: {duelScore} ball
                  </div>

                  <div className="flex items-center space-x-2 pt-4 w-full max-w-sm">
                    <button 
                      onClick={startTenseDuel}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-2.5 rounded-xl text-xs"
                    >
                      Qaytadan sinash 🔄
                    </button>
                    <button 
                      onClick={() => setActiveGame(null)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
                    >
                      Asosiy Menyu
                    </button>
                  </div>
                </div>
              )}

              {/* Standard complete finishing screen */}
              {duelFinished && (
                <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                  <span className="text-6xl animate-bounce">🏆</span>
                  <h3 className="text-xl font-black text-indigo-950">Muvaffaqiyatli Tugatildi!</h3>
                  <p className="text-xs text-slate-500 font-medium max-w-sm">Barakalla! Zamonlar jangi o'yinida har bir tsentral grammatik qoidaga muvaffaqiyatli hisobot bordingiz.</p>
                  
                  <div className="bg-emerald-50 border border-emerald-110 text-emerald-800 px-5 py-2.5 rounded-2xl text-xs font-black">
                    Siz topgan ball: +{duelScore} XP 🏆
                  </div>

                  <div className="flex items-center space-x-2 pt-4 w-full max-w-sm">
                    <button 
                      onClick={startTenseDuel}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Yana yangidan boshlash
                    </button>
                    <button 
                      onClick={() => setActiveGame(null)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs"
                    >
                      Asosiy Menyu
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER TIP */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/50 text-[10px] text-slate-500 leading-relaxed font-semibold flex items-center space-x-2 w-fit">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <span>O'yindagi har bir to'g'ri birgalik sizga real tajriba ballarini (XP Points) va muazzam darajali mukofot nishonlarni (Badges) yetkazib beradi!</span>
      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Award, BookOpen, Check, Play, ChevronRight, HelpCircle, ArrowLeft, RotateCcw, GraduationCap, Sparkles, BookOpenCheck, Lock, Unlock, Volume2 } from 'lucide-react';
import { grammarLessons, quizzesData } from '../data/grammarData';
import { oxfordLevels, oxfordDiscoverQuestions } from '../data/oxfordDiscoverData';
import { GrammarLesson, QuizQuestion } from '../types';

interface GrammarQuizzesProps {
  xpPoints?: number;
  addXP?: (amount: number, reason: string) => void;
  levelInfo?: { level: number };
  incrementCompletedLesson?: () => void;
}

export default function GrammarQuizzes({
  xpPoints = 120,
  addXP = () => {},
  levelInfo = { level: 1 },
  incrementCompletedLesson = () => {}
}: GrammarQuizzesProps) {
  // Toggle between 'oxford' and 'standard' modes
  const [quizMode, setQuizMode] = useState<'oxford' | 'standard'>('standard');
  
  // Selection states
  const [selectedLesson, setSelectedLesson] = useState<GrammarLesson>(grammarLessons[0]);
  const [selectedOxfordLevel, setSelectedOxfordLevel] = useState(oxfordLevels[0]);
  
  // General quiz workflow
  const [activeTab, setActiveTab] = useState<'lesson' | 'quiz'>('lesson');
  
  // Real-time selected randomized pool (Exactly 20 questions for Oxford Discover)
  const [currentQuestionsPool, setCurrentQuestionsPool] = useState<QuizQuestion[]>([]);
  
  // Active quiz session states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // questionId -> chosenOption

  // Speech synthesis for active question and options
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [currentQuestionIndex, showResults, activeTab]);

  const speakQuestion = (questionText: string, options: string[]) => {
    if (!window.speechSynthesis) {
      alert("Sizning brauzeringizda ovozli talaffuz qo'llab-quvvatlanmaydi.");
      return;
    }
    window.speechSynthesis.cancel();

    // Prepare human-friendly clean speech script
    const cleanQuestionText = questionText.replace(/_+/g, "blank");
    const optionsClean = options.map((opt, i) => `Option ${i + 1}: ${opt}`).join('. ');

    const speechText = `${cleanQuestionText}. ... Please choose the correct answer: ... ${optionsClean}`;
    const utterance = new SpeechSynthesisUtterance(speechText);

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.rate = 0.88;
    utterance.lang = 'en-US';

    window.speechSynthesis.speak(utterance);
  };

  const isLessonLocked = (lessonId: string) => {
    if (lessonId === 'present-continuous' && levelInfo.level < 2) {
      return { locked: true, requiredLevel: 2, requiredXp: 150 };
    }
    if (lessonId === 'past-simple' && levelInfo.level < 3) {
      return { locked: true, requiredLevel: 3, requiredXp: 350 };
    }
    return { locked: false, requiredLevel: 1, requiredXp: 0 };
  };

  const isOxfordLocked = (levelId: string) => {
    if ((levelId === 'level-3' || levelId === 'level-4') && levelInfo.level < 2) {
      return { locked: true, requiredLevel: 2, requiredXp: 150 };
    }
    if (levelId === 'level-5' && levelInfo.level < 3) {
      return { locked: true, requiredLevel: 3, requiredXp: 350 };
    }
    if (levelId === 'level-6' && levelInfo.level < 4) {
      return { locked: true, requiredLevel: 4, requiredXp: 650 };
    }
    return { locked: false, requiredLevel: 1, requiredXp: 0 };
  };

  const currentLessonLock = isLessonLocked(selectedLesson.id);
  const currentOxfordLock = isOxfordLocked(selectedOxfordLevel.id);
  const isCurrentItemLocked = quizMode === 'oxford' ? currentOxfordLock.locked : currentLessonLock.locked;
  const currentLockDetails = quizMode === 'oxford' ? currentOxfordLock : currentLessonLock;

  const playSoundEffect = (isCorrect: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (isCorrect) {
        // Double cheery beep
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else {
        // Low dull error buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      console.log('Audio Context blocked or unsupported', e);
    }
  };

  const handleStartQuiz = () => {
    if (isCurrentItemLocked) return;
    let pool: QuizQuestion[] = [];
    if (quizMode === 'standard') {
      pool = quizzesData[selectedLesson.id] || [];
    } else {
      // Oxford Discover Mode: Grab all 30 questions and randomly pick 20
      const allQuestions = oxfordDiscoverQuestions[selectedOxfordLevel.id] || [];
      // Fisher-Yates robust shuffle
      const shuffled = [...allQuestions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      // Take exactly 20 so that "savollar 20tadan bo'lsin va har safar yangi tushsin"
      pool = shuffled.slice(0, 20);
    }

    setCurrentQuestionsPool(pool);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
    setUserAnswers({});
    setActiveTab('quiz');
  };

  const handleAnswerSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isSubmitted) return;
    
    const correct = currentQuestionsPool[currentQuestionIndex].correctAnswer === selectedAnswer;
    if (correct) {
      setScore(prev => prev + 1);
    }
    playSoundEffect(correct);
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionsPool[currentQuestionIndex].id]: selectedAnswer
    }));
    
    setIsSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestionsPool.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
      // Give XP bonus to student profile
      try {
        const bonus = quizMode === 'oxford' ? 30 : 15; 
        const desc = quizMode === 'oxford'
          ? `Oxford Discover ${selectedOxfordLevel.name} testidan muvaffaqiyatli o'tganingiz uchun`
          : `"${selectedLesson.title}" grammatika darsi testini tugatganingiz uchun`;
        addXP(bonus, desc);
        incrementCompletedLesson();
      } catch (err) {}
    }
  };

  const getPercentage = () => {
    if (currentQuestionsPool.length === 0) return 0;
    return Math.round((score / currentQuestionsPool.length) * 100);
  };

  const getScoreVerdict = () => {
    const pct = getPercentage();
    if (pct === 100) return { title: 'Ajoyib! Mukammal Natija! 🌟🏆', msg: 'Siz ushbu darsni 100% o\'zlashtirdingiz, super natija!' };
    if (pct >= 80) return { title: 'Ajoyib natija! 👍', msg: 'Juda kam xatolar qildingiz. Oxford qoidalarini yaxshi tushunyapsiz!' };
    if (pct >= 50) return { title: 'Qoniqarli! 📈', msg: 'Yana bir marta takrorlab, xatolaringiz ustida ishlashni tavsiya qilamiz.' };
    return { title: 'Yana harakat qilib ko\'ring! 📚', msg: 'Qayta urinib ko\'ring, ingliz tilini o\'rganishda xatolar - bu dars olish demakdir!' };
  };

  return (
    <div id="grammar-and-quizzes-view" className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      
      {/* LEFT SIDEBAR Column - Mode Toggler & Item List Selector */}
      <div className="xl:col-span-4 flex flex-col space-y-4">
        
        {/* Toggle Panel Button for Oxford vs Standard */}
        <div className="bg-slate-200/70 p-1.5 rounded-2xl flex border border-slate-300/40 shadow-2xs">
          <button
            onClick={() => {
              setQuizMode('oxford');
              setActiveTab('lesson');
            }}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-xl text-xs font-extrabold transition-all duration-150 ${
              quizMode === 'oxford'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>Oxford Discover (1-6)</span>
          </button>
          <button
            onClick={() => {
              setQuizMode('standard');
              setActiveTab('lesson');
            }}
            className={`flex-1 flex items-center justify-center space-x-1.5 py-3 rounded-xl text-xs font-extrabold transition-all duration-150 ${
              quizMode === 'standard'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-transparent'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Milliy Grammatika</span>
          </button>
        </div>

        {/* Dynamic Items Listing per active sidebar mode */}
        <div className="flex flex-col space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
              {quizMode === 'oxford' ? 'Level / Sinf Tanlash' : 'Grammatika Darslari'}
            </h4>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-200/50 px-2 py-0.5 rounded-full font-mono">
              {quizMode === 'oxford' ? '6 ta Sinf' : '3 ta Mavzu'}
            </span>
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-2.5">
            {quizMode === 'oxford' ? (
              // Oxford Discover Levels List
              oxfordLevels.map((level) => {
                const isSelected = selectedOxfordLevel.id === level.id;
                const lockState = isOxfordLocked(level.id);
                return (
                  <button
                    key={level.id}
                    id={`oxford-selector-${level.id}`}
                    onClick={() => {
                      setSelectedOxfordLevel(level);
                      setActiveTab('lesson');
                    }}
                    className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 shadow-md text-white'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300 text-slate-700'
                    } ${lockState.locked ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-2 w-full justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`p-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-amber-100 text-amber-800'
                        }`}>
                          G{level.id.slice(-1)}
                        </span>
                        <span className="font-extrabold text-sm tracking-tight flex items-center gap-1">
                          {level.name}
                          {lockState.locked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-indigo-500/50 text-indigo-100' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {lockState.locked ? `Lvl ${lockState.requiredLevel} 🔒` : level.gradeUz}
                      </span>
                    </div>
                    <p className={`text-xs font-medium leading-relaxed mt-2.5 italic ${
                      isSelected ? 'text-indigo-100' : 'text-slate-500'
                    }`}>
                      Big Question: {level.bigQuestionUz}
                    </p>
                  </button>
                );
              })
            ) : (
              // Standard Grammar Lessons List
              grammarLessons.map((lesson) => {
                const isSelected = selectedLesson.id === lesson.id;
                const lockState = isLessonLocked(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    id={`lesson-selector-btn-${lesson.id}`}
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setActiveTab('lesson');
                    }}
                    className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 shadow-md text-white'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                    } ${lockState.locked ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center space-x-2 w-full justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`p-1.5 rounded-lg text-xs font-bold ${
                          isSelected ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {lesson.title === 'Present Simple' ? 'PS' : lesson.title === 'Past Simple' ? 'PAS' : 'PC'}
                        </span>
                        <span className="font-extrabold text-sm tracking-tight flex items-center gap-1">
                          {lesson.title}
                          {lockState.locked && <Lock className="w-3.5 h-3.5 text-slate-400 animate-pulse" />}
                        </span>
                      </div>
                      {lockState.locked && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          Lvl {lockState.requiredLevel} 🔒
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] font-medium leading-normal mt-2.5 ${
                      isSelected ? 'text-indigo-100' : 'text-slate-500'
                    }`}>
                      {lesson.titleUz}
                    </p>
                  </button>
                );
              })
            )}
          </div>         </div>
        </div>
      </div>

      {/* RIGHT COLUMN - Main Syllabus Card or Active Quiz Platform */}
      <div className="xl:col-span-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/70 min-h-[480px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            
            {/* View Tab 1: Syllabus Introduction details */}
            {activeTab === 'lesson' && (
              <motion.div
                key={quizMode === 'oxford' ? `${selectedOxfordLevel.id}-intro` : `${selectedLesson.id}-lesson`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {isCurrentItemLocked ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 py-16 border-2 border-dashed border-slate-200 rounded-3xl space-y-6 bg-slate-50/60 my-4">
                    <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center shadow-inner animate-bounce">
                      <Lock className="w-9 h-9" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-800">Ushbu bo'lim hozircha qulflangan! 🔒</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        Xavotir olmang! Darslarni o'rganib, testlarni muvaffaqiyatli topshirish orqali jami XP ballaringizni oshiring va barcha darslarni bemalol oching.
                      </p>
                    </div>
                    <div className="bg-white px-6 py-5 rounded-2xl border border-slate-200 max-w-xs w-full shadow-3xs space-y-2.5 text-xs text-left">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-400">Kerakli Daraja:</span>
                        <span className="text-indigo-600 font-extrabold text-sm">Level {currentLockDetails.requiredLevel}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-400">Kerakli jami XP:</span>
                        <span className="text-amber-600 font-extrabold text-sm">{currentLockDetails.requiredXp} XP</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-slate-150 pt-2.5">
                        <span className="text-slate-400">Sizning joriy XP:</span>
                        <span className="text-slate-700 font-black text-sm">{xpPoints} XP</span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-indigo-600 bg-white border border-indigo-100 rounded-full px-4 py-2 shadow-2xs">
                      Sizga yana <span className="text-indigo-700 font-black">{currentLockDetails.requiredXp - xpPoints} XP</span> points kerak! ⚡
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Header Information for selected category */}
                    <div className="border-b border-slate-150 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      {quizMode === 'oxford' ? (
                        <div>
                          <div className="flex items-center space-x-2 text-indigo-600 font-extrabold text-xs uppercase tracking-wider mb-1">
                            <BookOpenCheck className="w-4 h-4 text-emerald-500" />
                            <span>Oxford Discover Test Platformasi</span>
                          </div>
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            {selectedOxfordLevel.name}
                          </h2>
                          <span className="inline-block bg-amber-50 text-amber-800 font-bold text-xs px-2.5 py-1 rounded-lg mt-1 border border-amber-100">
                            {selectedOxfordLevel.gradeUz} uchun mo'ljallangan
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
                            <BookOpen className="w-4 h-4" />
                            <span>Boshlang'ich Grammatika darsi</span>
                          </div>
                          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            {selectedLesson.title} <span className="text-slate-400 font-normal">({selectedLesson.titleUz})</span>
                          </h2>
                          <p className="text-sm text-slate-500 mt-1 font-semibold">{selectedLesson.shortDescUz}</p>
                        </div>
                      )}

                      <button
                        id="start-level-quiz-btn"
                        onClick={handleStartQuiz}
                        className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-850 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all self-stretch sm:self-auto justify-center"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>{quizMode === 'oxford' ? '20 talik Testni Boshlash' : 'Testni Boshlash'}</span>
                      </button>
                    </div>

                {/* Oxford Discover "Big Question" or formula section */}
                {quizMode === 'oxford' ? (
                  <div className="bg-gradient-to-tr from-indigo-50 to-amber-50/10 p-5 rounded-2xl border border-indigo-150 relative overflow-hidden">
                    <div className="absolute right-3 top-3 opacity-10">
                      <Sparkles className="w-14 h-14 text-indigo-500" />
                    </div>
                    <span className="text-xs font-extrabold text-indigo-700 uppercase tracking-widest block mb-1">The Big Question (Bosh Savol)</span>
                    <p className="text-lg sm:text-xl font-black text-indigo-950 tracking-tight">
                      "{selectedOxfordLevel.bigQuestionUz}"
                    </p>
                    <div className="mt-3 text-slate-600 text-sm font-semibold">
                      Ushbu sinf testida qat'iy tekshiriladigan grammatika darsliklari:
                      <p className="text-slate-800 font-bold mt-1 bg-white/70 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                        {selectedOxfordLevel.descriptionUz}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-tr from-slate-50 to-indigo-50/10 p-5 rounded-2xl border border-indigo-100 overflow-hidden relative">
                    <div className="absolute -right-2 -bottom-2 opacity-5 select-none pointer-events-none text-9xl font-black text-indigo-900">f=</div>
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest block mb-1">Grammatika formulasi</span>
                    <p className="text-base sm:text-lg font-mono font-bold text-indigo-950 tracking-wider">
                      {selectedLesson.formula}
                    </p>
                  </div>
                )}

                {/* Oxford Specific Disclaimer or standard grammatical lessons */}
                {quizMode === 'oxford' ? (
                  <div className="space-y-4">
                    <div className="border border-amber-200/60 bg-amber-50/30 rounded-2xl p-5 space-y-2">
                      <h4 className="text-indigo-950 font-black text-sm flex items-center">
                        🛑 "Har doim har xil tushsin" Kafolati
                      </h4>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        Oxford Discover bazasidagi har bir daraja uchun maxsus mualliflik savollarimiz mavjud. Siz testni boshlaganingizda algoritmlar umumiy bazadan <strong>tasodifiy 20 ta savolni saralab beradi</strong> va variantlarni ham aralashtiradi. Shunda o'quvchi har safar butunlay yangicha variantlar to'plamiga ega bo'lib, xotirani mukammallashtiradi!
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                      <h4 className="text-slate-700 font-extrabold text-xs uppercase tracking-wider">Imtihon Yo'riqnomasi (Rules):</h4>
                      <ul className="text-xs text-slate-500 font-medium space-y-2 list-disc pl-5 leading-normal">
                        <li>Har bir test 20 ta mukammallashtirilgan mantiqiy grammatika va so'z boyligi savollaridan iborat.</li>
                        <li>Javob topshirilgandan so'ng darhol xatolar talqini va uning o'zbekcha sharhi tushuntirib beriladi.</li>
                        <li>80%+ ball bilan o'tsangiz, o'quvchi xotirasi muvofiqlashtirilgan hisoblanadi.</li>
                        <li>Oxford Discover tests platformasi sizga har bir muvaffaqiyat uchun +30 XP faollik ballarini taqdim etadi.</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Paragraph Rules for Standard Lesson */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Qoidalar va tushunchalar:</h3>
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                        <div className="text-sm text-slate-700 space-y-4 leading-relaxed font-normal whitespace-pre-wrap">
                          {selectedLesson.explanationUz.trim()}
                        </div>
                      </div>
                    </div>

                    {/* Example Sentences */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Namuna gaplar (Examples):</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedLesson.examples.map((ex, i) => (
                          <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs relative">
                            <span className="absolute top-2 right-3 font-mono text-[10px] text-slate-300 font-bold">#0{i+1}</span>
                            <p className="font-semibold text-indigo-600 text-base">{ex.english}</p>
                            <p className="text-sm text-slate-600 mt-1 font-medium">{ex.uzbek}</p>
                            {ex.description && (
                              <span className="inline-block bg-slate-100 text-slate-500 font-medium text-[10px] px-2 py-0.5 rounded-md mt-2">
                                {ex.description}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Bottom Trigger */}
                {!isCurrentItemLocked && (
                  <div className="flex justify-end pt-2 border-t border-slate-150">
                    <button
                      id="trigger-start-lessons-end-btn"
                      onClick={handleStartQuiz}
                      className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-black text-sm transition-colors py-2"
                    >
                      <span>Imtihonni endiroq boshlash</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>)}
            </motion.div>
            )}

            {/* View Tab 2: Graded Quiz Session */}
            {activeTab === 'quiz' && !showResults && currentQuestionsPool.length > 0 && (
              <motion.div
                key="active-quiz-session-arena"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  {/* Progress Header */}
                  <div className="flex items-center justify-between border-b border-slate-150 pb-4 mb-5">
                    <button
                      id="exit-to-lessons-mode-btn"
                      onClick={() => setActiveTab('lesson')}
                      className="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-bold"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Sinf Ma'lumotiga Qaytish</span>
                    </button>

                    <div className="text-xs font-bold text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      Savol {currentQuestionIndex + 1} / {currentQuestionsPool.length}
                    </div>
                  </div>

                  {/* Progress Bar container */}
                  <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6 border border-slate-200">
                    <motion.div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-indigo-600"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((currentQuestionIndex) / currentQuestionsPool.length) * 100}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  {/* Question Content */}
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-slate-400 font-extrabold text-xs uppercase tracking-widest gap-2 px-1">
                      <div className="flex items-center space-x-1.5">
                        <HelpCircle className="w-4 h-4 text-indigo-500" />
                        <span>Gapni to'g'ri to'ldiring:</span>
                      </div>
                      
                      <button
                        onClick={() => speakQuestion(
                          currentQuestionsPool[currentQuestionIndex].question,
                          currentQuestionsPool[currentQuestionIndex].options
                        )}
                        className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 text-indigo-700 font-extrabold text-[10px] rounded-full transition-all shadow-3xs cursor-pointer active:scale-95 normal-case"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Eshitish (Listen) 🔊</span>
                      </button>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug bg-slate-50 p-6 rounded-2xl border border-slate-250 shadow-sm font-sans">
                      {currentQuestionsPool[currentQuestionIndex].question}
                    </h3>

                    {/* Options list inside Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                      {currentQuestionsPool[currentQuestionIndex].options.map((option) => {
                        const isChosenTemp = selectedAnswer === option;
                        const isCorrectAnswer = currentQuestionsPool[currentQuestionIndex].correctAnswer === option;
                        
                        let optionStyle = 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800';
                        
                        if (isSubmitted) {
                          if (isCorrectAnswer) {
                            optionStyle = 'bg-emerald-50/90 border-emerald-500 text-emerald-850 font-black shadow-xs ring-4 ring-emerald-100';
                          } else if (isChosenTemp) {
                            optionStyle = 'bg-rose-50/90 border-rose-500 text-rose-850 font-bold shadow-xs';
                          } else {
                            optionStyle = 'bg-slate-50/50 border-slate-200/40 text-slate-400';
                          }
                        } else if (isChosenTemp) {
                          optionStyle = 'bg-indigo-50 border-indigo-500 text-indigo-950 ring-4 ring-indigo-100 font-black';
                        }

                        return (
                          <button
                            key={option}
                            id={`quiz-option-${option}`}
                            disabled={isSubmitted}
                            onClick={() => handleAnswerSelect(option)}
                            className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all text-sm font-medium ${optionStyle}`}
                          >
                            <span>{option}</span>
                            <div className="flex items-center space-x-1">
                              {isSubmitted && isCorrectAnswer && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                              )}
                              {isSubmitted && isChosenTemp && !isCorrectAnswer && (
                                <XCircle className="w-5 h-5 text-rose-600 fill-rose-50" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clarification Explanation feedback */}
                  <AnimatePresence>
                    {isSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-indigo-50/30 p-5 rounded-2xl border border-indigo-200/50 mt-6 space-y-2 text-indigo-950"
                      >
                        <span className="text-xs font-extrabold text-indigo-700 flex items-center gap-1">
                          📘 Sharp (Explanation / Tushuntirish):
                        </span>
                        <p className="text-xs sm:text-sm leading-relaxed font-semibold">
                          {currentQuestionsPool[currentQuestionIndex].explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit / Next navigation controls */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-150 mt-6">
                  <div className="text-xs font-semibold text-slate-400">
                    Sinf: <span className="text-indigo-600 font-bold">{quizMode === 'oxford' ? selectedOxfordLevel.name : selectedLesson.title}</span>
                  </div>

                  {!isSubmitted ? (
                    <button
                      id="submit-answer-btn"
                      disabled={!selectedAnswer}
                      onClick={handleSubmitAnswer}
                      className={`px-7 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-155 ${
                        selectedAnswer
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-sm active:scale-98'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Javobni Tekshirish
                    </button>
                  ) : (
                    <button
                      id="next-question-btn"
                      onClick={handleNextQuestion}
                      className="flex items-center space-x-1 bg-indigo-650 hover:bg-indigo-750 text-white px-7 py-3 rounded-xl font-extrabold text-xs tracking-wider uppercase shadow-sm transition-all duration-150 active:scale-98"
                    >
                      <span>
                        {currentQuestionIndex === currentQuestionsPool.length - 1 ? 'Natijalarni ko\'rish' : 'Keyingi Savol'}
                      </span>
                      <ChevronRight className="w-4 h-4 text-indigo-100" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* View Tab 3: Detailed results card overlay */}
            {activeTab === 'quiz' && showResults && (
              <motion.div
                key="test-results-board"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-6 space-y-6"
              >
                {/* Score visualization medal */}
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-100 rounded-full blur-2xl scale-125 opacity-70 animate-pulse" />
                  <div className="relative bg-gradient-to-tr from-indigo-500 to-indigo-600 text-white p-6 rounded-full shadow-lg">
                    <Award className="w-14 h-14 text-amber-300" />
                  </div>
                </div>

                {/* Score indicators */}
                <div className="space-y-2">
                  <span className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-100 px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide">
                    {quizMode === 'oxford' ? selectedOxfordLevel.name : selectedLesson.title} Testi Yakunlandi!
                  </span>
                  
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                    {getScoreVerdict().title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium">
                    {getScoreVerdict().msg}
                  </p>
                </div>

                {/* Score card grid */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-205 w-full max-w-sm flex justify-around items-center shadow-2xs">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Savollar</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-800">{currentQuestionsPool.length} ta</span>
                  </div>
                  <div className="w-px h-8 bg-slate-300" />
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">To'g'ri topildi</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-600">{score} ta</span>
                  </div>
                  <div className="w-px h-8 bg-slate-300" />
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono mb-0.5">O'zlashtirish</span>
                    <span className="text-xl sm:text-2xl font-black text-indigo-650 font-mono">{getPercentage()}%</span>
                  </div>
                </div>

                {/* Experience score multiplier */}
                <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-100/70 text-emerald-800 px-4 py-2 rounded-xl text-xs font-black">
                  <Sparkles className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                  <span>Siz {quizMode === 'oxford' ? '+30 XP' : '+15 XP'} bonus faollik ochkolarini qo'lga kiritdingiz!</span>
                </div>

                {/* Bottom triggers */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-4">
                  <button
                    id="retake-quiz-btn"
                    onClick={handleStartQuiz}
                    className="flex-1 flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-50 border border-slate-250 text-slate-700 px-5 py-3 rounded-2xl text-xs font-bold transition-all shadow-2xs"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                    <span>Qayta Topshirish</span>
                  </button>
                  <button
                    id="finish-and-go-lessons-btn"
                    onClick={() => setActiveTab('lesson')}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md transition-all"
                  >
                    Sinf Ma'lumotiga Qaytish
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, XCircle, Award, HelpCircle, ArrowRight, UserCheck, Users, Brain, Zap, RefreshCw, Volume2 } from 'lucide-react';

interface Question {
  id: number;
  category: 'Riddle' | 'Grammar' | 'Vocabulary';
  text: string;
  translationUz: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  points: number;
}

const triviaQuestions: Question[] = [
  {
    id: 1,
    category: 'Riddle',
    text: "What has to be broken before you can use it?",
    translationUz: "Ishlatishingizdan oldin uni albatta sindirishingiz kerak bo'lgan narsa nima?",
    options: ["A lock (Qulf)", "An egg (Tuxum)", "A window (Deraza)", "A stick (Tayoq)"],
    correctIdx: 1,
    explanation: "Excellent! Tuxum (an egg) ishlatishdan oldin maza qilib chaqilishi (sindirilishi) kerak! Juda zukko ekansiz!",
    points: 15
  },
  {
    id: 2,
    category: 'Riddle',
    text: "What is full of holes but still holds water?",
    translationUz: "Hamma joyi teshik-teshik bo'lsa ham, suvni o'zida saqlay oladigan narsa nima?",
    options: ["A net (To'r)", "A cloud (Bulut)", "A sponge (Gubka)", "A basket (Savat)"],
    correctIdx: 2,
    explanation: "Ajoyib! Gubka (sponge) teshiklarga to'la bo'lsa ham o'zida ajoyib tarzda suv ushlab qola oladi!",
    points: 15
  },
  {
    id: 3,
    category: 'Grammar',
    text: "If 'go' becomes 'went' in the past simple, what does 'fly' become?",
    translationUz: "Agar 'go' (bormoq) o'tgan zamonda 'went' bo'lsa, 'fly' (uchmoq) nima bo'ladi?",
    options: ["flyed", "flew", "flown", "flewed"],
    correctIdx: 1,
    explanation: "Dahshatli bilim! 'Fly' fe'li o'tgan zamonda noto'g'ri fe'l bo'lgani uchun 'flew' shakliga o'zgaradi.",
    points: 15
  },
  {
    id: 4,
    category: 'Grammar',
    text: "Identify the correct question structure:",
    translationUz: "To'g'ri tuzilgan so'roq gapni toping:",
    options: [
      "Where does she lives?",
      "Does she live here?",
      "Does she lives here?",
      "Is she live here?"
    ],
    correctIdx: 1,
    explanation: "To'g'ri! 'Does' kelganda fe'lning asliga qaytishi ('live') qoidasini juda zo'r bilar ekansiz!",
    points: 15
  },
  {
    id: 5,
    category: 'Vocabulary',
    text: "The opposite meaning of the word 'generous' (saxiy) is...",
    translationUz: "'Generous' (saxiy) so'ziga teskari ma'noli so'zni toping...",
    options: ["Kind (Mehribon)", "Stingy (Xasis/Baxil)", "Polite (Xushmuomala)", "Lazy (Tandir/Yalqov)"],
    correctIdx: 1,
    explanation: "Tabriklaymiz! 'Stingy' xasis yoki baxil degani bo'lib, 'generous' so'zining mutlaq antonimidir.",
    points: 15
  },
  {
    id: 6,
    category: 'Vocabulary',
    text: "Which of these words is spelled correctly?",
    translationUz: "Ushbu so'zlardan qaysi biri imloviy jihatdan to'g'ri yozilgan?",
    options: ["Bannana", "Bananna", "Banana", "Bananan"],
    correctIdx: 2,
    explanation: "To'ppa-to'g'ri! Banan mevasi ingliz tilida 'Banana' deb yoziladi.",
    points: 15
  },
  {
    id: 7,
    category: 'Riddle',
    text: "I have hands but I cannot clap. What am I?",
    translationUz: "Mening qo'llarim (millarim) bor, lekin qarsak chala olmayman. Men nimaman?",
    options: ["A glove (Qo'lqop)", "A clock (Soat)", "A mirror (Ko'zgu)", "A book (Kitob)"],
    correctIdx: 1,
    explanation: "Daho! Soatning millari ingliz tilida 'hands' deyiladi. Siz topishmoq ustasisiz!",
    points: 15
  }
];

interface AIAgentTriviaProps {
  addXP: (amount: number, reason: string) => void;
  onlineCount: number;
}

export default function AIAgentTrivia({ addXP, onlineCount }: AIAgentTriviaProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answeredMap, setAnsweredMap] = useState<Record<number, { chosen: number; correct: boolean }>>({});
  const [streakCount, setStreakCount] = useState(0);

  // Cancel any talking when index changes or component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [currentIdx]);

  const speakQuestion = (questionText: string, options: string[]) => {
    if (!window.speechSynthesis) {
      alert("Sizning brauzeringizda ovozli talaffuz qo'llab-quvvatlanmaydi.");
      return;
    }
    window.speechSynthesis.cancel();

    // Prepare human-friendly clean speech script
    // E.g., Replace blanks with "blank" so the synthesizer says "blank" instead of pausing
    const cleanQuestionText = questionText.replace(/_+/g, "blank");
    
    // We strip off Uzbek translated tags like "(Tuxum)" or "(Deraza)" so it pronounces only English alternatives cleanly
    const optionsClean = options.map((opt, i) => {
      const engPartOnly = opt.split(' (')[0]; // Split and take English part
      return `Option ${i + 1}: ${engPartOnly}`;
    }).join('. ');

    const speechText = `${cleanQuestionText}. ... Please choose the correct answer: ... ${optionsClean}`;
    const utterance = new SpeechSynthesisUtterance(speechText);

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.rate = 0.88; // Comfortable speed for ESL learners
    utterance.lang = 'en-US';

    window.speechSynthesis.speak(utterance);
  };

  const currentQuestion = triviaQuestions[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (isSubmitted) return;
    setSelectedAnswer(idx);
  };

  const playFeedbackSound = (isCorrect: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (isCorrect) {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220.00, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(146.83, ctx.currentTime + 0.15); // D3
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {}
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null || isSubmitted) return;

    const isCorrect = selectedAnswer === currentQuestion.correctIdx;
    setIsSubmitted(true);
    
    // Save to answered map
    setAnsweredMap(prev => ({
      ...prev,
      [currentQuestion.id]: { chosen: selectedAnswer, correct: isCorrect }
    }));

    playFeedbackSound(isCorrect);

    if (isCorrect) {
      setStreakCount(prev => prev + 1);
      addXP(
        currentQuestion.points, 
        `Google AI Studio Topishmog'i: "${currentQuestion.text.slice(0, 30)}..." savoliga to'g'ri javob uchun`
      );
    } else {
      setStreakCount(0);
    }
  };

  const handleNext = () => {
    if (currentIdx < triviaQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      // Reset state for the next question or restore already answered state
      const nextId = triviaQuestions[currentIdx + 1].id;
      if (answeredMap[nextId]) {
        setSelectedAnswer(answeredMap[nextId].chosen);
        setIsSubmitted(true);
      } else {
        setSelectedAnswer(null);
        setIsSubmitted(false);
      }
    } else {
      // Wrap around or restart
      setCurrentIdx(0);
      const firstId = triviaQuestions[0].id;
      if (answeredMap[firstId]) {
        setSelectedAnswer(answeredMap[firstId].chosen);
        setIsSubmitted(true);
      } else {
        setSelectedAnswer(null);
        setIsSubmitted(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      const prevId = triviaQuestions[currentIdx - 1].id;
      if (answeredMap[prevId]) {
        setSelectedAnswer(answeredMap[prevId].chosen);
        setIsSubmitted(true);
      } else {
        setSelectedAnswer(null);
        setIsSubmitted(false);
      }
    }
  };

  const resetAllQuestions = () => {
    setAnsweredMap({});
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setCurrentIdx(0);
    setStreakCount(0);
    addXP(5, "Savollarni yangidan harakat qilganingiz uchun");
  };

  // Helper count of correct answers
  const correctCount = Object.values(answeredMap).filter((x: any) => x?.correct).length;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden space-y-6">
      
      {/* Aurora visual glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-100/40 rounded-full blur-3xl pointer-events-none select-none" />
      
      {/* Header section with AI Agent identification */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-start space-x-3.5">
          <div className="relative shrink-0">
            <span className="flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white rounded-2xl shadow-md border-2 border-indigo-200 shadow-indigo-100 font-extrabold text-xl animate-pulse">
              🤖
            </span>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-white"></span>
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 tracking-tight leading-none flex items-center gap-1.5 flex-wrap">
              <span>Google AI Studio Coding Agent</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wide">AI Ko'makchi</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-normal">
              Gemini modeli tomonidan tayyorlangan turli xildagi quvnoq ingliz tili darslari va topishmoqlar arenasi.
            </p>
          </div>
        </div>

        {/* Real-time online student counter (necha kishi onlaynligi) */}
        <div className="flex items-center space-x-2.5 bg-emerald-50/80 border border-emerald-100/60 px-4 py-2 rounded-2xl shrink-0 self-start md:self-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <div className="text-left">
            <span className="text-[9px] uppercase font-black text-emerald-600 tracking-wider block leading-none">Onlayn O'quvchi</span>
            <span className="text-sm font-black text-emerald-800 font-mono leading-tight">{onlineCount} kishi</span>
          </div>
        </div>
      </div>

      {/* Main Agent Speech Chat Bubble */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start space-x-3 relative">
        <div className="text-2xl mt-0.5 select-none text-indigo-500">✨</div>
        <div className="space-y-1 text-xs font-semibold text-slate-700 leading-relaxed">
          <p>
            "Hi learner! Men <strong className="text-indigo-700">Google AI Studio'ning AI Coding (Gemini) Agenti</strong>man. Darsdan bo'sh vaqtingizda aqlni charxlovchi grammatik Jumboq, kutilmagan Lexical Topishmoq va mantiqiy savollarimni yeching! Har bir muvaffaqiyat uchun <span className="text-amber-600 font-bold font-mono">+15 XP</span> jami balingizga qo'shiladi."
          </p>
        </div>
      </div>

      {/* Questions Carousel Progress Dots */}
      <div className="flex items-center justify-between bg-slate-100/65 rounded-xl p-2.5">
        <div className="flex space-x-1.5 overflow-x-auto py-1">
          {triviaQuestions.map((q, idx) => {
            const isCurrent = idx === currentIdx;
            const answered = answeredMap[q.id];
            const isCorrect = answered?.correct;
            
            let colorClass = "bg-slate-300";
            if (isCurrent) colorClass = "bg-indigo-600 ring-2 ring-indigo-300";
            else if (answered) {
              colorClass = isCorrect ? "bg-emerald-500" : "bg-rose-500";
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIdx(idx);
                  const state = answeredMap[q.id];
                  if (state) {
                    setSelectedAnswer(state.chosen);
                    setIsSubmitted(true);
                  } else {
                    setSelectedAnswer(null);
                    setIsSubmitted(false);
                  }
                }}
                className={`w-7 h-7 rounded-lg text-[10px] font-extrabold flex items-center justify-center transition-all ${
                  isCurrent ? 'text-white' : 'text-slate-600 hover:bg-slate-200'
                } ${colorClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        
        {/* Status badges */}
        <div className="flex items-center space-x-2 text-[10px] font-black shrink-0 ml-2">
          {streakCount > 0 && (
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md flex items-center gap-1 animate-bounce">
              ⚡ {streakCount} Streak
            </span>
          )}
          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Yechildi: {correctCount}/{triviaQuestions.length}
          </span>
        </div>
      </div>

      {/* Interactive Question Card Frame */}
      <div className="border border-slate-150 rounded-2xl p-5 sm:p-6 bg-slate-50/40 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] font-bold text-slate-400 gap-2 mb-4">
          <div className="flex items-center space-x-2">
            <span className="uppercase tracking-widest">{currentQuestion.category} SAVOL</span>
            <span className="text-amber-600 font-extrabold">+{currentQuestion.points} XP 🏆</span>
          </div>
          
          <button
            onClick={() => speakQuestion(currentQuestion.text, currentQuestion.options)}
            className="flex items-center space-x-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 text-indigo-700 font-extrabold text-[10px] rounded-full transition-all shadow-3xs cursor-pointer active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Eshitish (Listen) 🔊</span>
          </button>
        </div>

        {/* Question Text & translation */}
        <div className="space-y-2 mb-6">
          <h4 className="text-lg font-extrabold text-slate-800 leading-snug">
            {currentQuestion.text}
          </h4>
          <p className="text-xs font-semibold text-slate-400 italic">
            Tarjimasi: {currentQuestion.translationUz}
          </p>
        </div>

        {/* Multi-choice options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectIdx = idx === currentQuestion.correctIdx;
            
            let btnClass = "border-slate-200 bg-white hover:bg-slate-50 text-slate-700";
            if (isSelected) {
              btnClass = "border-indigo-600 bg-indigo-50 text-indigo-950 font-bold ring-2 ring-indigo-200";
            }
            if (isSubmitted) {
              if (isCorrectIdx) {
                btnClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-200";
              } else if (isSelected) {
                btnClass = "border-rose-500 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-200";
              } else {
                btnClass = "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60";
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleOptionClick(idx)}
                className={`p-4 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {isSubmitted && isCorrectIdx && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                {isSubmitted && isSelected && !isCorrectIdx && <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Answer results explanation area */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 pt-4 border-t border-dashed border-slate-200 space-y-2 text-xs font-medium"
            >
              <div className="flex items-start space-x-2 text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100 shadow-3xs">
                <span className="text-lg">📢</span>
                <div>
                  <strong className="text-slate-950 font-black block">Tushuntirish (AI Izohi):</strong>
                  <p className="mt-0.5 text-slate-600 font-semibold">{currentQuestion.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons (Previous, Next, Submit Answer) */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 active:scale-95 disabled:opacity-50 text-slate-700 font-extrabold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
          >
            Orqaga
          </button>
          <button
            onClick={handleNext}
            className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-extrabold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center"
          >
            Keyingisi
          </button>
        </div>

        <div className="flex gap-2 items-stretch">
          {Object.keys(answeredMap).length > 0 && (
            <button
              onClick={resetAllQuestions}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs p-3 rounded-xl transition-all hover:text-slate-800"
              title="Savollarni tozalab qayta boshlash"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          
          <button
            disabled={selectedAnswer === null || isSubmitted}
            onClick={handleAnswerSubmit}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-extrabold text-xs cursor-pointer tracking-wider uppercase transition-all shadow-sm flex items-center justify-center space-x-1 border ${
              selectedAnswer === null || isSubmitted
                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white border-indigo-600'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Javobni Tekshirish</span>
          </button>
        </div>
      </div>

    </div>
  );
}

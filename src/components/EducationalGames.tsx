/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, Shuffle, CheckCircle2, RotateCcw, Volume2, Award, ArrowRight, ArrowLeft, Lightbulb, Trash2, Trophy, HelpCircle, Lock } from 'lucide-react';

// Word Builder Levels
const wordGameLevels = [
  { id: 1, correct: 'FAMILY', clueUz: 'Oila', category: 'Oila & Yaqinlar' },
  { id: 2, correct: 'TEACHER', clueUz: 'O\'qituvchi', category: 'Maktab & Ta\'lim' },
  { id: 3, correct: 'RABBIT', clueUz: 'Quyon', category: 'Hayvonot Dunyosi' },
  { id: 4, correct: 'BANANA', clueUz: 'Banan', category: 'Mevalar' },
  { id: 5, correct: 'MORNING', clueUz: 'Ertalab / Tong', category: 'Vaqt & Kun' },
  { id: 6, correct: 'ENGLISH', clueUz: 'Ingliz tili', category: 'Tillar va O\'quv' }
];

// Sentence Builder Levels
const sentenceGameLevels = [
  { id: 1, correct: 'She plays piano on Sundays.', translationUz: 'U yakshanba kunlari fortepiyano chaladi.', tense: 'Present Simple' },
  { id: 2, correct: 'They are learning English now.', translationUz: 'Ular hozir ingliz tilini o\'rganishyapti.', tense: 'Present Continuous' },
  { id: 3, correct: 'We watched a funny film yesterday.', translationUz: 'Biz kecha qiziqarli film tomosha qildik.', tense: 'Past Simple' },
  { id: 4, correct: 'I am eating a sweet apple.', translationUz: 'Men shirin olma yeyapman.', tense: 'Present Continuous' },
  { id: 5, correct: 'He bought a blue car last month.', translationUz: 'U o\'tgan oyda ko\'k mashina sotib oldi.', tense: 'Past Simple' }
];

interface EducationalGamesProps {
  xpPoints?: number;
  addXP?: (amount: number, reason: string) => void;
  levelInfo?: { level: number };
}

export default function EducationalGames({
  xpPoints = 120,
  addXP = () => {},
  levelInfo = { level: 1 }
}: EducationalGamesProps) {
  const [activeGame, setActiveGame] = useState<'word' | 'sentence' | null>(null);

  // Word Builder State
  const [wordLevelIndex, setWordLevelIndex] = useState(0);
  const [wordScrambled, setWordScrambled] = useState<string[]>([]);
  const [wordBuilt, setWordBuilt] = useState<string[]>([]);
  const [wordCompleted, setWordCompleted] = useState(false);
  const [wordScore, setWordScore] = useState(0);
  const [showWordSuccessMsg, setShowWordSuccessMsg] = useState(false);

  // Sentence Builder State
  const [sentenceLevelIndex, setSentenceLevelIndex] = useState(0);
  const [sentenceScrambled, setSentenceScrambled] = useState<string[]>([]);
  const [sentenceBuilt, setSentenceBuilt] = useState<string[]>([]);
  const [sentenceCompleted, setSentenceCompleted] = useState(false);
  const [sentenceScore, setSentenceScore] = useState(0);
  const [showSentenceSuccessMsg, setShowSentenceSuccessMsg] = useState(false);

  // Audio tone cue
  const playTune = (isCorrect: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (isCorrect) {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.log('Audio Context blocked', e);
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // ------------------------------------
  // Initialize Word Builder Game Level
  // ------------------------------------
  useEffect(() => {
    if (activeGame === 'word' && wordLevelIndex < wordGameLevels.length) {
      const currentWordObj = wordGameLevels[wordLevelIndex];
      const letters = currentWordObj.correct.split('');
      // Scramble letters until they don't match exactly original
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

  // ------------------------------------
  // Initialize Sentence Builder Level
  // ------------------------------------
  useEffect(() => {
    if (activeGame === 'sentence' && sentenceLevelIndex < sentenceGameLevels.length) {
      const currentSentObj = sentenceGameLevels[sentenceLevelIndex];
      // Split sentence into words, stripping periods
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

  // Word Game actions
  const handleWordLetterClick = (letter: string, idx: number) => {
    if (wordCompleted) return;
    
    // Add to built
    const newBuilt = [...wordBuilt, letter];
    setWordBuilt(newBuilt);
    
    // Rem from scrambled by removing index
    const newScrambled = [...wordScrambled];
    newScrambled.splice(idx, 1);
    setWordScrambled(newScrambled);

    const targetWord = wordGameLevels[wordLevelIndex].correct;
    
     // Check if lengths are the same
    if (newBuilt.length === targetWord.length) {
      const finalWord = newBuilt.join('');
      if (finalWord === targetWord) {
        setWordCompleted(true);
        setShowWordSuccessMsg(true);
        setWordScore(prev => prev + 10);
        addXP(10, `Word Builder: "${targetWord}" so'zini to'g'ri terganingiz uchun`);
        playTune(true);
        // Pronounce correct answer automatically!
        setTimeout(() => speakText(targetWord), 200);
      } else {
        // Failed construction, play buzz and shake/reset
        playTune(false);
        setTimeout(() => {
          // Reset level
          const origLetters = targetWord.split('');
          setWordScrambled([...origLetters].sort(() => Math.random() - 0.5));
          setWordBuilt([]);
        }, 600);
      }
    }
  };

  const resetWordGameLevel = () => {
    const targetWord = wordGameLevels[wordLevelIndex].correct;
    setWordScrambled([...targetWord.split('')].sort(() => Math.random() - 0.5));
    setWordBuilt([]);
    setWordCompleted(false);
  };

  const handleNextWordLevel = () => {
    if (wordLevelIndex < wordGameLevels.length - 1) {
      setWordLevelIndex(prev => prev + 1);
    } else {
      // Completed last level!
      setShowWordSuccessMsg(true);
      setWordCompleted(true);
    }
  };

  // Sentence Game actions
  const handleSentenceWordClick = (word: string, idx: number) => {
    if (sentenceCompleted) return;

    const newBuilt = [...sentenceBuilt, word];
    setSentenceBuilt(newBuilt);

    const newScrambled = [...sentenceScrambled];
    newScrambled.splice(idx, 1);
    setSentenceScrambled(newScrambled);

    const actualTarget = sentenceGameLevels[sentenceLevelIndex].correct.replace(/[.]/g, '');
    const targetWords = actualTarget.split(' ');

    if (newBuilt.length === targetWords.length) {
      const finalSentence = newBuilt.join(' ');
      if (finalSentence === actualTarget) {
        setSentenceCompleted(true);
        setShowSentenceSuccessMsg(true);
        setSentenceScore(prev => prev + 20);
        addXP(20, `Sentence Builder: "${sentenceGameLevels[sentenceLevelIndex].tense}" gapini to'g'ri terganingiz uchun`);
        playTune(true);
        // Pronounce sentence automatically
        setTimeout(() => speakText(sentenceGameLevels[sentenceLevelIndex].correct), 200);
      } else {
        playTune(false);
        setTimeout(() => {
          // Reset
          setSentenceScrambled([...targetWords].sort(() => Math.random() - 0.5));
          setSentenceBuilt([]);
        }, 600);
      }
    }
  };

  const resetSentenceGameLevel = () => {
    const cleanSent = sentenceGameLevels[sentenceLevelIndex].correct.replace(/[.]/g, '');
    setSentenceScrambled([...cleanSent.split(' ')].sort(() => Math.random() - 0.5));
    setSentenceBuilt([]);
    setSentenceCompleted(false);
  };

  const handleNextSentenceLevel = () => {
    if (sentenceLevelIndex < sentenceGameLevels.length - 1) {
      setSentenceLevelIndex(prev => prev + 1);
    } else {
      setShowSentenceSuccessMsg(true);
      setSentenceCompleted(true);
    }
  };

  return (
    <div id="games-workspace-view" className="space-y-6">
      
      {/* Game Selector Hub */}
      {!activeGame && (
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm text-center max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <span className="flex items-center justify-center mx-auto p-3 bg-indigo-50 rounded-2xl text-indigo-600 w-14 h-14">
              <Gamepad2 className="w-8 h-8" />
            </span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">O'yinlar Orqali Ingliz Tilini O'rganing!</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Scrambled harflardan so'z yasash yoki so'zlarni joy-joyiga qo'yib grammatik to'g'ri gaplar tuzish mashqlari orqali bilimingizni tekshiring!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Game 1 Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              id="select-word-builder-game-btn"
              onClick={() => {
                setWordLevelIndex(0);
                setWordScore(0);
                setActiveGame('word');
              }}
              className="p-6 bg-slate-50 hover:bg-white border hover:border-indigo-200 border-slate-200 rounded-2xl text-left transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <span className="text-3xl">🔤</span>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight mt-3">Word Builder</h3>
                <p className="text-xs text-slate-500 mt-1">Harflarni to'g'ri ketma-ketlikda birlashtirib, inglizcha lug'at va talaffuzingizni oshiring.</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 flex items-center">O'yinni boshlash <ArrowRight className="w-3.5 h-3.5 ml-1" /></span>
            </motion.button>

            {/* Game 2 Card */}
            <motion.button
              whileHover={levelInfo.level < 2 ? {} : { scale: 1.02 }}
              whileTap={levelInfo.level < 2 ? {} : { scale: 0.98 }}
              id="select-sentence-builder-game-btn"
              onClick={() => {
                if (levelInfo.level < 2) return;
                setSentenceLevelIndex(0);
                setSentenceScore(0);
                setActiveGame('sentence');
              }}
              className={`p-6 border text-left transition-all flex flex-col justify-between space-y-4 rounded-2xl ${
                levelInfo.level < 2
                  ? 'bg-slate-50/75 border-slate-200 opacity-75 cursor-not-allowed'
                  : 'bg-slate-50 hover:bg-white hover:border-indigo-200 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">📝</span>
                  {levelInfo.level < 2 && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Level 2 🔒
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight mt-3">Sentence Builder</h3>
                <p className="text-xs text-slate-500 mt-1">Present, Past va Continuous zamonlarida tartibsiz so'zlardan to'g'ri gaplar tuzing.</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 flex items-center">
                {levelInfo.level < 2 ? "Qulflangan (Level 2 kerak)" : "O'yinni boshlash"} 
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </motion.button>
          </div>
        </div>
      )}

      {/* GAME 1: WORD BUILDER SCREEN */}
      {activeGame === 'word' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 max-w-2xl mx-auto flex flex-col min-h-[460px] justify-between">
          <div>
            {/* Header game navigator */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <button
                id="word-game-back-to-hub-btn"
                onClick={() => setActiveGame(null)}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Asosiy Menyu</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-xl text-xs space-x-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Hisob: {wordScore}</span>
                </div>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  Zina {wordLevelIndex + 1} / {wordGameLevels.length}
                </span>
              </div>
            </div>

            {wordLevelIndex < wordGameLevels.length ? (
              <div className="space-y-6">
                
                {/* Clue Panel */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-1">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Kategoriya: {wordGameLevels[wordLevelIndex].category}
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 pt-2">
                    "{wordGameLevels[wordLevelIndex].clueUz}"
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Uzbekcha so'zning inglizchasini pastdagi harflardan foydalanib yig'ing:</p>
                </div>

                {/* Built Sentence Input slot */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50/50 min-h-[72px] flex flex-wrap gap-2 justify-center items-center">
                  {wordBuilt.length === 0 ? (
                    <span className="text-slate-400 text-sm italic font-medium">Harflarni tanlashni boshlang...</span>
                  ) : (
                    wordBuilt.map((char, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white font-black rounded-lg text-lg shadow-sm"
                      >
                        {char}
                      </motion.span>
                    ))
                  )}
                </div>

                {/* Scrambled Box Options */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase px-1">Harflar jamg'armasi:</span>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {wordScrambled.map((char, index) => (
                      <motion.button
                        key={`${char}-${index}`}
                        id={`letter-scrambled-${char}-${index}`}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleWordLetterClick(char, index)}
                        className="w-12 h-12 flex items-center justify-center bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-400 text-slate-800 font-black rounded-xl text-lg shadow-xs cursor-pointer select-none"
                      >
                        {char}
                      </motion.button>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* All levels complete */
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
                <span className="text-6xl">🏆</span>
                <h3 className="text-2xl font-black text-indigo-900">Word Builder Bo'yicha Chempion!</h3>
                <p className="text-slate-500 text-sm max-w-sm font-medium">Siz barcha {wordGameLevels.length} ta darajadagi so'zlarni xatosiz to'g'ri topdingiz!</p>
                
                <div className="bg-indigo-50 text-indigo-800 px-6 py-3 rounded-2xl text-sm font-bold border border-indigo-100">
                  Sizning Yakuniy Hisobingiz: {wordScore} ball
                </div>

                <div className="flex gap-3 pt-4 w-full max-w-xs">
                  <button
                    id="word-game-restart-btn"
                    onClick={() => {
                      setWordLevelIndex(0);
                      setWordScore(0);
                      setWordCompleted(false);
                      setShowWordSuccessMsg(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Boshidan boshlash
                  </button>
                  <button
                    id="word-game-exit-to-hub-btn"
                    onClick={() => setActiveGame(null)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs"
                  >
                    Boshqa o'yinga o'tish
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Success Dialog Modal inside Word Game */}
          <AnimatePresence>
            {showWordSuccessMsg && wordLevelIndex < wordGameLevels.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4"
              >
                <div className="flex items-center space-x-3 text-center sm:text-left">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <h5 className="text-emerald-950 font-extrabold text-sm">Barakalla! To'g'ri topdingiz!</h5>
                    <p className="text-xs text-emerald-800 flex items-center justify-center sm:justify-start">
                      <strong className="text-emerald-950 tracking-wide font-black mr-2">
                        {wordGameLevels[wordLevelIndex].correct}
                      </strong>
                      - {wordGameLevels[wordLevelIndex].clueUz}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                     id="speak-guessed-word-audio"
                     onClick={() => speakText(wordGameLevels[wordLevelIndex].correct)}
                     className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-2 rounded-xl transition-all"
                     title="Talaffuzini tinglash"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    id="next-word-level-btn"
                    onClick={handleNextWordLevel}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    {wordLevelIndex === wordGameLevels.length - 1 ? "Natija" : "Keyingi daraja"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* GAME 2: SENTENCE BUILDER SCREEN */}
      {activeGame === 'sentence' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 max-w-2xl mx-auto flex flex-col min-h-[460px] justify-between">
          <div>
            {/* Header navigations */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <button
                id="sentence-game-back-to-hub-btn"
                onClick={() => setActiveGame(null)}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Asosiy Menyu</span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-xl text-xs space-x-1">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Hisob: {sentenceScore}</span>
                </div>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  Zina {sentenceLevelIndex + 1} / {sentenceGameLevels.length}
                </span>
              </div>
            </div>

            {sentenceLevelIndex < sentenceGameLevels.length ? (
              <div className="space-y-6">
                
                {/* Uz Translation Clue */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-1">
                  <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Kalit Zamon: {sentenceGameLevels[sentenceLevelIndex].tense}
                  </span>
                  <p className="text-xs text-slate-400 font-medium pt-2">Tarjimaga mos keluvchi to'g'ri inglizcha gapni quring:</p>
                  <h3 className="text-xl font-extrabold text-slate-800 italic">
                    "{sentenceGameLevels[sentenceLevelIndex].translationUz}"
                  </h3>
                </div>

                {/* Built gap output bar */}
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-slate-55 shadow-3xs min-h-[80px] flex flex-wrap gap-2 justify-center items-center">
                  {sentenceBuilt.length === 0 ? (
                    <span className="text-slate-400 text-sm italic font-medium">So'zlarni tartib bilan tanlang...</span>
                  ) : (
                    sentenceBuilt.map((word, idx) => (
                      <motion.span
                        key={idx}
                        className="bg-indigo-600 text-white font-semibold text-sm px-3.5 py-1.5 rounded-xl shadow-xs"
                      >
                        {word}
                      </motion.span>
                    ))
                  )}
                </div>

                {/* Scrambled blocks */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-400 block uppercase px-1">Tartiblanmagan so'zlar:</span>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {sentenceScrambled.map((word, idx) => (
                      <motion.button
                        key={`${word}-${idx}`}
                        id={`word-scrambled-${word}-${idx}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSentenceWordClick(word, idx)}
                        className="bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-400 text-slate-800 font-semibold px-4 py-2 rounded-xl text-sm shadow-xs cursor-pointer select-none"
                      >
                        {word}
                      </motion.button>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* Completed all sentence levels */
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
                <span className="text-6xl">👑</span>
                <h3 className="text-2xl font-black text-indigo-900">Sentence Builder Ustasi!</h3>
                <p className="text-slate-500 text-sm max-w-sm font-medium">Siz barcha {sentenceGameLevels.length} ta murakkab grammatik gaplarni to'g'ri tartibda yig'dingiz!</p>
                
                <div className="bg-indigo-50 text-indigo-800 px-6 py-3 rounded-2xl text-sm font-bold border border-indigo-100">
                  Sizning Yakuniy Hisobingiz: {sentenceScore} ball
                </div>

                <div className="flex gap-3 pt-4 w-full max-w-xs">
                  <button
                    id="sentence-game-restart-btn"
                    onClick={() => {
                      setSentenceLevelIndex(0);
                      setSentenceScore(0);
                      setSentenceCompleted(false);
                      setShowSentenceSuccessMsg(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Boshidan boshlash
                  </button>
                  <button
                    id="sentence-game-exit-to-hub-btn"
                    onClick={() => setActiveGame(null)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-xs"
                  >
                    Boshqa o'yinga o'tish
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Correct Modal inside Sentence Game */}
          <AnimatePresence>
            {showSentenceSuccessMsg && sentenceLevelIndex < sentenceGameLevels.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4"
              >
                <div className="flex items-center space-x-3 text-center sm:text-left">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h5 className="text-emerald-950 font-extrabold text-sm">Ajoyib shakllantirildi!</h5>
                    <p className="text-xs text-emerald-800 leading-normal mt-0.5">
                      Grammatika to'g'ri: "{sentenceGameLevels[sentenceLevelIndex].correct}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                     id="speak-sentence-game-correct"
                     onClick={() => speakText(sentenceGameLevels[sentenceLevelIndex].correct)}
                     className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 p-2 rounded-xl transition-all"
                     title="GAP talaffuzini eshitish"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    id="next-sentence-level-btn"
                    onClick={handleNextSentenceLevel}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors"
                  >
                    {sentenceLevelIndex === sentenceGameLevels.length - 1 ? "Natija" : "Keyingi daraja"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}

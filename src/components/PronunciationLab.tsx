/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, Mic, MicOff, RefreshCw, CheckCircle, Sparkles, 
  HelpCircle, Flame, ArrowRight, BookOpen, Trophy, Play, Award
} from 'lucide-react';
import { oxfordDiscoverPoems, OxfordPoem, PoemLine } from '../data/oxfordDiscoverPoems';

const presetPhrases = [
  { text: 'Hello, how are you today?', translation: 'Salom, bugun ahvollaringiz qalay?', category: 'Kundalik salomlashish' },
  { text: 'I am learning English grammar step by step.', translation: 'Men ingliz tili grammatikasini bosqichma-bosqich o\'rganyapman.', category: 'O\'rganish' },
  { text: 'Could you please help me with this?', translation: 'Iltimos, menga shu masalada yordam bera olasizmi?', category: 'Iltimos qilish' },
  { text: 'Past simple is used for completed actions.', translation: 'O\'tgan oddiy zamon tugallangan ish-harakatlar uchun ishlatiladi.', category: 'Grammatika' },
  { text: 'Where is the nearest bookshop?', translation: 'Eng yaqin kitob do\'koni qayerda?', category: 'Sayohat' },
  { text: 'Practice makes perfect.', translation: 'Mashq qilish mukammallikka yetaklaydi.', category: 'Maqol / Hikmatli' }
];

interface PronunciationLabProps {
  addXP?: (amount: number, reason: string) => void;
  levelInfo?: { level: number };
}

export default function PronunciationLab({
  addXP = () => {},
  levelInfo = { level: 1 }
}: PronunciationLabProps) {
  const [labMode, setLabMode] = useState<'poetry' | 'phrases'>('poetry');
  
  // Normal phrases state
  const [inputText, setInputText] = useState(presetPhrases[0].text);
  const [translationText, setTranslationText] = useState(presetPhrases[0].translation);
  
  // Poetry state
  const [selectedPoem, setSelectedPoem] = useState<OxfordPoem>(oxfordDiscoverPoems[0]);
  const [activePoemLineIndex, setActivePoemLineIndex] = useState<number | null>(null);
  const [matchScoresByLine, setMatchScoresByLine] = useState<Record<number, number | null>>({});

  const [speechRate, setSpeechRate] = useState(0.8); // 0.8 is great for elementary school pronunciation
  const [accent, setAccent] = useState<'US' | 'UK'>('US');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const isListeningRef = useRef(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const activeRecognitionRef = useRef<any>(null);

  // References to bypass React stale closures in Web Speech API events
  const labModeRef = useRef(labMode);
  const selectedPoemRef = useRef(selectedPoem);
  const activePoemLineIndexRef = useRef(activePoemLineIndex);
  const inputTextRef = useRef(inputText);
  const accentRef = useRef(accent);

  useEffect(() => {
    labModeRef.current = labMode;
  }, [labMode]);

  useEffect(() => {
    selectedPoemRef.current = selectedPoem;
  }, [selectedPoem]);

  useEffect(() => {
    activePoemLineIndexRef.current = activePoemLineIndex;
  }, [activePoemLineIndex]);

  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  useEffect(() => {
    accentRef.current = accent;
  }, [accent]);

  useEffect(() => {
    // Check for web speech recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
    }

    return () => {
      // Clean up both speech and synthesis on unmount
      if (activeRecognitionRef.current) {
        try {
          activeRecognitionRef.current.onstart = null;
          activeRecognitionRef.current.onresult = null;
          activeRecognitionRef.current.onerror = null;
          activeRecognitionRef.current.onend = null;
          activeRecognitionRef.current.abort();
        } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const calculateSimpleMatch = (spoken: string, original: string) => {
    const cleanOriginal = original.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g,"").trim();
    const cleanSpoken = spoken.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g,"").trim();

    const origWords = cleanOriginal.split(/\s+/);
    const spokenWords = cleanSpoken.split(/\s+/);

    let matches = 0;
    origWords.forEach(w => {
      if (spokenWords.includes(w)) {
        matches++;
      }
    });

    return Math.round((matches / Math.max(origWords.length, 1)) * 100);
  };

  const stopRecognitionIfActive = () => {
    if (activeRecognitionRef.current) {
      try {
        activeRecognitionRef.current.onstart = null;
        activeRecognitionRef.current.onresult = null;
        activeRecognitionRef.current.onerror = null;
        activeRecognitionRef.current.onend = null;
        activeRecognitionRef.current.abort();
      } catch (e) {}
      activeRecognitionRef.current = null;
    }
    setIsListening(false);
    isListeningRef.current = false;
  };

  const safeStartRecognition = (lineIndex: number | null) => {
    // 1. Terminate ongoing voice syntheses and clean any active recognition
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    stopRecognitionIfActive();

    // 2. Setup SpeechRecognition class type
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    // 3. Initialize visual indicators
    setActivePoemLineIndex(lineIndex);
    setRecognizedText('');
    setMatchScore(null);
    setIsListening(true);
    isListeningRef.current = true;

    // 4. Instantiate a brand new recognition event loop container
    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = accentRef.current === 'US' ? 'en-US' : 'en-GB';

      rec.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        
        const mode = labModeRef.current;
        const poem = selectedPoemRef.current;
        const input = inputTextRef.current;

        if (mode === 'poetry' && lineIndex !== null && poem) {
          const originalText = poem.lines[lineIndex].english;
          const score = calculateSimpleMatch(transcript, originalText);
          setMatchScore(score);
          setMatchScoresByLine(prev => ({
            ...prev,
            [lineIndex]: score
          }));
          if (score >= 70) {
            addXP(10, `She'r satrini to'g'ri talaffuz qilganingiz uchun`);
          }
          
          // Save pronunciation stats
          try {
            const currentBest = parseInt(localStorage.getItem('eng_pronunciation_best') || '0', 10);
            if (score > currentBest) {
              localStorage.setItem('eng_pronunciation_best', score.toString());
            }
            const totalAttempts = parseInt(localStorage.getItem('eng_pronunciation_attempts') || '0', 10) + 1;
            localStorage.setItem('eng_pronunciation_attempts', totalAttempts.toString());
            window.dispatchEvent(new Event('storage'));
          } catch (e) {}
        } else {
          const score = calculateSimpleMatch(transcript, input);
          setMatchScore(score);
          if (score >= 70) {
            addXP(5, `Gapni to'g'ri talaffuz qilganingiz uchun`);
          }
          
          // Save pronunciation stats
          try {
            const currentBest = parseInt(localStorage.getItem('eng_pronunciation_best') || '0', 10);
            if (score > currentBest) {
              localStorage.setItem('eng_pronunciation_best', score.toString());
            }
            const totalAttempts = parseInt(localStorage.getItem('eng_pronunciation_attempts') || '0', 10) + 1;
            localStorage.setItem('eng_pronunciation_attempts', totalAttempts.toString());
            window.dispatchEvent(new Event('storage'));
          } catch (e) {}
        }
      };

      rec.onerror = (err: any) => {
        console.error('Speech recognition session error:', err);
        if (activeRecognitionRef.current === rec) {
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      rec.onend = () => {
        if (activeRecognitionRef.current === rec) {
          setIsListening(false);
          isListeningRef.current = false;
          activeRecognitionRef.current = null;
        }
      };

      activeRecognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      isListeningRef.current = false;
      activeRecognitionRef.current = null;
    }
  };

  const speakTextCurrent = () => {
    stopRecognitionIfActive();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(inputText);
    utterance.lang = accent === 'US' ? 'en-US' : 'en-GB';
    utterance.rate = speechRate;
    
    // Attempt best voices
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(accent === 'US' ? 'en-US' : 'en-GB'));
    if (voice) utterance.voice = voice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const speakPoemLine = (text: string, index: number) => {
    stopRecognitionIfActive();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setActivePoemLineIndex(index);
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = accent === 'US' ? 'en-US' : 'en-GB';
    utterance.rate = speechRate;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(accent === 'US' ? 'en-US' : 'en-GB'));
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const startRecitingPoemLine = (index: number) => {
    // If we click again on the currently recording line, toggle it off!
    if (isListening && activePoemLineIndex === index) {
      stopRecognitionIfActive();
      return;
    }

    const originalText = selectedPoem.lines[index].english;
    setInputText(originalText);
    
    safeStartRecognition(index);
  };

  const handleStartListening = () => {
    // Toggle off if already listening in general mode
    if (isListening && activePoemLineIndex === null) {
      stopRecognitionIfActive();
      return;
    }

    safeStartRecognition(null);
  };

  const speakWholePoem = () => {
    stopRecognitionIfActive();
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    // Combine all lines of selected poem
    const fullText = selectedPoem.lines.map(l => l.english).join('. ');
    setIsSpeaking(true);
    setActivePoemLineIndex(null);

    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = accent === 'US' ? 'en-US' : 'en-GB';
    utterance.rate = speechRate;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(accent === 'US' ? 'en-US' : 'en-GB'));
    if (voice) utterance.voice = voice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectPoem = (poem: OxfordPoem) => {
    stopRecognitionIfActive();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSelectedPoem(poem);
    setActivePoemLineIndex(null);
    setRecognizedText('');
    setMatchScore(null);
    setMatchScoresByLine({});
  };

  const handleTabModeChange = (mode: 'poetry' | 'phrases') => {
    stopRecognitionIfActive();
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setLabMode(mode);
    setActivePoemLineIndex(null);
    setRecognizedText('');
    setMatchScore(null);
  };

  // Calculate overall poem progress
  const linesAttemptedCount = Object.keys(matchScoresByLine).length;
  const attemptedScoresValues = Object.values(matchScoresByLine).filter(s => s !== null) as number[];
  const averagePoemScore = attemptedScoresValues.length > 0
    ? Math.round(attemptedScoresValues.reduce((a, b) => a + b, 0) / attemptedScoresValues.length)
    : 0;

  return (
    <div id="pronunciation-lab-view" className="space-y-6">
      
      {/* Upper Navigation Toggle between Standard phrases and Poems */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl p-3 shadow-xs border border-slate-100 gap-3">
        <div className="flex items-center space-x-3">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold uppercase py-0.5 px-2 rounded-sm">Oxford Discover 2 Exclusive</span>
            <h3 className="text-sm font-black text-slate-800">Bo'limni Tanlang (Pratice Section)</h3>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            id="tab-mode-poetry"
            onClick={() => handleTabModeChange('poetry')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-6 py-2.5 text-xs font-bold rounded-lg transition-all ${
              labMode === 'poetry'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oxford Level 2 She’rlari 📝</span>
          </button>
          <button
            id="tab-mode-phrases"
            onClick={() => handleTabModeChange('phrases')}
            className={`flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-6 py-2.5 text-xs font-bold rounded-lg transition-all ${
              labMode === 'phrases'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Erkin Talaffuz Jumlalari 🎙️</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {labMode === 'poetry' ? (
          <motion.div
            key="poetry-mode"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Playable Poem Card Column (Left) */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              
              {/* Poem Selector Horizontal Roll */}
              <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase block">
                  Oxford Discover 2 She'r yoki Qo'shig'ini tanlang:
                </span>
                <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
                  {oxfordDiscoverPoems.map((poem) => {
                    const isSelected = selectedPoem.id === poem.id;
                    return (
                      <button
                        key={poem.id}
                        id={`btn-poem-select-${poem.id}`}
                        onClick={() => handleSelectPoem(poem)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-100 text-slate-600 hover:text-slate-800'
                        }`}
                      >
                        <span className="text-base">{poem.emoji}</span>
                        <div className="text-left">
                          <p className="font-extrabold leading-tight">{poem.title}</p>
                          <p className={`text-[9px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>{poem.unitRange}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Recital Recitator Room */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
                
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{selectedPoem.emoji}</span>
                      <h2 className="text-xl font-black text-slate-800 leading-none">{selectedPoem.title}</h2>
                      <span className="bg-amber-100 text-amber-800 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded">
                        {selectedPoem.unitRange}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Mavzu: <span className="text-slate-600">{selectedPoem.themeUz}</span>
                    </p>
                    <div className="inline-flex items-center bg-indigo-50 text-indigo-700 font-medium text-[11px] px-2.5 py-1 rounded-md mt-2">
                      <HelpCircle className="w-3.5 h-3.5 mr-1" />
                      <span>Big Question: <strong>{selectedPoem.bigQuestion}</strong></span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      id="btn-speak-whole-poem"
                      onClick={speakWholePoem}
                      className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border border-indigo-100"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>She’rni to’liq eshitish</span>
                    </button>
                  </div>
                </div>

                {/* Accent/Speed Subcontrols inside poetry page */}
                <div className="flex flex-wrap items-center justify-between bg-slate-50 p-3 rounded-2xl gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500 font-medium">Aksent:</span>
                    <button
                      onClick={() => setAccent('US')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        accent === 'US' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-500'
                      }`}
                    >
                      US 🇺🇸
                    </button>
                    <button
                      onClick={() => setAccent('UK')}
                      className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                        accent === 'UK' ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-500'
                      }`}
                    >
                      UK 🇬🇧
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500 font-medium mr-1.5">Tezlik:</span>
                    {([0.6, 0.8, 1.0] as const).map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setSpeechRate(rate)}
                        className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                          speechRate === rate ? 'bg-white text-indigo-600 shadow-3xs' : 'text-slate-500'
                        }`}
                      >
                        {rate === 0.6 ? 'Sekin' : rate === 0.8 ? 'Yosh bolalar' : 'Oddiy'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Line by line display list of poetry */}
                <div className="space-y-4">
                  {selectedPoem.lines.map((line, index) => {
                    const isLineSpeaking = activePoemLineIndex === index && isSpeaking;
                    const isLineListening = activePoemLineIndex === index && isListening;
                    const lineScore = matchScoresByLine[index];

                    return (
                      <div
                        key={index}
                        id={`poem-line-container-${index}`}
                        className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          activePoemLineIndex === index
                            ? 'bg-indigo-50/40 border-indigo-200 shadow-3xs'
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        {/* Text part of poem */}
                        <div className="space-y-1">
                          <p className="text-base font-extrabold text-slate-800 tracking-tight leading-tight">
                            {line.english}
                          </p>
                          <p className="text-xs text-indigo-500 font-medium italic">
                            {line.uzbek}
                          </p>
                        </div>

                        {/* Interactive triggers of line */}
                        <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                          {/* Match Score Indicator Bubble if exists */}
                          {lineScore !== undefined && lineScore !== null && (
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                              lineScore >= 80 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : lineScore >= 50 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {lineScore}% Mos Keldi {lineScore >= 80 ? '⭐️' : ''}
                            </span>
                          )}

                          {/* Listen Line Trigger */}
                          <button
                            id={`btn-play-line-${index}`}
                            onClick={() => speakPoemLine(line.english, index)}
                            title="Tinglash (Listen)"
                            className={`p-2 rounded-xl transition-all ${
                              isLineSpeaking 
                                ? 'bg-indigo-600 text-white shadow-inner animate-pulse' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          {/* Recite/Pratice Microphone Trigger */}
                          {recognitionSupported ? (
                            <button
                              id={`btn-mic-line-${index}`}
                              onClick={() => startRecitingPoemLine(index)}
                              title="Taqillash & O'qish (Recite)"
                              className={`p-2 rounded-xl transition-all ${
                                isLineListening
                                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-100'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-900 border border-emerald-100'
                              }`}
                            >
                              <Mic className="w-4 h-4" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Micro Feedback box beneath active recording for quick evaluation */}
                {recognizedText && activePoemLineIndex !== null && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Sizdan faqat ushbu satr eshitildi:</span>
                      <p className="text-sm font-bold text-slate-800">"{recognizedText}"</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Asl matn: <span className="text-indigo-600 font-semibold">{selectedPoem.lines[activePoemLineIndex].english}</span></p>
                    </div>

                    {matchScore !== null && (
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-slate-400 block">Joriy satr mosligi:</span>
                        <span className={`text-base font-extrabold ${matchScore >= 80 ? 'text-emerald-600' : 'text-amber-500'}`}>
                          {matchScore}% matching
                        </span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>

            {/* General Poetry dashboard metrics & tips (Right) */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              
              {/* Oxford Discover Recital Stats */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black tracking-tight">Recital Panel (Statistika)</h4>
                  <Trophy className="w-5 h-5 text-amber-400" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-3.5 rounded-2xl">
                    <span className="text-[10px] text-indigo-200 font-bold block">Mashq qilingan satr:</span>
                    <span className="text-xl font-black text-white">{linesAttemptedCount}</span>
                    <span className="text-[9px] text-slate-300 block"> / {selectedPoem.lines.length} ta umumiy</span>
                  </div>

                  <div className="bg-white/10 p-3.5 rounded-2xl">
                    <span className="text-[10px] text-indigo-200 font-bold block">O'rtacha ball (Score):</span>
                    <span className="text-xl font-black text-white">{averagePoemScore}%</span>
                    <span className="text-[9px] text-slate-300 block">aniqlik darajasi</span>
                  </div>
                </div>

                {/* Progress evaluation rating */}
                <div className="border-t border-white/10 pt-4 flex items-center space-x-3">
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <Award className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">Darajangiz (Reading Level)</h5>
                    <p className="text-[10px] text-indigo-200">
                      {averagePoemScore >= 85 
                        ? 'Super Reciter! 🏆 (Ajoyib)' 
                        : averagePoemScore >= 60 
                        ? 'Rising Poet! 🌟 (Yaxshi)' 
                        : 'Practice more to unlock badges!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Oxford Discover 2 Educational Tips */}
              <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
                <h4 className="text-xs font-black text-slate-800 tracking-wider uppercase">Maslahatlar (Tips for Kids)</h4>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-start space-x-2.5">
                    <span className="text-indigo-600 bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                    <p className="text-slate-600">
                      <strong>Sezdirmasdan nafas oling:</strong> Nuqta yoki vergul belgilarida kelganda nafas olib ravon o'qing.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <span className="text-indigo-600 bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                    <p className="text-slate-600">
                      <strong>Tinglang va yodlang:</strong> 🔊 tugmasini ko'p bosib ohang va urg'u berishga (intonation) taqlid qiling.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <span className="text-indigo-600 bg-indigo-50 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                    <p className="text-slate-600">
                      <strong>Baland va tiniq so'zlang:</strong> Mikrofon 🎙️ yonib, "Hozir gapiring" degandan keyin balandroq tushunarli ayting.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="phrases-mode"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Control Station (left) - Custom text or selected phrases */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
                <div>
                  <div className="flex items-center space-x-1 px-1 text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span>Erkin Amaliyot xonasi</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mustaqil Talaffuz</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Istalgan inglizcha so'z yoki gapni yozing, to'g'ri o'qilishini eshiting va mikrofonga aytib talaffuzingizni solishtiring!
                  </p>
                </div>

                {/* Text Input area */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sizning jumlangiz (Ingliz tilida):</span>
                  <textarea
                    id="pronunciation-textbox"
                    rows={3}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      setTranslationText(''); // clear translation if custom typed
                      setMatchScore(null);
                      setRecognizedText('');
                      setActivePoemLineIndex(null);
                    }}
                    placeholder="Yozing yoki tepadagi namuna gaplardan birini tanlang..."
                    className="w-full p-4 text-base font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800"
                  />
                </div>

                {/* Translation row if present */}
                {translationText && (
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-start space-x-2">
                    <span className="text-lg">🇺🇿</span>
                    <p className="text-xs text-indigo-950 font-medium">Uzbekcha tarjimasi: {translationText}</p>
                  </div>
                )}

                {/* Voice configuration control line */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  
                  {/* Accent Selection */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Talaffuz aksenti:</span>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button
                        id="lab-accent-us"
                        onClick={() => setAccent('US')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                          accent === 'US' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Amerika (US) 🇺🇸
                      </button>
                      <button
                        id="lab-accent-uk"
                        onClick={() => setAccent('UK')}
                        className={`flex-1 py-1 px-12 text-xs font-bold rounded-lg transition-all ${
                          accent === 'UK' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Britaniya (UK) 🇬🇧
                      </button>
                    </div>
                  </div>

                  {/* Pronunciation speech rate */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ovoz tezligi:</span>
                    <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl">
                      <button
                        id="lab-rate-slow"
                        onClick={() => setSpeechRate(0.6)}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          speechRate === 0.6 ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        Sekin (0.6x)
                      </button>
                      <button
                        id="lab-rate-medium"
                        onClick={() => setSpeechRate(0.8)}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          speechRate === 0.8 ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        Bolalar (0.8x)
                      </button>
                      <button
                        id="lab-rate-normal"
                        onClick={() => setSpeechRate(1)}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          speechRate === 1 ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500'
                        }`}
                      >
                        Oddiy (1.0x)
                      </button>
                    </div>
                  </div>

                </div>

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    id="lab-listen-now-btn"
                    onClick={speakTextCurrent}
                    className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-sm transition-all"
                  >
                    {isSpeaking ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                    <span>Tinglash (Listen)</span>
                  </button>

                  {recognitionSupported ? (
                    <button
                      id="lab-speak-now-btn"
                      onClick={handleStartListening}
                      className={`flex-1 flex items-center justify-center space-x-2 font-bold text-sm px-6 py-3.5 rounded-2xl border transition-all ${
                        isListening
                          ? 'bg-rose-50 border-rose-300 text-rose-600 ring-4 ring-rose-100 animate-pulse'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 shadow-xs'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <Mic className="w-5 h-5 animate-bounce text-rose-500" />
                          <span>Hozir gapiring...</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          <span>Men ham aytaman (Speak)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex-1 bg-slate-50 text-slate-400 p-2.5 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-xs text-center">
                      <MicOff className="w-4 h-4 mr-1.5 text-slate-300" />
                      Sizning brauzeringiz mikrofonda talaffuz tekshirishni qo'llab-quvvatlamaydi. (Chrome tavsiya etiladi)
                    </div>
                  )}
                </div>

                {/* Matches & feedback drawer */}
                {(recognizedText || matchScore !== null) && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 animate-fade-in">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Natijangiz:</h4>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Siz talaffuz qilgan jumla:</span>
                        <p className="text-base font-bold text-slate-800">"{recognizedText || 'Hech narsa eshitilmadi...'}"</p>
                      </div>

                      {matchScore !== null && (
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-500">Talaffuz mosligi:</span>
                            <span className={`text-sm font-extrabold ${
                              matchScore >= 80 ? 'text-emerald-600' : matchScore >= 50 ? 'text-amber-600' : 'text-rose-500'
                            }`}>
                              {matchScore}% matching
                            </span>
                          </div>
                          
                          {/* Progress Bar indicator */}
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                matchScore >= 80 ? 'bg-emerald-500' : matchScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${matchScore}%` }}
                            />
                          </div>

                          <p className="text-xs text-slate-500 mt-2 font-medium">
                            {matchScore >= 80 
                              ? 'Barakalla! Talaffuzingiz ajoyib xuddi ona-tilida so\'zlashuvchilar kabi!'
                              : matchScore >= 50
                              ? 'Yaxshi! Ayrim so\'zlarga ko\'proq urg\'u berib, qayta eshitib takrorlang.'
                              : 'Yana bir bor harakat qilib, ovoz chiqarib balandroq va ravonroq gapiring.'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Recommended sample list (right) */}
            <div className="lg:col-span-4 flex flex-col space-y-3">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase px-1">Tavsiyaviy Namunalar</h4>
              <div className="grid grid-cols-1 gap-2">
                {presetPhrases.map((phrase, idx) => {
                  const isSelected = inputText === phrase.text;
                  return (
                    <button
                      key={idx}
                      id={`lab-preset-${idx}`}
                      onClick={() => {
                        setInputText(phrase.text);
                        setTranslationText(phrase.translation);
                        setMatchScore(null);
                        setRecognizedText('');
                        setActivePoemLineIndex(null);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-300 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1.5">
                        <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">
                          {phrase.category}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-slate-800 line-clamp-2">
                        "{phrase.text}"
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 truncate">
                        {phrase.translation}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


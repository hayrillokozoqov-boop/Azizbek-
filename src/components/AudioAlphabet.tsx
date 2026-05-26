/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Search, Sparkles, Sliders, Play, Square, RefreshCw, Star, Pause } from 'lucide-react';
import { alphabetData } from '../data/alphabetData';
import { AlphabetItem } from '../types';

interface AudioAlphabetProps {
  addXP?: (amount: number, reason: string) => void;
  levelInfo?: { level: number };
}

export default function AudioAlphabet({
  addXP = () => {},
  levelInfo = { level: 1 }
}: AudioAlphabetProps) {
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem | null>(alphabetData[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'vowels' | 'consonants'>('all');
  const [speechRate, setSpeechRate] = useState<number>(1); // 1 = normal, 0.6 = slow
  const [accent, setAccent] = useState<'US' | 'UK'>('US');
  const [isPlaying, setIsPlaying] = useState<string | null>(null); // 'letter' | 'word' | 'sentence' | null

  // Autoplay (ketma-ket yodlash) state
  const [isAutoplayActive, setIsAutoplayActive] = useState(false);
  const [autoplayIndex, setAutoplayIndex] = useState<number>(-1);
  const autoplayActiveRef = useRef(false);
  const speechRateRef = useRef(speechRate);
  const accentRef = useRef(accent);

  useEffect(() => {
    speechRateRef.current = speechRate;
  }, [speechRate]);

  useEffect(() => {
    accentRef.current = accent;
  }, [accent]);

  // Stop reading if component unmounts
  useEffect(() => {
    return () => {
      autoplayActiveRef.current = false;
      window.speechSynthesis?.cancel();
    };
  }, []);

  const stopAutoplay = () => {
    setIsAutoplayActive(false);
    autoplayActiveRef.current = false;
    window.speechSynthesis?.cancel();
    setIsPlaying(null);
  };

  const speakLetterAutoplay = (index: number) => {
    if (!autoplayActiveRef.current) return;

    if (index >= alphabetData.length) {
      // Completed A-Z successfully!
      setIsAutoplayActive(false);
      autoplayActiveRef.current = false;
      setIsPlaying(null);
      setAutoplayIndex(-1);
      
      // Award nice gamified points!
      try {
        addXP(30, "Alifboni boshidan oxirigacha auto-play orqali to'liq eshitib, yodlaganingiz uchun! 🌟");
      } catch (e) {}
      return;
    }

    setAutoplayIndex(index);
    const item = alphabetData[index];
    setSelectedLetter(item);
    setIsPlaying('letter');

    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${item.letter}. ... ${item.word}.`);
    
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    if (accentRef.current === 'US') {
      selectedVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
    } else {
      selectedVoice = voices.find(v => v.lang.startsWith('en-GB')) || voices.find(v => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    // slightly comfortable and slower so kids can repeat nicely after the speaker
    utterance.rate = speechRateRef.current * 0.85;
    utterance.lang = accentRef.current === 'US' ? 'en-US' : 'en-GB';

    utterance.onend = () => {
      if (autoplayActiveRef.current) {
        setIsPlaying(null);
        // Wait 1500ms so learner has time to register, look at the screen, and visually follow
        setTimeout(() => {
          if (autoplayActiveRef.current) {
            speakLetterAutoplay(index + 1);
          }
        }, 1500);
      } else {
        setIsPlaying(null);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(null);
      if (autoplayActiveRef.current) {
        speakLetterAutoplay(index + 1);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const startAutoplay = (startIndex: number = 0) => {
    window.speechSynthesis?.cancel();
    setIsAutoplayActive(true);
    autoplayActiveRef.current = true;
    speakLetterAutoplay(startIndex);
  };

  const speakText = (text: string, type: 'letter' | 'word' | 'sentence') => {
    if (autoplayActiveRef.current) {
      stopAutoplay();
    }
    if (!window.speechSynthesis) {
      alert("Sizning brauzeringizda ovozli talaffuz qo'llab-quvvatlanmaydi.");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    setIsPlaying(type);

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate voice based on selected accent
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (accent === 'US') {
      selectedVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
    } else {
      selectedVoice = voices.find(v => v.lang.startsWith('en-GB')) || voices.find(v => v.lang.startsWith('en'));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Set voice rate (speed)
    utterance.rate = speechRate;
    utterance.lang = accent === 'US' ? 'en-US' : 'en-GB';

    utterance.onend = () => {
      setIsPlaying(null);
    };

    utterance.onerror = () => {
      setIsPlaying(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Filter letters
  const filteredLetters = alphabetData.filter(item => {
    const matchesSearch = item.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.wordTranslation.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'vowels') return matchesSearch && item.isVowel;
    if (filter === 'consonants') return matchesSearch && !item.isVowel;
    return matchesSearch;
  });

  return (
    <div id="audio-alphabet-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Sidebar: Navigation Alphabet Cards */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        
        {/* Search & Filter Header */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-3 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              id="alphabet-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Harf yoki so'zni qidirish..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700"
            />
          </div>

          {/* Filters */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
            <button
              id="filter-all-btn"
              onClick={() => setFilter('all')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Barchasi
            </button>
            <button
              id="filter-vowels-btn"
              onClick={() => setFilter('vowels')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'vowels'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unli (Vowels)
            </button>
            <button
              id="filter-consonants-btn"
              onClick={() => setFilter('consonants')}
              className={`flex-1 md:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === 'consonants'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Undosh (Consonants)
            </button>
          </div>
        </div>

        {/* Alphabet Grid */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1">
          {filteredLetters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-4xl">🔍</span>
              <p className="mt-3 text-slate-500 text-sm font-medium">Uzr, qidiruv mos keladigan harf toilmadi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredLetters.map((item) => {
                const isSelected = selectedLetter?.letter === item.letter;
                return (
                  <motion.button
                    key={item.letter}
                    id={`alphabet-letter-${item.letter}`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (autoplayActiveRef.current) {
                        stopAutoplay();
                      }
                      setSelectedLetter(item);
                      // Auto-speak the letter name and its associated word for interactive feel
                      setTimeout(() => {
                        window.speechSynthesis?.cancel();
                        const utterance = new SpeechSynthesisUtterance(`${item.letter}. ... ${item.word}.`);
                        
                        const voices = window.speechSynthesis.getVoices();
                        let selectedVoice = null;
                        if (accent === 'US') {
                          selectedVoice = voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en'));
                        } else {
                          selectedVoice = voices.find(v => v.lang.startsWith('en-GB')) || voices.find(v => v.lang.startsWith('en'));
                        }

                        if (selectedVoice) {
                          utterance.voice = selectedVoice;
                        }
                        
                        utterance.rate = speechRate;
                        utterance.lang = accent === 'US' ? 'en-US' : 'en-GB';
                        window.speechSynthesis?.speak(utterance);
                      }, 50);
                    }}
                    className={`flex flex-col items-center p-3 rounded-xl border transition-all relative ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-100'
                        : 'bg-slate-50 hover:bg-white hover:border-slate-300 border-slate-100'
                    }`}
                  >
                    {/* Badge Vowel/Consonant */}
                    <span className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${
                      item.isVowel ? 'bg-amber-500' : 'bg-sky-400'
                    }`} title={item.isVowel ? "Unli" : "Undosh"} />

                    {/* Capital Letter */}
                    <span className="text-3xl font-extrabold tracking-tight text-slate-800">
                      {item.letter}
                    </span>

                    {/* Example Word */}
                    <span className="text-xs font-bold text-slate-500 mt-1">
                      {item.word}
                    </span>

                    {/* Emoji */}
                    <span className="text-lg mt-1">{item.emoji}</span>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Reader / Player Spotlight */}
      <div className="lg:col-span-5 flex flex-col">
        <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 shadow-sm border border-indigo-50/50 flex flex-col space-y-5 h-full sticky top-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center space-y-0.5">
              <span className="flex items-center justify-center p-1.5 bg-indigo-50 rounded-lg text-indigo-500">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase ml-2">Talaffuz Stansiyasi</span>
            </div>
            
            {/* Options Toggle */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                <button
                  id="accent-us-btn"
                  onClick={() => setAccent('US')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    accent === 'US' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  US 🇺🇸
                </button>
                <button
                  id="accent-uk-btn"
                  onClick={() => setAccent('UK')}
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    accent === 'UK' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  UK 🇬🇧
                </button>
              </div>
            </div>
          </div>

          {/* CONTINUOUS ALPHABET AUTOPLAY LEARNER (KETMA-KET YODLASH) */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-indigo-100/30 rounded-2xl p-4 border border-indigo-100/60 space-y-3 shadow-3xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🎧</span>
                <div>
                  <h4 className="text-[11px] font-black text-indigo-950 uppercase tracking-wide leading-tight">Ketma-ket yodlash (Auto-play)</h4>
                  <p className="text-[9px] text-indigo-600 font-semibold mt-0.5">Harflarni birma-bir ketma-ket aytib beradi</p>
                </div>
              </div>
              
              {isAutoplayActive && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              )}
            </div>

            {/* Progress bar showing position */}
            {isAutoplayActive && autoplayIndex !== -1 && (
              <div className="space-y-1 bg-white p-2 rounded-xl border border-indigo-100/50">
                <div className="flex justify-between text-[10px] font-extrabold text-indigo-900/80">
                  <span>A-Z Ketma-ketligi:</span>
                  <span className="font-mono">{autoplayIndex + 1} / 26 harf ({Math.round(((autoplayIndex + 1) / 26) * 100)}%)</span>
                </div>
                <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${((autoplayIndex + 1) / 26) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {isAutoplayActive ? (
                <button
                  id="stop-alphabet-autoplay-btn"
                  onClick={stopAutoplay}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-extrabold text-[10px] py-2 px-3 rounded-xl shadow-xs cursor-pointer tracking-wider uppercase transition-all"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>To'xtatish</span>
                </button>
              ) : (
                <button
                  id="start-alphabet-autoplay-btn"
                  onClick={() => startAutoplay(selectedLetter ? alphabetData.findIndex(x => x.letter === selectedLetter.letter) : 0)}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-[10px] py-2 px-3 rounded-xl shadow-sm cursor-pointer tracking-wider uppercase transition-all"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{selectedLetter ? `"${selectedLetter.letter}" dan boshlash` : "A dan boshlash"}</span>
                </button>
              )}

              {!isAutoplayActive && selectedLetter && selectedLetter.letter !== 'A' && (
                <button
                  id="restart-alphabet-autoplay-btn"
                  onClick={() => startAutoplay(0)}
                  className="bg-indigo-50 hover:bg-indigo-100 active:scale-98 text-indigo-700 font-extrabold text-xs p-2 rounded-xl transition-all cursor-pointer"
                  title="A-dan qayta boshlash"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <p className="text-[10px] text-slate-500 italic leading-snug">
              "A is for Apple, B is for Book..." deb birma-bir ketma-ket o'qiydi. To'liq eshitib tugatsangiz <b>+30 XP bonus</b> yutasiz! 🏅
            </p>
          </div>

          <AnimatePresence mode="wait">
            {selectedLetter ? (
              <motion.div
                key={selectedLetter.letter}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col justify-between space-y-6"
              >
                
                {/* Big Display Area */}
                <div className="flex flex-col items-center py-4 bg-white rounded-2xl border border-slate-100 shadow-xs relative overflow-hidden">
                  <div className="absolute top-2 left-3 flex items-center space-x-1">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                      selectedLetter.isVowel ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      {selectedLetter.isVowel ? 'Unli (Vowel)' : 'Undosh (Consonant)'}
                    </span>
                  </div>

                  {/* Gigantic Letter */}
                  <div className="text-8xl font-black text-indigo-600 select-none cursor-pointer tracking-tight"
                       onClick={() => speakText(selectedLetter.letter, 'letter')}>
                    {selectedLetter.letter}
                  </div>

                  <span className="text-slate-400 font-mono text-xs tracking-widest mt-1">
                    Talaffuzi: {selectedLetter.phonetic}
                  </span>

                  {/* Sound Trigger */}
                  <button
                    id="speak-letter-main-btn"
                    onClick={() => speakText(selectedLetter.letter, 'letter')}
                    className="mt-3 p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    title="Harf talaffuzini eshitish"
                  >
                    {isPlaying === 'letter' ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Example Word Detail */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Harfga oid so'z:</span>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-3">
                      <span className="text-4xl">{selectedLetter.emoji}</span>
                      <div>
                        <h4 className="text-xl font-bold text-slate-800 flex items-center">
                          {selectedLetter.word}
                        </h4>
                        <p className="text-sm text-slate-500 font-medium">Uzbekcha: {selectedLetter.wordTranslation}</p>
                      </div>
                    </div>
                    
                    <button
                      id="speak-word-btn"
                      onClick={() => speakText(selectedLetter.word, 'word')}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        isPlaying === 'word' 
                          ? 'bg-amber-50 text-amber-600 border-amber-200' 
                          : 'bg-slate-50 hover:bg-white text-slate-700 hover:border-slate-300 border-slate-100'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Eshitish</span>
                    </button>
                  </div>
                </div>

                {/* Example Sentence Detail */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Namuna gap (Grammatika):</span>
                  <div className="bg-indigo-900 text-indigo-50 p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Star className="w-16 h-16 text-white" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                      <div>
                        <p className="text-base font-medium leading-relaxed tracking-wide italic">
                          "{selectedLetter.exampleSentence}"
                        </p>
                        <p className="text-xs text-indigo-200 mt-2 font-light">
                          Tarjimasi: {selectedLetter.sentenceTranslation}
                        </p>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          id="speak-sentence-btn"
                          onClick={() => speakText(selectedLetter.exampleSentence, 'sentence')}
                          className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all"
                        >
                          {isPlaying === 'sentence' ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                          <span>Gapni tinglash</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Speed Controls Controls */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 flex items-center">
                      <Sliders className="w-3.5 h-3.5 mr-1" /> Tezlikni sozlash
                    </span>
                    <span className="text-[10px] font-mono font-bold text-indigo-600">
                      {speechRate === 1 ? 'Oddiy (1.0x)' : speechRate === 0.75 ? 'O\'rtacha daxshat (0.75x)' : 'Sekin (0.55x)'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      id="rate-slow-btn"
                      onClick={() => setSpeechRate(0.55)}
                      className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        speechRate === 0.55
                          ? 'bg-white border-indigo-400 text-indigo-600 shadow-xs'
                          : 'bg-transparent text-slate-500 hover:bg-slate-100 border-transparent'
                      }`}
                    >
                      Sekin (0.55x)
                    </button>
                    <button
                      id="rate-medium-btn"
                      onClick={() => setSpeechRate(0.75)}
                      className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        speechRate === 0.75
                          ? 'bg-white border-indigo-400 text-indigo-600 shadow-xs'
                          : 'bg-transparent text-slate-500 hover:bg-slate-100 border-transparent'
                      }`}
                    >
                      Teziraq (0.75x)
                    </button>
                    <button
                      id="rate-normal-btn"
                      onClick={() => setSpeechRate(1)}
                      className={`flex-1 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        speechRate === 1
                          ? 'bg-white border-indigo-400 text-indigo-600 shadow-xs'
                          : 'bg-transparent text-slate-500 hover:bg-slate-100 border-transparent'
                      }`}
                    >
                      Normal (1.0x)
                    </button>
                  </div>
                </div>

              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 min-h-[300px]">
                <Volume2 className="w-12 h-12 stroke-1 animate-pulse" />
                <p className="mt-3 text-sm">Tinglash stansiyasini faollashtirish uchun chapdan biror harfni tanlang.</p>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>

    </div>
  );
}

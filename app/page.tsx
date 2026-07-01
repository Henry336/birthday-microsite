'use client';

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// ============================================================================
// ⚙️ CONFIGURATION & CONTENT
// ============================================================================
const SHOW_PREVIEW = true; // CHANGE TO FALSE BEFORE SENDING TO HER
const TARGET_DATE_SGT = new Date('2026-07-02T00:00:00+08:00').getTime();

const LETTER_TEXT = `Happy 20th Birthday, Thel Thel! ❤️

I wanted to make something special for you this year. [Insert your raw, genuine birthday message here. Write about how much she means to you, your favorite moments from the past year, and what you are looking forward to in the future.]

Scroll down to see some of my favorite memories of us.`;

const CAROUSEL_DATA = [
  { img: '/photos/photo1.jpg', text: 'This was such a fun day. I love your smile here so much.' },
  { img: '/photos/photo2.jpg', text: 'Remember this? One of my absolute favorite moments with you.' },
  { img: '/photos/photo3.jpg', text: 'You looked incredibly gorgeous this day. I couldnt take my eyes off you.' },
  { img: '/photos/photo4.jpg', text: 'Just us being completely silly. I love our dynamic.' },
  { img: '/photos/photo5.jpg', text: 'Happy Birthday, my love. Here is to a hundred more memories like this.' }
];
// ============================================================================

export default function BirthdayMicrosite() {
  const [phase, setPhase] = useState<number>(0); 
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [hearts, setHearts] = useState<any[]>([]);
  const [stars, setStars] = useState<any[]>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);

  const calmAudioRef = useRef<HTMLAudioElement>(null);
  const hbdAudioRef = useRef<HTMLAudioElement>(null);

  // --- BACKGROUND GENERATOR ---
  useEffect(() => {
    setHearts(Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: Math.random() * 10 + 10,
      opacity: Math.random() * 0.5 + 0.3
    })));

    setStars(Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
    })));
  }, []);

  // --- COUNTDOWN LOGIC ---
  useEffect(() => {
    if (phase !== 1) return;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = TARGET_DATE_SGT - now;

      if (distance <= 0) {
        clearInterval(timer);
        triggerMidnight();
      } else {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // --- ACTIONS ---
  const handleEnterGate = () => {
    if (calmAudioRef.current) {
      calmAudioRef.current.volume = 0.5;
      calmAudioRef.current.play().catch(e => console.log('Audio blocked:', e));
    }
    setPhase(1);
  };

  const triggerMidnight = () => {
    setPhase(2);
    if (calmAudioRef.current) calmAudioRef.current.pause();
    if (hbdAudioRef.current) {
      hbdAudioRef.current.volume = 0.7;
      hbdAudioRef.current.currentTime = 0;
      hbdAudioRef.current.play().catch(e => console.log('Audio blocked:', e));
    }
    
    // Confetti Explosion
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleNextCarousel = () => setCarouselIdx((prev) => (prev + 1) % CAROUSEL_DATA.length);
  const handlePrevCarousel = () => setCarouselIdx((prev) => (prev - 1 + CAROUSEL_DATA.length) % CAROUSEL_DATA.length);

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center relative overflow-hidden font-serif text-rose-950">
      
      {/* --- HIDDEN AUDIO --- */}
      <audio ref={calmAudioRef} src="/music/calm.mp3" loop />
      <audio ref={hbdAudioRef} src="/music/birthday.mp3" />

      {/* --- BACKGROUND PARTICLES --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map(star => (
          <div key={`star-${star.id}`} className="absolute w-1.5 h-1.5 bg-yellow-200 rotate-45 animate-twinkle rounded-sm shadow-[0_0_5px_#fef08a]"
               style={{ top: star.top, left: star.left, animationDuration: star.animationDuration, animationDelay: star.animationDelay }} />
        ))}
        {hearts.map(heart => (
          <svg key={`heart-${heart.id}`} className="absolute text-rose-300 animate-float drop-shadow-sm"
               style={{ left: heart.left, width: heart.size, height: heart.size, animationDuration: heart.animationDuration, animationDelay: heart.animationDelay, '--target-opacity': heart.opacity } as any}
               viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ))}
      </div>

      {/* --- CONTENT WRAPPER --- */}
      <div className="z-10 w-full flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* ================= PHASE 0: GATE ================= */}
        {phase === 0 && (
          <div className="text-center space-y-8 animate-in fade-in duration-1000">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl italic text-rose-600 font-medium tracking-wide">for Thel Thel</h2>
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-light tracking-wide">Something is counting down,</p>
                <p className="text-2xl md:text-3xl font-light tracking-wide">just for you.</p>
              </div>
            </div>
            
            <div className="pt-8 flex flex-col items-center gap-4">
              <button onClick={handleEnterGate} className="px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xl shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-all hover:scale-105 active:scale-95 font-sans font-medium tracking-wide">
                Tap to enter, my love
              </button>
              <span className="text-xs tracking-[0.3em] uppercase text-rose-400/80 font-sans">Turn your sound on</span>
            </div>
          </div>
        )}

        {/* ================= PHASE 1: COUNTDOWN ================= */}
        {phase === 1 && (
          <div className="text-center animate-in fade-in zoom-in duration-700 space-y-8">
             <h2 className="text-2xl md:text-3xl italic text-rose-500 font-light">See you at Midnight...</h2>
             <div className="flex gap-4 md:gap-8 justify-center font-sans">
                <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-7xl font-bold text-rose-600 drop-shadow-sm">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-rose-400 mt-2">Hours</span>
                </div>
                <span className="text-4xl md:text-6xl font-bold text-rose-300 mt-1 animate-pulse">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-7xl font-bold text-rose-600 drop-shadow-sm">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-rose-400 mt-2">Minutes</span>
                </div>
                <span className="text-4xl md:text-6xl font-bold text-rose-300 mt-1 animate-pulse">:</span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl md:text-7xl font-bold text-rose-600 drop-shadow-sm">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-rose-400 mt-2">Seconds</span>
                </div>
             </div>
          </div>
        )}

        {/* ================= PHASE 2: MIDNIGHT REVEAL ================= */}
        {phase === 2 && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-10">
            <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400 drop-shadow-lg p-4">
              Happy 20th Birthday, <br/> my love!
            </h1>
            <button onClick={() => setPhase(3)} className="mt-8 px-8 py-3 border-2 border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white rounded-full text-lg transition-all hover:scale-105 active:scale-95 font-sans tracking-wide">
              Read My Letter →
            </button>
          </div>
        )}

        {/* ================= PHASE 3: LETTER & CAROUSEL ================= */}
        {phase === 3 && (
          <div className="w-full max-w-5xl mx-auto py-12 animate-in fade-in duration-700 h-screen overflow-y-auto custom-scrollbar flex flex-col items-center">
            
            {/* The Letter */}
            <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-xl border border-rose-100 mb-16 w-11/12 max-w-3xl transform rotate-1 hover:rotate-0 transition-transform">
              <p className="text-lg md:text-xl leading-loose whitespace-pre-line text-gray-700 font-sans font-light">
                {LETTER_TEXT}
              </p>
            </div>

            {/* The Floating Carousel */}
            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 mb-20 relative px-4">
              
              {/* Left: Polaroid */}
              <div className="bg-white p-4 pb-12 rounded-sm shadow-2xl border border-gray-100 transform -rotate-3 hover:scale-105 transition-all z-10 w-72 md:w-96">
                <div className="w-full h-64 md:h-80 bg-rose-50 rounded overflow-hidden">
                  <img src={CAROUSEL_DATA[carouselIdx].img} alt="Memory" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Right: Diary Card */}
              <div className="bg-rose-50/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-rose-200 transform rotate-2 hover:scale-105 transition-all z-20 w-72 md:w-96 h-48 flex items-center justify-center">
                <p className="text-lg md:text-xl text-center italic text-rose-900 leading-relaxed">
                  "{CAROUSEL_DATA[carouselIdx].text}"
                </p>
              </div>

              {/* Controls */}
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-30">
                <button onClick={handlePrevCarousel} className="p-3 rounded-full bg-white text-rose-600 shadow-md hover:bg-rose-50 transition-colors">
                  ←
                </button>
                <div className="flex gap-2">
                  {CAROUSEL_DATA.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === carouselIdx ? 'bg-rose-500' : 'bg-rose-200'}`} />
                  ))}
                </div>
                <button onClick={handleNextCarousel} className="p-3 rounded-full bg-white text-rose-600 shadow-md hover:bg-rose-50 transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= DEV PREVIEW PANEL ================= */}
      {SHOW_PREVIEW && (
        <div className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-rose-200 shadow-2xl text-xs font-sans w-48">
          <p className="font-bold text-rose-800 mb-3 border-b border-rose-100 pb-1">🔧 DEV CONTROLS</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => setPhase(0)} className={`px-3 py-2 rounded text-left transition-colors ${phase === 0 ? 'bg-rose-500 text-white shadow-sm' : 'hover:bg-rose-50 text-gray-600'}`}>0. Gate</button>
            <button onClick={() => setPhase(1)} className={`px-3 py-2 rounded text-left transition-colors ${phase === 1 ? 'bg-rose-500 text-white shadow-sm' : 'hover:bg-rose-50 text-gray-600'}`}>1. Countdown</button>
            <button onClick={() => triggerMidnight()} className={`px-3 py-2 rounded text-left transition-colors ${phase === 2 ? 'bg-rose-500 text-white shadow-sm' : 'hover:bg-rose-50 text-gray-600'}`}>2. Midnight Reveal</button>
            <button onClick={() => setPhase(3)} className={`px-3 py-2 rounded text-left transition-colors ${phase === 3 ? 'bg-rose-500 text-white shadow-sm' : 'hover:bg-rose-50 text-gray-600'}`}>3. Letter & Photos</button>
          </div>
        </div>
      )}

    </div>
  );
}
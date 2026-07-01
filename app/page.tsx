'use client';

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// ============================================================================
// ⚙️ CONFIGURATION: EDIT EVERYTHING HERE
// ============================================================================
const CONFIG = {
  // --- SYSTEM ---
  SHOW_PREVIEW: false, // CHANGE TO FALSE BEFORE SENDING TO HER
  TARGET_DATE_MYANMAR: '2026-07-02T00:00:00+06:30',

  // --- AUDIO (Ensure these files are in public/music/) ---
  music: {
    calm: '/music/calm.mp3',
    birthday: '/music/birthday.mp3',
    afterBirthdayQueue: [
      '/music/song1.mp3',
      '/music/song2.mp3',
      '/music/song3.mp3',
      '/music/calm.mp3'
    ]
  },

  // --- PHASE 0: THE GATE ---
  gate: {
    title: "for Thel Thel",
    subtitle1: "Something is counting down,",
    subtitle2: "just for you.",
    buttonText: "Tap to enter, my love",
    hintText: "Turn your sound on"
  },

  // --- PHASE 1: COUNTDOWN ---
  countdown: {
    title: "Midnight is almost here..."
  },

  // --- PHASE 2: MIDNIGHT REVEAL ---
  reveal: {
    title: "Happy 20th Birthday, <br/> my love!",
    buttonText: "Read my letter →"
  },

  // --- PHASE 3: THE LETTER & PHOTOS ---
  letterText: `🎉 🎉 Happy Birthday, Thel Thel! 🎉 🎉\n\nHappy Birthday ပါ ကလေးလေးရေ🥳🥳❤️ သဲသဲ အသက် ၂၀ တောင် ပြည့်သွားပြီပဲ 👀👀 မွေးနေ့ကစပြီး နောင်နှစ်ပေါင်းရာချီတဲ့အထိ ကျန်းမာချမ်းသာပြီး ကိုကိုနဲ့အမြဲတမ်း ပျော်ပျော်ရွှင်ရွှင်လက်တွဲသွားရပါစေ😋❤️ တောင်းတဲ့ဆုတွေလည်းပြည့်ပြီး ဘဝမှာလည်း အောင်မြင်မှုတွေ ပျော်ရွှင်မှုတွေ အများကြီးရပါစေနော် မှူးလေး😁🤍 \nအရမ်းချစ်တယ် ကလေးလေးရေ 😙😙😙😙❤️❤️❤️ အာာာဘွားးးးးး\n \n🎂ပျော်ရွှင်စရာ မွေးနေ့လေးဖြစ်ပါစေ မှူးလေး 🎂 နောက်လာမယ့် မွေးနေ့အဆက်ဆက်ကိုလည်း ဘဝလက်တွေဖော်တွေအဖြစ် ဖြတ်သန်းသွားကြရအောင်နော် 😚❤️❤️❤️ \n\nScroll down, my love - I saved some of my favorite memories of you!`,

  // Ensure these files are in public/photos/
  carousel: [
    {
      img: '/photos/photo1.jpg',
      text: 'သဲသဲနဲ့ ပထမဆုံး dinner date လုပ်တုန်းက ကိုကိုရိုက်ပေးခဲ့တဲ့ပုံလေး😁❤️ ပုံထဲကအချိန်လေးမရောက်ခင် နေပူထဲ လမ်းအကြာကြီးလျှောက်လိုက်ရလို့ Marina Bay Sands သွားတဲ့ တံတားပေါ်မှာ ပင်ပန်းပြီး မျက်နှာလေးမဲ့နေတာက ချစ်စရာလေးရော၊ အခုလို စားလိုက်ရတော့လည်း အဆင်ပြေသွားတာပါပဲ😋'
    },
    {
      img: '/photos/photo2.jpg',
      text: 'Universal Studios မှာ dinosaur တွေနေရာက တွဲလောင်းစီးရတဲ့ဟာကြီးအတွက် တန်းစီနေတုန်းက ရိုက်ထားတာ ဟီးဟီး😁 ထိုင်နေတာ အရမ်းချစ်စရာလေးမို့ favorite ထဲပါသွားတယ်😌❤️'
    },
    {
      img: '/photos/photo3.jpg',
      text: '14th Monthsary တုန်းက ပန်းစည်းလေးနဲ့ရိုက်ထားတဲ့ပုံလေး အရမ်းလှလွန်းလို့ ခဏခဏပြန်ကြည့်မိတယ်😭❤️❤️❤️ ချစ်စရာလေးဗျာာာာာ ပြန်ကြည့်လိုက်တိုင်းလည်း ဗိုက်တွေဆာပါတယ် သဲသဲရေ'
    },
    {
      img: '/photos/photo4.jpg',
      text: 'ဒါလည်း dinner date ကပဲ ဆိုပေမယ့် matching photo လေးရိုက်ထားတာမို့ အရမ်းကြိုက်လို့😚🤍 ချစ်စရာလေးဗျာ omg🥺🥺🥺 အယ် ပြီးတော့ သဲသဲ ဒါလေး fb မှာ ထားမယ်တဲ့ highlight တွေ ထည့်မယ်တို့ပြောပြီး လုပ်လည်းလုပ်ရသေးဘူး😞'
    },
    {
      img: '/photos/photo5.jpg',
      text: 'First Date တုန်းကပုံလေးကတော့ ထုံးစံအတိုင်း မမေ့မလျော့ ပါကိုပါမှရမှာ🙂‍↕️❤️❤️❤️ ချစ်ခွင့်ပန်တုန်းက “အင်း” လို့ဖြေခဲ့သူလေးမို့ ဒီပုံလေး မှတ်မှတ်ရရအမြဲဖြစ်နေပြီ🥺'
    }
  ]
};
// ============================================================================
// END OF CONFIGURATION - DO NOT TOUCH BELOW UNLESS YOU WANT TO CHANGE UI
// ============================================================================

type FloatingHeart = {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: number;
  opacity: number;
};

type TwinkleStar = {
  id: number;
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
};

export default function BirthdayMicrosite() {
  const [phase, setPhase] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [stars, setStars] = useState<TwinkleStar[]>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [muted, setMuted] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [queueSrc, setQueueSrc] = useState(CONFIG.music.afterBirthdayQueue[0]);

  const calmAudioRef = useRef<HTMLAudioElement>(null);
  const hbdAudioRef = useRef<HTMLAudioElement>(null);
  const queueAudioRef = useRef<HTMLAudioElement>(null);
  const queueIndexRef = useRef(0);

  // --- BACKGROUND GENERATOR ---
  useEffect(() => {
    setHearts(
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 5 + 5}s`,
        animationDelay: `${Math.random() * 5}s`,
        size: Math.random() * 10 + 10,
        opacity: Math.random() * 0.5 + 0.3
      }))
    );

    setStars(
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 2}s`
      }))
    );
  }, []);

  // --- MUTE / UNMUTE ---
  useEffect(() => {
    if (calmAudioRef.current) calmAudioRef.current.muted = muted;
    if (hbdAudioRef.current) hbdAudioRef.current.muted = muted;
    if (queueAudioRef.current) queueAudioRef.current.muted = muted;
  }, [muted]);

  // --- COUNTDOWN LOGIC ---
  useEffect(() => {
    if (phase !== 1) return;

    const targetTime = new Date(CONFIG.TARGET_DATE_MYANMAR).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

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

  // --- AUTO MOVE FROM REVEAL TO LETTER AFTER 60 SECONDS ---
  useEffect(() => {
    if (phase !== 2) return;

    const timeout = setTimeout(() => {
      setPhase(3);
    }, 60000);

    return () => clearTimeout(timeout);
  }, [phase]);

  const playQueueFromStart = () => {
  queueIndexRef.current = 0;
  const firstTrack = CONFIG.music.afterBirthdayQueue[0];

  setQueueSrc(firstTrack);

  setTimeout(() => {
    if (!queueAudioRef.current) return;

    queueAudioRef.current.volume = 0.45;
    queueAudioRef.current.currentTime = 0;
    queueAudioRef.current.play().catch((e) => console.log('Queue audio blocked:', e));
  }, 80);
};

  const playNextQueueTrack = () => {
    queueIndexRef.current =
      (queueIndexRef.current + 1) % CONFIG.music.afterBirthdayQueue.length;

    const nextTrack = CONFIG.music.afterBirthdayQueue[queueIndexRef.current];
    setQueueSrc(nextTrack);

    setTimeout(() => {
      if (!queueAudioRef.current) return;

      queueAudioRef.current.volume = 0.45;
      queueAudioRef.current.currentTime = 0;
      queueAudioRef.current.play().catch((e) => console.log('Queue audio blocked:', e));
    }, 80);
  };

  // --- ACTIONS ---
  const handleEnterGate = () => {
    if (calmAudioRef.current) {
      calmAudioRef.current.volume = 0.5;
      calmAudioRef.current.play().catch((e) => console.log('Audio blocked:', e));
    }
    setPhase(1);
  };

  const triggerMidnight = () => {
    setPhase(2);

    if (calmAudioRef.current) calmAudioRef.current.pause();
    if (queueAudioRef.current) queueAudioRef.current.pause();

    if (hbdAudioRef.current) {
      hbdAudioRef.current.volume = 0.7;
      hbdAudioRef.current.currentTime = 0;
      hbdAudioRef.current.play().catch((e) => console.log('Audio blocked:', e));
    }

    // Confetti Explosion
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const interval = setInterval(() => {
      const remaining = animationEnd - Date.now();

      if (remaining <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (remaining / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleNextCarousel = () => {
    setCarouselIdx((prev) => (prev + 1) % CONFIG.carousel.length);
  };

  const handlePrevCarousel = () => {
    setCarouselIdx((prev) => (prev - 1 + CONFIG.carousel.length) % CONFIG.carousel.length);
  };

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center relative overflow-hidden font-serif text-rose-950">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,rgba(251,113,133,0.16),transparent_32%),radial-gradient(circle_at_20%_25%,rgba(253,186,116,0.10),transparent_24%),radial-gradient(circle_at_80%_70%,rgba(244,114,182,0.12),transparent_28%)]" />
      {/* --- HIDDEN AUDIO --- */}
      <audio ref={calmAudioRef} src={CONFIG.music.calm} loop />

      <audio
        ref={hbdAudioRef}
        src={CONFIG.music.birthday}
        onEnded={() => {
          playQueueFromStart();
        }}
      />

      <audio
        ref={queueAudioRef}
        src={queueSrc}
        onEnded={() => {
          playNextQueueTrack();
        }}
      />

      {/* --- SOUND CONTROL --- */}
      {phase !== 0 && (
        <button
          onClick={() => setMuted((m) => !m)}
          className="fixed top-5 right-5 z-50 rounded-full bg-white/80 px-4 py-2 text-sm text-rose-700 shadow-lg border border-rose-100 backdrop-blur-md hover:bg-white transition-all font-sans"
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
        >
          {muted ? '🔇 Sound off' : '🔊 Sound on'}
        </button>
      )}

      {/* --- BACKGROUND PARTICLES --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star) => (
          <div
            key={`star-${star.id}`}
            className="absolute w-1.5 h-1.5 bg-yellow-200 rotate-45 animate-twinkle rounded-sm shadow-[0_0_5px_#fef08a]"
            style={{
              top: star.top,
              left: star.left,
              animationDuration: star.animationDuration,
              animationDelay: star.animationDelay
            }}
          />
        ))}

        {hearts.map((heart) => (
          <svg
            key={`heart-${heart.id}`}
            className="absolute text-rose-300 animate-float drop-shadow-sm"
            style={
              {
                left: heart.left,
                width: heart.size,
                height: heart.size,
                animationDuration: heart.animationDuration,
                animationDelay: heart.animationDelay,
                '--target-opacity': heart.opacity
              } as React.CSSProperties
            }
            viewBox="0 0 24 24"
            fill="currentColor"
          >
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
              <h2 className="text-4xl md:text-5xl italic text-rose-600 font-medium tracking-wide">
                {CONFIG.gate.title}
              </h2>

              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-light tracking-wide">
                  {CONFIG.gate.subtitle1}
                </p>
                <p className="text-2xl md:text-3xl font-light tracking-wide">
                  {CONFIG.gate.subtitle2}
                </p>
              </div>
            </div>

            <div className="pt-8 flex flex-col items-center gap-4">
              <button
                onClick={handleEnterGate}
                className="px-10 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xl shadow-[0_0_25px_rgba(225,29,72,0.4)] transition-all hover:scale-105 active:scale-95 font-sans font-medium tracking-wide"
              >
                {CONFIG.gate.buttonText}
              </button>

              <span className="text-xs tracking-[0.3em] uppercase text-rose-400/80 font-sans">
                {CONFIG.gate.hintText}
              </span>
            </div>
          </div>
        )}

        {/* ================= PHASE 1: COUNTDOWN ================= */}
        {phase === 1 && (
          <div className="text-center animate-in fade-in zoom-in duration-700 space-y-8 rounded-[32px] px-10 py-8 bg-white/20 backdrop-blur-[2px] border border-white/30 shadow-[0_30px_90px_rgba(244,63,94,0.08)]">
            <h2 className="text-2xl md:text-3xl italic text-rose-500 font-light">
              {CONFIG.countdown.title}
            </h2>

            <div className="flex gap-4 md:gap-8 justify-center font-sans">
              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-7xl font-bold text-rose-600 drop-shadow-sm">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-rose-400 mt-2">
                  Hours
                </span>
              </div>

              <span className="text-4xl md:text-6xl font-bold text-rose-300 mt-1 animate-pulse">
                :
              </span>

              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-7xl font-bold text-rose-600 drop-shadow-sm">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-rose-400 mt-2">
                  Minutes
                </span>
              </div>

              <span className="text-4xl md:text-6xl font-bold text-rose-300 mt-1 animate-pulse">
                :
              </span>

              <div className="flex flex-col items-center">
                <span className="text-5xl md:text-7xl font-bold text-rose-600 drop-shadow-sm">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-rose-400 mt-2">
                  Seconds
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ================= PHASE 2: MIDNIGHT REVEAL ================= */}
        {phase === 2 && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-8">
            <h1
              className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400 drop-shadow-lg p-4"
              dangerouslySetInnerHTML={{ __html: CONFIG.reveal.title }}
            />

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => setPhase(3)}
                className="mt-4 px-8 py-3 border-2 border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white rounded-full text-lg transition-all hover:scale-105 active:scale-95 font-sans tracking-wide"
              >
                {CONFIG.reveal.buttonText}
              </button>

              <p className="text-sm text-rose-400 font-sans tracking-wide">
                or wait a little… I’ll take you there ✨
              </p>
            </div>
          </div>
        )}

        {/* ================= PHASE 3: LETTER & CAROUSEL ================= */}
        {phase === 3 && (
          <div className="w-full h-screen overflow-y-auto custom-scrollbar animate-in fade-in duration-700 absolute top-0 left-0 pt-16 md:pt-20">
            <div className="w-full max-w-5xl mx-auto pb-32 flex flex-col items-center px-4">
              {/* Letter Header */}
              <div className="text-center mb-8">
                <p className="text-sm uppercase tracking-[0.35em] text-rose-400 font-sans mb-3">
                  my letter to you
                </p>
                <h1 className="text-4xl md:text-5xl text-rose-900 italic">
                  For you, on your 20th birthday
                </h1>
              </div>

              {/* The Letter */}
              <div className="bg-white/85 backdrop-blur-md p-8 md:p-12 rounded-[28px] shadow-xl border border-rose-100 mb-20 w-full max-w-4xl transform rotate-1 hover:rotate-0 transition-transform">
                <p className="text-lg md:text-xl leading-loose whitespace-pre-line text-gray-700 font-sans font-light">
                  {CONFIG.letterText}
                </p>
              </div>

              {/* Carousel Header */}
              <div className="text-center mb-12">
                <p className="text-sm uppercase tracking-[0.35em] text-rose-400 font-sans mb-3">
                  little memories
                </p>
                <h2 className="text-3xl md:text-4xl text-rose-900 italic">
                  Some of my favorite pictures of you
                </h2>
              </div>

              {/* The Floating Photo Album / Diary Carousel */}
              <div className="w-full relative mb-28">
                <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 relative">
                  {/* Left: Floating Polaroid Photo */}
                  <div className="polaroid-photo relative bg-white p-4 pb-14 rounded-[10px] border border-white/80 transform -rotate-3 md:-translate-y-6 hover:-rotate-1 hover:scale-[1.02] transition-all duration-500 z-10 w-[min(88vw,380px)] md:w-[430px] shrink-0">
                    <div className="w-full aspect-[4/5] bg-rose-50 rounded-[6px] overflow-hidden">
                      {imageErrors[carouselIdx] ? (
                        <div className="h-full flex items-center justify-center text-center text-rose-600 px-8">
                          <p className="font-serif italic text-xl">
                            Photo {carouselIdx + 1}
                            <br />
                            coming soon ♡
                          </p>
                        </div>
                      ) : (
                        <img
                          src={CONFIG.carousel[carouselIdx].img}
                          alt={`Favorite memory ${carouselIdx + 1}`}
                          className="w-full h-full object-cover"
                          onError={() =>
                            setImageErrors((prev) => ({
                              ...prev,
                              [carouselIdx]: true
                            }))
                          }
                        />
                      )}
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-xs tracking-[0.28em] uppercase text-rose-300 font-sans">
                        memory {carouselIdx + 1} / {CONFIG.carousel.length}
                      </p>
                    </div>
                  </div>

                  {/* Right: Floating Diary Entry */}
                  <div className="diary-paper relative w-[min(92vw,440px)] md:w-[500px] min-h-[360px] rounded-[28px] px-7 py-10 md:px-10 md:py-12 transform rotate-2 md:translate-y-8 hover:rotate-1 hover:scale-[1.015] transition-all duration-500 z-20">
                    <div className="relative z-10">
                      <p className="diary-label text-[10px] uppercase text-rose-400/80 mb-5 font-sans">
                        why this is one of my favorites
                      </p>

                      <p className="diary-text text-rose-900 text-center whitespace-pre-line">
                        {CONFIG.carousel[carouselIdx].text}
                      </p>
                    </div>

                    <div className="absolute -top-3 -right-3 text-2xl rotate-12">♡</div>
                    <div className="absolute -bottom-4 left-8 text-yellow-300 text-xl">✦</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-14 flex items-center justify-center gap-6 z-30">
                  <button
                    onClick={handlePrevCarousel}
                    className="album-control w-12 h-12 rounded-full bg-white text-rose-600 hover:bg-rose-50 transition-all hover:scale-105 active:scale-95 font-sans"
                    aria-label="Previous memory"
                  >
                    ←
                  </button>

                  <div className="flex gap-2">
                    {CONFIG.carousel.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCarouselIdx(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === carouselIdx
                            ? 'bg-rose-500 scale-125'
                            : 'bg-rose-200 hover:bg-rose-300'
                        }`}
                        aria-label={`Go to memory ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextCarousel}
                    className="album-control w-12 h-12 rounded-full bg-white text-rose-600 hover:bg-rose-50 transition-all hover:scale-105 active:scale-95 font-sans"
                    aria-label="Next memory"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= DEV PREVIEW PANEL ================= */}
      {CONFIG.SHOW_PREVIEW && (
        <div className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-rose-200 shadow-2xl text-xs font-sans w-48">
          <p className="font-bold text-rose-800 mb-3 border-b border-rose-100 pb-1">
            🔧 DEV CONTROLS
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setPhase(0)}
              className={`px-3 py-2 rounded text-left transition-colors ${
                phase === 0 ? 'bg-rose-500 text-white shadow-sm' : 'hover:bg-rose-50 text-gray-600'
              }`}
            >
              0. Gate
            </button>

            <button
              onClick={() => setPhase(1)}
              className={`px-3 py-2 rounded text-left transition-colors ${
                phase === 1 ? 'bg-rose-500 text-white shadow-sm' : 'hover:bg-rose-50 text-gray-600'
              }`}
            >
              1. Countdown
            </button>

            <button
              onClick={() => triggerMidnight()}
              className={`px-3 py-2 rounded text-left transition-colors ${
                phase === 2 ? 'bg-rose-500 text-white shadow-sm' : 'hover:bg-rose-50 text-gray-600'
              }`}
            >
              2. Midnight Reveal
            </button>

            <button
              onClick={() => setPhase(3)}
              className={`px-3 py-2 rounded text-left transition-colors ${
                phase === 3 ? 'bg-rose-500 text-white shadow-sm' : 'hover:bg-rose-50 text-gray-600'
              }`}
            >
              3. Letter & Photos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
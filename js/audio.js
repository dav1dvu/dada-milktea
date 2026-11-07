/**
 * Dada Milktea - Web Audio & Sound Engine
 * Quản lý SFX tổng hợp Web Audio API, BGM nhạc nền và Haptic Feedback
 */

import { S, save } from './state.js';

let ac = null;
let noAc = false;
let master = null;
let musBus = null;
let sfxBus = null;
let bgmBus = null;

/**
 * Khởi tạo AudioContext an toàn đa trình duyệt
 */
function ctx() {
  if (ac || noAc) return ac;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  
  try {
    ac = new AudioCtx();
  } catch (e) {
    noAc = true;
    return null;
  }

  master = ac.createGain();
  master.gain.value = 0.9;
  master.connect(ac.destination);

  musBus = ac.createGain();
  musBus.gain.value = 0.0;
  musBus.connect(master);

  sfxBus = ac.createGain();
  sfxBus.gain.value = 0.85;
  sfxBus.connect(master);

  bgmBus = ac.createGain();
  bgmBus.gain.value = 0.0;
  bgmBus.connect(master);

  return ac;
}

/**
 * Mở khóa Web Audio context trên iOS Safari và Chrome Mobile
 */
export function unlock() {
  const c = ctx();
  if (!c) return;
  
  if (c.state === 'suspended') {
    c.resume().catch(() => {});
  }
  
  // iOS Safari trick: Phát một bộ đệm siêu ngắn để mở khóa kênh âm thanh phần cứng
  try {
    const silentBuf = c.createBuffer(1, 1, 22050);
    const src = c.createBufferSource();
    src.buffer = silentBuf;
    src.connect(c.destination);
    src.start(0);
  } catch (e) {}

  if (S.opts?.music && bgm.el && bgm.el.paused && bgm.cur && !bgm.bad) {
    bgm.el.play().catch(() => {});
  }
}

const note = (n) => 440 * Math.pow(2, (n - 69) / 12);

/**
 * Phát âm thanh dạng sóng tổng hợp
 */
function blip(freq, dur, type = 'sine', vol = 0.18, pitchMult = 0.0) {
  const c = ctx();
  if (!c || !S.opts?.sfx) return;

  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (pitchMult) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq * pitchMult), t0 + dur);
  }

  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  osc.connect(gain).connect(sfxBus);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/**
 * Phát âm thanh nhiễu trắng tổng hợp (tiếng đổ nước, lắc ly...)
 */
function noise(dur, vol = 0.12, cutoff = 800) {
  const c = ctx();
  if (!c || !S.opts?.sfx) return;

  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);

  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  }

  const src = c.createBufferSource();
  src.buffer = buf;

  const filter = c.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = cutoff;

  const gain = c.createGain();
  gain.gain.value = vol;

  src.connect(filter).connect(gain).connect(sfxBus);
  src.start();
}

/**
 * Bộ thư viện hiệu ứng âm thanh (SFX)
 */
export const sfx = {
  tap: () => blip(note(76), 0.07, 'triangle', 0.12),
  pick: () => blip(note(81), 0.09, 'sine', 0.14, 1.18),
  pour: () => noise(0.42, 0.07, 500),
  ice: () => {
    noise(0.1, 0.09, 2600);
    setTimeout(() => noise(0.08, 0.06, 3200), 70);
  },
  pearl: () => {
    blip(note(60), 0.06, 'sine', 0.1, 0.7);
    setTimeout(() => blip(note(55), 0.07, 'sine', 0.09, 0.7), 60);
  },
  serve: () => {
    [72, 76, 79].forEach((n, idx) => setTimeout(() => blip(note(n), 0.16, 'triangle', 0.14), idx * 70));
  },
  perfect: () => {
    [72, 76, 79, 84].forEach((n, idx) => setTimeout(() => blip(note(n), 0.22, 'sine', 0.16), idx * 80));
  },
  coin: () => {
    blip(note(88), 0.08, 'square', 0.08);
    setTimeout(() => blip(note(93), 0.14, 'square', 0.07), 70);
  },
  bad: () => {
    blip(note(52), 0.3, 'sawtooth', 0.11, 0.6);
  },
  leave: () => {
    blip(note(57), 0.18, 'triangle', 0.12, 0.55);
    setTimeout(() => blip(note(50), 0.26, 'triangle', 0.1, 0.6), 130);
  },
  levelup: () => {
    [67, 72, 76, 79, 84].forEach((n, idx) => setTimeout(() => blip(note(n), 0.3, 'triangle', 0.15), idx * 90));
  },
  day: () => {
    [60, 64, 67, 72].forEach((n, idx) => setTimeout(() => blip(note(n), 0.35, 'sine', 0.13), idx * 110));
  },
  bell: () => {
    blip(note(88), 0.45, 'sine', 0.1);
    setTimeout(() => blip(note(93), 0.55, 'sine', 0.08), 120);
  },
  nope: () => blip(note(58), 0.09, 'square', 0.05),
  pop: () => {
    blip(note(81), 0.06, 'sine', 0.1);
    setTimeout(() => blip(note(88), 0.09, 'sine', 0.08), 50);
  },
  whoosh: () => noise(0.22, 0.05, 1600),
  pump: () => {
    blip(note(64), 0.05, 'triangle', 0.09, 1.3);
    setTimeout(() => noise(0.12, 0.04, 1200), 40);
  },
  shake: () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => noise(0.05, 0.08, 2400 + i * 300), i * 70);
    }
  },
  star: () => {
    [84, 88, 91].forEach((n, idx) => setTimeout(() => blip(note(n), 0.25, 'sine', 0.09), idx * 80));
  },
  chime: () => {
    [96, 100, 103].forEach((n, idx) => setTimeout(() => blip(note(n), 0.7, 'sine', 0.05), idx * 90));
  },
  meow: () => blip(note(79), 0.35, 'triangle', 0.1, 1.35),
  woof: () => {
    blip(note(50), 0.1, 'square', 0.07, 0.8);
    setTimeout(() => blip(note(47), 0.14, 'square', 0.07, 0.8), 170);
  },
  squeak: () => {
    blip(note(98), 0.06, 'sine', 0.07);
    setTimeout(() => blip(note(101), 0.08, 'sine', 0.06), 90);
  },
  combo: () => {
    [79, 83, 86, 91].forEach((n, idx) => setTimeout(() => blip(note(n), 0.18, 'triangle', 0.1), idx * 70));
  }
};

// ======================== TỔNG HỢP NHẠC NỀN DỰ PHÒNG ========================
const PROG = [
  [53, 57, 60, 64],
  [52, 55, 59, 62],
  [50, 53, 57, 60],
  [48, 52, 55, 59]
];

let timer = null;
let step = 0;
let bar = 0;
let mel = null;
let nextT = 0;
let mood = 'prep';

const tempo = () => (mood === 'sell' ? 0.3 : 0.4);

function makeMel() {
  return PROG.map((chord) =>
    [1, 0, 0.5, 0, 0.8, 0, 0.45, 0.3].map((prob) =>
      Math.random() < prob
        ? chord[1 + Math.floor(Math.random() * 3)] + 12 + (Math.random() < 0.22 ? 12 : 0)
        : null
    )
  );
}

function voice(freq, t0, dur, type, vol, bus) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.03);
  gain.gain.setTargetAtTime(0.0001, t0 + dur, 0.04);
  osc.connect(gain).connect(bus);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noiseHat(t0) {
  const len = Math.floor(ac.sampleRate * 0.05);
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  }
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 6000;
  const gain = ac.createGain();
  gain.gain.value = 0.025;
  src.connect(filter).connect(gain).connect(musBus);
  src.start(t0);
}

function tick() {
  if (!ac) return;
  const tp = tempo();
  while (nextT < ac.currentTime + 0.3) {
    const chord = PROG[bar % 4];
    if (step === 0) {
      chord.forEach((n, idx) => voice(note(n - 12 + (idx ? 0 : 0)), nextT, tp * 7, 'sine', 0.035, musBus));
    }
    if (step % 2 === 0) {
      voice(note(chord[0] - 24), nextT, tp * 1.6, 'triangle', 0.05, musBus);
    }
    const mn = mel && mel[bar % 4] ? mel[bar % 4][step] : null;
    if (mn != null) {
      voice(note(mn), nextT, tp * 1.4, 'triangle', 0.045, musBus);
    }
    if (mood === 'sell' && step % 4 === 2) {
      noiseHat(nextT);
    }
    nextT += tp;
    if (++step >= 8) {
      step = 0;
      if (++bar % 4 === 0) mel = makeMel();
    }
  }
}

function synthStart() {
  const c = ctx();
  if (!c || timer) return;
  mel = makeMel();
  step = 0;
  bar = 0;
  nextT = c.currentTime + 0.1;
  timer = setInterval(tick, 120);
  fade(0.5);
}

function synthStop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  fade(0);
}

function fade(vol) {
  if (!musBus || !ac) return;
  musBus.gain.cancelScheduledValues(ac.currentTime);
  musBus.gain.setTargetAtTime(vol, ac.currentTime, 0.4);
}

// ======================== QUẢN LÝ BGM MP3 ========================
const TRACKS = [
  { f: 'carefree', n: 'Carefree', m: 'prep' },
  { f: 'easy-lemon', n: 'Easy Lemon', m: 'prep' },
  { f: 'life-of-riley', n: 'Life of Riley', m: 'sell' },
  { f: 'monkeys-spinning-monkeys', n: 'Monkeys Spinning Monkeys', m: 'sell' },
  { f: 'merry-go', n: 'Merry Go', m: 'sell' }
];

export const MUSIC_CREDIT =
  'Nhạc nền: ' +
  TRACKS.map((t) => t.n).join(', ') +
  ' của Kevin MacLeod (incompetech.com), giấy phép Creative Commons: By Attribution 4.0.';

const BGM_VOL = 0.42;
const bgm = {
  el: null,
  cur: null,
  bad: false,
  tok: 0
};

function bgmPick() {
  const list = TRACKS.filter((t) => t.m === mood);
  const diff = list.filter((t) => t !== bgm.cur);
  const pool = diff.length ? diff : list;
  return pool[Math.floor(Math.random() * pool.length)];
}

function bgmEl() {
  if (bgm.el) return bgm.el;
  const audio = new Audio();
  audio.preload = 'auto';

  audio.addEventListener('ended', () => {
    if (S.opts?.music && !bgm.bad) {
      bgmPlay(bgmPick());
    }
  });

  audio.addEventListener('error', () => {
    if (bgm.bad || !audio.src) return;
    bgm.bad = true;
    bgm.cur = null;
    if (S.opts?.music) synthStart();
  });

  const c = ctx();
  try {
    c.createMediaElementSource(audio).connect(bgmBus);
  } catch (e) {
    audio.volume = BGM_VOL;
    bgmBus = null;
  }

  bgm.el = audio;
  return audio;
}

function bgmFade(targetVol, dur = 0.25) {
  if (!ac || !bgmBus) return;
  bgmBus.gain.cancelScheduledValues(ac.currentTime);
  bgmBus.gain.setTargetAtTime(targetVol, ac.currentTime, dur);
}

function bgmPlay(track) {
  const el = bgmEl();
  const tok = ++bgm.tok;
  const wasPlaying = bgm.cur && !el.paused;
  bgm.cur = track;

  const doPlay = () => {
    if (tok !== bgm.tok || !S.opts?.music) return;
    el.src = './music/' + track.f + '.mp3';
    el.play().catch(() => {});
    bgmFade(BGM_VOL, 0.4);
  };

  if (wasPlaying) {
    bgmFade(0, 0.12);
    setTimeout(doPlay, 380);
  } else {
    doPlay();
  }
}

export function musicStart() {
  if (!S.opts?.music || !ctx()) return;
  if (bgm.bad) return synthStart();
  const el = bgmEl();
  if (bgm.cur && bgm.cur.m === mood) {
    if (el.paused) el.play().catch(() => {});
    bgmFade(BGM_VOL, 0.4);
    return;
  }
  bgmPlay(bgmPick());
}

export function musicStop() {
  synthStop();
  if (bgm.el && !bgm.el.paused) {
    bgmFade(0, 0.1);
    const el = bgm.el;
    setTimeout(() => {
      if (!S.opts?.music || document.hidden) {
        el.pause();
      }
    }, 350);
  }
}

export function nextTrack() {
  if (S.opts?.music && !bgm.bad) {
    bgmPlay(bgmPick());
  }
}

export function setMood(newMood) {
  if (newMood === mood) return;
  mood = newMood;
  if (mel) mel = makeMel();
  if (S.opts?.music && !bgm.bad && bgm.cur && bgm.cur.m !== newMood) {
    bgmPlay(bgmPick());
  }
}

export function toggleMusic() {
  S.opts.music = !S.opts.music;
  save();
  if (S.opts.music) musicStart();
  else musicStop();
  return S.opts.music;
}

export function toggleSfx() {
  S.opts.sfx = !S.opts.sfx;
  save();
  return S.opts.sfx;
}

export function buzz(duration = 12) {
  if (!S.opts?.haptic) return;
  const haptics = window.Capacitor?.Plugins?.Haptics;
  if (haptics) {
    haptics.impact({ style: duration > 20 ? 'MEDIUM' : 'LIGHT' }).catch(() => {});
    return;
  }
  try {
    navigator.vibrate?.(duration);
  } catch (e) {}
}

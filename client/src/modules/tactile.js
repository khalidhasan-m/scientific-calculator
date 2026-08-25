// Touch feedback: press state, optional vibration and lightweight browser-synthesized tap sound.
let audioContext;

function playTap() {
  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) return;

  try {
    audioContext ??= new Context();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.setValueAtTime(165, now);
    oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.05);
    gain.gain.setValueAtTime(0.018, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.06);
  } catch {
    // Audio feedback is optional when the browser blocks playback.
  }
}

function addRipple(target, event) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || target.tagName !== 'BUTTON') return;
  const rect = target.getBoundingClientRect();
  const diameter = Math.max(rect.width, rect.height) * 1.7;
  const ripple = document.createElement('span');
  ripple.className = 'tap-ripple';
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - rect.left - diameter / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - diameter / 2}px`;
  target.classList.add('ripple-host');
  target.append(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

export function addTactileFeedback(target, event) {
  target.classList.remove('is-pressed');
  void target.offsetWidth;
  target.classList.add('is-pressed');
  window.setTimeout(() => target.classList.remove('is-pressed'), 115);
  addRipple(target, event);
  if (navigator.vibrate) navigator.vibrate(7);
  playTap();
}

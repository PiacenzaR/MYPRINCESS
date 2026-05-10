// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== HAMBURGER MENU =====
const hamburger   = document.getElementById('navHamburger');
const mobileMenu  = document.getElementById('navMobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close menu when a link is tapped
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== MAIN PARTICLES =====
const pCanvas = document.getElementById('particles-canvas');
const pCtx    = pCanvas.getContext('2d');
let particles  = [];

function resizeParticles() {
  pCanvas.width  = window.innerWidth;
  pCanvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener('resize', resizeParticles);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x      = Math.random() * pCanvas.width;
    this.y      = Math.random() * pCanvas.height;
    this.size   = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = -Math.random() * 0.5 - 0.2;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color  = Math.random() > 0.5 ? '#ff4d6d' : '#ffb3c1';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity -= 0.001;
    if (this.opacity <= 0 || this.y < -10) this.reset();
  }
  draw() {
    pCtx.save();
    pCtx.globalAlpha = this.opacity;
    pCtx.fillStyle   = this.color;
    pCtx.shadowBlur  = 6;
    pCtx.shadowColor = this.color;
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.restore();
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function animateParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== INTRO HEARTS =====
const iCanvas = document.getElementById('intro-hearts-canvas');
const iCtx    = iCanvas.getContext('2d');
iCanvas.width  = window.innerWidth;
iCanvas.height = window.innerHeight;
let introHearts = [];

class IntroHeart {
  constructor() { this.reset(); }
  reset() {
    this.x      = Math.random() * iCanvas.width;
    this.y      = iCanvas.height + 20;
    this.size   = Math.random() * 16 + 8;
    this.speed  = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.6 + 0.2;
    this.drift  = (Math.random() - 0.5) * 0.8;
    this.rot    = (Math.random() - 0.5) * 0.05;
    this.angle  = 0;
  }
  drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.3);
    ctx.bezierCurveTo(x - size * 0.5, y + size * 0.6, x, y + size * 0.9, x, y + size);
    ctx.bezierCurveTo(x, y + size * 0.9, x + size * 0.5, y + size * 0.6, x + size * 0.5, y + size * 0.3);
    ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.3);
    ctx.closePath();
  }
  update() {
    this.y     -= this.speed;
    this.x     += this.drift;
    this.angle += this.rot;
    if (this.y < -40) this.reset();
  }
  draw() {
    iCtx.save();
    iCtx.globalAlpha = this.opacity;
    iCtx.translate(this.x, this.y);
    iCtx.rotate(this.angle);
    iCtx.fillStyle   = '#ff4d6d';
    iCtx.shadowBlur  = 15;
    iCtx.shadowColor = '#ff4d6d';
    this.drawHeart(iCtx, -this.size / 2, -this.size / 2, this.size);
    iCtx.fill();
    iCtx.restore();
  }
}

for (let i = 0; i < 25; i++) {
  const h = new IntroHeart();
  h.y = Math.random() * iCanvas.height;
  introHearts.push(h);
}

function animateIntroHearts() {
  iCtx.clearRect(0, 0, iCanvas.width, iCanvas.height);
  introHearts.forEach(h => { h.update(); h.draw(); });
  if (!document.getElementById('intro').classList.contains('hidden'))
    requestAnimationFrame(animateIntroHearts);
}
animateIntroHearts();

// ===== INTRO SEQUENCE =====
// ===== BOUQUET + INTRO SEQUENCE =====
const messages = ['msg1', 'msg2', 'msg3', 'msg4', 'msg5'];
let currentMsg = 0;

// ── Music helpers ──
function fadeVolumeTo(audio, target, durationMs) {
  const steps = 80;
  const ms    = durationMs / steps;
  const start = audio.volume;
  const delta = (start - target) / steps;
  const fade  = setInterval(() => {
    if (audio.volume - delta > target) {
      audio.volume = Math.max(0, parseFloat((audio.volume - delta).toFixed(4)));
    } else {
      audio.volume = target;
      clearInterval(fade);
    }
  }, ms);
}

function startMusic() {
  const audio = document.getElementById('bgMusic');
  if (isPlaying) return; // já tocando, não reinicia
  audio.loop   = true;
  audio.volume = 0;
  audio.play().catch(() => {});
  isPlaying = true;
  document.getElementById('playBtn').textContent = '⏸';
  document.getElementById('musicCover').classList.add('playing');
  document.getElementById('musicPlayer').classList.add('playing');
  // Fade in suave até 0.75
  let v = 0;
  const ramp = setInterval(() => {
    v = Math.min(0.75, v + 0.015);
    audio.volume = parseFloat(v.toFixed(3));
    if (v >= 0.75) clearInterval(ramp);
  }, 40); // ~2s para chegar a 0.75
}

function fadeToAmbient() {
  const audio = document.getElementById('bgMusic');
  fadeVolumeTo(audio, 0.22, 4000);
}

// ── Petal burst ──
function spawnPetals() {
  const petals = ['🌸','🌹','🌺','💮'];
  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'petal';
      p.textContent = petals[Math.floor(Math.random() * petals.length)];
      p.style.left = (5 + Math.random() * 90) + 'vw';
      p.style.top  = '-40px';
      p.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem';
      p.style.animationDuration = (3 + Math.random() * 3) + 's';
      p.style.animationDelay = (Math.random() * 0.5) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 7000);
    }, i * 80);
  }
}

// ── Animate flowers blooming sequentially on each flap ──
function animateFlowers() {
  return new Promise(resolve => {
    // All flower SVGs and leaves inside each flap
    const leftFlowers  = document.querySelectorAll('.flap-left  .fl, .flap-left  .leaf, .flap-left  .stem');
    const rightFlowers = document.querySelectorAll('.flap-right .fl, .flap-right .leaf, .flap-right .stem');

    // Start hidden via inline style
    [...leftFlowers, ...rightFlowers].forEach(el => {
      el.style.opacity = '0';
      if (el.classList.contains('fl')) {
        el.style.transform = (el.style.transform || '') + ' scale(0.3)';
      } else {
        // stems and leaves grow from bottom
        el.style.transform = (el.style.transform || '') + ' scaleY(0.1)';
      }
      el.style.transition = 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.34,1.56,0.64,1)';
    });

    // Reveal stems first, then flowers staggered
    const allLeft  = [...leftFlowers];
    const allRight = [...rightFlowers];

    // Helper to reveal one element
    const reveal = (el, delay) => setTimeout(() => {
      el.style.opacity = '1';
      if (el.classList.contains('fl')) {
        el.style.transform = el.style.transform.replace('scale(0.3)', 'scale(1)');
        setTimeout(() => {
          el.style.animation = 'flowerBloom 1.2s ease-in-out';
        }, 300);
      } else {
        el.style.transform = el.style.transform.replace('scaleY(0.1)', 'scaleY(1)');
      }
    }, delay);

    // Stagger: 120ms apart, stems first
    let t = 200;
    allLeft.forEach(el  => { reveal(el, t); t += 110; });
    t = 350; // slight offset so right side staggers vs left (more natural)
    allRight.forEach(el => { reveal(el, t); t += 110; });

    // Resolve after all flowers are revealed + a short pause to admire them
    const totalTime = 350 + allRight.length * 110 + 1000;
    setTimeout(resolve, totalTime);
  });
}

// ── Bouquet open → message appears → music starts ──
function runBouquetIntro() {
  const flapL   = document.getElementById('flapLeft');
  const flapR   = document.getElementById('flapRight');
  const msg     = document.getElementById('bouquetMessage');
  const bouquet = document.getElementById('bouquetIntro');

  // Step 1 — short pause, then flowers bloom sequentially
  setTimeout(async () => {
    await animateFlowers();

    // Step 2 — flaps slide open
    flapL.classList.add('open');
    flapR.classList.add('open');
    spawnPetals();

    // Step 3 — after flaps finish opening (1.6s): show "Oi, Letícia" AND start music
    setTimeout(() => {
      msg.classList.add('visible');
      startMusic();   // ← música começa aqui, junto com a mensagem

      // Step 4 — after reading time: fade out and start cinematic sequence
      setTimeout(() => {
        msg.classList.remove('visible');
        setTimeout(() => {
          bouquet.classList.add('hidden');
          setTimeout(() => {
            bouquet.style.display = 'none';
            showNextMessage();
          }, 1200);
        }, 400);
      }, 2800);

    }, 1700);
  }, 600);
}

// ── Cinematic messages (msg2 → msg5) ──
// msg1 was already shown in bouquet, so we start from msg2
function showNextMessage() {
  // Skip msg1 (already used in bouquet), start from msg2
  if (currentMsg === 0) currentMsg = 1;

  if (currentMsg > 1) {
    const prev = document.getElementById(messages[currentMsg - 1]);
    if (prev) {
      prev.classList.add('fading');
      setTimeout(() => prev.classList.remove('visible', 'fading'), 800);
    }
  }

  if (currentMsg < messages.length) {
    setTimeout(() => {
      const el = document.getElementById(messages[currentMsg]);
      if (el) el.classList.add('visible');
      currentMsg++;

      if (currentMsg < messages.length) {
        setTimeout(showNextMessage, 2800);
      } else {
        // Última mensagem mostrada → exibe botão de continuar
        // (volume cai para ambiente quando clicar pra entrar)
        setTimeout(() => {
          document.getElementById('introContinue').style.display = 'block';
        }, 2200);
      }
    }, 400);
  }
}

// ── Enter site ──
function enterSite() {
  const intro = document.getElementById('intro');
  const main  = document.getElementById('main-site');
  // Volume cai para ambiente ao entrar na tela principal
  fadeToAmbient();
  intro.classList.add('hidden');
  setTimeout(() => {
    intro.style.display = 'none';
    main.classList.add('visible');
    startLetterAnimation();
  }, 1500);
}

document.getElementById('intro').addEventListener('click', () => {
  if (document.getElementById('introContinue').style.display === 'block') {
    enterSite();
  }
});

// ── Kick everything off ──
runBouquetIntro();

// ===== MODAL =====
function openModal(text) {
  document.getElementById('modalText').textContent = text;
  document.getElementById('modalOverlay').classList.add('open');
  spawnFloatingHearts();
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modalOverlay') || !e.target) {
    document.getElementById('modalOverlay').classList.remove('open');
  }
}

// ===== FLOATING HEARTS =====
function spawnFloatingHearts() {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'floating-heart';
      h.textContent = '♥';
      h.style.left   = (20 + Math.random() * 60) + 'vw';
      h.style.top    = (40 + Math.random() * 40) + 'vh';
      h.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
      h.style.animationDuration = (2 + Math.random() * 2) + 's';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 4000);
    }, i * 200);
  }
}

document.addEventListener('click', e => {
  if (
    e.target.closest('#main-site') &&
    !e.target.closest('.polaroid') &&
    !e.target.closest('.love-card') &&
    !e.target.closest('.music-player') &&
    !e.target.closest('nav')
  ) {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = '♥';
    h.style.left   = e.clientX + 'px';
    h.style.top    = e.clientY + 'px';
    h.style.position = 'fixed';
    h.style.fontSize = '1.2rem';
    h.style.animationDuration = '2s';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2000);
  }
});

// ===== MUSIC PLAYER =====
let isPlaying = false;

function togglePlay() {
  const audio  = document.getElementById('bgMusic');
  const btn    = document.getElementById('playBtn');
  const cover  = document.getElementById('musicCover');
  const player = document.getElementById('musicPlayer');
  if (isPlaying) {
    audio.pause();
    btn.textContent = '▶';
    cover.classList.remove('playing');
    player.classList.remove('playing');
  } else {
    audio.play().catch(() => {});
    btn.textContent = '⏸';
    cover.classList.add('playing');
    player.classList.add('playing');
  }
  isPlaying = !isPlaying;
}

// ===== LETTER TYPEWRITER =====
const letterText = `Você chegou devagar, sem fazer barulho...
e conquistou tudo em mim.

Você me faz bem, me faz feliz,
me faz querer ficar.

Nunca imaginei que alguém pudesse me fazer
sentir tanto assim, com tão pouco.

Um olhar seu e tudo fica mais fácil.
Uma palavra sua e o mundo fica mais gentil.

Obrigado por existir.
Obrigado por ser você.
Obrigado por me escolher.`;

let letterIndex    = 0;
let letterAnimating = false;

function startLetterAnimation() {
  const letterSection = document.querySelector('.letter-section');
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !letterAnimating) {
      letterAnimating = true;
      typeNextChar();
    }
  }, { threshold: 0.3 });
  observer.observe(letterSection);
}

function typeNextChar() {
  const el = document.getElementById('letterBody');
  if (letterIndex < letterText.length) {
    const char = letterText[letterIndex];
    el.innerHTML += char === '\n' ? '<br>' : char;
    letterIndex++;
    const delay = (char === '.' || char === '!' || char === '?') ? 180 : 50;
    setTimeout(typeNextChar, delay);
  } else {
    document.getElementById('letterSignature').style.opacity = '1';
  }
}

// ===== COUNTER =====
// 🔧 Altere a data de início do relacionamento aqui (Ano, Mês-1, Dia)
const startDate = new Date(2024, 0, 1); // Ex: 1 de janeiro de 2024

function updateCounter() {
  const now  = new Date();
  const diff = now - startDate;
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  document.getElementById('days').textContent    = String(d).padStart(3, '0');
  document.getElementById('hours').textContent   = String(h).padStart(2, '0');
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
}
setInterval(updateCounter, 1000);
updateCounter();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ===== GALLERY DRAG SCROLL =====
const galleryScroll = document.getElementById('galleryScroll');
let isDown = false, startX, scrollLeft;

galleryScroll.addEventListener('mousedown', e => {
  isDown = true;
  startX = e.pageX - galleryScroll.offsetLeft;
  scrollLeft = galleryScroll.scrollLeft;
});
galleryScroll.addEventListener('mouseleave', () => isDown = false);
galleryScroll.addEventListener('mouseup',    () => isDown = false);
galleryScroll.addEventListener('mousemove',  e => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - galleryScroll.offsetLeft;
  galleryScroll.scrollLeft = scrollLeft - (x - startX) * 1.5;
});

// ===== PERIODIC FLOATING HEARTS =====
setInterval(() => {
  if (document.getElementById('main-site').classList.contains('visible')) {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = Math.random() > 0.5 ? '♥' : '❤';
    h.style.left   = (Math.random() * 100) + 'vw';
    h.style.top    = (60 + Math.random() * 40) + 'vh';
    h.style.fontSize = (0.5 + Math.random() * 0.8) + 'rem';
    h.style.opacity  = '0.3';
    h.style.animationDuration = (3 + Math.random() * 3) + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 6000);
  }
}, 2000);


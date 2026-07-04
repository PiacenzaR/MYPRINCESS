// ============================================================
//  SEQUÊNCIA CORRIGIDA DA INTRO
// ============================================================
const sequence = [
  { type: 'msg', id: 'msg1', duration: 2800 },      // "Oi, Letícia ❤️"
  { type: 'msg', id: 'msg2', duration: 2800 },      // "Esse lugar foi feito pra você."
  { type: 'msg', id: 'msg3', duration: 2800 },      // "Cada momento com você é especial. ♥"
  { type: 'msg', id: 'msg4', duration: 2800 },      // "Eu só queria te lembrar o quanto eu amo você."
  { type: 'msg', id: 'msg5', duration: 2800 },      // "Obrigado por existir."
  { type: 'polaroid', id: 'polaroidMemory', duration: 4000 },  // Polaroid sobe, fica 4s
  { type: 'msg', id: 'msgFinal', duration: 0 }      // Mensagem final (espera clique)
];

// ============================================================
//  STATE
// ============================================================
let audioInstance = null;
let musicStarted = false;
let isPlaying = false;
let activeFade = null;

let currentStep = 0;
let currentItemEl = null;
let introPhase = 'idle';
let stepTimer = null;
let clickHandlerActive = false;

// ============================================================
//  CURSOR
// ============================================================
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function animateCursor() {
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
  rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
  if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
  requestAnimationFrame(animateCursor);
})();

// ============================================================
//  HAMBURGER
// ============================================================
const hamburger = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('navMobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }));
}

// ============================================================
//  PARTICLES
// ============================================================
const pCanvas = document.getElementById('particles-canvas');
if (pCanvas) {
  const pCtx = pCanvas.getContext('2d');
  const particles = [];
  function resizeP() { pCanvas.width = innerWidth; pCanvas.height = innerHeight; }
  resizeP();
  window.addEventListener('resize', resizeP);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * pCanvas.width;
      this.y = Math.random() * pCanvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.sx = (Math.random() - 0.5) * 0.3;
      this.sy = -Math.random() * 0.5 - 0.2;
      this.op = Math.random() * 0.5 + 0.1;
      this.col = Math.random() > 0.5 ? '#ff4d6d' : '#ffb3c1';
    }
    update() {
      this.x += this.sx;
      this.y += this.sy;
      this.op -= 0.001;
      if (this.op <= 0 || this.y < -10) this.reset();
    }
    draw() {
      pCtx.save();
      pCtx.globalAlpha = this.op;
      pCtx.fillStyle = this.col;
      pCtx.shadowBlur = 6;
      pCtx.shadowColor = this.col;
      pCtx.beginPath();
      pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      pCtx.fill();
      pCtx.restore();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());
  (function animP() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animP);
  })();
}

// ============================================================
//  INTRO HEARTS
// ============================================================
const iCanvas = document.getElementById('intro-hearts-canvas');
if (iCanvas) {
  const iCtx = iCanvas.getContext('2d');
  iCanvas.width = innerWidth;
  iCanvas.height = innerHeight;
  const introHearts = [];

  class IHeart {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * iCanvas.width;
      this.y = iCanvas.height + 20;
      this.size = Math.random() * 16 + 8;
      this.speed = Math.random() * 1.5 + 0.5;
      this.op = Math.random() * 0.6 + 0.2;
      this.drift = (Math.random() - 0.5) * 0.8;
      this.angle = 0;
      this.rot = (Math.random() - 0.5) * 0.05;
    }
    drawH(ctx, x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y, x - s * .5, y, x - s * .5, y + s * .3);
      ctx.bezierCurveTo(x - s * .5, y + s * .6, x, y + s * .9, x, y + s);
      ctx.bezierCurveTo(x, y + s * .9, x + s * .5, y + s * .6, x + s * .5, y + s * .3);
      ctx.bezierCurveTo(x + s * .5, y, x, y, x, y + s * .3);
      ctx.closePath();
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      this.angle += this.rot;
      if (this.y < -40) this.reset();
    }
    draw() {
      iCtx.save();
      iCtx.globalAlpha = this.op;
      iCtx.translate(this.x, this.y);
      iCtx.rotate(this.angle);
      iCtx.fillStyle = '#ff4d6d';
      iCtx.shadowBlur = 15;
      iCtx.shadowColor = '#ff4d6d';
      this.drawH(iCtx, -this.size / 2, -this.size / 2, this.size);
      iCtx.fill();
      iCtx.restore();
    }
  }

  for (let i = 0; i < 25; i++) {
    const h = new IHeart();
    h.y = Math.random() * iCanvas.height;
    introHearts.push(h);
  }
  (function animIH() {
    iCtx.clearRect(0, 0, iCanvas.width, iCanvas.height);
    introHearts.forEach(h => { h.update(); h.draw(); });
    const intro = document.getElementById('intro');
    if (intro && !intro.classList.contains('hidden')) requestAnimationFrame(animIH);
  })();
}

// ============================================================
//  AUDIO - COM SUPORTE PARA CELULAR
// ============================================================
function fadeVolumeTo(target, duration) {
  if (!audioInstance) return;
  if (activeFade) activeFade.cancelled = true;
  const fade = { cancelled: false };
  activeFade = fade;
  const start = audioInstance.volume;
  const change = target - start;
  const t0 = performance.now();

  function step(now) {
    if (fade.cancelled) return;
    const p = Math.min((now - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    audioInstance.volume = Math.max(0, Math.min(1, start + change * eased));
    if (p < 1) requestAnimationFrame(step);
    else activeFade = null;
  }
  requestAnimationFrame(step);
}

function updateMusicUI(isPlayingState) {
  isPlaying = isPlayingState;
  const btn = document.getElementById('playBtn');
  const cover = document.getElementById('musicCover');
  const player = document.getElementById('musicPlayer');
  if (btn) btn.textContent = isPlayingState ? '⏸' : '▶';
  if (cover) {
    if (isPlayingState) cover.classList.add('playing');
    else cover.classList.remove('playing');
  }
  if (player) {
    if (isPlayingState) player.classList.add('playing');
    else player.classList.remove('playing');
  }
}

function startMusic() {
  if (musicStarted) return;
  musicStarted = true;

  const audio = document.getElementById('bgMusic');
  if (!audio) return;
  audioInstance = audio;
  audio.loop = true;
  audio.volume = 0.0;

  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        fadeVolumeTo(0.07, 2500);
        updateMusicUI(true);
      })
      .catch(() => {
        audio.volume = 0;
        const startAudioOnInteraction = function() {
          if (musicStarted && audioInstance) {
            audio.play()
              .then(() => {
                fadeVolumeTo(0.07, 2500);
                updateMusicUI(true);
              })
              .catch(e => console.log("Ainda não foi possível tocar:", e));
          }
          document.removeEventListener('click', startAudioOnInteraction);
          document.removeEventListener('touchstart', startAudioOnInteraction);
        };
        document.addEventListener('click', startAudioOnInteraction);
        document.addEventListener('touchstart', startAudioOnInteraction);
      });
  }
  
  updateMusicUI(true);
}

function riseToEmotion() { fadeVolumeTo(0.32, 4500); }
function approachPeak() { fadeVolumeTo(0.48, 3000); }
function peakEmotion() { fadeVolumeTo(0.62, 2500); }
function goAmbient() { fadeVolumeTo(0.15, 6000); }

// ============================================================
//  BOUQUET
// ============================================================
function spawnPetals() {
  const petals = ['🌸', '🌹', '🌺', '💮', '🌷'];
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'petal';
      p.textContent = petals[Math.floor(Math.random() * petals.length)];
      p.style.left = (3 + Math.random() * 94) + 'vw';
      p.style.top = '-40px';
      p.style.fontSize = (0.7 + Math.random() * 1.6) + 'rem';
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      p.style.animationDelay = (Math.random() * 0.6) + 's';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 8000);
    }, i * 70);
  }
}

function animateFlowers(bunchSelector) {
  const bunch = document.querySelector(bunchSelector);
  if (!bunch) return;
  bunch.querySelectorAll('.stem').forEach((s, i) => {
    setTimeout(() => {
      s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      s.style.opacity = '1';
    }, i * 60);
  });
  bunch.querySelectorAll('.fl').forEach((f, i) => {
    setTimeout(() => {
      const orig = f.style.transform || '';
      const noScale = orig.replace(/scale\([^)]*\)/g, '').trim();
      f.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)';
      f.style.opacity = '1';
      f.style.transform = noScale || 'none';
    }, 200 + i * 130);
  });
  bunch.querySelectorAll('.leaf').forEach((l, i) => {
    setTimeout(() => {
      l.style.transition = 'opacity 0.5s ease';
      l.style.opacity = '0.85';
    }, 300 + i * 80);
  });
}

function runBouquetIntro() {
  introPhase = 'bouquet';
  startMusic();
  animateFlowers('.left-bunch');
  animateFlowers('.right-bunch');

  setTimeout(() => {
    const fL = document.getElementById('flapLeft');
    const fR = document.getElementById('flapRight');
    if (fL) fL.classList.add('open');
    if (fR) fR.classList.add('open');
    spawnPetals();

    setTimeout(() => {
      const bMsg = document.getElementById('bouquetMessage');
      if (bMsg) bMsg.classList.add('visible');

      setTimeout(() => {
        if (bMsg) bMsg.classList.remove('visible');
        setTimeout(() => {
          const bouquet = document.getElementById('bouquetIntro');
          if (bouquet) {
            bouquet.classList.add('hidden');
            setTimeout(() => { bouquet.style.display = 'none'; }, 1300);
          }
          const intro = document.getElementById('intro');
          if (intro) intro.style.display = 'flex';
          introPhase = 'intro';
          setTimeout(showNextStep, 400);
        }, 500);
      }, 3200);
    }, 2300);
  }, 1800);
}

// ============================================================
//  SEQUÊNCIA DA INTRO
// ============================================================
function fadeOutCurrent(cb) {
  if (!currentItemEl) { if (cb) cb(); return; }
  currentItemEl.classList.add('fading');
  const el = currentItemEl;
  currentItemEl = null;
  setTimeout(() => {
    el.classList.remove('visible', 'fading');
    if (cb) cb();
  }, 600);
}

function showNextStep() {
  if (currentStep >= sequence.length) return;

  fadeOutCurrent(() => {
    if (currentStep >= sequence.length) return;

    const item = sequence[currentStep];
    const el = document.getElementById(item.id);
    if (!el) { currentStep++; setTimeout(showNextStep, 100); return; }

    el.classList.add('visible');
    currentItemEl = el;

    if (currentStep === 0) riseToEmotion();
    if (currentStep === sequence.length - 2) approachPeak();
    if (currentStep === sequence.length - 1) peakEmotion();

    const duration = item.duration || (item.type === 'msg' ? 2800 : 3500);
    currentStep++;

    if (currentStep < sequence.length) {
      stepTimer = setTimeout(showNextStep, duration);
    } else {
      setTimeout(() => {
        goAmbient();
        const continueBtn = document.getElementById('introContinue');
        if (continueBtn) continueBtn.style.display = 'block';
        introPhase = 'waitingClick';
        setupClickToEnter();
      }, 500);
    }
  });
}

// ============================================================
//  CLIQUE PARA ENTRAR
// ============================================================
let clickToEnterActive = false;

function setupClickToEnter() {
  if (clickToEnterActive) return;
  clickToEnterActive = true;
  
  const handler = function(e) {
    if (introPhase === 'waitingClick') {
      enterSite();
      document.removeEventListener('click', handler);
      document.removeEventListener('touchstart', handler);
      clickToEnterActive = false;
    }
  };
  
  document.addEventListener('click', handler);
  document.addEventListener('touchstart', handler);
}

// ============================================================
//  ENTRAR NO SITE
// ============================================================
function enterSite() {
  if (introPhase === 'entering' || introPhase === 'site') return;
  introPhase = 'entering';

  const intro = document.getElementById('intro');
  const main = document.getElementById('main-site');
  if (intro) intro.classList.add('hidden');
  goAmbient();

  setTimeout(() => {
    if (intro) intro.style.display = 'none';
    if (main) main.classList.add('visible');
    introPhase = 'site';
    
    // GERA UMA CARTA ALEATÓRIA NOVA AO ENTRAR
    currentLetterText = getRandomCarta();
    letterIndex = 0;
    letterAnimating = false;
    const letterBody = document.getElementById('letterBody');
    if (letterBody) letterBody.innerHTML = '';
    const sig = document.getElementById('letterSignature');
    if (sig) sig.style.opacity = '0';
    
    startLetterAnimation();
    setupImagesVisibility();
  }, 1500);
}

// ============================================================
//  CONFIGURAR VISIBILIDADE DAS IMAGENS
// ============================================================
function setupImagesVisibility() {
  const heroImg = document.getElementById('heroPhoto');
  const heroPlaceholder = document.getElementById('heroPlaceholder');
  if (heroImg && heroPlaceholder) {
    if (heroImg.complete && heroImg.naturalHeight !== 0) {
      heroImg.style.display = 'block';
      heroPlaceholder.style.display = 'none';
    } else {
      heroImg.onload = function() {
        heroImg.style.display = 'block';
        heroPlaceholder.style.display = 'none';
      };
      heroImg.onerror = function() {
        heroImg.style.display = 'none';
        heroPlaceholder.style.display = 'flex';
      };
    }
  }
  
  for (let i = 1; i <= 7; i++) {
    const img = document.getElementById(`polaroid${i}Img`);
    const placeholder = document.getElementById(`polaroid${i}Placeholder`);
    if (img && placeholder) {
      if (img.complete && img.naturalHeight !== 0) {
        img.style.display = 'block';
        placeholder.style.display = 'none';
      } else {
        img.onload = function() {
          img.style.display = 'block';
          placeholder.style.display = 'none';
        };
        img.onerror = function() {
          img.style.display = 'none';
          placeholder.style.display = 'flex';
        };
      }
    }
  }
}

// ============================================================
//  PLAYER
// ============================================================
function togglePlay() {
  if (!audioInstance) return;
  const btn = document.getElementById('playBtn');
  const cover = document.getElementById('musicCover');
  const player = document.getElementById('musicPlayer');
  if (isPlaying) {
    audioInstance.pause();
    if (btn) btn.textContent = '▶';
    if (cover) cover.classList.remove('playing');
    if (player) player.classList.remove('playing');
  } else {
    audioInstance.play().catch(() => {});
    if (btn) btn.textContent = '⏸';
    if (cover) cover.classList.add('playing');
    if (player) player.classList.add('playing');
  }
  isPlaying = !isPlaying;
}

// ============================================================
//  MODAL
// ============================================================
function openModal(text) {
  const modalText = document.getElementById('modalText');
  if (modalText) modalText.textContent = text;
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.add('open');
  spawnFloatingHearts();
}

function closeModal(e) {
  const overlay = document.getElementById('modalOverlay');
  if (!e || e.target === overlay || !e.target) {
    if (overlay) overlay.classList.remove('open');
  }
}

// ============================================================
//  FLOATING HEARTS
// ============================================================
function spawnFloatingHearts() {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'floating-heart';
      h.textContent = '♥';
      h.style.left = (20 + Math.random() * 60) + 'vw';
      h.style.top = (40 + Math.random() * 40) + 'vh';
      h.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
      h.style.animationDuration = (2 + Math.random() * 2) + 's';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 4000);
    }, i * 200);
  }
}

document.addEventListener('click', e => {
  const mainSite = document.getElementById('main-site');
  if (mainSite && mainSite.classList.contains('visible') &&
    !e.target.closest('.polaroid') &&
    !e.target.closest('.love-card') &&
    !e.target.closest('.music-player') &&
    !e.target.closest('nav')) {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = '♥';
    h.style.left = e.clientX + 'px';
    h.style.top = e.clientY + 'px';
    h.style.position = 'fixed';
    h.style.fontSize = '1.2rem';
    h.style.animationDuration = '2s';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2000);
  }
});

setInterval(() => {
  const mainSite = document.getElementById('main-site');
  if (mainSite && mainSite.classList.contains('visible')) {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = Math.random() > 0.5 ? '♥' : '❤';
    h.style.left = (Math.random() * 100) + 'vw';
    h.style.top = (60 + Math.random() * 40) + 'vh';
    h.style.fontSize = (0.5 + Math.random() * 0.8) + 'rem';
    h.style.opacity = '0.3';
    h.style.animationDuration = (3 + Math.random() * 3) + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 6000);
  }
}, 2000);

// ============================================================
//  LETTER TYPEWRITER - COM CARTAS ROMÂNTICAS ALEATÓRIAS
// ============================================================

const cartas = [
`Letícia, meu amor,
 
Hoje faz 76 dias desde que você entrou na minha vida…
 
E eu fico aqui, tentando entender como algo tão simples quanto te conhecer mudou tudo tão profundamente.
 
Cada um desses dias, mesmo os difíceis, valeu a pena porque foi ao seu lado.
 
Obrigado por existir.
 
Obrigado por me escolher.
 
Obrigado por me ensinar, dia após dia, o que é amar de verdade. ♥`,
 
`Meu amor,
 
Eu queria começar essas cartas te dizendo uma coisa simples, mas que carrega tudo o que eu sinto: eu te amo.
 
E eu sei que nem sempre mostrei isso do jeito que você merecia…
 
Mas hoje eu quero recomeçar.
 
Mostrando, com cada palavra, com cada gesto, o quanto você significa pra mim.
 
Obrigado por ainda estar aqui. ♥`,
 
`Amor,
 
Eu errei.
 
E eu sei que palavras não apagam o que eu fiz…
 
Mas eu preciso que você saiba, com toda a sinceridade que existe em mim: eu me arrependo de verdade.
 
Eu fui burro. Agi sem pensar no tamanho da dor que isso poderia te causar.
 
E isso não é quem eu quero ser pra você.
 
Me desculpa.
 
Eu vou fazer diferente. ♥`,
 
`Letícia,
 
Antes de qualquer coisa… eu preciso te pedir desculpas.
 
De coração. Sem desculpa esfarrapada. Sem "mas".
 
Eu te machuquei, e isso pesa em mim todos os dias, em cada momento de silêncio.
 
Você não merecia passar por isso.
 
Eu só espero, com toda a humildade que eu tenho, ter a chance de te mostrar que eu aprendi. ♥`,
 
`Meu amor,
 
Tem coisas que a gente só entende o valor quando quase perde…
 
E eu entendi.
 
Entendi o quanto você é importante.
 
O quanto eu te amo.
 
E o quanto dói saber que fui eu quem te machucou.
 
Me desculpa por ter sido burro.
 
Você merece muito mais cuidado do que eu te dei naquele momento. ♥`,
 
`Amor,
 
Eu queria voltar no tempo e mudar o que eu fiz…
 
Não posso.
 
Mas posso te prometer, com todas as minhas forças, que vou aprender com isso.
 
Você é a pessoa mais importante da minha vida.
 
E eu não quero, nunca mais, te ver triste por minha causa.
 
Perdão. De verdade. ♥`,
 
`Letícia,
 
Desde que a gente começou, cada dia com você foi um presente…
 
E é exatamente por te amar tanto que dói tanto saber que eu te decepcionei.
 
Eu sei que confiança se reconstrói com atitude, não só com palavras.
 
E é isso que eu quero fazer.
 
Todos os dias.
 
Um de cada vez.
 
Te amo. Me desculpa. ♥`,
 
`Meu amor,
 
Você merece alguém que pensa antes de agir…
 
Que cuida das suas palavras e do seu coração como quem cuida de algo raro.
 
Eu falhei nisso, e sinto muito.
 
Mas eu também quero que você saiba: o meu amor por você é real.
 
E eu vou trabalhar, com paciência e com verdade, pra ser a pessoa que você merece.
 
Obrigado por ainda me dar essa chance. ♥`,
 
`Amor,
 
Se eu pudesse resumir o que eu sinto agora, seria isto: arrependimento por ter te magoado… e gratidão por você ainda estar aqui.
 
Eu não quero só pedir desculpas.
 
Eu quero mostrar, dia após dia, gesto após gesto, que você pode confiar em mim de novo.
 
Eu te amo, Letícia. Mais do que ontem, menos do que amanhã. ♥`,
 
`Letícia, meu amor,
 
Eu passei um tempo pensando no que aconteceu…
 
E cheguei a uma conclusão simples: eu fui egoísta, e isso te machucou.
 
Você não merecia isso.
 
Ninguém que ama de verdade quer ver a pessoa amada sofrendo por causa das próprias falhas.
 
Me desculpa.
 
Eu vou ser melhor. Não porque eu preciso… mas porque você merece. ♥`,
 
`Meu amor,
 
Desde o dia em que você entrou na minha vida, tudo ganhou mais cor, mais sentido, mais brilho…
 
Seu sorriso é a luz que ilumina meus dias mais escuros.
 
Sua voz é a melodia que acalma minha alma.
 
Eu não sei o que seria de mim sem você ao meu lado.
 
Você me ensinou o que é amar de verdade.
 
Obrigado por cada abraço, cada risada, cada momento compartilhado.
 
Eu te amo mais do que palavras podem dizer. ♥`,
 
`Letícia,
 
Se existe uma coisa que eu tenho certeza nessa vida, é o amor que sinto por você.
 
Você chegou sem fazer barulho… e conquistou tudo em mim.
 
Seu jeito, seu olhar, sua essência… tudo em você me encanta.
 
Prometo cuidar de você, te fazer sorrir sempre, e te amar em todos os dias da minha vida.
 
Você é minha casa, meu porto seguro, meu amor para sempre. ♥`,
 
`Amor,
 
Eu sei que um erro pode abalar a confiança que a gente construiu…
 
E eu não quero minimizar isso.
 
Eu só quero que você saiba: eu estou disposto a reconstruir, tijolo por tijolo, o que eu balancei.
 
Sem pressa. No seu tempo.
 
Você vale esse esforço, e muito mais.
 
Me desculpa. ♥`,
 
`Minha vida mudou no dia que te conheci.
 
Antes de você, eu não sabia o que era sentir o coração bater mais forte…
 
Não sabia que era possível pensar em alguém o tempo todo.
 
Você despertou algo em mim que eu nem sabia que existia.
 
Quero estar ao seu lado em cada conquista, em cada desafio, em cada sonho realizado. ♥`,
 
`Letícia, meu amor,
 
Eu queria ter sido mais cuidadoso…
 
Mais presente. Mais atento ao que você sentia.
 
Não fui, e isso me machuca tanto quanto machucou você, só que de um jeito diferente: o meu vem da culpa de saber que eu poderia ter evitado.
 
Perdão.
 
E obrigado por me dar espaço pra consertar isso. ♥`,
 
`Amor,
 
Sabe aquela música que toca e te lembra alguém especial? Você é a música que toca dentro de mim o dia inteiro.
 
Sua presença transforma qualquer lugar especial.
 
Seu abraço é o único lugar onde eu me sinto completo.
 
Obrigado por existir.
 
Obrigado por me escolher, mesmo depois de tudo. ♥`,
 
`Letícia, meu amor,
 
Se eu pudesse escrever todas as estrelas do céu, ainda não seria o suficiente para descrever o que sinto por você…
 
Cada dia eu descubro um motivo novo para te amar mais.
 
E eu quero passar o resto da minha vida descobrindo esses motivos… e corrigindo os meus erros. ♥`,
 
`Meu amor,
 
Eu penso muito no que aconteceu…
 
E cada vez que penso, fica mais claro pra mim o tamanho do meu erro.
 
Eu não quero fugir disso, nem fingir que não foi nada.
 
Eu fiz besteira, e você mereceu mais respeito do que eu te dei.
 
Me desculpa. Do fundo do coração. ♥`,
 
`O que seria de mim sem você?
 
Talvez eu ainda estivesse perdido, sem saber o que é ser verdadeiramente feliz.
 
Você chegou e trouxe cor para um mundo que era cinza.
 
Você é meu maior presente, meu maior amor, minha maior certeza.
 
E eu prometo: vou te amar em todas as vidas que eu tiver. ♥`,
 
`Meu amor,
 
Sabe qual é o meu lugar favorito no mundo? É do seu lado.
 
Ali, onde seu braço me envolve e o mundo lá fora some…
 
Eu sei que magoei esse lugar, e isso me dói mais do que eu consigo explicar.
 
Eu quero voltar a ser esse porto seguro pra você.
 
Me desculpa. ♥`,
 
`Letícia,
 
Eu não vou inventar desculpa, nem tentar diminuir o que eu fiz.
 
Eu errei. Ponto.
 
O que eu posso fazer agora é mostrar, com atitude e paciência, que eu aprendi.
 
Que eu te respeito, e que eu quero merecer sua confiança de novo.
 
Te amo, e sinto muito. ♥`,
 
`Se um dia eu escrever um livro, cada página será sobre você.
 
Sobre como seu sorriso ilumina meu mundo.
 
Sobre como seu toque acalma minha alma.
 
Você me inspira a ser melhor todos os dias.
 
Por você, eu quero ser a melhor versão de mim mesmo.
 
Te amo infinitamente. ♥`,
 
`Quando eu te olho, eu vejo o meu futuro.
 
Vejo nossos planos, nossos sonhos, nossos dias de sol e até os dias de chuva…
 
E em todos eles, eu estou feliz porque você está comigo.
 
Nada nessa vida faz sentido sem você.
 
Obrigado por fazer sentido na minha vida. ♥`,
 
`Meu amor,
 
Eu queria que você soubesse que essa dor de ter te machucado não vai embora fácil…
 
E é justo que seja assim.
 
Mas eu prometo: vou usar essa dor pra crescer, pra prestar mais atenção, pra nunca mais te fazer sentir o que você sentiu.
 
Perdão, Letícia. ♥`,
 
`Existem amores que marcam, e existe você, que transformou tudo.
 
Antes de você, eu respirava.
 
Depois de você, eu aprendi a viver.
 
Você é a página mais bonita da minha história.
 
E eu quero continuar escrevendo essa história com você, consertando o que precisar ser consertado. ♥`,
 
`Amor,
 
Desculpa não é só uma palavra que eu digo e sigo em frente.
 
Pra mim, desculpa é ação, é mudança, é cuidado todos os dias daqui pra frente.
 
Eu vou te mostrar isso, no meu tempo, no seu tempo, do jeito que você precisar.
 
Eu te amo. ♥`,
 
`Letícia,
 
Eu amo o jeito que você sorri.
 
Amo o jeito que você fala.
 
Amo o jeito que você existe.
 
E é exatamente por te amar tanto que eu não me perdoo fácil por ter te magoado.
 
Mas eu vou continuar tentando, todos os dias, ser digno desse amor. ♥`,
 
`Meu amor,
 
Se tem uma coisa que eu tenho certeza hoje, é que eu quero viver muita coisa ainda ao seu lado, aprendendo com os meus erros.
 
Quero criar memórias novas com você, boas o suficiente pra deixar as ruins pra trás, sem apagar o aprendizado.
 
Você é essencial na minha vida. ♥`,
 
`Amor,
 
Às vezes eu fico pensando como seria minha vida se eu não tivesse te conhecido…
 
E sinceramente? Eu nem gosto de imaginar.
 
Por isso eu luto tanto pra consertar o que eu estraguei.
 
Porque você não é só alguém que passou.
 
Você é alguém que eu quero que fique. ♥`,
 
`Letícia,
 
Eu amo você nos detalhes.
 
Nos pequenos momentos.
 
Nas conversas simples.
 
E foi justamente por não prestar atenção nesses detalhes que eu acabei te machucando.
 
Eu vi isso. E vou mudar.
 
Um amor calmo, mas intenso, e completamente verdadeiro… é isso que eu quero te dar. ♥`,
 
`Meu amor,
 
Eu não prometo que tudo vai ser sempre perfeito, principalmente depois do que aconteceu.
 
Mas eu prometo que vou estar com você em tudo, com mais cuidado, mais atenção e mais respeito do que antes.
 
Você merece um amor de verdade.
 
E é exatamente isso que eu sinto por você. ♥`,
 
`Amor,
 
Você é, sem dúvida nenhuma, a melhor coisa que já aconteceu na minha vida.
 
Foi por isso que perceber que eu te machuquei me doeu tanto.
 
Eu não quero ser motivo de tristeza pra você… quero ser motivo de paz.
 
Enquanto eu puder, vou continuar te amando e me esforçando por você. ♥`,
 
`Meu amor,
 
Às vezes eu me pego pensando em como tudo começou…
 
E em como, sem perceber, você se tornou tudo pra mim.
 
Hoje eu tenho certeza de uma coisa: eu não quero um futuro bonito… eu quero um futuro com você, mesmo que precise reconstruir a confiança primeiro.
 
Porque sem você, nada realmente faz sentido. ♥`,
 
`Letícia,
 
Eu queria pedir desculpas não só pelo que eu fiz…
 
Mas por não ter percebido antes o quanto isso te doeu.
 
Eu devia ter sido mais presente. Mais sensível ao que você estava sentindo.
 
Perdão por essa falta de cuidado.
 
Vou fazer diferente. ♥`,
 
`Meu amor,
 
Eu amo o jeito que você faz coisas simples se tornarem especiais.
 
Um olhar, um momento qualquer… tudo com você ganha um significado diferente.
 
E é por isso que eu não quero perder isso por causa de um erro meu.
 
Eu vou lutar pra manter esse brilho entre a gente. ♥`,
 
`Amor,
 
Se tem uma coisa que eu nunca vou me cansar, é de te escolher.
 
Todos os dias.
 
Principalmente nos dias difíceis, como esse que a gente está atravessando.
 
Amar você não é só sentimento, é decisão também.
 
E eu decido, todos os dias, continuar aqui, por você. ♥`,
 
`Letícia,
 
Eu não sei se você tem noção do quanto você é importante pra mim…
 
Do quanto o meu dia muda completamente dependendo de como você está.
 
Foi exatamente por isso que ver você triste por minha causa me partiu.
 
Eu quero cuidar desse amor com mais zelo daqui pra frente. ♥`,
 
`Meu amor,
 
Eu amo pensar no futuro… mas só quando você está nele.
 
Eu sei que agora talvez esteja mais difícil pensar em futuro, por causa do que eu fiz.
 
Mas eu vou ter paciência, e vou esperar você se sentir segura de novo.
 
Estar com você é a melhor direção que a vida poderia me dar. ♥`,
 
`Amor,
 
Você me ensinou que amar não é só sentir, é cuidar.
 
Eu falhei nisso uma vez, e isso me ensinou uma lição que eu não vou esquecer: cuidado não é opcional quando se ama de verdade.
 
Você me fez melhor…
 
E eu não vou desperdiçar essa chance de mostrar isso. ♥`,
 
`Letícia,
 
Se eu pudesse te dar uma coisa nessa vida, eu te daria a capacidade de se ver com os meus olhos…
 
Pra entender o quanto você é incrível, e o quanto merece ser bem tratada.
 
Eu tenho muito orgulho de amar alguém como você.
 
E muita vergonha de ter falhado com você uma vez. ♥`,
 
`Meu amor,
 
Eu não preciso de motivos grandes pra te amar.
 
Até nos menores detalhes, eu encontro razões.
 
E é justamente por amar os detalhes que eu quero prestar mais atenção neles daqui pra frente…
 
Pra nunca mais deixar passar algo que possa te machucar. ♥`,
 
`Amor,
 
Eu quero estar com você nos momentos bons, mas principalmente nos difíceis…
 
Incluindo esse que a gente está vivendo agora por minha causa.
 
Quero ser a pessoa que vai segurar sua mão quando tudo parecer pesado, mesmo quando o peso for culpa minha.
 
Porque é isso que você merece: alguém que não desiste. ♥`,
 
`Letícia,
 
Você é o tipo de pessoa que deixa marcas boas…
 
Daquelas que transformam, que ensinam, que fazem crescer.
 
Eu não quero que o que eu fiz vire uma marca ruim na nossa história.
 
Eu quero que vire só mais uma prova de que a gente sabe superar coisas juntos.
 
Uma vida inteira ao seu lado… é isso que eu quero. ♥`,
 
`Meu amor,
 
Eu amo você até nos momentos em que talvez você não se sinta merecedora de ser amada…
 
Principalmente depois de ter sido magoada por mim.
 
Mas eu conheço você de verdade, e é exatamente por isso que eu não desisto do nosso amor.
 
Você merece isso, e muito mais. ♥`,
 
`Amor,
 
Você é a pessoa que eu quero contar tudo.
 
As coisas boas, as ruins, as difíceis de admitir… como o meu erro.
 
Compartilhar a vida com você, mesmo os momentos difíceis, faz tudo ficar melhor…
 
Porque eu sei que é com você que eu quero crescer. ♥`,
 
`Letícia,
 
Eu não sei o que o futuro reserva…
 
Mas eu sei de uma coisa: eu quero você nele, e quero merecer estar nele.
 
Quero construir, aprender, errar menos, acertar mais, tudo com você.
 
Você é a pessoa com quem eu quero dividir tudo… inclusive os meus erros e o meu crescimento. ♥`,
 
`Meu amor,
 
Se amar você fosse um risco, eu correria ele mil vezes…
 
Mesmo sabendo que às vezes eu vou errar no caminho.
 
O que eu não posso fazer é parar de tentar.
 
Cada momento ao seu lado vale o esforço de ser melhor. ♥`,
 
`Amor,
 
Eu queria te dizer que sinto muito, mas não do jeito automático que a gente às vezes fala.
 
Eu sinto muito de verdade, com o peito apertado, sabendo que fui eu quem causou essa dor.
 
Você não merecia isso.
 
Eu vou fazer por merecer sua confiança de volta. ♥`,
 
`Letícia, meu amor,
 
Eu penso em você o tempo todo…
 
Mesmo nos momentos em que eu sei que magoei seu coração.
 
E é justamente esse pensamento constante que me faz ter certeza: eu preciso, e quero, consertar isso.
 
Porque você é importante demais pra mim. ♥`,
 
`Meu amor,
 
Eu não vou te pedir pra esquecer o que aconteceu, porque isso não seria justo com você.
 
Eu só peço a chance de te mostrar, com tempo e com atitude, que eu aprendi…
 
E que o meu amor por você é maior do que o meu erro. ♥`,
 
`Amor,
 
Tem coisas que a gente só aprende doendo…
 
E essa foi uma delas.
 
Eu aprendi, na dor de te ver triste, o quanto eu preciso cuidar melhor do que sinto por você e de como eu demonstro isso.
 
Perdão, Letícia.
 
Eu te amo. ♥`,
 
`Letícia,
 
Eu queria que cada uma dessas cartas fosse um lembrete…
 
De que eu te amo.
 
De que eu errei.
 
E de que eu quero, todos os dias, ser alguém em quem você pode confiar de novo. ♥`,
 
`Meu amor,
 
Você merece alguém que celebra você todos os dias, não só nos dias fáceis.
 
Eu quero ser essa pessoa, mesmo tendo falhado uma vez.
 
Eu vou te mostrar, com paciência, que eu aprendi o tamanho do que você vale. ♥`,
 
`Amor,
 
Eu sei que confiança não volta de uma hora pra outra, e eu não espero isso de você.
 
O que eu posso prometer é consistência…
 
Nos meus atos, nas minhas palavras, no meu cuidado com você, todos os dias, até você sentir que pode confiar em mim de novo. ♥`,
 
`Letícia, meu amor,
 
Cada dia que passa eu tenho mais clareza do quanto eu te amo…
 
E do quanto eu preciso ser mais cuidadoso com esse amor.
 
Obrigado por me dar espaço pra mostrar isso.
 
Eu não vou desperdiçar. ♥`,
 
`Meu amor,
 
Eu queria ser o motivo dos seus sorrisos, não das suas lágrimas.
 
E eu sei que uma vez eu fui o contrário disso.
 
Mas eu vou trabalhar, todos os dias, pra voltar a ser aquele motivo de alegria que eu sei que posso ser pra você. ♥`,
 
`Amor,
 
Se um pedido de desculpas pudesse apagar a dor, eu diria mil vezes…
 
Mas eu sei que não funciona assim.
 
Então eu vou fazer o que realmente importa: mudar, prestar atenção, cuidar.
 
Você merece isso de mim. ♥`,
 
`Letícia,
 
Eu amo o som da sua risada, o jeito que seus olhos brilham quando você está feliz…
 
E dói saber que, por um tempo, eu fui a razão desse brilho sumir.
 
Eu quero trazer esse brilho de volta, com paciência e com amor verdadeiro. ♥`,
 
`Meu amor,
 
Eu sei que palavras bonitas não valem nada sem atitude por trás.
 
Por isso, mais do que essas cartas, eu quero te mostrar no dia a dia que eu mudei.
 
Você vai ver, no tempo certo, que esse amor é real, e que eu aprendi. ♥`,
 
`Amor,
 
Hoje, no dia 76, eu quero te agradecer por não ter desistido de mim, mesmo depois de eu ter errado.
 
Isso não é pra mim motivo de acomodação, é motivo de gratidão e de compromisso…
 
Eu vou honrar essa chance que você me deu. ♥`,
 
`Letícia, meu amor,
 
Eu queria que você soubesse que, mesmo nos meus piores momentos, o meu amor por você nunca diminuiu.
 
O que faltou foi cuidado, não amor.
 
E cuidado é algo que eu posso, e vou, melhorar.
 
Te amo. ♥`,
 
`Meu amor,
 
Cada dia que a gente supera junto, mesmo os difíceis, fortalece o que a gente tem.
 
Eu não trocaria essa jornada, com seus erros e acertos, por nada.
 
Porque no fim, é com você que eu quero estar. ♥`,
 
`Amor,
 
Eu não sou perfeito, e eu errei feio uma vez.
 
Mas eu sou alguém que se importa, que aprende, e que quer construir algo verdadeiro com você.
 
Obrigado por me dar a chance de provar isso. ♥`,
 
`Letícia,
 
Você merece um amor tranquilo, sem sustos, sem dor desnecessária.
 
Eu vou fazer de tudo pra te dar isso daqui pra frente.
 
O erro que eu cometi me ensinou o tamanho da responsabilidade que é amar alguém como você. ♥`,
 
`Meu amor,
 
Eu queria te lembrar, nesse dia 76, que apesar de tudo que aconteceu, o que eu sinto por você continua sendo a coisa mais verdadeira da minha vida.
 
Vamos construir, juntos, um caminho mais forte a partir daqui. ♥`,
 
`Amor,
 
Eu sei que magoei você, e essa é uma verdade que eu não vou fugir.
 
Mas eu também sei que o nosso amor é maior do que esse erro, se a gente cuidar dele com carinho.
 
Eu quero cuidar. Junto com você. ♥`,
 
`Letícia, meu amor,
 
Obrigado por me dar a oportunidade de mostrar quem eu realmente sou…
 
Alguém que erra, sim, mas que também luta pra consertar e ser melhor por você.
 
Eu te amo, hoje e sempre. ♥`,
 
`Meu amor,
 
Se eu pudesse voltar no tempo, eu teria sido mais atento, mais gentil, mais presente.
 
Não posso voltar, mas posso ser assim de agora em diante.
 
Você merece esse cuidado todos os dias, não só depois de um erro. ♥`,
 
`Amor,
 
Eu escolho você, com todos os meus erros e aprendizados, todos os dias.
 
Escolho aprender com o que passou.
 
Escolho cuidar melhor.
 
Escolho te amar de um jeito mais consciente e mais presente. ♥`,
 
`Letícia,
 
Eu sei que ainda tem trabalho a fazer pra reconstruir o que eu abalei…
 
E eu estou disposto a fazer esse trabalho, com paciência e sem pressa, no seu tempo. ♥`,
 
`Meu amor,
 
Você é a pessoa que me faz querer ser melhor, não por obrigação, mas porque eu vejo o quanto você merece o meu melhor.
 
Foi isso que eu esqueci por um momento…
 
E é isso que eu não vou mais esquecer. ♥`,
 
`Amor,
 
Eu penso em tudo que a gente já viveu nesses 76 dias, os bons e os difíceis…
 
E sinto que cada um deles me ensinou algo sobre como amar você direito.
 
Obrigado por essa jornada, mesmo com os tropeços. ♥`,
 
`Letícia, meu amor,
 
Eu não quero só ser perdoado.
 
Eu quero merecer o seu perdão, com atitude, com tempo, com carinho verdadeiro.
 
Você vale todo esse esforço, e muito mais. ♥`,
 
`Meu amor,
 
Hoje eu olho pra trás e vejo o quanto cresci…
 
Mesmo que tenha sido através de um erro que eu não tenho orgulho de ter cometido.
 
O que importa agora é o que eu faço daqui pra frente, e eu escolho fazer isso com você, cuidando de você. ♥`,
 
`Amor,
 
Essas 76 cartas são só uma pequena forma de te mostrar o que eu sinto: amor de verdade, arrependimento sincero, e vontade genuína de ser melhor pra você, todos os dias que vierem. ♥`,
 
`Letícia, meu amor,
 
76 dias… 76 cartas…
 
E um só sentimento por trás de todas elas: eu te amo, eu errei, e eu quero passar o resto do meu tempo mostrando que aprendi.
 
Obrigado por cada dia, por cada chance, por cada "eu ainda estou aqui" que você me deu.
 
Eu não vou desperdiçar isso.
 
Te amo, hoje e sempre. ♥`


];

function getRandomCarta() {
  const index = Math.floor(Math.random() * cartas.length);
  return cartas[index];
}

let letterIndex = 0;
let letterAnimating = false;
let currentLetterText = getRandomCarta();

function startLetterAnimation() {
  const section = document.querySelector('.letter-section');
  if (!section) return;
  
  currentLetterText = getRandomCarta();
  letterIndex = 0;
  letterAnimating = false;
  
  const letterBody = document.getElementById('letterBody');
  if (letterBody) letterBody.innerHTML = '';
  
  const sig = document.getElementById('letterSignature');
  if (sig) sig.style.opacity = '0';
  
  new IntersectionObserver((entries, obs) => {
    if (entries[0].isIntersecting && !letterAnimating) {
      letterAnimating = true;
      obs.disconnect();
      typeNextChar();
    }
  }, { threshold: 0.3 }).observe(section);
}

function typeNextChar() {
  const el = document.getElementById('letterBody');
  if (!el) return;
  
  if (letterIndex < currentLetterText.length) {
    const ch = currentLetterText[letterIndex];
    el.innerHTML += ch === '\n' ? '<br>' : ch;
    letterIndex++;
    
    let delay = 45;
    if (ch === '.' || ch === '!' || ch === '?') delay = 280;
    else if (ch === ',') delay = 120;
    else if (ch === '\n') delay = 80;
    
    setTimeout(typeNextChar, delay);
  } else {
    const sig = document.getElementById('letterSignature');
    if (sig) sig.style.opacity = '1';
  }
}

// ============================================================
//  COUNTER - DATA CORRIGIDA: 18 de abril de 2025
// ============================================================
const startDate = new Date(2026, 3, 18);

function updateCounter() {
  const diff = Date.now() - startDate.getTime();
  const set = (id, val, pad) => {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val).padStart(pad, '0');
  };
  set('days', Math.floor(diff / 86400000), 3);
  set('hours', Math.floor((diff % 86400000) / 3600000), 2);
  set('minutes', Math.floor((diff % 3600000) / 60000), 2);
  set('seconds', Math.floor((diff % 60000) / 1000), 2);
}
setInterval(updateCounter, 1000);
updateCounter();

// ============================================================
//  SCROLL REVEAL
// ============================================================
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ============================================================
//  GALLERY DRAG
// ============================================================
const gallery = document.getElementById('galleryScroll');
if (gallery) {
  let isDragging = false, startX, scrollLeft;
  gallery.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX - gallery.offsetLeft;
    scrollLeft = gallery.scrollLeft;
  });
  gallery.addEventListener('mouseleave', () => isDragging = false);
  gallery.addEventListener('mouseup', () => isDragging = false);
  gallery.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    gallery.scrollLeft = scrollLeft - (e.pageX - gallery.offsetLeft - startX) * 1.5;
  });
}

// ============================================================
//  FORÇAR ÁUDIO NO CELULAR
// ============================================================
function forceMobileAudio() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    const audio = document.getElementById('bgMusic');
    if (audio) {
      audio.load();
      
      const unlockAudio = function() {
        if (audio.paused && musicStarted) {
          audio.play().catch(e => console.log("Áudio iniciado por toque"));
        }
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('click', unlockAudio);
      };
      
      document.addEventListener('touchstart', unlockAudio);
      document.addEventListener('click', unlockAudio);
    }
  }
}

forceMobileAudio();

// ============================================================
//  INICIALIZAÇÃO - COMEÇA AUTOMATICAMENTE
// ============================================================
let bouquetStarted = false;

function startExperience() {
  if (bouquetStarted) return;
  bouquetStarted = true;
  runBouquetIntro();
}

setTimeout(startExperience, 500);

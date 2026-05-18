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
  `Meu amor,

Desde o dia em que você entrou na minha vida, tudo ganhou mais cor, mais sentido, mais brilho.

Seu sorriso é a luz que ilumina meus dias mais escuros. Sua voz é a melodia que acalma minha alma.

Eu não sei o que seria de mim sem você ao meu lado. Você me ensinou o que é amar de verdade.

Obrigado por cada abraço, cada risada, cada momento compartilhado.

Eu te amo mais do que palavras podem dizer. E esse amor só cresce a cada segundo. ♥`,

  `Letícia,

Se existe uma coisa que eu tenho certeza nessa vida, é o amor que sinto por você.

Você chegou sem fazer barulho e conquistou tudo em mim. Seu jeito, seu olhar, sua essência... tudo em você me encanta.

Cada dia ao seu lado é um presente. Cada conversa, cada silêncio, cada risada fica guardada no meu coração.

Prometo cuidar de você, te fazer sorrir sempre, e te amar em todos os dias da minha vida.

Você é minha casa, meu porto seguro, meu amor para sempre. ♥`,

  `Minha vida mudou no dia que te conheci.

Antes de você, eu não sabia o que era sentir o coração bater mais forte. Não sabia que era possível pensar em alguém o tempo todo.

Você despertou algo em mim que eu nem sabia que existia. Meu mundo ficou mais bonito, mais leve, mais feliz.

Quero estar ao seu lado em cada conquista, em cada desafio, em cada sonho realizado.

Você é a melhor escolha que eu já fiz. E eu faria tudo de novo, só para te encontrar outra vez. ♥`,

  `Amor,

Sabe aquela música que toca e te lembra alguém especial? Você é a música que toca dentro de mim o dia inteiro.

Sua presença transforma qualquer lugar especial. Seu abraço é o único lugar onde eu me sinto completo.

Não existe distância que nos separe, porque você vive dentro de mim. Em cada pensamento, em cada batida do coração.

Obrigado por existir. Obrigado por me escolher. Obrigado por ser a razão do meu sorriso todos os dias.

Eu te amo. Simples assim. Para sempre assim. ♥`,

  `Letícia, meu amor,

Se eu pudesse escrever todas as estrelas do céu, ainda não seria o suficiente para descrever o que sinto por você.

Você é a pessoa mais incrível que eu já conheci. Sua força, sua sensibilidade, seu coração gigante... tudo em você me fascina.

Cada dia eu descubro um motivo novo para te amar mais. E eu quero passar o resto da minha vida descobrindo esses motivos.

Você não é só parte da minha vida. Você é a minha vida.

Te amo hoje, amanhã e sempre. ♥`,

  `O que seria de mim sem você?

Talvez eu ainda estivesse perdido, sem saber o que é ser verdadeiramente feliz.

Você chegou e trouxe cor para um mundo que era cinza. Você trouxe luz para os meus dias e paz para as minhas noites.

Não existe palavra que defina o tamanho da minha gratidão por ter você na minha vida.

Você é meu maior presente, meu maior amor, minha maior certeza.

E eu prometo: vou te amar em todas as vidas que eu tiver. ♥`,

  `Meu amor,

Sabe qual é o meu lugar favorito no mundo? É do seu lado. Ali, onde seu braço me envolve e o mundo lá fora some.

Você é o melhor que a vida me deu. Não há dinheiro, presente ou conquista que se compare ao que sinto por você.

Seu sorriso é meu combustível. Sua felicidade é minha prioridade.

Eu acordo pensando em você e durmo agradecendo por mais um dia ao seu lado.

Obrigado por ser exatamente quem você é. Perfeita. Pra mim. ♥`,

  `Letícia,

Se um dia eu escrever um livro, cada página será sobre você. Sobre como seu sorriso ilumina meu mundo. Sobre como seu toque acalma minha alma.

Você me inspira a ser melhor todos os dias. Por você, eu quero ser a melhor versão de mim mesmo.

Não há desafio que eu não enfrente se for para estar com você. Não há distância que me impeça de te amar.

Você é meu começo, meu meio e meu fim.

Te amo infinitamente. ♥`,

  `Quando eu te olho, eu vejo o meu futuro.

Vejo nossos planos, nossos sonhos, nossos dias de sol e até os dias de chuva. E em todos eles, eu estou feliz porque você está comigo.

Você é a pessoa que eu quero ao meu lado para envelhecer. Para compartilhar as alegrias e dividir as tristezas.

Nada nessa vida faz sentido sem você.

Então, obrigado por fazer sentido na minha vida. Obrigado por ser o amor da minha vida. ♥`,

  `Meu amor,

Existem amores que marcam, e existe você, que transformou tudo.

Antes de você, eu respirava. Depois de você, eu aprendi a viver.

Cada dia eu descubro um jeito novo de te amar. Cada dia você me surpreende com sua doçura, sua força, sua luz.

Você é a página mais bonita da minha história. E eu quero continuar escrevendo essa história com você para sempre.

Te amo além do que os olhos podem ver. ♥`
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
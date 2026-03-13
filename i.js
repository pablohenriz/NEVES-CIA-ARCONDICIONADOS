/* ═══════════════════════════════════════════════════════════════
   script.js — Neves & CIA Climatização
   ───────────────────────────────────────────────────────────────
   1. Scroll reveal
   2. Hero slideshow
   3. Carrossel de depoimentos (drag + touch + dots + botões)
═══════════════════════════════════════════════════════════════ */
 
/* ───────────────────────────────────────────
   1. SCROLL REVEAL
─────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
 
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
 
  els.forEach((el) => observer.observe(el));
})();
 
 
/* ───────────────────────────────────────────
   2. HERO SLIDESHOW
─────────────────────────────────────────── */
(function initHero() {
  const imagens = [
    '/img/img-1-hero.webp',
    '/img/imagem de serviço1.webp',
    '/img/imagem-limpeza.webp',
  ];
 
  const bgs = [
    document.getElementById('heroBg0'),
    document.getElementById('heroBg1'),
  ];
 
  if (!bgs[0] || !bgs[1]) return;
 
  let indice = 0;
  let ativo  = 0;
 
  /* Carrega a primeira imagem */
  bgs[0].style.backgroundImage = `url('${encodeURI(imagens[0])}')`;
  bgs[0].style.opacity = '1';
 
  function trocar(direcao) {
    if (direcao === 'next') {
      indice = (indice + 1) % imagens.length;
    } else {
      indice = (indice - 1 + imagens.length) % imagens.length;
    }
 
    const saindo  = bgs[ativo];
    const entrando = bgs[ativo === 0 ? 1 : 0];
 
    entrando.style.backgroundImage = `url('${encodeURI(imagens[indice])}')`;
    entrando.style.opacity = '1';
    saindo.style.opacity   = '0';
 
    ativo = ativo === 0 ? 1 : 0;
  }
 
  /* Expõe para os onclick do HTML */
  window.btnRgth = () => trocar('prev');
  window.btnLft  = () => trocar('next');
 
  /* Auto-play a cada 5 segundos */
  setInterval(() => trocar('next'), 5000);
})();
 
 
/* ───────────────────────────────────────────
   3. CARROSSEL DE DEPOIMENTOS
─────────────────────────────────────────── */
(function initCarrossel() {
  const track    = document.getElementById('depTrack');
  const viewport = document.getElementById('depViewport');
  const btnPrev  = document.getElementById('depPrev');
  const btnNext  = document.getElementById('depNext');
  const dotsWrap = document.getElementById('depDots');
 
  if (!track) return;
 
  const cards = Array.from(track.querySelectorAll('.dep-card'));
  const GAP   = 24; /* px — deve bater com o gap do CSS */
  let current   = 0;
  let currentOff = 0;
 
  /* ── Estado do drag ── */
  let isDragging   = false;
  let dragStartX   = 0;
  let dragStartOff = 0;
  let hasDragged   = false;
 
  /* ── Helpers ── */
  const cardWidth    = () => cards[0].offsetWidth + GAP;
  const visibleCount = () => Math.max(1, Math.floor(viewport.offsetWidth / cardWidth()));
  const maxIndex     = () => Math.max(0, cards.length - visibleCount());
  const maxOffset    = () => maxIndex() * cardWidth();
 
  /* ── Navegar para um índice ── */
  function goTo(index) {
    current    = Math.max(0, Math.min(index, maxIndex()));
    currentOff = current * cardWidth();
 
    track.style.transition = 'transform 0.42s cubic-bezier(0.4,0,0.2,1)';
    track.style.transform  = `translateX(-${currentOff}px)`;
 
    updateUI();
  }
 
  /* ── Atualizar dots e botões ── */
  function updateUI() {
    dotsWrap.querySelectorAll('.dep-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
    btnPrev.disabled = current === 0;
    btnNext.disabled = current >= maxIndex();
  }
 
  /* ── Construir dots ── */
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i++) {
      const btn = document.createElement('button');
      btn.className = `dep-dot${i === 0 ? ' active' : ''}`;
      btn.setAttribute('aria-label', `Depoimento ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }
 
  /* ── Início do drag ── */
  function onDragStart(clientX) {
    isDragging   = true;
    hasDragged   = false;
    dragStartX   = clientX;
    dragStartOff = currentOff;
    track.style.transition  = 'none';
    viewport.style.cursor   = 'grabbing';
  }
 
  /* ── Movimento do drag ── */
  function onDragMove(clientX) {
    if (!isDragging) return;
 
    const delta = clientX - dragStartX;
    if (Math.abs(delta) > 5) hasDragged = true;
 
    /* Rubber-band nas bordas */
    let newOff = dragStartOff - delta;
    if (newOff < 0)            newOff = newOff * 0.25;
    if (newOff > maxOffset())  newOff = maxOffset() + (newOff - maxOffset()) * 0.25;
 
    track.style.transform = `translateX(-${newOff}px)`;
  }
 
  /* ── Fim do drag ── */
  function onDragEnd(clientX) {
    if (!isDragging) return;
    isDragging           = false;
    viewport.style.cursor = 'grab';
 
    const delta     = clientX - dragStartX;
    const THRESHOLD = 50;
 
    if (Math.abs(delta) > THRESHOLD) {
      goTo(current + (delta < 0 ? 1 : -1));
    } else {
      goTo(current);
    }
  }
 
  /* ── Eventos de mouse ── */
  viewport.addEventListener('mousedown', (e) => {
    e.preventDefault();
    onDragStart(e.clientX);
  });
 
  window.addEventListener('mousemove', (e) => {
    if (isDragging) onDragMove(e.clientX);
  });
 
  window.addEventListener('mouseup', (e) => {
    if (isDragging) onDragEnd(e.clientX);
  });
 
  /* Bloqueia click após drag */
  track.addEventListener('click', (e) => {
    if (hasDragged) e.stopPropagation();
  }, true);
 
  /* ── Eventos de touch ── */
  track.addEventListener('touchstart', (e) => {
    onDragStart(e.touches[0].clientX);
  }, { passive: true });
 
  track.addEventListener('touchmove', (e) => {
    onDragMove(e.touches[0].clientX);
    if (isDragging && Math.abs(e.touches[0].clientX - dragStartX) > 10) {
      e.preventDefault();
    }
  }, { passive: false });
 
  track.addEventListener('touchend', (e) => {
    onDragEnd(e.changedTouches[0].clientX);
  });
 
  /* ── Botões ── */
  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));
 
  /* ── Resize ── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(Math.min(current, maxIndex()));
    }, 150);
  });
 
  /* ── Init ── */
  viewport.style.cursor = 'grab';
  buildDots();
  goTo(0);
})();
 
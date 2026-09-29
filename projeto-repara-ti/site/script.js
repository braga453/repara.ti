// ======= EDITE AQUI O NÚMERO DE WHATSAPP (com código do país, sem espaços/símbolos) =======
  const WHATSAPP_NUMBER = "5547999999999"; // <-- troque pelo número real
  // ============================================================================================

  document.getElementById('year').textContent = new Date().getFullYear();

  function waLink(message){ return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`; }

  const defaultMsg = "Olá! Vim pelo site da Repara.TI e gostaria de tirar uma dúvida.";
  ['waHeroBtn','waCtaBtn','waFloatBtn'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.href = waLink(defaultMsg);
  });

  /* ---------- modal ---------- */
  const overlay = document.getElementById('modalOverlay');
  const modalBox = overlay.querySelector('.modal-box');
  let lastFocused = null;

  function openModal(){
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(()=>{ document.getElementById('fName').focus(); }, 200);
  }
  function closeModal(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if(lastFocused) lastFocused.focus();
  }
  document.querySelectorAll('[data-open-modal]').forEach(btn=>{
    btn.addEventListener('click', openModal);
  });
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

  /* ---------- form submit ---------- */
  const form = document.getElementById('quoteForm');
  const toast = document.getElementById('toast');
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('fName').value.trim();
    const phone = document.getElementById('fPhone').value.trim();
    const device = document.getElementById('fDevice').value;
    const service = document.getElementById('fService').value;
    const msg = document.getElementById('fMsg').value.trim();

    let text = `*Solicitação de orçamento — Repara.TI*\n\n`;
    text += `Nome: ${name}\nTelefone: ${phone}\nEquipamento: ${device}\nServiço desejado: ${service}\n`;
    if(msg) text += `Detalhes: ${msg}\n`;

    window.open(waLink(text), '_blank', 'noopener');

    toast.classList.add('show');
    setTimeout(()=> toast.classList.remove('show'), 3200);
    setTimeout(()=>{ closeModal(); form.reset(); }, 500);
  });

  /* ---------- mobile nav close on click ---------- */
  const mobileNav = document.getElementById('mobileNav');
  document.querySelectorAll('#mobileNav a.navlink').forEach(a=>{
    a.addEventListener('click', ()=>{ mobileNav.style.display = 'none'; });
  });

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el=> io.observe(el));
  } else {
    revealEls.forEach(el=> el.classList.add('in-view'));
  }

  /* ---------- count up ---------- */
  const countEls = document.querySelectorAll('[data-count]');
  function animateCount(el){
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1100;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if('IntersectionObserver' in window){
    const ioCount = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          animateCount(entry.target);
          ioCount.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    countEls.forEach(el=> ioCount.observe(el));
  }

  /* ---------- carousel ---------- */
  const track = document.getElementById('carTrack');
  const slides = track.querySelectorAll('.carousel-slide');
  const dotsWrap = document.getElementById('carDots');
  let current = 0;
  let autoplayTimer = null;

  slides.forEach((_, i)=>{
    const d = document.createElement('button');
    d.className = 'car-dot' + (i===0 ? ' active' : '');
    d.setAttribute('aria-label', 'Ir para slide ' + (i+1));
    d.addEventListener('click', ()=> goTo(i));
    dotsWrap.appendChild(d);
  });
  const dots = dotsWrap.querySelectorAll('.car-dot');

  function goTo(i){
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx)=> d.classList.toggle('active', idx === current));
  }
  document.getElementById('carPrev').addEventListener('click', ()=>{ goTo(current - 1); restartAutoplay(); });
  document.getElementById('carNext').addEventListener('click', ()=>{ goTo(current + 1); restartAutoplay(); });

  function startAutoplay(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    autoplayTimer = setInterval(()=> goTo(current + 1), 4500);
  }
  function restartAutoplay(){
    clearInterval(autoplayTimer);
    startAutoplay();
  }
  const carousel = document.getElementById('carousel');
  carousel.addEventListener('mouseenter', ()=> clearInterval(autoplayTimer));
  carousel.addEventListener('mouseleave', startAutoplay);
  startAutoplay();

  // basic touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e)=>{ touchStartX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', (e)=>{
    const dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40){ dx > 0 ? goTo(current - 1) : goTo(current + 1); restartAutoplay(); }
  }, {passive:true});

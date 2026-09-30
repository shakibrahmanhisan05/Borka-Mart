/* Borka Mart — home page */
(function () {
  const { $, $$, card, icon, money, esc, PRODUCTS, CATEGORIES, byId, reveal, toast, stars } = window.BM;

  /* hero slider */
  const hero = $('#hero');
  const slides = $$('.hero__slide', hero);
  const dots = $('.hero__dots', hero);
  let cur = 0, timer;
  dots.innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i + 1}" role="tab"><span></span></button>`).join('');
  const dotEls = $$('button', dots);
  const go = (i) => {
    slides[cur].classList.remove('active');
    dotEls[cur].classList.remove('active');
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add('active');
    // restart the progress animation
    void dotEls[cur].offsetWidth;
    dotEls[cur].classList.add('active');
    clearTimeout(timer);
    timer = setTimeout(() => go(cur + 1), 6000);
  };
  dotEls.forEach((d, i) => d.addEventListener('click', () => go(i)));
  let sx = null;
  hero.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', (e) => {
    if (sx == null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 45) go(cur + (dx < 0 ? 1 : -1));
    sx = null;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else go(cur); });
  go(0);

  /* categories */
  $('#cat-rail').innerHTML = CATEGORIES.map((c) => {
    const p = byId(c.cover);
    const n = PRODUCTS.filter((x) => x.category === c.id).length;
    return `<a class="cat-card" href="shop.html?cat=${c.id}">
      <img src="${p.image(null, 'a')}" alt="${esc(c.name)}" loading="lazy" width="600" height="800">
      <span class="cat-card__count">${n} styles</span>
      <div class="cat-card__body"><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p></div>
      <span class="cat-card__go">${icon('arrow', 'icon-sm')}</span>
    </a>`;
  }).join('');

  /* new arrivals */
  $('#new-grid').innerHTML = PRODUCTS.filter((p) => p.tags.includes('new')).slice(0, 8).map((p, i) => card(p, `reveal reveal-d${i % 4}`)).join('');

  /* tabs */
  const tabGrid = $('#tab-grid');
  const renderTab = (k) => {
    const list = k === 'luxury' ? PRODUCTS.filter((p) => p.category === 'luxury' || p.price >= 5400) : PRODUCTS.filter((p) => p.tags.includes(k));
    tabGrid.innerHTML = list.slice(0, list.length >= 8 ? 8 : 4).map((p, i) => card(p, `reveal reveal-d${i % 4}`)).join('');
    reveal(tabGrid);
  };
  $('#tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    $$('#tabs .chip').forEach((c) => c.classList.toggle('active', c === b));
    renderTab(b.dataset.tab);
  });
  renderTab('best');

  /* countdown — always a few days out so the offer feels live */
  const cdKey = 'bm_offer_end';
  let end = 0;
  try { end = +localStorage.getItem(cdKey) || 0; } catch (e) { /* ignore */ }
  if (end < Date.now()) {
    end = Date.now() + (3 * 24 + 7) * 3600e3 + 42 * 60e3;
    try { localStorage.setItem(cdKey, end); } catch (e) { /* ignore */ }
  }
  const cd = Object.fromEntries($$('[data-cd]').map((el) => [el.dataset.cd, el]));
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    cd.d.textContent = pad(Math.floor(s / 86400));
    cd.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cd.m.textContent = pad(Math.floor((s % 3600) / 60));
    cd.s.textContent = pad(s % 60);
  };
  tick();
  setInterval(tick, 1000);

  /* lookbook */
  const looks = [
    { img: 'look-1', id: 'p05', color: 'olive', pin: [52, 54] },
    { img: 'look-2', id: 'p14', color: 'indigo', pin: [50, 57] },
    { img: 'look-3', id: 'p15', color: 'terracotta', pin: [44, 46] },
  ];
  $('#look').insertAdjacentHTML('beforeend', looks.map((l, i) => {
    const p = byId(l.id);
    return `<div class="look__tile reveal reveal-d${i + 1}">
      <img src="assets/img/site/${l.img}.svg" alt="${esc(p.name)} styled look" loading="lazy" width="600" height="800">
      <span class="look__pin" style="left:${l.pin[0]}%;top:${l.pin[1]}%"></span>
      <a class="look__tag" href="product.html?id=${p.id}&color=${l.color}">
        <img src="${p.image(l.color, 'b')}" alt="">
        <span><b>${esc(p.name)}</b><small>${money(p.price)}</small></span>
        <span class="icon-btn" style="background:var(--emerald);color:var(--gold-soft);width:38px;height:38px">${icon('arrow', 'icon-sm')}</span>
      </a>
    </div>`;
  }).join(''));

  /* reviews */
  const reviews = [
    ['Nusrat Jahan', 'Dhanmondi, Dhaka', 'The Zahra abaya is even more beautiful in person. The embroidery is so fine and the fabric falls perfectly. I received so many compliments on Eid!', '#1e5a4c'],
    ['Farzana Akter', 'Chattogram', "Finally a borka that doesn't feel heavy in this heat. The Hafsa is my daily go-to now — I've already ordered it in a second colour.", '#6b1e2e'],
    ['Tahmina Rahman', 'Sylhet', 'Delivery came in two days with cash on delivery, beautifully packed with a handwritten note. You can feel the quality straight away.', '#b8925a'],
    ['Sadia Islam', 'Uttara, Dhaka', 'The size guide was spot on and exchange was so easy. Customer service replied on WhatsApp within minutes. Highly recommended!', '#4b2a44'],
    ['Mahmuda Khatun', 'Rajshahi', "I wore the Inaya pearl abaya to my sister's walima — elegant, modest and so comfortable. Worth every taka.", '#3d5578'],
  ];
  $('#big-stars').innerHTML = '★★★★★'.split('').map(() => '<svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>').join('');
  $('#reviews').innerHTML = reviews.map(([n, city, t, c]) => `
    <figure class="review" style="margin:0">
      <svg class="review__quote" viewBox="0 0 24 24" fill="currentColor"><path d="M10 7C6.5 8 5 10.5 5 14v3h5v-5H7.5c0-2 .9-3.3 2.5-4zM19 7c-3.5 1-5 3.5-5 7v3h5v-5h-2.5c0-2 .9-3.3 2.5-4z"/></svg>
      <p>${esc(t)}</p>
      <figcaption class="review__who">
        <span class="avatar" style="background:${c}">${n[0]}</span>
        <span><b>${esc(n)}</b><small>${esc(city)} · <span class="verified">${icon('check', 'icon-xs')}Verified</span></small></span>
      </figcaption>
    </figure>`).join('');

  /* insta grid */
  const picks = ['p01-noir', 'p03-rose', 'p11-wine', 'p09-emerald', 'p08-champagne', 'p12-blush'];
  $('#insta').innerHTML = picks.map((k) => {
    const [id, color] = k.split('-');
    return `<a href="product.html?id=${id}&color=${color}" aria-label="${esc(byId(id).name)}"><img src="assets/img/products/${k}-b.svg" alt="" loading="lazy" width="600" height="800"></a>`;
  }).join('');

  /* stats count-up */
  const statEls = $$('[data-count]');
  const io = new IntersectionObserver((ents) => {
    ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, to = +el.dataset.count, dec = +el.dataset.dec || 0;
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1600), v = to * (1 - Math.pow(1 - k, 3));
        el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-IN') + (to > 1000 ? '+' : '');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.4 });
  statEls.forEach((el) => io.observe(el));

  /* newsletter */
  $('#news-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = e.target.querySelector('input');
    if (!/^\S+@\S+\.\S+$/.test(inp.value)) { inp.focus(); inp.style.borderColor = '#e08a8a'; return; }
    inp.style.borderColor = '';
    e.target.innerHTML = `<p style="font-family:var(--f-display);font-size:24px;color:#fff;margin:0">Welcome to the circle ✨<br><span style="font-family:var(--f-body);font-size:14px;opacity:.8">Use code <b style="color:var(--gold-2);letter-spacing:.14em">WELCOME300</b> on your first order.</span></p>`;
    toast({ title: 'You’re subscribed!', text: 'Your ৳300 welcome code: WELCOME300', iconName: 'gift' });
  });

  void stars;
  reveal();
})();

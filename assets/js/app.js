/* ==========================================================
   Borka Mart — storefront core
   Shell (header, drawers, footer), cart, wishlist, search.
   ========================================================== */
(function () {
  const { PRODUCTS, CATEGORIES } = window.BM_DATA;

  /* ---------- utils ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = (n) => '৳' + Math.round(n).toLocaleString('en-IN');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const catName = (id) => (CATEGORIES.find((c) => c.id === id) || {}).name || '';
  const color = (p, key) => p.colors.find((c) => c.key === key) || p.colors[0];

  const store = {
    get(k, d) {
      try { const v = localStorage.getItem('bm_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
    },
    set(k, v) {
      try { localStorage.setItem('bm_' + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ }
    },
  };

  /* ---------- icons ---------- */
  const ICONS = {
    menu: '<path d="M4 7h16M4 12h10M4 17h16"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/>',
    bag: '<path d="M5.5 8.5h13l-1 11.5h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
    plusbag: '<path d="M5.5 8.5h13l-1 11.5h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5M12 12v5M9.5 14.5h5"/>',
    home: '<path d="M4 10.5 12 4l8 6.5V20h-5.5v-5.5h-5V20H4z"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    back: '<path d="M20 12H5M11 6l-6 6 6 6"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    truck: '<path d="M3 6.5h11v9H3zM14 9.5h3.8l3.2 3.3v2.7h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
    shield: '<path d="M12 3.5 5 6v5.5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    refresh: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5.1L19.5 9M19.5 4.5V9H15M19.5 12a7.5 7.5 0 0 1-13 5.1L4.5 15M4.5 19.5V15H9"/>',
    cash: '<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5v.01M17.5 14.5v.01"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9S10.5 4 8 4.8C6 5.5 7 9 12 9Zm0 0s1.5-5 4-4.2c2 .7 1 4.2-4 4.2Z"/>',
    sparkle: '<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z"/><path d="M19 16c.2 1.4.8 2 2.2 2.2-1.4.2-2 .8-2.2 2.2-.2-1.4-.8-2-2.2-2.2 1.4-.2 2-.8 2.2-2.2Z"/>',
    phone: '<path d="M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
    chat: '<path d="M4.5 18.5 5.8 15A7.5 7.5 0 1 1 9 18.2z"/><path d="M9 11h.01M12 11h.01M15 11h.01"/>',
    insta: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><path d="M16.8 7.2h.01"/>',
    fb: '<path d="M14.5 8H16V4.8h-2.2A3.8 3.8 0 0 0 10 8.6V11H8v3.2h2V20h3.3v-5.8h2.3l.4-3.2h-2.7V9.1c0-.6.5-1.1 1.2-1.1Z"/>',
    yt: '<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="m10.5 9.5 4 2.5-4 2.5z"/>',
    tiktok: '<path d="M14 4v10.2a3.3 3.3 0 1 1-3.3-3.3M14 4c.4 2.4 2 4 4.5 4.2"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    filter: '<path d="M4 6.5h9M17 6.5h3M4 12h3M11 12h9M4 17.5h11M19 17.5h1"/><circle cx="15" cy="6.5" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17.5" r="2"/>',
    ruler: '<path d="m3.5 15.5 12-12 5 5-12 12z"/><path d="m7 12 2 2M10 9l1.5 1.5M13 6l2 2"/>',
    zoom: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5"/>',
    share: '<circle cx="17.5" cy="6" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/><circle cx="17.5" cy="18" r="2.5"/><path d="m8.7 10.8 6.6-3.6M8.7 13.2l6.6 3.6"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    quote: '<path d="M10 7C6.5 8 5 10.5 5 14v3h5v-5H7.5c0-2 .9-3.3 2.5-4zM19 7c-3.5 1-5 3.5-5 7v3h5v-5h-2.5c0-2 .9-3.3 2.5-4z"/>',
    leaf: '<path d="M5 19C5 10 10 5 19.5 4.5 19 14 14 19 5 19Z"/><path d="M5 19 13 11"/>',
    needle: '<path d="M18.5 3.5 7 15l2 2L20.5 5.5z"/><path d="M17 5l2 2M5 19l2-2M4 20c1-3 2.5-3.5 4.5-3.5"/>',
    hand: '<path d="M12 20s-6-3.8-6-8.3A3.4 3.4 0 0 1 12 9.6a3.4 3.4 0 0 1 6 2.1C18 16.2 12 20 12 20Z"/><path d="M3 12c0-5 4-8.5 9-8.5s9 3.5 9 8.5"/>',
    package: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    tag: '<path d="M3.5 12.3V4.5h7.8l9.2 9.2-7.8 7.8z"/><circle cx="8" cy="9" r="1.5"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8.2 19z"/><path d="M9.2 8.5c0 3.4 2.9 6.3 6.3 6.3l1-1.6-2-1-.9.9a4.4 4.4 0 0 1-2.7-2.7l.9-.9-1-2z"/>',
  };
  const icon = (n, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const starSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>';
  const stars = (r, n) => `<span class="stars">${starSvg}<b style="color:var(--ink);font-weight:500">${r.toFixed(1)}</b>${n != null ? `<span>(${n})</span>` : ''}</span>`;
  const LOGO_MARK = `<svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="19" fill="#123a33"/>
    <circle cx="20" cy="20" r="16.4" fill="none" stroke="#d4b06a" stroke-width=".6" opacity=".7"/>
    <path d="M12.5 31V18.5a7.5 7.5 0 0 1 15 0V31" fill="none" stroke="#d4b06a" stroke-width="1.5"/>
    <path d="M21.8 13.6a4.3 4.3 0 1 0 0 8.2 5.2 5.2 0 1 1 0-8.2Z" fill="#d4b06a"/>
    <path d="M23.6 16.1l.5 1.1 1.2.1-.9.8.3 1.2-1.1-.6-1 .6.2-1.2-.9-.8 1.2-.1z" fill="#efe2c6"/>
  </svg>`;
  const logo = (href = 'index.html') => `<a class="logo" href="${href}" aria-label="Borka Mart home">${LOGO_MARK}<span class="logo__text"><span class="logo__name">Borka Mart</span><span class="logo__tag">Modest Luxury</span></span></a>`;

  /* ---------- state ---------- */
  let cart = store.get('cart', []);
  let wish = store.get('wish', []);
  let coupon = store.get('coupon', null);

  const COUPONS = {
    EID10: { type: 'pct', value: 10, label: '10% Eid discount' },
    WELCOME300: { type: 'flat', value: 300, min: 3000, label: '৳300 off your first order' },
  };
  const FREE_SHIP = 5000;

  const Cart = {
    items: () => cart,
    count: () => cart.reduce((s, i) => s + i.qty, 0),
    subtotal: () => cart.reduce((s, i) => s + (byId(i.id)?.price || 0) * i.qty, 0),
    mrpTotal: () => cart.reduce((s, i) => { const p = byId(i.id); return s + (p?.oldPrice || p?.price || 0) * i.qty; }, 0),
    discount() {
      if (!coupon || !COUPONS[coupon]) return 0;
      const c = COUPONS[coupon], sub = this.subtotal();
      if (c.min && sub < c.min) return 0;
      return c.type === 'pct' ? Math.round((sub * c.value) / 100) : c.value;
    },
    add(id, colorKey, size, qty = 1) {
      const line = cart.find((i) => i.id === id && i.color === colorKey && i.size === size);
      if (line) line.qty = Math.min(10, line.qty + qty);
      else cart.push({ id, color: colorKey, size, qty });
      save();
    },
    setQty(idx, qty) {
      if (!cart[idx]) return;
      if (qty <= 0) cart.splice(idx, 1);
      else cart[idx].qty = Math.min(10, qty);
      save();
    },
    remove(idx) { cart.splice(idx, 1); save(); },
    clear() { cart = []; coupon = null; store.set('coupon', null); save(); },
    applyCoupon(code) {
      code = String(code || '').trim().toUpperCase();
      if (!COUPONS[code]) return { ok: false, msg: 'This code is not valid.' };
      const c = COUPONS[code];
      if (c.min && this.subtotal() < c.min) return { ok: false, msg: `Add items worth ${money(c.min)} to use ${code}.` };
      coupon = code; store.set('coupon', code); save();
      return { ok: true, msg: `${code} applied — ${c.label}.` };
    },
    removeCoupon() { coupon = null; store.set('coupon', null); save(); },
    coupon: () => coupon,
    couponLabel: () => (coupon && COUPONS[coupon] ? COUPONS[coupon].label : ''),
  };

  const Wish = {
    has: (id) => wish.includes(id),
    toggle(id) {
      if (wish.includes(id)) wish = wish.filter((x) => x !== id);
      else wish.unshift(id);
      store.set('wish', wish);
      updateBadges('wish');
      document.dispatchEvent(new CustomEvent('bm:wish'));
      return wish.includes(id);
    },
    list: () => wish.slice(),
  };

  function save() {
    store.set('cart', cart);
    updateBadges('cart');
    renderCart();
    document.dispatchEvent(new CustomEvent('bm:cart'));
  }

  function updateBadges(which) {
    const c = Cart.count(), w = wish.length;
    $$('[data-badge="cart"]').forEach((b) => {
      b.textContent = c; b.classList.toggle('has', c > 0);
      if (which === 'cart') { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    });
    $$('[data-badge="wish"]').forEach((b) => {
      b.textContent = w; b.classList.toggle('has', w > 0);
      if (which === 'wish') { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    });
  }

  /* ---------- product card ---------- */
  function badgeHtml(p) {
    if (!p.badge) return '';
    const cls = p.badge.startsWith('-') ? 'sale' : ['Bestseller', 'Eid Edit', 'Limited'].includes(p.badge) ? 'dark' : '';
    return `<span class="card__badge ${cls}">${esc(p.badge)}</span>`;
  }
  function card(p, extra = '') {
    const c = p.colors[0];
    return `<article class="card ${extra}" data-id="${p.id}">
      <div class="card__top">
      <a class="card__media" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">
        <img src="${p.image(c.key, 'a')}" alt="${esc(p.name)} in ${esc(c.name)}" loading="lazy" width="600" height="800">
        <img class="alt" src="${p.image(c.key, 'c')}" alt="" loading="lazy" width="600" height="800">
      </a>
      ${badgeHtml(p)}
      <button class="card__wish ${Wish.has(p.id) ? 'is-wished' : ''}" data-action="wish" data-id="${p.id}" aria-label="Save to wishlist">${icon('heart')}</button>
      <button class="card__quick" data-action="quick" data-id="${p.id}" aria-label="Quick add ${esc(p.name)}">${icon('plusbag')}</button>
      </div>
      <div class="card__info">
        <div class="card__cat">${esc(catName(p.category))}</div>
        <h3 class="card__name"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
        <div class="card__price"><span class="price">${money(p.price)}</span>${p.oldPrice ? `<span class="price-old">${money(p.oldPrice)}</span>` : ''}</div>
        <div class="card__swatches">${p.colors.map((cc) => `<span class="dot" style="background:${cc.base}" title="${esc(cc.name)}"></span>`).join('')}</div>
      </div>
    </article>`;
  }

  /* ---------- shell ---------- */
  const page = document.body.dataset.page || '';
  const NAV = [
    ['index.html', 'Home', 'home'],
    ['shop.html', 'Shop All', 'shop'],
    ['shop.html?cat=luxury', 'Eid Edit', 'eid'],
    ['shop.html?tag=new', 'New In', 'new'],
    ['about.html', 'Our Story', 'about'],
  ];

  function shell() {
    const annc = ['Free delivery on orders over ৳5,000', 'Cash on delivery all over Bangladesh', 'Eid Collection 2026 — now live', 'Easy 7-day exchange', 'Use code EID10 for 10% off'];
    const track = [...annc, ...annc].map((t) => `<span>${t}</span>`).join('');

    const header = `
      <div class="announce" role="note"><div class="announce__track">${track}</div></div>
      <header class="header" id="header">
        <div class="container header__inner">
          <div class="header__left">
            <button class="icon-btn hide-desk" data-action="menu" aria-label="Open menu">${icon('menu')}</button>
            <button class="icon-btn hide-desk" data-action="search" aria-label="Search">${icon('search')}</button>
            <span class="hide-mobile">${logo()}</span>
          </div>
          <span class="hide-desk">${logo()}</span>
          <nav class="nav" aria-label="Main">${NAV.map(([h, t, k]) => `<a href="${h}" data-nav="${k}">${t}</a>`).join('')}</nav>
          <div class="header__right">
            <button class="icon-btn hide-mobile" data-action="search" aria-label="Search">${icon('search')}</button>
            <a class="icon-btn hide-mobile" href="wishlist.html" aria-label="Wishlist">${icon('heart')}<span class="badge-count" data-badge="wish">0</span></a>
            <a class="icon-btn hide-mobile" href="track.html" aria-label="Track order">${icon('user')}</a>
            <button class="icon-btn" data-action="cart" aria-label="Open bag">${icon('bag')}<span class="badge-count" data-badge="cart">0</span></button>
          </div>
        </div>
      </header>`;

    const overlays = `
      <div class="scrim" id="scrim"></div>

      <aside class="drawer drawer--left" id="menu" aria-label="Menu">
        <div class="drawer__head">${logo()}<button class="icon-btn" data-action="close" aria-label="Close">${icon('close')}</button></div>
        <div class="drawer__body">
          <nav class="menu-links">
            ${NAV.map(([h, t]) => `<a href="${h}">${t}${icon('chevron')}</a>`).join('')}
            <a href="wishlist.html">Wishlist${icon('chevron')}</a>
            <a href="track.html">Track Order${icon('chevron')}</a>
          </nav>
          <div class="menu-sub">
            <h4>Collections</h4>
            ${CATEGORIES.map((c) => `<a href="shop.html?cat=${c.id}">${c.name}</a>`).join('')}
          </div>
          <div class="menu-promo">
            <h5>Eid Mubarak</h5>
            <p>Celebrate in elegance. Enjoy 10% off the entire Eid collection.</p>
            <code>EID10</code>
          </div>
          <div class="menu-sub">
            <h4>Need help?</h4>
            <a href="tel:+8809613000000">${'+880 9613-000000'}</a>
            <a href="about.html#contact">hello@borkamart.com</a>
          </div>
        </div>
      </aside>

      <aside class="drawer drawer--right" id="cart" aria-label="Shopping bag">
        <div class="drawer__head"><h2 class="drawer__title">Your Bag <small id="cart-count"></small></h2><button class="icon-btn" data-action="close" aria-label="Close">${icon('close')}</button></div>
        <div class="drawer__body" id="cart-body"></div>
        <div class="drawer__foot" id="cart-foot"></div>
      </aside>

      <div class="search" id="search" role="dialog" aria-label="Search">
        <div class="search__bar">
          ${icon('search')}
          <input type="search" id="search-input" placeholder="Search abayas, colours…" autocomplete="off" enterkeyhint="search">
          <button class="icon-btn" data-action="close" aria-label="Close search">${icon('close')}</button>
        </div>
        <div class="search__body">
          <div id="search-idle">
            <div class="search__label">Popular searches</div>
            <div class="chips">${['Butterfly', 'Black', 'Embroidered', 'Cape', 'Kimono', 'Emerald', 'Pearl', 'Linen'].map((t) => `<button class="chip" data-search="${t}">${t}</button>`).join('')}</div>
            <div class="search__label mt-32">Trending now</div>
            <div class="search-results">${PRODUCTS.filter((p) => p.tags.includes('best')).slice(0, 4).map((p) => hit(p)).join('')}</div>
          </div>
          <div id="search-live" class="search-results" hidden></div>
        </div>
      </div>

      <div class="modal" id="modal" role="dialog" aria-modal="true"><div class="modal__box" id="modal-box"></div></div>
      <div class="toasts" id="toasts" aria-live="polite"></div>
      <button class="to-top" id="to-top" aria-label="Back to top">${icon('arrow', 'icon-sm')}</button>

      <nav class="bottom-nav" aria-label="Quick navigation">
        <a href="index.html" data-nav="home">${icon('home')}Home</a>
        <a href="shop.html" data-nav="shop">${icon('grid')}Shop</a>
        <button data-action="search">${icon('search')}Search</button>
        <a href="wishlist.html" data-nav="wishlist">${icon('heart')}Wishlist<span class="badge-count" data-badge="wish">0</span></a>
        <button data-action="cart">${icon('bag')}Bag<span class="badge-count" data-badge="cart">0</span></button>
      </nav>`;

    const footer = `
      <footer class="footer">
        <div class="container">
          <div class="footer__top">
            <div class="footer__brand">
              ${logo()}
              <p>Timeless borkas and abayas, thoughtfully designed in Dhaka for the modern woman who carries her faith with grace.</p>
              <div class="socials">
                <a href="#" aria-label="Facebook">${icon('fb')}</a>
                <a href="#" aria-label="Instagram">${icon('insta')}</a>
                <a href="#" aria-label="TikTok">${icon('tiktok')}</a>
                <a href="#" aria-label="YouTube">${icon('yt')}</a>
              </div>
            </div>
            <div class="footer__cols">
              <div><h4>Shop</h4>${CATEGORIES.map((c) => `<a href="shop.html?cat=${c.id}">${c.name}</a>`).join('')}<a href="shop.html?tag=sale">On Sale</a></div>
              <div><h4>Help</h4><a href="track.html">Track Order</a><a href="about.html#faq">Delivery &amp; Returns</a><a href="product.html?id=p01#size">Size Guide</a><a href="about.html#faq">FAQs</a><a href="about.html#contact">Contact Us</a></div>
              <div><h4>Borka Mart</h4><a href="about.html">Our Story</a><a href="about.html#atelier">The Atelier</a><a href="wishlist.html">Wishlist</a><a href="shop.html?tag=new">New Arrivals</a></div>
              <div><h4>Visit Us</h4>
                <ul class="footer__contact">
                  <li>${icon('pin')}<span>House 12, Road 7, Dhanmondi, Dhaka 1205</span></li>
                  <li>${icon('phone')}<span>+880 9613-000000</span></li>
                  <li>${icon('clock')}<span>Sat – Thu, 10am – 9pm</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer__bottom">
            <div class="pay"><span>bKash</span><span>Nagad</span><span>Rocket</span><span>VISA</span><span>Mastercard</span><span>Cash on Delivery</span></div>
            <div>© ${new Date().getFullYear()} Borka Mart. All rights reserved.</div>
          </div>
        </div>
      </footer>`;

    $('#site-header').outerHTML = header;
    $('#site-footer').outerHTML = footer + overlays;

    const key = page === 'shop' ? (new URLSearchParams(location.search).get('cat') === 'luxury' ? 'eid' : new URLSearchParams(location.search).get('tag') === 'new' ? 'new' : 'shop') : page;
    $$(`[data-nav="${key}"]`).forEach((a) => a.classList.add('active'));
  }

  function hit(p, q) {
    let name = esc(p.name);
    if (q) name = name.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
    return `<a class="search-hit" href="product.html?id=${p.id}"><img src="${p.image(null, 'a')}" alt="" loading="lazy"><span><b>${name}</b><small>${esc(catName(p.category))} · ${esc(p.fabric)}</small></span><span class="price">${money(p.price)}</span></a>`;
  }

  /* ---------- overlays ---------- */
  let openEl = null;
  function open(id) {
    closeAll(true);
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('open');
    if (id !== 'search') $('#scrim').classList.add('show');
    document.body.classList.add('no-scroll');
    openEl = el;
    if (id === 'search') setTimeout(() => $('#search-input').focus(), 250);
  }
  function closeAll(silent) {
    $$('.drawer.open, .search.open, .modal.open, .sheet.open').forEach((e) => e.classList.remove('open'));
    $('#scrim')?.classList.remove('show');
    document.body.classList.remove('no-scroll');
    openEl = null;
    if (!silent) document.dispatchEvent(new CustomEvent('bm:closed'));
  }

  /* ---------- cart drawer ---------- */
  function renderCart() {
    const body = $('#cart-body'), foot = $('#cart-foot');
    if (!body) return;
    const n = Cart.count();
    $('#cart-count').textContent = n ? `${n} item${n > 1 ? 's' : ''}` : '';
    if (!cart.length) {
      body.innerHTML = `<div class="cart-empty">
        <svg class="cart-empty__art" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="56" fill="#f4ede3"/><path d="M36 48h48l-4 42H40z" stroke="#b8925a" stroke-width="2"/><path d="M48 48v-6a12 12 0 0 1 24 0v6" stroke="#b8925a" stroke-width="2"/><path d="M60 62c3 6 9 7 12 7-3 0-9 1-12 7-3-6-9-7-12-7 3 0 9-1 12-7z" fill="#d4b06a"/></svg>
        <h3>Your bag is empty</h3><p>Discover pieces crafted to be loved for years.</p>
        <a class="btn" href="shop.html">Explore the collection</a></div>`;
      foot.innerHTML = '';
      foot.style.display = 'none';
      return;
    }
    foot.style.display = '';
    const sub = Cart.subtotal(), left = Math.max(0, FREE_SHIP - sub);
    body.innerHTML = `
      <div class="free-ship">${left > 0 ? `You're <strong>${money(left)}</strong> away from free delivery` : `<strong>Congratulations!</strong> You've unlocked free delivery ✨`}
        <div class="progress"><span style="width:${Math.min(100, (sub / FREE_SHIP) * 100)}%"></span></div></div>
      ${cart.map((i, idx) => {
        const p = byId(i.id); if (!p) return '';
        const c = color(p, i.color);
        return `<div class="cart-item">
          <a class="cart-item__img" href="product.html?id=${p.id}&color=${c.key}"><img src="${p.image(c.key, 'a')}" alt="${esc(p.name)}"></a>
          <div>
            <div class="cart-item__name">${esc(p.name)}</div>
            <div class="cart-item__meta">${esc(c.name)} · Size ${i.size}</div>
            <div class="cart-item__row">
              <div class="qty"><button data-action="dec" data-idx="${idx}" aria-label="Decrease">${icon('minus', 'icon-xs')}</button><span>${i.qty}</span><button data-action="inc" data-idx="${idx}" aria-label="Increase" ${i.qty >= 10 ? 'disabled' : ''}>${icon('plus', 'icon-xs')}</button></div>
              <span class="cart-item__price">${money(p.price * i.qty)}</span>
            </div>
            <button class="link-btn" data-action="remove" data-idx="${idx}" style="margin-top:8px">Remove</button>
          </div>
        </div>`;
      }).join('')}`;
    const disc = Cart.discount();
    const savings = Cart.mrpTotal() - sub + disc;
    foot.innerHTML = `
      <div class="sum-row"><span>Subtotal</span><span>${money(sub)}</span></div>
      ${disc ? `<div class="sum-row"><span>Discount (${Cart.coupon()})</span><span class="save">−${money(disc)}</span></div>` : ''}
      <div class="sum-row"><span>Delivery</span><span>${left > 0 ? 'Calculated at checkout' : 'Free'}</span></div>
      <div class="sum-row total"><span>Total</span><span>${money(sub - disc)}</span></div>
      <a class="btn btn--block" href="checkout.html">Checkout ${icon('arrow')}</a>
      <p class="foot-note">${savings > 0 ? `<span style="color:var(--success)">You save ${money(savings)} on this order</span>` : `${icon('lock', 'icon-xs')} Secure checkout · Cash on delivery available`}</p>`;
  }

  /* ---------- toast ---------- */
  function toast({ title, text = '', img, iconName = 'check', link, linkText }) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `${img ? `<img src="${img}" alt="">` : `<span class="toast__icon">${icon(iconName, 'icon-sm')}</span>`}<div><b>${title}</b>${text ? `<small>${text}</small>` : ''}</div>${link ? `<a href="${link}" ${link === '#cart' ? 'data-action="cart"' : ''}>${linkText || 'View'}</a>` : ''}`;
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3200);
  }

  /* ---------- fly to cart ---------- */
  function flyToCart(imgEl) {
    const target = [...$$('[data-action="cart"]')].find((b) => b.offsetParent !== null && b.getBoundingClientRect().width > 0);
    if (!imgEl || !target) return;
    const a = imgEl.getBoundingClientRect(), b = target.getBoundingClientRect();
    if (!a.width) return;
    const f = imgEl.cloneNode();
    f.className = 'fly';
    Object.assign(f.style, { left: a.left + 'px', top: a.top + 'px', width: a.width + 'px', height: a.height + 'px' });
    document.body.appendChild(f);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      Object.assign(f.style, { left: b.left + b.width / 2 - 12 + 'px', top: b.top + b.height / 2 - 16 + 'px', width: '24px', height: '32px', opacity: '0.3', borderRadius: '50%' });
    }));
    setTimeout(() => f.remove(), 900);
  }

  function added(p, colorKey, size, qty, imgEl) {
    Cart.add(p.id, colorKey, size, qty);
    flyToCart(imgEl);
    const c = color(p, colorKey);
    toast({ title: 'Added to your bag', text: `${p.name} · ${c.name} · ${size}`, img: p.image(c.key, 'a'), link: '#cart', linkText: 'View bag' });
  }

  /* ---------- quick view ---------- */
  function quickView(id) {
    const p = byId(id); if (!p) return;
    let sel = { color: p.colors[0].key, size: null, qty: 1 };
    const box = $('#modal-box');
    const draw = () => {
      const c = color(p, sel.color);
      box.innerHTML = `
        <button class="icon-btn modal__close" data-action="close" aria-label="Close">${icon('close')}</button>
        <div class="qv">
          <div class="qv__img"><img id="qv-img" src="${p.image(c.key, 'a')}" alt="${esc(p.name)}"></div>
          <div>
            <div class="pdp__cat">${esc(catName(p.category))}</div>
            <h3>${esc(p.name)}</h3>
            <div class="pdp__price" style="margin:8px 0 0"><span class="price" style="font-size:24px">${money(p.price)}</span>${p.oldPrice ? `<span class="price-old">${money(p.oldPrice)}</span>` : ''}</div>
            ${stars(p.rating, p.reviews)}
          </div>
        </div>
        <div class="opt"><div class="opt__label"><b>Colour: <span style="color:var(--ink-2);font-weight:400">${esc(c.name)}</span></b></div>
          <div class="swatches">${p.colors.map((cc) => `<button class="swatch ${cc.key === sel.color ? 'active' : ''}" style="background:${cc.base}" data-qv-color="${cc.key}" aria-label="${esc(cc.name)}"></button>`).join('')}</div></div>
        <div class="opt"><div class="opt__label"><b>Length (inches)</b><a class="size-guide-link" href="product.html?id=${p.id}#size">${icon('ruler', 'icon-xs')}Size guide</a></div>
          <div class="sizes">${p.sizes.map((s) => `<button class="size ${sel.size === s ? 'active' : ''}" data-qv-size="${s}">${s}</button>`).join('')}</div>
          <p class="opt-error" id="qv-err">Please choose your length to continue.</p></div>
        <div class="buy-row" style="grid-template-columns:auto 1fr">
          <div class="qty qty--lg"><button data-qv-qty="-1" aria-label="Decrease">${icon('minus', 'icon-xs')}</button><span>${sel.qty}</span><button data-qv-qty="1" aria-label="Increase">${icon('plus', 'icon-xs')}</button></div>
          <button class="btn" data-qv-add>${icon('bag')} Add to bag · ${money(p.price * sel.qty)}</button>
        </div>
        <p class="center mt-24"><a class="view-all" href="product.html?id=${p.id}&color=${sel.color}">View full details ${icon('arrow')}</a></p>`;
    };
    draw();
    box.onclick = (e) => {
      const t = e.target.closest('button'); if (!t) return;
      if (t.dataset.qvColor) { sel.color = t.dataset.qvColor; draw(); }
      else if (t.dataset.qvSize) { sel.size = +t.dataset.qvSize; draw(); }
      else if (t.dataset.qvQty) { sel.qty = Math.max(1, Math.min(10, sel.qty + +t.dataset.qvQty)); draw(); }
      else if (t.hasAttribute('data-qv-add')) {
        if (!sel.size) { const er = $('#qv-err'); er.classList.remove('show'); void er.offsetWidth; er.classList.add('show'); return; }
        const img = $('#qv-img');
        added(p, sel.color, sel.size, sel.qty, img);
        setTimeout(closeAll, 150);
      }
    };
    open('modal');
    $('#scrim').classList.add('show');
  }

  /* ---------- search ---------- */
  function initSearch() {
    const input = $('#search-input'), idle = $('#search-idle'), live = $('#search-live');
    const run = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { idle.hidden = false; live.hidden = true; return; }
      const res = PRODUCTS.filter((p) => [p.name, p.fabric, catName(p.category), p.style, p.desc, ...p.colors.map((c) => c.name)].join(' ').toLowerCase().includes(q));
      idle.hidden = true; live.hidden = false;
      live.innerHTML = res.length
        ? `<div class="search__label">${res.length} result${res.length > 1 ? 's' : ''}</div>${res.slice(0, 8).map((p) => hit(p, input.value.trim())).join('')}${res.length > 8 ? `<a class="btn btn--outline btn--block mt-24" href="shop.html?q=${encodeURIComponent(q)}">View all ${res.length}</a>` : ''}`
        : `<div class="empty-state">${icon('search')}<h3>No matches found</h3><p>Try "black", "butterfly" or "embroidered".</p></div>`;
    };
    input.addEventListener('input', run);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && input.value.trim()) location.href = `shop.html?q=${encodeURIComponent(input.value.trim())}`; });
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-search]');
      if (chip) { input.value = chip.dataset.search; run(); input.focus(); }
    });
  }

  /* ---------- global events ---------- */
  function initEvents() {
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-action]');
      if (!t) return;
      const a = t.dataset.action;
      if (['menu', 'cart', 'search', 'close', 'wish', 'quick', 'inc', 'dec', 'remove'].includes(a)) e.preventDefault();
      if (a === 'menu') open('menu');
      else if (a === 'cart') { renderCart(); open('cart'); }
      else if (a === 'search') open('search');
      else if (a === 'close') closeAll();
      else if (a === 'wish') {
        const p = byId(t.dataset.id);
        const on = Wish.toggle(t.dataset.id);
        $$(`[data-action="wish"][data-id="${t.dataset.id}"]`).forEach((b) => b.classList.toggle('is-wished', on));
        toast(on ? { title: 'Saved to wishlist', text: p.name, img: p.image(null, 'a'), link: 'wishlist.html', linkText: 'View' } : { title: 'Removed from wishlist', text: p.name, iconName: 'heart' });
      } else if (a === 'quick') quickView(t.dataset.id);
      else if (a === 'inc') Cart.setQty(+t.dataset.idx, cart[+t.dataset.idx].qty + 1);
      else if (a === 'dec') Cart.setQty(+t.dataset.idx, cart[+t.dataset.idx].qty - 1);
      else if (a === 'remove') Cart.remove(+t.dataset.idx);
    });
    $('#scrim').addEventListener('click', () => closeAll());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

    const header = $('#header'), top = $('#to-top');
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 10);
      top.classList.toggle('show', y > 900);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Swipe-to-close for drawers & sheets
    let sx = 0, sy = 0;
    document.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    document.addEventListener('touchend', (e) => {
      if (!openEl) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (openEl.id === 'cart' && dx > 80 && Math.abs(dy) < 60) closeAll();
      if (openEl.id === 'menu' && dx < -80 && Math.abs(dy) < 60) closeAll();
    }, { passive: true });
  }

  /* ---------- reveal on scroll ---------- */
  function reveal(root = document) {
    const els = $$('.reveal:not(.in)', root);
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- boot ---------- */
  shell();
  initEvents();
  initSearch();
  updateBadges();
  renderCart();

  window.BM = { $, $$, money, esc, byId, catName, color, icon, stars, card, badgeHtml, Cart, Wish, store, toast, added, flyToCart, open, closeAll, quickView, reveal, PRODUCTS, CATEGORIES, FREE_SHIP, COUPONS };

  const hideLoader = () => $('#loader')?.classList.add('done');
  window.addEventListener('load', () => setTimeout(hideLoader, 150));
  setTimeout(hideLoader, 2200);
  document.addEventListener('DOMContentLoaded', () => reveal());
  setTimeout(() => reveal(), 60);
})();

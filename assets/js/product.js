/* Borka Mart — product detail */
(function () {
  const { $, $$, card, money, esc, icon, stars, byId, catName, color, badgeHtml, PRODUCTS, Wish, added, reveal, store, toast, open } = window.BM;

  const params = new URLSearchParams(location.search);
  const p = byId(params.get('id')) || PRODUCTS[0];
  const sel = { color: color(p, params.get('color')).key, size: null, qty: 1 };

  // pseudo-random but stable stock per product/size
  const stockOf = (size) => {
    let h = 0;
    for (const ch of p.id + size) h = (h * 33 + ch.charCodeAt(0)) % 997;
    return 2 + (h % 14);
  };

  document.title = `${p.name} — Borka Mart`;
  $('#crumb-cat').textContent = catName(p.category);
  $('#crumb-cat').href = `shop.html?cat=${p.category}`;
  $('#crumb-name').textContent = p.name;

  // recently viewed
  const recent = store.get('recent', []).filter((x) => x !== p.id);
  store.set('recent', [p.id, ...recent].slice(0, 8));

  const deliveryDate = (days) => {
    const d = new Date(Date.now() + days * 864e5);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  $('#pdp').innerHTML = '<div class="gallery" id="gallery"></div><div class="pdp__info" id="info"></div>';

  function renderGallery() {
    const c = color(p, sel.color);
    const views = ['a', 'b', 'c'];
    $('#gallery').innerHTML = `
        <div class="gallery__thumbs">${views.map((v, i) => `<button class="${i === 0 ? 'active' : ''}" data-thumb="${i}" aria-label="View image ${i + 1}"><img src="${p.image(c.key, v)}" alt=""></button>`).join('')}</div>
        <div class="gallery__track" id="g-track">${views.map((v, i) => `<div class="gallery__slide"><img src="${p.image(c.key, v)}" alt="${esc(p.name)} in ${esc(c.name)} — view ${i + 1}" ${i ? 'loading="lazy"' : ''} width="600" height="800"></div>`).join('')}</div>
        <div class="gallery__dots">${views.map((_, i) => `<span class="${i === 0 ? 'active' : ''}"></span>`).join('')}</div>
        ${badgeHtml(p)}
        <div class="gallery__tools">
          <button class="${Wish.has(p.id) ? 'is-wished' : ''}" data-action="wish" data-id="${p.id}" aria-label="Save to wishlist">${icon('heart', 'icon-sm')}</button>
          <button id="share" aria-label="Share">${icon('share', 'icon-sm')}</button>
        </div>`;
    bindGallery();
  }

  function render() {
    const c = color(p, sel.color);
    const save = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    $('#info').innerHTML = `
        <div class="pdp__cat">${esc(catName(p.category))}</div>
        <h1 class="pdp__title">${esc(p.name)}</h1>
        <a class="pdp__rating" href="#reviews-sec">${stars(p.rating)}<span>${p.reviews} reviews</span></a>
        <div class="pdp__price">
          <span class="price">${money(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${money(p.oldPrice)}</span><span class="save-tag">Save ${save}%</span>` : ''}
        </div>
        <p class="pdp__tax">Inclusive of VAT · Pay with bKash, Nagad, card or cash on delivery</p>
        <p class="pdp__short">${esc(p.desc)}</p>

        <div class="opt">
          <div class="opt__label"><b>Colour: <span style="color:var(--ink-2);font-weight:400">${esc(c.name)}</span></b><span>${p.colors.length} colours</span></div>
          <div class="swatches">${p.colors.map((cc) => `<button class="swatch ${cc.key === sel.color ? 'active' : ''}" style="background:${cc.base}" data-color="${cc.key}" aria-label="${esc(cc.name)}" title="${esc(cc.name)}"></button>`).join('')}</div>
        </div>

        <div class="opt" id="size">
          <div class="opt__label"><b>Length (inches)${sel.size ? `: <span style="color:var(--ink-2);font-weight:400">${sel.size}"</span>` : ''}</b><button class="size-guide-link" id="size-guide">${icon('ruler', 'icon-xs')} Size guide</button></div>
          <div class="sizes">${p.sizes.map((s) => `<button class="size ${sel.size === s ? 'active' : ''} ${stockOf(s) <= 4 ? 'low' : ''}" data-size="${s}">${s}<small>${heightFor(s)}</small></button>`).join('')}</div>
          <p class="opt-error" id="size-err">Please select your length to continue.</p>
        </div>

        <div class="buy-row" id="buy-row">
          <div class="qty qty--lg"><button data-qty="-1" aria-label="Decrease" ${sel.qty <= 1 ? 'disabled' : ''}>${icon('minus', 'icon-xs')}</button><span>${sel.qty}</span><button data-qty="1" aria-label="Increase" ${sel.qty >= 10 ? 'disabled' : ''}>${icon('plus', 'icon-xs')}</button></div>
          <button class="btn" id="add-btn">${icon('bag')} Add to Bag</button>
          <button class="wish-btn ${Wish.has(p.id) ? 'is-wished' : ''}" data-action="wish" data-id="${p.id}" aria-label="Save to wishlist">${icon('heart')}</button>
        </div>
        <button class="btn btn--gold btn--block" id="buy-now" style="margin-top:10px">Buy it now</button>

        <div class="stock">${sel.size && stockOf(sel.size) <= 4 ? `<i style="background:#d08a3b;box-shadow:0 0 0 4px rgba(208,138,59,.18)"></i>Hurry — only ${stockOf(sel.size)} left in size ${sel.size}` : '<i></i>In stock · Ready to ship'}</div>
        <div class="tip" style="margin-top:14px">${icon('truck')}<span>Order today — delivered in Dhaka by <b>${deliveryDate(1)}</b>, outside Dhaka by <b>${deliveryDate(3)}</b>.</span></div>

        <div class="perks">
          <div>${icon('cash')}Cash on<br>Delivery</div>
          <div>${icon('refresh')}7-Day<br>Exchange</div>
          <div>${icon('shield')}Quality<br>Guaranteed</div>
        </div>

        <div class="accordion">
          <div class="acc open"><button class="acc__btn">Product Details<span class="plus"></span></button><div class="acc__panel"><div><div class="inner">
            <ul><li>Fabric: ${esc(p.fabric)}</li><li>Style: ${esc(styleName(p.style))}</li><li>Free-size chest (fits up to 46")</li><li>Matching hijab included</li><li>Designed &amp; finished in Dhaka</li></ul>
          </div></div></div></div>
          <div class="acc"><button class="acc__btn">Fabric &amp; Care<span class="plus"></span></button><div class="acc__panel"><div><div class="inner">
            <ul><li>Gentle hand wash in cold water</li><li>Do not bleach or tumble dry</li><li>Iron on low heat, inside out</li><li>Dry in shade to protect the colour</li></ul>
          </div></div></div></div>
          <div class="acc"><button class="acc__btn">Delivery &amp; Exchange<span class="plus"></span></button><div class="acc__panel"><div><div class="inner">
            <p>Inside Dhaka: ৳70 · 24–48 hours. Outside Dhaka: ৳130 · 2–4 days. Free delivery on orders over ৳5,000.</p>
            <p style="margin-top:8px">Not the perfect fit? Exchange your size within 7 days of delivery — simply message us and we'll arrange a pickup.</p>
          </div></div></div></div>
        </div>`;

    $('#sticky-buy').innerHTML = `<img src="${p.image(c.key, 'a')}" alt=""><div><b>${esc(p.name)}</b><small>${money(p.price)}${sel.size ? ` · ${sel.size}"` : ''}</small></div><button class="btn" id="sticky-add">${sel.size ? 'Add to Bag' : 'Select Size'}</button>`;
  }

  let openAcc = [true, false, false];
  const _render = render;
  render = function () {
    _render();
    $$('.acc', $('#info')).forEach((a, i) => a.classList.toggle('open', !!openAcc[i]));
  };

  function heightFor(s) {
    return { 50: "4'10\"", 52: "5'1\"", 54: "5'3\"", 56: "5'5\"", 58: "5'8\"" }[s] || '';
  }
  function styleName(s) {
    return { classic: 'Classic closed front', open: 'Open-front kimono', butterfly: 'Butterfly / farasha', belted: 'Belted A-line', cape: 'Layered cape' }[s];
  }

  function bindGallery() {
    const track = $('#g-track');
    const dots = $$('.gallery__dots span');
    const thumbs = $$('[data-thumb]');
    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, k) => d.classList.toggle('active', k === i));
      thumbs.forEach((d, k) => d.classList.toggle('active', k === i));
    }, { passive: true });
    thumbs.forEach((t) => t.addEventListener('click', () => track.scrollTo({ left: track.clientWidth * +t.dataset.thumb, behavior: 'smooth' })));
    // tap / click to zoom (pan with pointer on desktop)
    $$('.gallery__slide', track).forEach((s) => {
      const img = $('img', s);
      s.addEventListener('click', (e) => {
        const on = s.classList.toggle('zoom');
        if (on) { const r = s.getBoundingClientRect(); img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`; }
      });
      s.addEventListener('mousemove', (e) => {
        if (!s.classList.contains('zoom')) return;
        const r = s.getBoundingClientRect();
        img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
      });
      s.addEventListener('mouseleave', () => s.classList.remove('zoom'));
    });
  }

  function needSize() {
    if (sel.size) return false;
    const er = $('#size-err');
    er.classList.remove('show'); void er.offsetWidth; er.classList.add('show');
    $('#size').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
  }

  function sizeGuide() {
    $('#modal-box').innerHTML = `
      <button class="icon-btn modal__close" data-action="close" aria-label="Close">${icon('close')}</button>
      <span class="eyebrow">Find your fit</span>
      <h3 style="margin-top:8px">Size Guide</h3>
      <p class="muted" style="font-size:14px">Our borkas are free-size across the chest. Choose your length based on your height.</p>
      <table class="size-table">
        <thead><tr><th>Length</th><th>Your height</th><th>Chest</th></tr></thead>
        <tbody>
          <tr><td><b>50"</b></td><td>4'8" – 4'10"</td><td>Up to 46"</td></tr>
          <tr><td><b>52"</b></td><td>4'11" – 5'1"</td><td>Up to 46"</td></tr>
          <tr><td><b>54"</b></td><td>5'2" – 5'3"</td><td>Up to 46"</td></tr>
          <tr><td><b>56"</b></td><td>5'4" – 5'5"</td><td>Up to 48"</td></tr>
          <tr><td><b>58"</b></td><td>5'6" – 5'8"</td><td>Up to 48"</td></tr>
        </tbody>
      </table>
      <div class="tip">${icon('sparkle')}<span>Between sizes? Choose the longer length if you wear heels. Length is measured from shoulder to hem.</span></div>`;
    $('#modal-box').onclick = null;
    open('modal');
    $('#scrim').classList.add('show');
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t || !t.closest('#pdp, #sticky-buy')) return;
    if (t.dataset.color) { sel.color = t.dataset.color; renderGallery(); render(); }
    else if (t.dataset.size) { sel.size = +t.dataset.size; render(); }
    else if (t.dataset.qty) { sel.qty = Math.max(1, Math.min(10, sel.qty + +t.dataset.qty)); render(); }
    else if (t.id === 'size-guide') sizeGuide();
    else if (t.classList.contains('acc__btn')) { t.parentElement.classList.toggle('open'); openAcc = $$('.acc', $('#info')).map((a) => a.classList.contains('open')); }
    else if (t.id === 'add-btn' || t.id === 'sticky-add') {
      if (needSize()) return;
      added(p, sel.color, sel.size, sel.qty, $('#g-track img'));
    } else if (t.id === 'buy-now') {
      if (needSize()) return;
      window.BM.Cart.add(p.id, sel.color, sel.size, sel.qty);
      t.classList.add('loading');
      setTimeout(() => (location.href = 'checkout.html'), 450);
    } else if (t.id === 'share') {
      const data = { title: p.name + ' — Borka Mart', url: location.href };
      if (navigator.share) navigator.share(data).catch(() => {});
      else { navigator.clipboard?.writeText(location.href); toast({ title: 'Link copied', text: 'Share it with someone special', iconName: 'share' }); }
    }
  });

  // sticky add-to-bag bar
  const sticky = $('#sticky-buy');
  renderGallery();
  render();
  const onScroll = () => {
    const r = $('#buy-row').getBoundingClientRect();
    sticky.classList.toggle('show', r.bottom < 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  if (location.hash === '#size') setTimeout(sizeGuide, 400);

  /* reviews */
  const names = [['Rumana K.', 'Mirpur, Dhaka'], ['Afsana M.', 'Khulna'], ['Shirin A.', 'Gazipur'], ['Lamia H.', 'Cumilla']];
  const lines = [
    `Absolutely beautiful. The ${p.fabric.split(',')[0].toLowerCase()} feels premium and the finishing is neat. Exactly like the pictures.`,
    'Perfect length with the size guide. Delivery was quick and the packaging felt like a gift. Will order again, in shaa Allah.',
    'So elegant and comfortable — I wore it all day at a family dawat and received so many compliments.',
    'The colour is rich and the embroidery is delicate. Great value for this quality.',
  ];
  const dist = [78, 16, 4, 1, 1];
  $('#pdp-reviews').innerHTML = `
    <div class="rv">
      <div class="rv__sum">
        <b>${p.rating.toFixed(1)}</b>
        <div>${'<svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>'.repeat(5)}</div>
        <small>Based on ${p.reviews} reviews</small>
        <div class="rv__bars">${dist.map((d, i) => `<div><span>${5 - i}★</span><i><em style="width:${d}%"></em></i><span>${d}%</span></div>`).join('')}</div>
      </div>
      <div class="rv__list">${names.map(([n, c], i) => `
        <div class="rv__item">
          <div class="rv__head"><span class="avatar" style="background:${['#1e5a4c', '#6b1e2e', '#b8925a', '#4b2a44'][i]}">${n[0]}</span><div><b>${n}</b><small>${c} · <span class="verified">${icon('check', 'icon-xs')}Verified buyer</span></small></div><span class="stars" style="margin-left:auto">${'<svg viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/></svg>'.repeat(i === 3 ? 4 : 5)}</span></div>
          <p>${esc(lines[i])}</p>
        </div>`).join('')}</div>
    </div>`;

  /* related & recent */
  const related = [...PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id), ...PRODUCTS.filter((x) => x.category !== p.category && x.tags.includes('best'))].slice(0, 4);
  $('#related').innerHTML = related.map((x) => card(x)).join('');
  const rec = recent.map(byId).filter(Boolean).slice(0, 4);
  if (rec.length) { $('#recent-sec').hidden = false; $('#recent').innerHTML = rec.map((x) => card(x)).join(''); }
  reveal();
})();

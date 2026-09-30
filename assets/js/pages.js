/* Borka Mart — wishlist, order tracking & story pages */
(function () {
  const { $, $$, card, money, esc, icon, byId, color, PRODUCTS, Wish, store, toast, reveal } = window.BM;
  const page = document.body.dataset.page;

  /* ---------- wishlist ---------- */
  if (page === 'wishlist') {
    const draw = () => {
      const items = Wish.list().map(byId).filter(Boolean);
      $('#wish-sub').textContent = items.length ? `${items.length} saved piece${items.length > 1 ? 's' : ''} — tap the bag to add in your size.` : 'Pieces you love, saved for later.';
      $('#wish-grid').innerHTML = items.length
        ? items.map((p) => card(p)).join('')
        : `<div class="empty-state">${icon('heart')}<h3>Nothing saved yet</h3><p>Tap the heart on any piece to keep it here.</p><a class="btn" href="shop.html">Discover the collection</a></div>`;
      $('#wish-trending').innerHTML = PRODUCTS.filter((p) => p.tags.includes('best') && !Wish.has(p.id)).slice(0, 4).map((p) => card(p)).join('');
    };
    draw();
    document.addEventListener('bm:wish', draw);
  }

  /* ---------- order tracking ---------- */
  if (page === 'track') {
    const orders = store.get('orders', []);
    const stage = (o) => {
      const mins = (Date.now() - o.date) / 60000;
      return mins < 2 ? 1 : mins < 60 ? 2 : mins < 60 * 24 ? 3 : 4;
    };
    const show = (o) => {
      const s = stage(o);
      const labels = ['Order placed', 'Packed at our atelier', 'Out with courier', 'Delivered'];
      const d = new Date(o.date);
      $('#track-result').innerHTML = `<div class="panel">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><h3 style="margin:0">Order #${esc(o.id)}</h3><span class="muted" style="font-size:13px">${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
        <p style="margin:6px 0 0;color:var(--emerald);font-weight:500">${labels[s - 1]}</p>
        <div class="timeline" style="--done:${((s - 1) / 3) * 75}%;margin:26px auto">
          ${[['check', 'Placed'], ['package', 'Packed'], ['truck', 'Shipped'], ['home', 'Delivered']].map(([ic, t], i) => `<div class="${i < s ? 'done' : ''}"><span>${icon(ic)}</span>${t}</div>`).join('')}
        </div>
        ${o.items.map((i) => { const p = byId(i.id); if (!p) return ''; const c = color(p, i.color); return `<div class="summary-item"><span class="thumb"><img src="${p.image(c.key, 'a')}" alt=""><i>${i.qty}</i></span><span><b>${esc(p.name)}</b><small>${esc(c.name)} · ${i.size}"</small></span><span class="price">${money(i.price * i.qty)}</span></div>`; }).join('')}
        <div class="divider"></div>
        <div class="sum-row total" style="margin:0"><span>Total</span><span>${money(o.total)}</span></div>
      </div>`;
      $('#track-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const inp = $('#t-id');
    $('#track-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = inp.value.trim().toUpperCase().replace(/^#/, '');
      const o = orders.find((x) => x.id === id);
      inp.closest('.field').classList.toggle('error', !o);
      if (o) show(o);
      else $('#track-result').innerHTML = '';
    });
    inp.addEventListener('input', () => inp.closest('.field').classList.remove('error'));
    if (orders.length) {
      $('#my-orders').innerHTML = `<div class="search__label">Your recent orders</div>` + orders.slice(0, 5).map((o) => `<button class="radio-card" style="width:100%;text-align:left" data-oid="${esc(o.id)}"><span class="rc-body"><b>#${esc(o.id)}</b><small>${o.items.reduce((s, i) => s + i.qty, 0)} item(s) · ${new Date(o.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</small></span><span class="rc-end">${money(o.total)}</span>${icon('chevron', 'icon-sm')}</button>`).join('');
      $('#my-orders').addEventListener('click', (e) => {
        const b = e.target.closest('[data-oid]'); if (!b) return;
        inp.value = b.dataset.oid;
        show(orders.find((x) => x.id === b.dataset.oid));
      });
    }
    const q = new URLSearchParams(location.search).get('id');
    if (q) { inp.value = q; const o = orders.find((x) => x.id === q); if (o) show(o); }
  }

  /* ---------- story / contact ---------- */
  if (page === 'about') {
    $$('.acc__btn').forEach((b) => b.addEventListener('click', () => b.parentElement.classList.toggle('open')));
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, to = +el.dataset.count, t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1600);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN') + (to > 1000 && k === 1 ? '+' : '');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    }), { threshold: 0.4 });
    $$('[data-count]').forEach((el) => io.observe(el));

    const f = $('#contact-form');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      ['m-name', 'm-phone', 'm-msg'].forEach((id) => {
        const el = $('#' + id), bad = el.value.trim().length < 2;
        el.closest('.field').classList.toggle('error', bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      const btn = $('button[type=submit]', f);
      btn.classList.add('loading');
      setTimeout(() => {
        f.innerHTML = `<div class="center" style="padding:30px 0"><div class="success__check" style="width:72px;height:72px">${icon('check')}</div><h3 style="justify-content:center">Message received</h3><p class="muted">Thank you — our team will get back to you shortly.</p></div>`;
        toast({ title: 'Message sent', text: 'We’ll be in touch soon.', iconName: 'mail' });
      }, 900);
    });
    $$('.field input, .field textarea', f).forEach((el) => el.addEventListener('input', () => el.closest('.field').classList.remove('error')));
  }

  reveal();
})();

/* Borka Mart — checkout */
(function () {
  const { $, $$, money, esc, icon, byId, color, Cart, FREE_SHIP, store, toast, open, closeAll } = window.BM;

  const DISTRICTS = ['Dhaka', 'Gazipur', 'Narayanganj', 'Chattogram', "Cox's Bazar", 'Cumilla', 'Sylhet', 'Moulvibazar', 'Khulna', 'Jashore', 'Rajshahi', 'Bogura', 'Barishal', 'Rangpur', 'Dinajpur', 'Mymensingh', 'Tangail', 'Faridpur', 'Noakhali', 'Feni', 'Brahmanbaria', 'Pabna', 'Kushtia', 'Narsingdi', 'Manikganj', 'Munshiganj', 'Savar'];
  const main = $('#checkout-main');
  const form = $('#checkout-form');

  const oid = new URLSearchParams(location.search).get('order');
  const pastOrder = oid && store.get('orders', []).find((x) => x.id === oid);
  let placing = false;

  if (!Cart.items().length && !pastOrder) {
    main.innerHTML = `<section class="section"><div class="container"><div class="cart-empty">
      <svg class="cart-empty__art" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="56" fill="#f4ede3"/><path d="M36 48h48l-4 42H40z" stroke="#b8925a" stroke-width="2"/><path d="M48 48v-6a12 12 0 0 1 24 0v6" stroke="#b8925a" stroke-width="2"/></svg>
      <h3>Your bag is empty</h3><p>Add a piece you love to begin checkout.</p><a class="btn" href="shop.html">Continue shopping</a></div></div></section>`;
    return;
  }

  // restore saved details for returning customers
  const saved = store.get('customer', {});
  $('#f-district').innerHTML = `<option value="">Select district</option>` + DISTRICTS.map((d) => `<option ${saved.district === d ? 'selected' : ''}>${d}</option>`).join('');
  ['name', 'phone', 'email', 'area', 'address'].forEach((k) => { if (saved[k]) form.elements[k].value = saved[k]; });

  const isDhaka = () => ['Dhaka', 'Savar'].includes(form.elements.district.value);
  let ship = 'standard';

  function shipCost() {
    const sub = Cart.subtotal();
    if (ship === 'express') return 150;
    if (sub >= FREE_SHIP) return 0;
    return isDhaka() || !form.elements.district.value ? 70 : 130;
  }

  function renderShip() {
    const free = Cart.subtotal() >= FREE_SHIP;
    const std = free ? 'Free' : money(isDhaka() || !form.elements.district.value ? 70 : 130);
    const opts = [
      { v: 'standard', t: isDhaka() ? 'Standard — Inside Dhaka' : form.elements.district.value ? 'Standard — Outside Dhaka' : 'Standard Delivery', s: isDhaka() || !form.elements.district.value ? '24–48 hours' : '2–4 working days', p: std },
    ];
    if (isDhaka()) opts.push({ v: 'express', t: 'Express — Same Day', s: 'Order before 2pm, delivered tonight', p: money(150) });
    if (!opts.find((o) => o.v === ship)) ship = 'standard';
    $('#ship-options').innerHTML = opts.map((o) => `<label class="radio-card"><input type="radio" name="ship" value="${o.v}" ${ship === o.v ? 'checked' : ''}><span class="ring"></span><span class="rc-body"><b>${o.t}</b><small>${o.s}</small></span><span class="rc-end">${o.p}</span></label>`).join('');
  }

  function renderSummary() {
    $('#sum-items').innerHTML = Cart.items().map((i) => {
      const p = byId(i.id); if (!p) return '';
      const c = color(p, i.color);
      return `<div class="summary-item"><span class="thumb"><img src="${p.image(c.key, 'a')}" alt=""><i>${i.qty}</i></span><span><b>${esc(p.name)}</b><small>${esc(c.name)} · ${i.size}"</small></span><span class="price">${money(p.price * i.qty)}</span></div>`;
    }).join('');

    const code = Cart.coupon();
    $('#coupon-box').innerHTML = code && Cart.discount()
      ? `<div class="applied"><span>${icon('tag', 'icon-xs')} <b>${code}</b> — ${esc(Cart.couponLabel())}</span><button type="button" class="link-btn" id="rm-coupon">Remove</button></div>`
      : `<div class="coupon"><input id="coupon-in" placeholder="Promo code" aria-label="Promo code"><button type="button" class="btn btn--outline" id="apply-coupon">Apply</button></div>
         <p class="coupon-hint">Try <button type="button" data-code="EID10">EID10</button> for 10% off</p>`;

    const sub = Cart.subtotal(), disc = Cart.discount(), sh = shipCost();
    const total = sub - disc + sh;
    $('#sum-totals').innerHTML = `
      <div class="sum-row"><span>Subtotal</span><span>${money(sub)}</span></div>
      ${disc ? `<div class="sum-row"><span>Discount</span><span class="save">−${money(disc)}</span></div>` : ''}
      <div class="sum-row"><span>Delivery</span><span>${sh ? money(sh) : '<span class="save">Free</span>'}</span></div>
      <div class="sum-row total"><span>Total</span><span>${money(total)}</span></div>`;
    $('#place-order').innerHTML = `Place Order · ${money(total)}`;
  }

  function renderAll() { renderShip(); renderSummary(); }
  renderAll();

  form.addEventListener('change', (e) => {
    if (e.target.name === 'district') renderAll();
    if (e.target.name === 'ship') { ship = e.target.value; renderSummary(); }
    if (e.target.name === 'pay') $$('.pay-extra').forEach((x) => x.classList.toggle('show', x.dataset.for === e.target.value));
  });

  form.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.id === 'apply-coupon' || t.dataset.code) {
      const v = t.dataset.code || $('#coupon-in').value;
      const r = Cart.applyCoupon(v);
      toast({ title: r.ok ? 'Code applied' : 'Code not applied', text: r.msg, iconName: r.ok ? 'gift' : 'tag' });
      renderSummary();
    } else if (t.id === 'rm-coupon') { Cart.removeCoupon(); renderSummary(); }
  });
  document.addEventListener('bm:cart', () => {
    if (placing || !document.body.contains(form)) return;
    if (!Cart.items().length) location.reload(); else renderAll();
  });

  // input formatting
  const phone = form.elements.phone;
  phone.addEventListener('input', () => { phone.value = phone.value.replace(/\D/g, '').slice(0, 11); });
  $('#c-num').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
  $('#c-exp').addEventListener('input', (e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); e.target.value = v.length > 2 ? `${v.slice(0, 2)} / ${v.slice(2)}` : v; });
  $('#c-cvc').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });

  function validate() {
    const rules = {
      name: (v) => v.trim().length >= 2,
      phone: (v) => /^01[3-9]\d{8}$/.test(v),
      email: (v) => !v || /^\S+@\S+\.\S+$/.test(v),
      district: (v) => !!v,
      area: (v) => v.trim().length >= 2,
      address: (v) => v.trim().length >= 5,
    };
    let first = null;
    Object.entries(rules).forEach(([k, fn]) => {
      const el = form.elements[k];
      const ok = fn(el.value);
      el.closest('.field').classList.toggle('error', !ok);
      if (!ok && !first) first = el;
    });
    const pay = form.elements.pay.value;
    if (pay === 'card') {
      [['c-num', (v) => v.replace(/\s/g, '').length >= 15], ['c-exp', (v) => /^\d{2} \/ \d{2}$/.test(v)], ['c-cvc', (v) => v.length >= 3]].forEach(([id, fn]) => {
        const el = $('#' + id), ok = fn(el.value);
        el.closest('.field').classList.toggle('error', !ok);
        if (!ok && !first) first = el;
      });
    }
    if (first) { first.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => first.focus({ preventScroll: true }), 400); }
    return !first;
  }
  $$('input, select', form).forEach((el) => el.addEventListener('input', () => el.closest('.field')?.classList.remove('error')));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) { toast({ title: 'Almost there', text: 'Please check the highlighted fields.', iconName: 'pin' }); return; }
    const btn = $('#place-order');
    btn.classList.add('loading');
    const pay = form.elements.pay.value;
    const finish = () => placeOrder(pay);
    if (pay === 'bkash' || pay === 'nagad' || pay === 'card') gateway(pay, finish);
    else setTimeout(finish, 1100);
  });

  function gateway(pay, done) {
    const name = { bkash: 'bKash', nagad: 'Nagad', card: 'your bank' }[pay];
    const total = Cart.subtotal() - Cart.discount() + shipCost();
    const box = $('#modal-box');
    box.onclick = null;
    box.innerHTML = `<div class="center" style="padding:20px 0 10px">
      <div class="pay-logo ${pay}" style="width:80px;height:44px;margin:0 auto 18px;font-size:15px;border-radius:10px">${pay === 'card' ? 'VISA' : name}</div>
      <h3 id="gw-title">Connecting to ${name}…</h3>
      <p class="muted" id="gw-text" style="margin-top:6px">Securely authorising ${money(total)}</p>
      <div style="width:44px;height:44px;margin:24px auto 0;border-radius:50%;border:3px solid var(--sand);border-top-color:var(--emerald);animation:spin .8s linear infinite" id="gw-spin"></div>
    </div>`;
    open('modal');
    $('#scrim').classList.add('show');
    setTimeout(() => {
      $('#gw-title').textContent = 'Payment successful';
      $('#gw-text').textContent = `${money(total)} paid via ${pay === 'card' ? 'card' : name}`;
      $('#gw-spin').outerHTML = `<div class="success__check" style="width:64px;height:64px;margin:22px auto 0;box-shadow:none">${icon('check')}</div>`;
      setTimeout(() => { closeAll(true); done(); }, 1100);
    }, 1800);
  }

  function placeOrder(pay) {
    const f = form.elements;
    const customer = { name: f.name.value.trim(), phone: f.phone.value, email: f.email.value.trim(), district: f.district.value, area: f.area.value.trim(), address: f.address.value.trim() };
    store.set('customer', customer);
    const sub = Cart.subtotal(), disc = Cart.discount(), sh = shipCost();
    const id = 'BM' + String(Date.now()).slice(-7);
    const order = {
      id, date: Date.now(), customer, pay, ship, note: f.note.value.trim(),
      items: Cart.items().map((i) => ({ ...i, price: byId(i.id).price })),
      subtotal: sub, discount: disc, shipping: sh, total: sub - disc + sh,
    };
    const orders = store.get('orders', []);
    orders.unshift(order);
    store.set('orders', orders.slice(0, 20));
    placing = true;
    Cart.clear();
    history.replaceState(null, '', 'checkout.html?order=' + id);
    success(order);
  }

  function success(o) {
    const payName = { cod: 'Cash on Delivery', bkash: 'bKash', nagad: 'Nagad', card: 'Card' }[o.pay];
    const eta = new Date(o.date + (['Dhaka', 'Savar'].includes(o.customer.district) ? (o.ship === 'express' ? 0 : 1) : 3) * 864e5).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    main.innerHTML = `<section class="container success">
      <div class="success__check">${icon('check')}</div>
      <span class="eyebrow both">Order confirmed</span>
      <h1 style="margin-top:10px">Thank you, <em>${esc(o.customer.name.split(' ')[0])}</em></h1>
      <p>Your order has been placed successfully. We've sent a confirmation SMS to <b>+88 ${esc(o.customer.phone)}</b>. Expected delivery: <b>${eta}</b>.</p>
      <div class="order-id">Order <b>#${o.id}</b></div>
      <div class="timeline" style="--done:0%">
        <div class="done"><span>${icon('check')}</span>Placed</div>
        <div><span>${icon('package')}</span>Packed</div>
        <div><span>${icon('truck')}</span>Shipped</div>
        <div><span>${icon('home')}</span>Delivered</div>
      </div>
      <div class="panel receipt">
        <h3>Order Details</h3>
        ${o.items.map((i) => { const p = byId(i.id), c = color(p, i.color); return `<div class="summary-item"><span class="thumb"><img src="${p.image(c.key, 'a')}" alt=""><i>${i.qty}</i></span><span><b>${esc(p.name)}</b><small>${esc(c.name)} · ${i.size}"</small></span><span class="price">${money(i.price * i.qty)}</span></div>`; }).join('')}
        <div class="divider"></div>
        <div class="sum-row"><span>Subtotal</span><span>${money(o.subtotal)}</span></div>
        ${o.discount ? `<div class="sum-row"><span>Discount</span><span class="save">−${money(o.discount)}</span></div>` : ''}
        <div class="sum-row"><span>Delivery</span><span>${o.shipping ? money(o.shipping) : 'Free'}</span></div>
        <div class="sum-row total"><span>${o.pay === 'cod' ? 'To pay on delivery' : 'Paid'}</span><span>${money(o.total)}</span></div>
        <div class="divider"></div>
        <div class="sum-row"><span>Payment</span><span>${payName}</span></div>
        <div class="sum-row" style="align-items:flex-start;gap:20px"><span>Ship to</span><span style="text-align:right">${esc(o.customer.address)}, ${esc(o.customer.area)}, ${esc(o.customer.district)}</span></div>
      </div>
      <div class="hero__ctas mt-32"><a class="btn" href="shop.html">Continue Shopping</a><a class="btn btn--outline" href="track.html?id=${o.id}">Track Order</a></div>
    </section>`;
    window.scrollTo({ top: 0 });
    if (!pastOrder || o !== pastOrder) confetti();
  }

  function confetti() {
    const colors = ['#d4b06a', '#123a33', '#c48e8c', '#efe2c6', '#1e5a4c'];
    for (let i = 0; i < 70; i++) {
      const d = document.createElement('i');
      const s = 6 + Math.random() * 6;
      Object.assign(d.style, {
        position: 'fixed', zIndex: 150, top: '-12px', left: Math.random() * 100 + 'vw', width: s + 'px', height: s * 0.5 + 'px',
        background: colors[i % colors.length], borderRadius: '2px', pointerEvents: 'none', opacity: 0.9,
        transform: `rotate(${Math.random() * 360}deg)`, transition: `transform ${2 + Math.random() * 1.5}s cubic-bezier(.2,.6,.4,1), top ${2 + Math.random() * 1.5}s cubic-bezier(.3,.1,.5,1), opacity 3s`,
      });
      document.body.appendChild(d);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        d.style.top = 70 + Math.random() * 40 + 'vh';
        d.style.transform = `translateX(${(Math.random() - 0.5) * 200}px) rotate(${Math.random() * 720}deg)`;
        d.style.opacity = 0;
      }));
      setTimeout(() => d.remove(), 4000);
    }
  }

  // Revisiting a confirmation link
  if (pastOrder) success(pastOrder);
})();

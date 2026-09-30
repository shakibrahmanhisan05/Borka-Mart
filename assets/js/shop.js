/* Borka Mart — shop listing */
(function () {
  const { $, $$, card, money, esc, PRODUCTS, CATEGORIES, reveal, open, icon } = window.BM;

  const FAMILIES = {
    black: { name: 'Black', hex: '#1b1a1f', keys: ['noir'] },
    blue: { name: 'Blue', hex: '#2c3e63', keys: ['navy', 'indigo', 'ice'] },
    green: { name: 'Green', hex: '#1e5a4c', keys: ['emerald', 'teal', 'sage', 'olive'] },
    neutral: { name: 'Beige & Brown', hex: '#b89b7a', keys: ['coffee', 'mocha', 'sand', 'champagne', 'terracotta'] },
    pink: { name: 'Pink & Red', hex: '#b9716f', keys: ['rose', 'blush', 'wine'] },
    purple: { name: 'Purple', hex: '#6d4f68', keys: ['mauve', 'plum', 'lavender'] },
    grey: { name: 'Grey', hex: '#707078', keys: ['charcoal', 'grey'] },
    white: { name: 'White', hex: '#efe8dc', keys: ['pearl', 'ivory'] },
  };
  const familyOf = (key) => Object.keys(FAMILIES).find((f) => FAMILIES[f].keys.includes(key));

  const params = new URLSearchParams(location.search);
  const maxPrice = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 250) * 250;
  const state = {
    cat: params.get('cat') || 'all',
    tags: params.get('tag') ? [params.get('tag')] : [],
    q: params.get('q') || '',
    colors: [],
    price: maxPrice,
    sort: 'featured',
  };

  /* chips */
  const chips = $('#cat-chips');
  chips.innerHTML = [{ id: 'all', name: 'All' }, ...CATEGORIES].map((c) => `<button class="chip" data-cat="${c.id}">${esc(c.name)}</button>`).join('');
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    state.cat = b.dataset.cat;
    state.q = '';
    render();
    b.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  });

  /* colour filter */
  $('#color-filter').innerHTML = Object.entries(FAMILIES).map(([k, f]) => `<button data-color="${k}"><span class="dot" style="background:${f.hex}"></span>${f.name}</button>`).join('');
  $('#color-filter').addEventListener('click', (e) => {
    const b = e.target.closest('[data-color]'); if (!b) return;
    const k = b.dataset.color;
    state.colors = state.colors.includes(k) ? state.colors.filter((x) => x !== k) : [...state.colors, k];
    render();
  });

  /* tags */
  $('#tag-filter').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tag]'); if (!b) return;
    const k = b.dataset.tag;
    state.tags = state.tags.includes(k) ? state.tags.filter((x) => x !== k) : [...state.tags, k];
    render();
  });

  /* price */
  const range = $('#price');
  range.max = maxPrice;
  range.value = state.price;
  range.addEventListener('input', () => { state.price = +range.value; render(); });

  $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
  $('#clear-filters').addEventListener('click', () => {
    Object.assign(state, { cat: 'all', tags: [], colors: [], price: maxPrice, q: '' });
    range.value = maxPrice;
    render();
  });
  $('#filter-open').addEventListener('click', () => open('filters'));

  function filtered() {
    const q = state.q.toLowerCase();
    let list = PRODUCTS.filter((p) =>
      (state.cat === 'all' || p.category === state.cat) &&
      p.price <= state.price &&
      state.tags.every((t) => p.tags.includes(t)) &&
      (!state.colors.length || p.colors.some((c) => state.colors.includes(familyOf(c.key)))) &&
      (!q || [p.name, p.fabric, p.desc, p.style, ...p.colors.map((c) => c.name)].join(' ').toLowerCase().includes(q)));
    const idx = (p) => PRODUCTS.indexOf(p);
    const sorters = {
      featured: (a, b) => (b.tags.includes('best') - a.tags.includes('best')) || idx(a) - idx(b),
      new: (a, b) => (b.tags.includes('new') - a.tags.includes('new')) || idx(b) - idx(a),
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
    };
    return list.sort(sorters[state.sort]);
  }

  function render() {
    const cat = CATEGORIES.find((c) => c.id === state.cat);
    const tagTitles = { new: ['New', 'Arrivals'], best: ['Our', 'Bestsellers'], sale: ['On', 'Sale'] };
    let t = ['The', 'Collection'], sub = 'Borkas, abayas & jilbabs designed in Dhaka.';
    if (state.q) { t = ['Results for', `“${state.q}”`]; sub = 'Handpicked matches from our collection.'; }
    else if (cat) { const w = cat.name.split(' '); t = [w.slice(0, -1).join(' ') || cat.name, w.length > 1 ? w[w.length - 1] : '']; sub = cat.blurb + '.'; }
    else if (state.tags.length === 1 && tagTitles[state.tags[0]]) t = tagTitles[state.tags[0]];
    $('#shop-title').innerHTML = `${esc(t[0])} <em>${esc(t[1])}</em>`;
    $('#shop-sub').textContent = sub;
    $('#crumb-cur').textContent = cat ? cat.name : 'Shop';
    document.title = `${cat ? cat.name : state.q ? 'Search' : 'Shop'} — Borka Mart`;

    $$('[data-cat]', chips).forEach((b) => b.classList.toggle('active', b.dataset.cat === state.cat));
    $$('[data-color]').forEach((b) => b.classList.toggle('active', state.colors.includes(b.dataset.color)));
    $$('[data-tag]').forEach((b) => b.classList.toggle('active', state.tags.includes(b.dataset.tag)));
    $('#price-val').textContent = money(state.price);

    const n = state.colors.length + state.tags.length + (state.price < maxPrice ? 1 : 0);
    const badge = $('#filter-n');
    badge.hidden = !n;
    badge.textContent = n;

    const list = filtered();
    $('#result-count').textContent = `${list.length} ${list.length === 1 ? 'style' : 'styles'}`;
    $('#show-results').textContent = `Show ${list.length} result${list.length === 1 ? '' : 's'}`;
    $('#shop-grid').innerHTML = list.length
      ? list.map((p, i) => card(p, `reveal reveal-d${i % 3}`)).join('')
      : `<div class="empty-state">${icon('search')}<h3>Nothing matches — yet</h3><p>Try removing a filter or explore our full collection.</p><button class="btn" id="reset-empty">Reset filters</button></div>`;
    const reset = $('#reset-empty');
    if (reset) reset.onclick = () => $('#clear-filters').click();
    reveal($('#shop-grid'));

    const u = new URLSearchParams();
    if (state.cat !== 'all') u.set('cat', state.cat);
    if (state.tags.length === 1) u.set('tag', state.tags[0]);
    if (state.q) u.set('q', state.q);
    history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
  }

  render();
})();

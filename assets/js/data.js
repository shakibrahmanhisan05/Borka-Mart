/* Borka Mart — catalogue */
(function (root) {
  const SKIN = ['#E6BE9C', '#D9A987', '#C8936F', '#EBC8AA', '#B98260'];

  const CATEGORIES = [
    { id: 'everyday', name: 'Everyday Borka', blurb: 'Breathable comfort for every day', cover: 'p07' },
    { id: 'luxury', name: 'Eid & Party', blurb: 'Hand-finished festive pieces', cover: 'p11' },
    { id: 'butterfly', name: 'Butterfly Abaya', blurb: 'Flowing farasha silhouettes', cover: 'p03' },
    { id: 'kimono', name: 'Kimono & Open', blurb: 'Layer-ready open fronts', cover: 'p04' },
    { id: 'cape', name: 'Cape & Jilbab', blurb: 'Graceful full coverage', cover: 'p06' },
  ];

  const P = (o) => Object.assign({ sizes: [50, 52, 54, 56, 58], rating: 4.8, reviews: 40, tags: [] }, o);

  const PRODUCTS = [
    P({
      id: 'p01', name: 'Noor Classic Borka', category: 'everyday', style: 'classic', motif: 'vine',
      price: 3450, oldPrice: 3950, rating: 4.9, reviews: 212, tags: ['best'], badge: 'Bestseller',
      fabric: 'Premium Cherry Nida',
      colors: [
        { key: 'noir', name: 'Noir Black', base: '#1B1A1F', trim: '#C9A45C', bg: ['#F1E9DF', '#E3D5C5'] },
        { key: 'navy', name: 'Midnight Navy', base: '#1E2740', trim: '#C9A45C', bg: ['#EEE9E2', '#DCD3C6'] },
        { key: 'coffee', name: 'Coffee', base: '#4A3328', trim: '#D9BC84', bg: ['#F3ECE3', '#E4D6C6'] },
      ],
      desc: 'Our signature everyday borka, cut from soft, matte Cherry Nida that drapes beautifully and never clings. A delicate hand-guided gold vine runs down the front placket and cuffs — understated, refined, unmistakably Borka Mart.',
    }),
    P({
      id: 'p02', name: 'Zahra Embroidered Abaya', category: 'luxury', style: 'classic', motif: 'vine', hem: true,
      price: 6850, oldPrice: 7900, rating: 4.9, reviews: 138, tags: ['new', 'best'], badge: 'New',
      fabric: 'Dubai Crepe with Zari Embroidery', brooch: true,
      colors: [
        { key: 'navy', name: 'Royal Navy', base: '#1B2445', trim: '#D6B26A', bg: ['#F0E8DE', '#E0D1BF'] },
        { key: 'noir', name: 'Noir Gold', base: '#17161A', trim: '#D6B26A', bg: ['#EFE6DA', '#DCCBB6'] },
      ],
      desc: 'A statement piece for Eid mornings and wedding evenings. Rich Dubai crepe is finished with a deep zari-embroidered hem and matching placket, crowned with a pearl-set hijab brooch.',
    }),
    P({
      id: 'p03', name: 'Layla Butterfly Borka', category: 'butterfly', style: 'butterfly', motif: 'pearl',
      price: 4650, rating: 4.8, reviews: 96, tags: ['best'], badge: 'Trending',
      fabric: 'Soft Korean Chiffon, double layer',
      colors: [
        { key: 'rose', name: 'Dusty Rose', base: '#C48E8C', trim: '#F4DDBE', bg: ['#F6ECE8', '#E8D6CF'] },
        { key: 'mauve', name: 'Mauve', base: '#8E6B7E', trim: '#EFD9C2', bg: ['#F2EAEA', '#E0D2D2'] },
        { key: 'noir', name: 'Noir', base: '#1C1B20', trim: '#E4D0B0', bg: ['#EFE8E4', '#DDD0C8'] },
      ],
      desc: 'Wide farasha wings that move with you. Double-layered Korean chiffon gives full coverage with a weightless feel, finished with a column of hand-set faux pearls.',
    }),
    P({
      id: 'p04', name: 'Amira Open Kimono', category: 'kimono', style: 'open', motif: 'geo',
      price: 3950, rating: 4.7, reviews: 74, tags: ['new'], badge: 'New',
      fabric: 'Linen-blend Crepe',
      colors: [
        { key: 'sand', name: 'Desert Sand', base: '#C9B397', inner: '#F4ECE0', trim: '#9C7A4A', bg: ['#EFE6DC', '#DDCDBB'] },
        { key: 'sage', name: 'Sage', base: '#8E9A80', inner: '#F0EEE4', trim: '#6E6440', bg: ['#EDEDE4', '#D9D9CB'] },
      ],
      desc: 'An open-front kimono abaya with geometric-trim edges, paired with a soft ivory inner slip. Wear it closed with the inner or open over your favourite long dress.',
    }),
    P({
      id: 'p05', name: 'Safiya Belted Abaya', category: 'everyday', style: 'belted', motif: 'vine', hem: true,
      price: 4250, oldPrice: 4990, rating: 4.8, reviews: 88, tags: ['sale'], badge: '-15%',
      fabric: 'Medina Silk',
      colors: [
        { key: 'olive', name: 'Olive Grove', base: '#6F7A5E', trim: '#D9C28E', bg: ['#EEEBE2', '#DAD5C6'] },
        { key: 'mocha', name: 'Mocha', base: '#7A5A48', trim: '#E2C79A', bg: ['#F2EAE2', '#E0D2C4'] },
      ],
      desc: 'A tailored everyday abaya with a self-tie belt that defines the waist gently. Medina silk has a subtle sheen and resists wrinkles — perfect from campus to office.',
    }),
    P({
      id: 'p06', name: 'Maryam Cape Borka', category: 'cape', style: 'cape', motif: 'geo',
      price: 5450, rating: 4.9, reviews: 121, tags: ['best'], badge: 'Bestseller',
      fabric: 'Premium Nida with Chiffon Cape',
      colors: [
        { key: 'noir', name: 'Noir Silver', base: '#211F28', trim: '#C4C8D0', bg: ['#EDEBEA', '#D8D4D1'] },
        { key: 'plum', name: 'Deep Plum', base: '#3E2336', trim: '#D8B8C8', bg: ['#F1E8EC', '#DECFD6'] },
      ],
      desc: 'A layered cape borka with a hip-length chiffon overlay and silver geometric trim. Elegant full coverage that feels light and airy all day.',
    }),
    P({
      id: 'p07', name: 'Hafsa Everyday Borka', category: 'everyday', style: 'classic', motif: 'geo',
      price: 2650, rating: 4.7, reviews: 305, tags: ['best'],
      fabric: 'Breathable Dubai Cherry',
      colors: [
        { key: 'charcoal', name: 'Charcoal', base: '#34343A', trim: '#B9A27A', bg: ['#EFEBE6', '#DDD6CD'] },
        { key: 'noir', name: 'Noir', base: '#18171B', trim: '#B9A27A', bg: ['#F1EAE1', '#E1D5C7'] },
        { key: 'teal', name: 'Deep Teal', base: '#1F4A4A', trim: '#D0B98A', bg: ['#ECEDE8', '#D6D9D1'] },
      ],
      desc: 'Lightweight, breathable and made for Dhaka weather. The Hafsa is our most-loved daily borka with a clean geometric placket and easy-wear snap front.',
    }),
    P({
      id: 'p08', name: 'Inaya Pearl Abaya', category: 'luxury', style: 'classic', motif: 'pearl', hem: true,
      price: 7450, rating: 5.0, reviews: 64, tags: ['new'], badge: 'Limited',
      fabric: 'Satin-back Crepe, hand-set pearls', hijabTrim: true,
      colors: [
        { key: 'champagne', name: 'Champagne', base: '#D8C4A8', trim: '#9D8055', bg: ['#F3ECE3', '#E4D8C8'] },
        { key: 'pearl', name: 'Pearl White', base: '#ECE6DC', trim: '#A58E68', bg: ['#EDE6DD', '#D6CBBD'] },
      ],
      desc: 'Soft champagne satin-back crepe with rows of hand-set pearls along the hem and placket. Designed for nikkah, walima and every moment worth remembering.',
    }),
    P({
      id: 'p09', name: 'Rania Silk Farasha', category: 'butterfly', style: 'butterfly', motif: 'vine', hem: true,
      price: 5850, oldPrice: 6500, rating: 4.9, reviews: 57, tags: ['sale', 'new', 'best'], badge: '-10%',
      fabric: 'Armani Silk',
      colors: [
        { key: 'emerald', name: 'Emerald', base: '#1E5A4C', trim: '#D8BC7C', bg: ['#EEEAE0', '#DAD3C2'] },
        { key: 'wine', name: 'Wine', base: '#5E1F2E', trim: '#DDB978', bg: ['#F3E8E2', '#E2D0C6'] },
      ],
      desc: 'Liquid-smooth Armani silk in a generous farasha cut, finished with a gold vine hem. It catches the light beautifully — made for festive gatherings.',
    }),
    P({
      id: 'p10', name: 'Sumaiya Nida Borka', category: 'everyday', style: 'belted', motif: 'geo',
      price: 3150, rating: 4.6, reviews: 142, tags: [],
      fabric: 'Japanese Nida',
      colors: [
        { key: 'mocha', name: 'Mocha Brown', base: '#6C4E3F', trim: '#DCC096', bg: ['#F2EAE2', '#E0D2C4'] },
        { key: 'grey', name: 'Stone Grey', base: '#7B7A80', trim: '#E2DCCF', bg: ['#EEECEA', '#DAD6D2'] },
      ],
      desc: 'Japanese Nida with a soft, fluid fall and a matching fabric belt. Easy to wash, quick to dry and lovely to wear.',
    }),
    P({
      id: 'p11', name: 'Aisha Eid Luxe Abaya', category: 'luxury', style: 'classic', motif: 'vine', hem: true,
      price: 8950, oldPrice: 9900, rating: 5.0, reviews: 83, tags: ['best', 'new'], badge: 'Eid Edit',
      fabric: 'Velvet-touch Crepe, zari embroidery', brooch: true, hijabTrim: true,
      colors: [
        { key: 'wine', name: 'Royal Maroon', base: '#6B1E2E', trim: '#D8B06A', bg: ['#F3E7E1', '#E2CFC4'] },
        { key: 'emerald', name: 'Emerald Night', base: '#173F37', trim: '#D8B06A', bg: ['#EFEAE0', '#DBD2C1'] },
      ],
      desc: 'The crown of our Eid edit. Velvet-touch crepe in jewel tones, with a deep zari-embroidered border, a trimmed hijab and a signature brooch.',
    }),
    P({
      id: 'p12', name: 'Fatima Chiffon Cape', category: 'cape', style: 'cape', motif: 'pearl',
      price: 4950, rating: 4.8, reviews: 69, tags: ['new'], badge: 'New',
      fabric: 'Georgette with Chiffon Cape',
      colors: [
        { key: 'lavender', name: 'Lavender Grey', base: '#8C8497', trim: '#F1E6EF', bg: ['#F1EEF2', '#DEDAE1'] },
        { key: 'blush', name: 'Blush', base: '#D2A9A0', trim: '#FFF2E6', bg: ['#F7EEEA', '#E9DAD3'] },
      ],
      desc: 'A dreamy chiffon cape with a pearl-edged hem over a full-length georgette borka. Soft pastel tones for daytime dawats and celebrations.',
    }),
    P({
      id: 'p13', name: 'Khadija Premium Jilbab', category: 'cape', style: 'cape', motif: 'vine', hem: true,
      price: 6250, rating: 4.9, reviews: 47, tags: ['best', 'new'], badge: 'New',
      fabric: 'Zoom Nida, two-piece set',
      colors: [
        { key: 'noir', name: 'Noir Gold', base: '#16151A', trim: '#CFAE6C', bg: ['#EFE7DD', '#DDCFBE'] },
        { key: 'navy', name: 'Ink Navy', base: '#1C2339', trim: '#CFAE6C', bg: ['#ECE8E2', '#D8D1C7'] },
      ],
      desc: 'A two-piece jilbab set with a generous cape and matching skirt borka. Gold vine trim on the cape and hem adds quiet luxury.',
    }),
    P({
      id: 'p14', name: 'Tasnim Denim Abaya', category: 'kimono', style: 'belted', motif: 'geo',
      price: 3750, oldPrice: 4200, rating: 4.7, reviews: 52, tags: ['sale'], badge: '-11%',
      fabric: 'Soft-wash Tencel Denim',
      colors: [
        { key: 'indigo', name: 'Indigo', base: '#3D5578', trim: '#E4D6BC', bg: ['#EDEDEA', '#D8D8D2'] },
        { key: 'ice', name: 'Ice Blue', base: '#8AA2BA', trim: '#F4EEE2', bg: ['#EFF0EE', '#DADDDA'] },
      ],
      desc: 'A modern soft-wash denim abaya in fluid Tencel. Contrast top-stitch trim and a tie belt make it a weekend favourite.',
    }),
    P({
      id: 'p15', name: 'Nusrat Linen Kimono', category: 'kimono', style: 'open', motif: 'vine',
      price: 3550, rating: 4.8, reviews: 61, tags: ['new'], badge: 'New',
      fabric: 'Pure Linen Blend',
      colors: [
        { key: 'terracotta', name: 'Terracotta', base: '#A5634A', inner: '#F2E6D8', trim: '#F0D6A8', bg: ['#F4EBE3', '#E4D3C4'] },
        { key: 'ivory', name: 'Ivory', base: '#E6DDCD', inner: '#FBF7F0', trim: '#A38454', bg: ['#EEE7DD', '#D8CCBC'] },
      ],
      desc: 'Relaxed linen kimono in sun-warmed tones with an embroidered vine edge. Breezy, breathable and made to be layered.',
    }),
    P({
      id: 'p16', name: 'Mehreen Georgette Borka', category: 'everyday', style: 'classic', motif: 'pearl',
      price: 2950, oldPrice: 3450, rating: 4.7, reviews: 118, tags: ['sale'], badge: '-14%',
      fabric: 'Soft Georgette',
      colors: [
        { key: 'plum', name: 'Plum', base: '#4B2A44', trim: '#E6CFC0', bg: ['#F2E9EC', '#E0D2D6'] },
        { key: 'noir', name: 'Noir', base: '#1A191E', trim: '#E6D8C4', bg: ['#EFE9E3', '#DDD3C9'] },
      ],
      desc: 'Soft, flowing georgette with a delicate pearl-beaded placket. A graceful everyday borka that feels special.',
    }),
  ];

  PRODUCTS.forEach((p, i) => {
    p.skin = SKIN[i % SKIN.length];
    p.image = (colorKey, view = 'a') => `assets/img/products/${p.id}-${colorKey || p.colors[0].key}-${view}.svg`;
  });

  const api = { PRODUCTS, CATEGORIES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BM_DATA = api;
})(typeof window !== 'undefined' ? window : globalThis);

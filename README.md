# Borka Mart — Modest Luxury Storefront

A complete, mobile-first e-commerce storefront for **Borka Mart**, a premium borka & abaya label from Dhaka.
Built with hand-written HTML, CSS and vanilla JavaScript. It has no framework and no build step, so it deploys anywhere as static files.

## Highlights

- **Design**: ivory, deep emerald and champagne-gold palette with *Cormorant Garamond*, *Jost* and *Hind Siliguri* (Bangla) type. Islamic-arch motifs, soft motion and scroll reveals.
- **Mobile-first**: app-style bottom navigation, swipeable hero, galleries and rails, bottom-sheet filters and quick view, a sticky add-to-bag bar, and safe-area support for notched phones.
- **Full shopping flow**
  - Home: hero slider, collections, new arrivals, Eid sale countdown, tabbed bestsellers, shop-the-look, reviews and newsletter.
  - Shop: category chips, price, colour and highlight filters, sorting and live search.
  - Product: colour switching (gallery updates), length/size picker with size guide, tap-to-zoom, quantity, wishlist, share, delivery estimate, reviews, related items and recently viewed.
  - Bag drawer: quantity steppers, free-delivery progress bar, savings.
  - Checkout: validated Bangladeshi phone and district form, Dhaka and outside-Dhaka delivery rates, same-day express, promo codes (`EID10`, `WELCOME300`), and Cash on Delivery / bKash / Nagad / card flows.
  - Order confirmation with a timeline, **Track Order**, Wishlist, Our Story, FAQ, Contact and 404 pages.
- Cart, wishlist and orders persist in the browser (`localStorage`).
- SEO and social meta, a link-preview image, favicon, PWA manifest and home-screen icons.

## Project structure

```
index.html  shop.html  product.html  checkout.html
wishlist.html  track.html  about.html  404.html
assets/
  css/style.css         design system & all styles
  js/data.js            product catalogue & categories  ← edit products here
  js/app.js             header/footer, cart, wishlist, search, drawers, toasts
  js/home.js  shop.js  product.js  checkout.js  pages.js
  img/products/         product artwork (3 views per colour)
  img/site/             hero, banner, lookbook, icons, og-image
scripts/                artwork generator (node scripts/generate-art.mjs)
vercel.json             caching headers
```

## Run locally

Any static server works:

```bash
npx serve .          # or: python3 -m http.server 8080
```

## Deploy to Vercel

1. Import this GitHub repository on [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Other**. Leave the build command and output directory empty.
3. Deploy. The site is served from the repository root.

> For rich link previews on WhatsApp and Facebook, replace the relative `og:image` value in each HTML `<head>` with the full URL of your deployment, e.g. `https://your-domain.vercel.app/assets/img/site/og-image.jpg`.

## Customising

- **Products, prices, colours**: `assets/js/data.js`. After adding or changing products or colours, run `node scripts/generate-art.mjs` to regenerate the artwork, or point `image()` at real product photos.
- **Contact details**: phone, address and email are in `assets/js/app.js` (footer and menu) and `about.html`.
- **Promo codes and free-delivery threshold**: `COUPONS` and `FREE_SHIP` in `assets/js/app.js`.
- **Delivery charges**: `assets/js/checkout.js`.

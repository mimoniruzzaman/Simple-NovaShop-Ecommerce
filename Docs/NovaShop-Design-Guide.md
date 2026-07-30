# NovaShop — Design Guide

**A visual and interaction system for the NovaShop e-commerce platform**
Prepared for: Bangladeshi Retail Market · Companion to NovaShop Requirement Analysis v1.0
Stack reference: Laravel 12 + Inertia.js + Vue 3 + Tailwind CSS

---

## 1. Design Philosophy

NovaShop should feel like a well-run neighborhood shop that happens to live on a phone screen — the kind where the shopkeeper knows their stock, prices are written clearly on a hung tag, and nothing about the counter feels uncertain. The design direction leans into that retail-counter honesty rather than generic "startup SaaS" polish: confident color, a warm serif voice for storytelling moments, and one recurring physical motif — the price tag — that ties the digital cart back to how goods are actually priced and sold in Bangladeshi shops.

Two audiences, two registers:
- **Storefront** — warm, confident, mobile-first. Built for someone thumbing through a feed on a mid-range Android phone over 4G.
- **Admin Panel** — calmer and denser. Same palette family, but restrained to a near-neutral surface so operators can scan tables and forms all day without visual fatigue.

Three principles govern every decision below:
1. **Legible over decorative.** Bangladesh's mobile traffic majority means every choice is tested at 360px width first.
2. **One signature, quietly repeated.** The hang-tag price motif is the single memorable device — it does not compete with itself elsewhere on the page.
3. **Taka is a first-class citizen.** Prices are never an afterthought in type or color; they get their own scale and their own font.

---

## 2. Color System

The palette is built from a deep bazaar green (not the flag green — softened toward teal so it prints and screens well) and a marigold gold, the color of festival garlands and jewelry-shop signage. It deliberately avoids the now-common "warm cream + terracotta" AI-default pairing.

### 2.1 Core Palette

| Token | Hex | Role |
|---|---|---|
| `green-900` | `#0B4A32` | Primary brand color — header background, primary buttons, active nav state |
| `green-600` | `#167D52` | Interactive states — link hover, secondary buttons, focus rings |
| `green-100` | `#DCEEE3` | Tinted backgrounds — selected filters, success surfaces |
| `gold-500` | `#E4A335` | Accent — CTA highlights, price tags, "Best Seller" ribbon, active badge |
| `gold-700` | `#C1841E` | Gold hover/pressed state |
| `paper-50` | `#F5F7F4` | App background (storefront) — cool off-white, not cream |
| `paper-0` | `#FFFFFF` | Card and surface background |
| `ink-900` | `#1B221D` | Primary text |
| `ink-500` | `#5B665E` | Secondary/muted text, placeholders |
| `line-200` | `#DCE3DD` | Borders, dividers, input outlines |
| `brick-600` | `#B3392C` | Errors, "Stock Out" badge, destructive actions |
| `leaf-600` | `#2F8F5B` | "In Stock" badge, success toasts |
| `slate-700` | `#2A4A5C` | Admin-panel accent (info, links inside dashboard only) |

### 2.2 Usage rules

- `green-900` never appears as body text — reserve it for surfaces and large UI blocks so it stays punchy.
- `gold-500` is a **spotlight color**: one gold element per view maximum on mobile (a single CTA, or the price tag, not both shouting at once). On product cards, gold lives only in the price tag; the "Add to Cart" button stays green.
- Stock badges always pair color with a text label (`In Stock` / `Stock Out`) — never color alone, for color-blind accessibility.
- Admin panel swaps `gold-500` out of the button role entirely; admin primary actions use `green-900`, and `slate-700` is reserved for informational links and chart accents, so operators can visually tell "I am managing the shop" apart from "I am the shop."

### 2.3 Do / Don't

- ✅ Do use `green-100` as a tint behind selected filter chips.
- ✅ Do let the hero carousel use full-bleed product photography with a `green-900` gradient scrim for text legibility.
- ❌ Don't introduce a second accent hue (no blue CTAs on the storefront, no purple badges).
- ❌ Don't use pure black (`#000`) or pure white text/background pairs — always route through `ink-900` / `paper-50`.

---

## 3. Typography

Three typefaces, three jobs. No font is used outside its lane.

| Role | Typeface | Why |
|---|---|---|
| **Display** | Fraunces (weight 600, optical size "72", slight negative tracking) | A soft-serif with warmth and a little handcrafted irregularity — carries hero headlines, section titles, and the logotype without reading as a generic startup serif. |
| **Body / UI** | Inter (400/500/600) | Clean, highly legible at small sizes on low-end Android screens; used for nav, buttons, descriptions, forms. |
| **Data / Price** | IBM Plex Mono (500) | Tabular figures for every price, quantity, order ID, and invoice line — gives commerce numbers a "ledger" precision distinct from prose, and keeps Taka amounts scanning cleanly in columns. |

### 3.1 Type scale (mobile → desktop)

| Style | Mobile | Desktop | Weight | Font |
|---|---|---|---|---|
| Display / Hero H1 | 2.25rem / 1.15 | 3.5rem / 1.1 | 600 | Fraunces |
| H1 (page title) | 1.875rem | 2.75rem | 600 | Fraunces |
| H2 (section title) | 1.5rem | 2.25rem | 600 | Fraunces |
| H3 (card/group title) | 1.25rem | 1.5rem | 600 | Inter |
| Body Large | 1.125rem | 1.125rem | 400 | Inter |
| Body | 1rem | 1rem | 400 | Inter |
| Caption / Label | 0.875rem | 0.875rem | 500 | Inter |
| Micro (badge/eyebrow) | 0.75rem, uppercase, +0.04em tracking | same | 600 | Inter |
| Price — card | 1.125rem | 1.25rem | 500 | IBM Plex Mono |
| Price — hero/PDP | 1.5rem | 1.875rem | 500 | IBM Plex Mono |

### 3.2 Rules

- Section titles (`H2`) always pair with a one-line Inter subtitle underneath at `ink-500` — the serif states the theme, the sans grounds it in specifics ("New Collection" / "Fresh arrivals, added this week").
- Never set Fraunces below 20px — its detail disappears at small sizes; drop to Inter 600 instead for compact headings (e.g., admin table headers).
- Strikethrough discount prices use `ink-500` at 0.9× the current price size, mono font retained.

---

## 4. Layout & Grid

- **Base unit:** 4px. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- **Container:** max-width 1280px, centered, horizontal padding 16px (mobile) / 24px (tablet) / 32px (desktop).
- **Grid:** 4 columns mobile, 8 columns tablet, 12 columns desktop. Gutter 16px mobile, 24px desktop.
- **Card radius:** 12px for product/category cards, 8px for buttons and inputs, 999px (pill) for badges and tags only.
- **Elevation:** flat design by default (`line-200` borders, no shadows) for listing pages; a single soft shadow (`0 4px 16px rgba(11,74,50,0.08)`) reserved for the hero carousel, modals, and the sticky mobile cart bar — shadow signals "this floats above the page," so it's rationed.

### 4.1 Breakpoints

| Name | Width | Priority |
|---|---|---|
| Base (mobile) | 0–639px | **Design target #1** — every component designed here first |
| `sm` | 640px | Large phones / small tablets landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops — nav collapses to full desktop header here |
| `xl` | 1280px | Desktop — container hits max-width |
| `2xl` | 1536px | Large desktop — content stays capped, background breathes |

---

## 5. Signature Elements

### 5.1 The Hang-Tag (primary signature)

Every price in the system — product card, cart line, checkout summary, invoice PDF — renders inside a small tag shape: a rounded-rectangle chip in `paper-0` with a `gold-500` 1.5px border, a small punched circle in the top-left corner (a literal perforation, rendered as a 6px `paper-50` circle with a `line-200` ring), and the price set in IBM Plex Mono. This is the one motif allowed to repeat everywhere, because it is functional (it's literally where the price lives) rather than decorative.

```
 ⬤─────────────────╮
 │  ৳ 1,250         │
 ╰──────────────────╯
```

- Card context: tag sits bottom-left of the product image, slightly overlapping the image edge (like a tag hanging off a garment).
- Discounted price: original price in `ink-500` strikethrough sits just above the tag, tag itself always shows the price the customer pays.
- Invoice PDF: same tag motif appears once at the total line only — restraint carries over to print.

### 5.2 The Weave Rule (secondary signature, used sparingly)

A thin repeating geometric line — a simplified diamond-dash pattern inspired by Jamdani weaving, rendered as a single-color SVG at 8px height — appears in exactly two places: directly beneath the hero carousel, and directly above the footer. It frames the shopping experience like a border on a woven textile without ever appearing mid-page. Do not add it to cards, buttons, or admin surfaces.

---

## 6. Core Components

### 6.1 Buttons

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary | `green-900` | white | none | Add to Cart, Place Order, Save (admin) |
| Primary hover | `green-600` | white | none | — |
| Secondary | transparent | `green-900` | 1.5px `green-900` | Continue Shopping, Cancel |
| Ghost | transparent | `ink-900` | none, underline on hover | Tertiary links, "View all" |
| Destructive | transparent | `brick-600` | 1.5px `brick-600` | Remove item, Delete category |
| Disabled | `line-200` | `ink-500` | none | Add to Cart when Stock Out |

Buttons: 44px min height on mobile (thumb target), 8px radius, Inter 600, 16px horizontal padding minimum 24px.

### 6.2 Stock Badge

Pill, micro-type, uppercase, 4px vertical / 10px horizontal padding.
- **In Stock:** `green-100` background, `leaf-600` text, small dot indicator.
- **Stock Out:** `line-200` background, `brick-600` text, no dot — visually quieter since it's a dead-end state, not an action.

### 6.3 Product Card

Image (1:1, rounded top corners 12px) → hang-tag price overlapping bottom-left of image → product name (Inter 600, 1 line truncate) → stock badge → Add to Cart button (full-width on mobile, fixed-width on desktop, disabled state if Stock Out). Card background `paper-0`, 1px `line-200` border, no shadow at rest; on hover (desktop only) lift with the reserved soft shadow and scale image 1.02.

### 6.4 Category Card

Image or icon on `green-900` tinted circular mask, category name in Inter 600 below, entire card is a single tap target routing to filtered Shop page. Admin-controlled order and "featured" flag determine which appear on Home.

### 6.5 Hero Carousel

Full-bleed image, `green-900`-to-transparent gradient scrim from the left (LTR reading), headline in Fraunces on the scrim, one CTA button (gold or white-outline depending on image brightness — admin picks per slide, defaulting to white-outline for safety). Dots (not arrows-only) for mobile touch navigation; arrows appear additionally at `md` and up. Autoplay 6s interval, pauses on touch/hover, always keyboard-navigable.

### 6.6 Header / Navigation

Mobile: logo left, search icon + cart icon (with item-count badge in `gold-500`) + hamburger right. Tapping hamburger opens a full-height drawer from the right with nav links, account, and categories. Desktop (`lg`+): full horizontal nav, search bar expands inline, sticky on scroll with a subtle `line-200` bottom border once scrolled.

### 6.7 Filters (Shop Page)

Mobile: filters collapse into a "Filter" button that opens a bottom sheet (category, price range slider, availability toggle, sort dropdown), so the product grid keeps full width. Desktop: persistent left sidebar, 3-column width out of 12.

### 6.8 Cart & Checkout

Cart line items use the hang-tag for unit price and subtotal. Sticky order summary bar on mobile (bottom-fixed, soft shadow, shows running total + "Proceed to Checkout"), becomes a static sidebar card at `lg`+. Checkout is a single scrolling form on mobile (not a multi-step wizard) grouped into clearly labeled cards: Contact, Delivery Address, Payment Method, Order Summary — reduces friction on mobile networks where step transitions cost time.

### 6.9 Admin Panel Components

- **Sidebar nav** (collapsible on tablet, hidden behind a menu icon on mobile): Dashboard, Hero Slides, Categories, Products, Orders.
- **Data tables:** `IBM Plex Mono` for numeric columns (price, order ID, quantity), Inter for text columns, row hover in `paper-50`, sticky header row.
- **Dashboard widgets:** flat cards, one metric per card, label in Caption style above a large Fraunces or mono numeral depending on whether the metric is a count (Inter/Fraunces) or currency (mono).
- **Forms (Product/Category/Hero CRUD):** labels above inputs (not floating labels — clearer on small screens), inline validation messages in `brick-600` directly under the field, image upload shows a drag-drop zone with live thumbnail preview.
- **Status stepper (Order detail):** horizontal on desktop, vertical on mobile, filled `green-900` for completed steps, outline for pending, `brick-600` fill only if Cancelled.

---

## 7. Page-Level Layout Notes

| Page | Mobile-first structure |
|---|---|
| **Home** | Header → Hero (edge-to-edge) → Weave rule → Categories (2-col grid, horizontally scrollable) → Best-Sellers (horizontally scrollable card row) → New Collection (2-col grid) → Weave rule → Footer |
| **Shop** | Header → sticky Search+Filter bar → Product grid (2-col mobile / 4-col desktop) → pagination or infinite scroll → Footer |
| **Product Details** | Header → breadcrumb → image gallery (swipeable) → name/price/badge → quantity + Add to Cart (sticky on mobile) → description → related products → Footer |
| **Cart** | Header → item list → sticky summary bar → Footer below fold |
| **Checkout** | Header (simplified, no full nav — reduce exit points) → grouped form cards → sticky "Place Order" bar |
| **Admin Dashboard** | Sidebar (collapsed) → top bar with admin name/logout → widget grid → recent orders table |

---

## 8. Motion & Interaction

Motion is used to confirm, not to decorate.

- **Page-load:** none beyond a 150ms fade-in on route change (Inertia transition) — keeps navigation feeling instant on slower connections.
- **Add to Cart:** cart icon badge does a single 200ms scale-pulse; a small toast slides up from bottom ("Added to cart") and auto-dismisses in 2.5s.
- **Hero carousel:** 500ms crossfade or slide, matched to whichever the admin's uploaded image aspect suggests; never both.
- **Hover (desktop only):** card lift (4px translateY + reserved shadow), 150ms ease-out. No hover-only functionality — everything must also work by tap.
- **Reduced motion:** respect `prefers-reduced-motion` — disable carousel autoplay transitions and card-lift animation, keep instant state changes only.

---

## 9. Accessibility

- Minimum contrast: `ink-900` on `paper-50`/`paper-0` exceeds AA for body text; `green-900` buttons with white text exceed AA; verify `gold-500` is never used for text on white (fails contrast) — gold is a border/fill/badge color only, never a text color on light backgrounds.
- All interactive elements have a visible focus ring: 2px `green-600` outline, 2px offset.
- Stock badges and error states always carry a text label, never rely on color alone.
- Touch targets minimum 44×44px throughout the storefront.
- Carousel and all custom controls (bottom sheets, drawers, steppers) are fully keyboard-operable and expose correct ARIA roles.

---

## 10. Content & Voice

- Buttons describe the actual action a person takes: "Add to Cart," "Place Order," "Save Changes" — never "Submit."
- Empty states are invitations, not apologies: an empty cart reads "Your cart is empty — start adding products you love," with a CTA back to Shop, not a passive "No items found."
- Errors state what happened and what to do, without apologizing: "This field is required" rather than "Oops! Something went wrong."
- Stock badge copy is fixed system-wide: exactly `In Stock` / `Stock Out` — never rephrase per product.
- Admin copy is direct and unembellished ("Delete category," with a confirmation naming the category), since operators need speed, not persuasion.

---

## 11. Tailwind Token Reference

Drop-in extension for `tailwind.config.js` to keep implementation aligned with this guide:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        green: { 900: '#0B4A32', 600: '#167D52', 100: '#DCEEE3' },
        gold:  { 700: '#C1841E', 500: '#E4A335' },
        paper: { 50: '#F5F7F4', 0: '#FFFFFF' },
        ink:   { 900: '#1B221D', 500: '#5B665E' },
        line:  { 200: '#DCE3DD' },
        brick: { 600: '#B3392C' },
        leaf:  { 600: '#2F8F5B' },
        slate: { 700: '#2A4A5C' },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        control: '8px',
      },
      boxShadow: {
        float: '0 4px 16px rgba(11,74,50,0.08)',
      },
    },
  },
};
```

---

## 12. Summary Checklist for Implementation

- [ ] Fraunces, Inter, IBM Plex Mono loaded (self-hosted or via a font provider that works on Bangladeshi mobile networks — subset to Latin only)
- [ ] Color tokens added to `tailwind.config.js` exactly as in Section 11
- [ ] Hang-tag price component built once, reused across Product Card, Cart, Checkout, and the invoice PDF template
- [ ] Weave-rule SVG used only under the hero and above the footer
- [ ] Admin panel restricted to `green-900` / `slate-700` / neutrals — no `gold-500` buttons in admin
- [ ] All components tested at 360px width before anything wider
- [ ] `prefers-reduced-motion` respected across carousel and card-hover animations

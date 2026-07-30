# NovaShop — AI Build Prompt (Phased Execution Plan)

**Purpose:** Feed this file to an AI coding assistant (Claude Code, Cursor, etc.) one phase at a time to build NovaShop in the right order. Each phase is self-contained, references the source docs, and has a "definition of done" so you can review before moving on.

**Source documents (keep these in the project root or context):**
- `NovaShop-Requirement-Analysis.md` — v1.0 functional requirements
- `NovaShop-PRD-v2.docx` — v2.0 PRD, supersedes v1.0 (payments, reviews, email, sales reports)
- `NovaShop-Design-Guide.md` — visual/UX system (colors, type, hang-tag motif, components)

**Global stack (do not deviate):** Laravel 12 · Inertia.js · Vue 3 (Composition API) · Tailwind CSS · MySQL/MariaDB · Laravel Starter Kit (Inertia + Vue variant)

**Global rule for every phase:** Before writing code, re-read the relevant sections of the Design Guide and PRD v2 named in that phase. Follow the design tokens exactly (hex values, font roles, spacing scale) — don't invent new colors, fonts, or spacing values. Mobile-first: build and test every component at 360px width before wider breakpoints.

---

## Phase 1 — Professional Storefront Design (Static / Front-End Only)

**Goal:** Build the customer-facing storefront UI with static/mock data — no backend, no database yet. This phase is about nailing the visual system before anything is wired up.

**Prompt to give the AI:**

> Using `NovaShop-Design-Guide.md` as the single source of truth for color, typography, spacing, and component styling, build the NovaShop storefront as static Vue 3 + Tailwind components with hard-coded mock data (no Laravel backend, no database calls yet).
>
> Pages to build, per the Design Guide Section 7 layout notes and PRD v2 Section 7:
> 1. **Home** — Header → Hero Carousel → Category grid → Best-Selling Products → New Collection → Footer
> 2. **Shop** — sticky search+filter bar, product grid (2-col mobile / 4-col desktop), pagination
> 3. **Product Details** — image gallery, price, stock badge, average rating summary, quantity selector, Add to Cart, reviews section (static placeholder), related products
> 4. **Cart** — item list, sticky order summary bar (mobile) / sidebar (desktop)
> 5. **Checkout** — grouped form cards (Contact, Delivery Address, Payment Method, Order Summary), no real submission yet
>
> Implement the signature "hang-tag" price component once (Design Guide §5.1) and reuse it everywhere a price appears. Apply the exact Tailwind token config from Design Guide §11. Respect the color usage rules in §2.2 (gold is a spotlight color, never body/CTA on admin, never text on light backgrounds). Use Fraunces for display headings, Inter for UI/body, IBM Plex Mono for all prices/numbers/order IDs. Build mobile (360px) first, then tablet/desktop breakpoints per §4.1.
>
> Use realistic mock JSON for products/categories/hero slides so the design reads convincingly — Bangladeshi product names, ৳ pricing, believable stock mix.

**Definition of done:**
- [ ] All 5 storefront pages render correctly at 360px, 768px, 1280px
- [ ] Hang-tag price component is a single reusable component, not duplicated per page
- [ ] Color/type tokens match the Design Guide exactly — spot-check hex values
- [ ] No backend calls; all data is local mock JSON
- [ ] Reduced-motion and focus-ring accessibility rules from Design Guide §8–9 are respected

**Do not proceed to Phase 2 until you've visually reviewed and approved this UI.**

---

## Phase 2 — Database Design

**Goal:** Design and migrate the full schema before any dynamic wiring happens, so Phase 3 has real tables to bind to.

**Prompt to give the AI:**

> Design the NovaShop MySQL/MariaDB schema in Laravel 12 migrations, covering every entity implied by `NovaShop-PRD-v2.docx` Section 9 (data model) plus the v2 additions. Entities required:
> - `users` (customer + admin, differentiated by guard/role)
> - `hero_slides` (image, title, subtitle, cta_text, cta_link, order, is_active)
> - `categories` (name, slug, image, description, show_on_homepage, order)
> - `products` (name, slug, category_id, price, discount_price, description, stock_status enum[in_stock, stock_out], is_best_seller, is_new_collection, is_active)
> - `product_images` (product_id, image_path, is_primary)
> - `reviews` (product_id, user_id, rating 1-5, comment, is_verified_purchase, status enum[pending, approved, rejected])
> - `carts` / `cart_items` (session or user-based, product_id, quantity)
> - `orders` (user_id nullable for guest, customer_name, phone, email, address, city, payment_method enum[cod, sslcommerz], payment_status enum[pending, paid, failed, collected], order_status, subtotal, delivery_fee, total, timestamps)
> - `order_items` (order_id, product_id, product_name_snapshot, price_snapshot, quantity, subtotal) — snapshot fields preserve historical accuracy per PRD v2 §9
> - `invoices` (order_id, invoice_number, generated_at, pdf_path)
> - `payment_transactions` (order_id, gateway, gateway_reference, raw_callback_payload, verified_at) — for SSLCommerz IPN/callback auditing per PRD v2 non-functional Reliability requirement
>
> Write proper foreign keys, indexes on `slug` and `category_id`/`product_id` lookups, and enum/status columns as Laravel migration column types (not free text). Add Eloquent models with relationships (hasMany/belongsTo) and basic factories/seeders that generate realistic Bangladeshi sample data for local development.
>
> Follow the category-deletion safety note from the Requirement Analysis §11 open question — implement soft-delete on `categories` and `products` rather than hard delete, since the PRD leaves this open; flag this choice in a comment for later confirmation.

**Definition of done:**
- [ ] All migrations run cleanly (`php artisan migrate:fresh --seed`)
- [ ] Eloquent relationships match the entity list above
- [ ] Seeders produce enough realistic data to populate every storefront page from Phase 1
- [ ] Soft-deletes in place on categories/products, with a note flagging it as pending confirmation

---

## Phase 3 — Make the Storefront Dynamic

**Goal:** Replace Phase 1's mock JSON with real data from the Phase 2 database, via Inertia controllers.

**Prompt to give the AI:**

> Wire the static storefront built in Phase 1 to the database from Phase 2. Build Laravel controllers + Inertia responses (no separate REST API layer, per PRD v2 §4) for:
> - Home page: pull active hero slides (ordered), homepage-flagged categories, best-seller products, new-collection products
> - Shop page: paginated/filterable product listing (category, price range, availability, rating ≥ N, sort by newest/price/top-rated) per PRD v2 §7.3
> - Product Details: single product with images, average rating + review count (approved reviews only), related products by category
> - Cart: session-based for guests, user-based when logged in; add/update/remove line items server-side
> - Checkout (data layer only — no payment yet): create an `Order` + `OrderItem` records with `payment_status = pending`, snapshotting product name/price at time of order
>
> Keep all pricing calculations (subtotal, totals) server-side — never trust client-submitted totals. Use Laravel form requests for validation. Preserve every visual detail from Phase 1; this phase is purely about swapping mock data for live queries and adding interactivity (filters, cart updates, pagination) via Inertia partial reloads, not restyling anything.

**Definition of done:**
- [ ] Every storefront page loads real data from the database, matches Phase 1's visual design pixel-for-pixel
- [ ] Cart persists across page loads (session or account)
- [ ] Filters/sort/pagination on Shop page work against real queries, not client-side array filtering
- [ ] Checkout creates a real `Order` row (payment still pending — Phase 5 handles gateways)

---

## Phase 4 — Admin Panel

**Goal:** Build the operator-facing CRUD dashboard per PRD v2 Section 9.

**Prompt to give the AI:**

> Build the NovaShop Admin Panel per `NovaShop-PRD-v2.docx` Section 9 and the admin component specs in `NovaShop-Design-Guide.md` §6.9 (sidebar nav, data tables, dashboard widgets, forms, status stepper). Admin uses a separate auth guard, not linked from storefront nav (PRD v2 §9.1).
>
> Modules to build:
> 1. **Dashboard** — summary widgets (total orders, pending orders, total products, revenue snapshot) + shortcut into Sales Reports
> 2. **Hero Slide CRUD** — image upload, title/subtitle/CTA fields, drag-reorder, active toggle
> 3. **Category CRUD** — name/slug/image/description, "show on homepage" toggle, order; block or soft-delete when products exist (flag as open question per Requirement Analysis §11)
> 4. **Product CRUD** — full field set from PRD v2 §9.4 including multi-image upload with primary flag, stock badge toggle, Best Seller / New Collection / Active flags, read-only average rating display
> 5. **Order & Invoice Management** — filterable order list (status, payment method, payment status, date range, customer), order detail view, status update flow, PDF invoice generation (barryvdh/laravel-dompdf)
> 6. **Review Moderation** — pending queue, approve/reject/delete, filter by product/rating/status
>
> Enforce the Design Guide's admin color restriction: `green-900` / `slate-700` / neutrals only — no `gold-500` buttons in the admin panel (Design Guide §12 checklist). Use `IBM Plex Mono` for numeric table columns, Inter for text columns, labels-above-inputs on all forms (not floating labels).

**Definition of done:**
- [ ] Admin login is a separate guard/route, not discoverable from storefront nav
- [ ] All 6 modules functional with real database CRUD
- [ ] Admin UI visually matches Design Guide §6.9 (no gold in admin, correct sidebar/table/stepper patterns)
- [ ] Order status changes update the order record (email hookup comes in a later phase, not required yet)

---

## Phase 5 — Payment Gateway Integration

**Goal:** Wire real payment methods into checkout, per PRD v2 Section 7.6 and 9.5.

**Prompt to give the AI:**

> Implement the two payment methods specified in `NovaShop-PRD-v2.docx` §7.6:
> 1. **Cash on Delivery (COD)** — no online transaction; order is created with `payment_status = pending (cash)`; admin manually marks payment as `collected` on delivery (§9.5).
> 2. **SSLCommerz** — redirect the customer to the SSLCommerz hosted payment page (cards, bKash, Nagad, Rocket, and other locally aggregated methods); handle the return/callback to mark the order `paid` or `failed`.
>
> Critical requirements from PRD v2 §10 (Non-Functional Requirements — Security & Reliability):
> - Validate SSLCommerz transaction signatures/IPN callbacks **server-side** before ever marking an order Paid — never trust the client-side redirect alone.
> - Payment status must never be inferred or set client-side; only a verified SSLCommerz callback or a manual admin action (for COD) may change `payment_status`.
> - Store the gateway transaction reference and raw callback payload in `payment_transactions` (from Phase 2 schema) for audit purposes.
> - Build a dedicated `PaymentService` abstraction (per PRD v2 §10 Maintainability) so COD and SSLCommerz share a common interface, making it easy to add gateways later without reworking checkout.
> - Order is created immediately for both payment methods; `payment_status` is tracked independently from `order_status` (fulfillment) so COD orders aren't mistaken for failed payments.
> - On successful order placement, trigger the order confirmation flow (email wiring can follow in a later phase if not yet built — but the trigger point/event should be in place now).

**Definition of done:**
- [ ] Checkout offers exactly two payment method options, matching Design Guide checkout layout
- [ ] COD orders land in the admin panel with correct pending/collected states
- [ ] SSLCommerz sandbox transactions complete end-to-end (redirect → callback → verified → order marked Paid)
- [ ] Signature/IPN validation happens server-side; a tampered/unsigned callback is rejected and logged
- [ ] `PaymentService` interface is reused by both methods, not duplicated logic

---

## Optional Next Phases (from PRD v2, not requested yet but scoped)

Once Phases 1–5 are done and confirmed, the PRD v2 identifies two more feature sets that weren't in your list — flagging them here so you can decide whether to include them in this build or park them:

- **Product Reviews & Ratings** (PRD v2 §7.7) — star rating + comment submission, verified-purchase indicator, moderation queue (ties into Phase 4's review moderation module, which assumes this exists)
- **Email Order Notifications** (PRD v2 §8) — queued transactional emails at order placement, status changes, and payment results
- **Sales Reports** (PRD v2 §9.7) — revenue/order/top-product reporting with CSV/PDF export

**Note:** Phase 4's admin panel spec above includes a Review Moderation module per the PRD, which technically depends on the review submission system existing on the storefront. If you want to keep Phases 1–5 strictly to your five requested areas, consider deferring Review Moderation out of Phase 4 into its own follow-up phase alongside the reviews feature itself.

---

## How to Use This File

Copy one phase's "Prompt to give the AI" block at a time into your AI coding tool. Don't paste the whole file at once — each phase depends on the previous one being reviewed and approved first. Keep the three source documents attached/accessible in every phase's context so the AI can re-check specifics (exact hex codes, field lists, enum values) instead of guessing.

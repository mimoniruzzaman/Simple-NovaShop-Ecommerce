# NovaShop — E-Commerce Platform Requirement Analysis

**Prepared for:** Bangladeshi Retail Market
**Document Version:** 1.0
**Date:** July 27, 2026

---

## 1. Project Overview

NovaShop is a full-stack e-commerce web application built for the Bangladeshi market. The platform consists of two primary modules:

1. **Storefront** — a customer-facing shopping experience (English language, BDT/Taka currency).
2. **Admin Panel** — an internal management dashboard for store operators to manage content, catalog, and orders.

The platform does **not** track granular inventory counts. Instead, each product carries a simple availability **badge** (`In Stock` / `Stock Out`) that is manually toggled by the admin.

---

## 2. Objectives

- Provide a fast, modern, mobile-friendly shopping experience for Bangladeshi customers.
- Allow the store admin to fully manage homepage content, categories, products, and orders without developer intervention.
- Display all pricing in **Bangladeshi Taka (৳)** while keeping the UI language in **English**.
- Keep the technical stack lean and maintainable using Laravel 12, Inertia.js, Vue 3, and Tailwind CSS.

---

## 3. Tech Stack

| Layer              | Technology                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| Backend Framework  | Laravel 12                                                                                         |
| Frontend Framework | Vue 3 (Composition API)                                                                            |
| Bridge             | Inertia.js (SPA-like experience, no separate REST/API layer needed for the web app)                |
| Styling            | Tailwind CSS                                                                                       |
| Starter Kit        | Laravel Starter Kit (Inertia + Vue variant) — provides auth scaffolding, layouts, and base tooling |
| Database           | MySQL / MariaDB (recommended)                                                                      |
| Image Storage      | Laravel Filesystem (local `storage` disk to start; swappable to S3-compatible driver later)        |
| Authentication     | Laravel's built-in auth (from starter kit) — separate guards for Customer and Admin                |

---

## 4. User Roles

| Role                           | Description                                                                                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Guest**                      | Unauthenticated visitor; can browse, view products, add to cart, and checkout as guest (or is required to log in — to be decided, see Open Questions). |
| **Customer**                   | Registered user; can view order history, manage profile, checkout faster with saved info.                                                              |
| **Admin**                      | Full access to the admin panel — manages hero banners, categories, products, orders/invoices.                                                          |
| **(Optional) Staff/Sub-admin** | Limited admin role, e.g., order processing only — flagged as a future enhancement unless required now.                                                 |

---

## 5. Information Architecture — Page Sequence

Both the **Home Page** and other core pages follow a consistent top-to-bottom content sequence as specified:

**Home Page:**

1. Header / Navigation
2. Hero Section (Image Carousel)
3. Category Section
4. Best-Selling Products Section
5. New Collection Section
6. Footer

**Shop Page, Product Details, Checkout** — reuse the same global structure (Header → Page Content → Footer), maintaining consistent branding and navigation throughout the site.

---

## 6. Functional Requirements — Storefront

### 6.1 Global Layout

- **Header/Navbar:** Logo, primary navigation (Home, Shop, Categories, About/Contact — TBD), search bar, cart icon with item count, account/login icon.
- **Footer:** Company info, quick links, category links, contact/social info, payment method icons, copyright.
- Currency displayed as **৳ (Taka)** across all price fields, e.g., `৳1,250`.
- Fully responsive (mobile-first, since Bangladeshi e-commerce traffic is majority mobile).

### 6.2 Home Page

| Section                   | Requirement                                                                                                                                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero Carousel**         | Auto-rotating image slider (with manual nav arrows/dots). Each slide supports: image, optional title/subtitle text, CTA button + link (e.g., to a category or product). Content fully managed via Admin Panel.                             |
| **Category Section**      | Grid/row of category cards (image + name). Clicking a category routes to Shop page filtered by that category. Sourced from admin-managed Category list; admin can choose which categories display and their order (e.g., "featured" flag). |
| **Best-Selling Products** | Grid of product cards (image, name, price, stock badge, quick "Add to Cart"). "Best-selling" is a manually curated flag set by admin per product (since we're not tracking real sales analytics for this) — **see Open Question 6.1**.     |
| **New Collection**        | Grid/section of newly added or admin-flagged "featured new" products, similarly curated.                                                                                                                                                   |
| **Footer**                | As described in 6.1.                                                                                                                                                                                                                       |

### 6.3 Shop Page

- Full product listing with pagination (or infinite scroll).
- Filters: by Category, Price range, Availability (In Stock / Stock Out), possibly Sort (Newest, Price Low-High, High-Low).
- Search bar integration (product name/description match).
- Product card shows: image, name, price, stock badge.

### 6.4 Product Details Page

- Image gallery (multiple product images, if supported).
- Product name, price, description, stock badge (In Stock / Stock Out).
- Quantity selector (only relevant if "Add to Cart" allows quantity — note: since inventory isn't tracked, quantity selection is just for cart convenience, not stock validation).
- "Add to Cart" button — disabled or hidden if `Stock Out`.
- Related/similar products section (optional, based on category).
- Breadcrumb navigation (Home > Shop > Category > Product).

### 6.5 Cart Page

- List of added items with image, name, unit price, quantity (editable), subtotal.
- Remove item option.
- Order summary: subtotal, delivery charge (if applicable), total — all in ৳.
- "Proceed to Checkout" CTA.

### 6.6 Checkout Page

- Customer information form: Name, Phone, Email (optional), Delivery Address, City/District (relevant for Bangladesh delivery zones), Order Notes (optional).
- Payment method selection — **Open Question:** Cash on Delivery (COD) only, or integrated gateways (bKash, Nagad, Rocket, SSLCommerz)? COD is the most common baseline for Bangladeshi e-commerce MVPs.
- Order summary review (items, quantities, subtotal, delivery fee, total).
- "Place Order" action → generates Order + Invoice, shows Order Confirmation page.

### 6.7 Order Confirmation Page

- Order number/reference, summary of items purchased, delivery info, estimated confirmation message.
- Optionally emailed/SMS'd to customer (future enhancement — see Section 10).

### 6.8 Customer Account (if login is implemented)

- Registration/Login (via starter kit auth).
- Order history list with statuses (Pending, Processing, Shipped, Delivered, Cancelled — to be finalized).
- Profile management (name, phone, address).

---

## 7. Functional Requirements — Admin Panel

### 7.1 Admin Authentication

- Separate admin login (protected route/guard), not publicly linked from storefront navigation.
- Dashboard landing page with summary widgets (total orders, pending orders, total products, revenue snapshot — optional nice-to-have).

### 7.2 Hero Section Management

- CRUD interface for hero slides.
- Fields per slide: Image upload, Title (optional), Subtitle (optional), CTA text (optional), CTA link (optional), Display order, Active/Inactive toggle.
- Reorder slides (drag-and-drop or order number field).

### 7.3 Category Management

- CRUD interface for categories.
- Fields: Name, Slug (auto-generated), Image/Icon, Description (optional), "Show on Homepage" toggle, Display order.
- Prevent deletion of a category that has associated products (or handle via reassignment/soft-delete — **Open Question**).

### 7.4 Product Management

- CRUD interface for products.
- Fields: Name, Slug, Category (relation), Price (in ৳), Discount Price (optional), Description, Images (multiple, with a primary/thumbnail image), **Stock Badge (In Stock / Stock Out — simple toggle/select, not a quantity field)**, "Best Seller" flag (boolean), "New Collection" flag (boolean), Active/Inactive (published) toggle.
- Bulk actions (optional): bulk stock status update, bulk delete.
- Image upload with preview, validation (file type/size).

### 7.5 Order & Invoice Management

- List of all orders with filters (status, date range, customer).
- Order detail view: customer info, items ordered, quantities, prices, total, delivery address, payment method, current status.
- Ability to update order status (e.g., Pending → Processing → Shipped → Delivered / Cancelled).
- **Invoice generation:** downloadable/printable PDF invoice per order (Laravel PDF package, e.g., `barryvdh/laravel-dompdf` or similar).
- Basic order search (by order ID, customer name, or phone).

### 7.6 Admin User Management (optional/future)

- Manage additional admin accounts, roles/permissions — flagged as future enhancement unless required for MVP.

---

## 8. Non-Functional Requirements

| Category            | Requirement                                                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Performance**     | Pages should load quickly on average Bangladeshi mobile network speeds; optimize images (lazy loading, compressed formats).                                       |
| **Responsiveness**  | Fully responsive design across mobile, tablet, desktop — mobile-first priority.                                                                                   |
| **Localization**    | UI language: English. Currency: Bangladeshi Taka (৳), formatted appropriately (e.g., thousand separators as per local convention).                                |
| **Security**        | CSRF protection (default in Laravel/Inertia), form validation (server + client side), sanitized file uploads, admin route protection via middleware/guards.       |
| **SEO**             | Meta tags, friendly slugs for categories/products, sitemap (recommended for future).                                                                              |
| **Maintainability** | Clean component structure in Vue, reusable Blade/Inertia layouts, organized Laravel folder structure (Actions/Services pattern recommended for business logic).   |
| **Scalability**     | Since inventory isn't tracked in real time, the system remains lightweight; architecture should still allow adding inventory tracking later without major rework. |
| **Browser Support** | Latest versions of Chrome, Firefox, Safari, Edge; mobile Chrome/Safari.                                                                                           |

---

## 9. Data Model (High-Level Entities)

- **User** (customers + admins, differentiated by role/guard)
- **HeroSlide** (image, title, subtitle, cta_text, cta_link, order, is_active)
- **Category** (name, slug, image, description, show_on_homepage, order)
- **Product** (name, slug, category_id, price, discount_price, description, stock_status [in_stock/stock_out], is_best_seller, is_new_collection, is_active)
- **ProductImage** (product_id, image_path, is_primary)
- **Cart / CartItem** (session or user-based, product_id, quantity)
- **Order** (user_id nullable for guest, customer_name, phone, email, address, city, payment_method, status, subtotal, delivery_fee, total, created_at)
- **OrderItem** (order_id, product_id, product_name_snapshot, price_snapshot, quantity, subtotal)
- **Invoice** (order_id, invoice_number, generated_at, pdf_path optional)

_Note: Product name/price are "snapshotted" into OrderItem to preserve historical accuracy even if the product is later edited or deleted._

---

## 10. Out of Scope (for this phase)

- Real-time inventory/stock quantity tracking.
- Multi-vendor/marketplace functionality.
- Product reviews & ratings (unless later requested).
- Wishlist functionality (unless later requested).
- Multi-language support (site is English-only for now).
- Automated email/SMS notifications (can be a fast-follow enhancement).
- Loyalty points, coupons/discount codes (unless later requested).

---

## 11. Open Questions / Decisions Needed

1. **Best-Seller / New Collection logic:** Confirmed as manually flagged by admin per product (not calculated from actual sales data) — please confirm this is acceptable, or if actual order-count-based "best seller" logic is desired later.
2. **Guest checkout:** Should customers be required to create an account, or is guest checkout allowed?
3. **Payment methods:** Cash on Delivery only for MVP, or integrate bKash/Nagad/Rocket/SSLCommerz gateways?
4. **Delivery charge logic:** Flat rate, free above a threshold, or location-based (Dhaka vs. outside Dhaka — a very common Bangladeshi e-commerce pattern)?
5. **Category deletion rule:** Block deletion if products exist under it, or reassign/soft-delete?
6. **Order status workflow:** Confirm exact statuses (e.g., Pending, Confirmed, Processing, Shipped, Delivered, Cancelled, Returned).
7. **Notifications:** Any requirement for SMS (very common in Bangladesh for order confirmation) or email notifications at this stage?

---

## 12. Suggested Development Phases

| Phase                                  | Scope                                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Phase 1 — Foundation**               | Laravel starter kit setup, auth scaffolding, base layout (header/footer), database schema & migrations. |
| **Phase 2 — Admin Panel Core**         | Category, Product, Hero Slide CRUD modules.                                                             |
| **Phase 3 — Storefront Core**          | Home page (all sections), Shop page, Product Details page.                                              |
| **Phase 4 — Cart & Checkout**          | Cart functionality, Checkout flow, Order creation.                                                      |
| **Phase 5 — Order/Invoice Management** | Admin order list, status updates, PDF invoice generation.                                               |
| **Phase 6 — Polish & Launch**          | Responsiveness pass, performance optimization, SEO basics, QA/testing.                                  |

---

## 13. Summary

NovaShop's requirements center around a clean, curated shopping experience without the complexity of real-time inventory management — relying instead on a simple stock-status badge. The homepage and all major pages follow a consistent Hero → Category → Best-Sellers → New Collection → Footer structure (adapted per page), and the admin panel gives full editorial control over homepage content, catalog, and order/invoice processing. The Laravel 12 + Inertia + Vue 3 + Tailwind stack is well suited for this scope, offering a fast SPA-like experience with Laravel's mature backend ecosystem.

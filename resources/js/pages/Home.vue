<script setup lang="ts">
import MiniCart from '@/components/MiniCart.vue';
import { useCart, type CartProduct } from '@/composables/useCart';
import { useWishlist, type WishlistProduct } from '@/composables/useWishlist';
import { Head, Link } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight, Facebook, Heart, Instagram, Menu, Search, Star, Trash2, UserRound, X } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import './Home.css';

type Product = WishlistProduct & CartProduct;

const slides = [
    {
        eyebrow: 'Eid Collection',
        title: 'Fresh weaves, festival ready',
        description: 'Handpicked sarees and panjabis, priced clearly, delivered across Bangladesh.',
        action: 'Shop the collection',
        target: '#new-collection',
        image: 'https://picsum.photos/seed/novashop-saree/1400/900',
    },
    {
        eyebrow: 'New Arrivals',
        title: 'Everyday electronics, honest prices',
        description: 'From mobile accessories to home gadgets, every price tag tells you exactly what you pay.',
        action: 'Explore best sellers',
        target: '#best-sellers',
        image: 'https://picsum.photos/seed/novashop-electronics/1400/900',
    },
    {
        eyebrow: 'Home & Kitchen',
        title: 'Built for the everyday counter',
        description: 'Cookware and storage that earns its keep, at prices that stay put.',
        action: 'Browse categories',
        target: '#categories',
        image: 'https://picsum.photos/seed/novashop-kitchen/1400/900',
    },
];

const categories = [
    { name: 'Sarees & Panjabis', image: 'https://loremflickr.com/240/240/saree' },
    { name: 'Electronics', image: 'https://loremflickr.com/240/240/electronics' },
    { name: 'Home & Kitchen', image: 'https://loremflickr.com/240/240/kitchenware' },
    { name: 'Beauty & Care', image: 'https://loremflickr.com/240/240/cosmetics' },
    { name: 'Groceries', image: 'https://loremflickr.com/240/240/groceries' },
    { name: 'Kids & Toys', image: 'https://loremflickr.com/240/240/toys' },
];

const bestSellers: Product[] = [
    { name: 'Cotton Jamdani Saree', price: 3450, oldPrice: 4200, seed: 'p-saree1', stock: true, rating: 4.6, reviews: 128 },
    { name: 'Wireless Earbuds Pro', price: 1890, seed: 'p-earbuds', stock: true, rating: 4.2, reviews: 342 },
    { name: 'Non-stick Cookware Set', price: 2650, oldPrice: 3100, seed: 'p-cookware', stock: true, rating: 4.8, reviews: 76 },
    { name: "Men's Panjabi - Festive", price: 1750, seed: 'p-panjabi', stock: false, rating: 4.4, reviews: 54 },
];

const newCollection: Product[] = [
    { name: 'Ceramic Tea Set', price: 1250, seed: 'p-tea', stock: true, rating: 4.5, reviews: 19 },
    { name: 'Kids Puzzle Cube', price: 350, seed: 'p-puzzle', stock: true, rating: 4.1, reviews: 33 },
    { name: 'Herbal Face Wash', price: 480, oldPrice: 550, seed: 'p-facewash', stock: true, rating: 4.7, reviews: 61 },
    { name: 'Bamboo Storage Basket', price: 690, seed: 'p-basket', stock: false, rating: 4.0, reviews: 12 },
    { name: 'Handwoven Table Runner', price: 890, seed: 'p-runner', stock: true, rating: 4.3, reviews: 27 },
    { name: 'Stainless Steel Water Bottle', price: 620, oldPrice: 750, seed: 'p-bottle', stock: true, rating: 4.6, reviews: 88 },
    { name: 'Kids Rain Jacket', price: 940, seed: 'p-jacket', stock: false, rating: 4.2, reviews: 15 },
    { name: 'Aromatic Scented Candle Set', price: 560, seed: 'p-candle', stock: true, rating: 4.8, reviews: 41 },
];

const currentSlide = ref(0);
const menuOpen = ref(false);
const wishlistOpen = ref(false);
const wishlistButton = ref<HTMLElement | null>(null);
const wishlistPanel = ref<HTMLElement | null>(null);
const toastMessage = ref('');
const toastVisible = ref(false);
let autoplayTimer: number | undefined;
let toastTimer: number | undefined;

const activeSlide = computed(() => slides[currentSlide.value]);
const { addItem } = useCart();
const { wishlistItems, wishlistCount, toggleWishlist: toggleWishlistItem, isInWishlist } = useWishlist();

function formatPrice(price: number) {
    return `৳ ${price.toLocaleString('en-IN')}`;
}

function showToast(message: string) {
    toastMessage.value = message;
    toastVisible.value = true;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        toastVisible.value = false;
    }, 2500);
}

function goToSlide(index: number) {
    currentSlide.value = (index + slides.length) % slides.length;
    restartAutoplay();
}

function nextSlide() {
    goToSlide(currentSlide.value + 1);
}

function previousSlide() {
    goToSlide(currentSlide.value - 1);
}

function restartAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = window.setInterval(nextSlide, 6000);
}

function addToCart(product: Product) {
    addItem(product);
    showToast('Added to cart');
}

function toggleWishlist(product?: Product) {
    if (!product) {
        wishlistOpen.value = !wishlistOpen.value;
        return;
    }

    const added = toggleWishlistItem(product);
    showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
}

function closeMenu() {
    menuOpen.value = false;
}

function closeWishlist() {
    wishlistOpen.value = false;
}

function handleDocumentClick(event: MouseEvent) {
    const target = event.target as Node;

    if (wishlistOpen.value && !wishlistPanel.value?.contains(target) && !wishlistButton.value?.contains(target)) {
        closeWishlist();
    }
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
        closeWishlist();
    }
}

onMounted(() => {
    restartAutoplay();
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    window.clearInterval(autoplayTimer);
    window.clearTimeout(toastTimer);
    document.removeEventListener('click', handleDocumentClick);
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <Head title="Everyday shopping, honestly priced">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link
            href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap"
            rel="stylesheet"
        />
    </Head>

    <div class="home-page">
        <header class="site-header">
            <div class="page-shell header-inner">
                <Link href="/" class="brand focus-ring">
                    <span class="brand-mark">৳</span>
                    <span class="brand-name">NovaShop</span>
                </Link>

                <nav class="desktop-nav" aria-label="Main navigation">
                    <Link href="/" class="active">Home</Link>
                    <a href="#best-sellers">Shop</a>
                    <a href="#categories">Categories</a>
                    <a href="#footer">About</a>
                </nav>

                <label class="desktop-search">
                    <span class="sr-only">Search products</span>
                    <input type="search" placeholder="Search products..." />
                    <Search :size="17" aria-hidden="true" />
                </label>

                <div class="header-actions">
                    <button
                        ref="wishlistButton"
                        class="icon-button wishlist-button focus-ring"
                        aria-label="Wishlist"
                        :aria-expanded="wishlistOpen"
                        @click="toggleWishlist()"
                    >
                        <Heart :size="20" :fill="wishlistCount ? 'currentColor' : 'none'" />
                        <span v-if="wishlistCount" class="count-badge">{{ wishlistCount }}</span>
                    </button>
                    <button class="icon-button mobile-only focus-ring" aria-label="Search">
                        <Search :size="20" />
                    </button>
                    <button class="icon-button account-button focus-ring" aria-label="Account">
                        <UserRound :size="20" />
                    </button>
                    <MiniCart />
                    <button class="icon-button mobile-only focus-ring" aria-label="Open menu" :aria-expanded="menuOpen" @click="menuOpen = true">
                        <Menu :size="24" />
                    </button>
                </div>
            </div>
        </header>

        <aside v-if="wishlistOpen" ref="wishlistPanel" class="wishlist-panel" aria-label="Wishlist">
            <div class="wishlist-panel-header">
                <h2>Your Wishlist ({{ wishlistCount }})</h2>
                <button class="icon-button focus-ring" aria-label="Close wishlist" @click="closeWishlist"><X :size="20" /></button>
            </div>
            <div v-if="wishlistItems.length" class="wishlist-item-list">
                <div v-for="item in wishlistItems" :key="item.name" class="wishlist-item">
                    <img :src="`https://picsum.photos/seed/${item.seed}/120/120`" :alt="item.name" />
                    <div class="wishlist-item-details">
                        <h3>{{ item.name }}</h3>
                        <strong>{{ formatPrice(item.price) }}</strong>
                        <span class="wishlist-stock" :class="{ out: !item.stock }">{{ item.stock ? 'In Stock' : 'Out of Stock' }}</span>
                    </div>
                    <button class="remove-button focus-ring" :aria-label="`Remove ${item.name} from wishlist`" @click="toggleWishlist(item)">
                        <Trash2 :size="16" />
                    </button>
                </div>
            </div>
            <div v-else class="wishlist-empty">
                <Heart :size="58" stroke-width="1.5" aria-hidden="true" />
                <strong>Your wishlist is empty</strong>
                <p>Looks like you haven't added anything yet.</p>
                <a class="button button-primary" href="#best-sellers" @click="closeWishlist">Explore Products</a>
            </div>
            <div v-if="wishlistItems.length" class="wishlist-panel-footer">
                <a class="button button-outline" href="/wishlist" @click="closeWishlist">View Wishlist</a>
            </div>
        </aside>

        <div v-if="menuOpen" class="drawer-overlay mobile-only" @click="closeMenu"></div>
        <aside class="mobile-drawer mobile-only" :class="{ open: menuOpen }" aria-label="Mobile navigation">
            <div class="drawer-header">
                <span class="brand-name">Menu</span>
                <button class="icon-button focus-ring" aria-label="Close menu" @click="closeMenu"><X :size="20" /></button>
            </div>
            <nav class="drawer-nav">
                <Link href="/" @click="closeMenu">Home</Link>
                <a href="#best-sellers" @click="closeMenu">Shop</a>
                <a href="#categories" @click="closeMenu">Categories</a>
                <a href="#footer" @click="closeMenu">About</a>
            </nav>
            <p class="drawer-note">Cash on Delivery and bKash, Nagad, Rocket accepted.</p>
        </aside>

        <main>
            <section class="hero-section" aria-label="Featured offers">
                <div class="hero" @mouseenter="window.clearInterval(autoplayTimer)" @mouseleave="restartAutoplay">
                    <Transition name="hero-fade" mode="out-in">
                        <div :key="currentSlide" class="hero-slide">
                            <img :src="activeSlide.image" alt="" />
                            <div class="hero-shade"></div>
                            <div class="page-shell hero-content">
                                <div class="hero-copy">
                                    <p class="eyebrow">{{ activeSlide.eyebrow }}</p>
                                    <h1>{{ activeSlide.title }}</h1>
                                    <p class="hero-description">{{ activeSlide.description }}</p>
                                    <a class="button button-gold" :href="activeSlide.target">{{ activeSlide.action }}</a>
                                </div>
                            </div>
                        </div>
                    </Transition>
                    <button class="hero-arrow hero-prev desktop-only focus-ring" aria-label="Previous slide" @click="previousSlide">
                        <ChevronLeft :size="20" />
                    </button>
                    <button class="hero-arrow hero-next desktop-only focus-ring" aria-label="Next slide" @click="nextSlide">
                        <ChevronRight :size="20" />
                    </button>
                    <div class="hero-dots" role="tablist" aria-label="Slide navigation">
                        <button
                            v-for="(_, index) in slides"
                            :key="index"
                            class="focus-ring"
                            :class="{ selected: index === currentSlide }"
                            :aria-label="`Go to slide ${index + 1}`"
                            @click="goToSlide(index)"
                        ></button>
                    </div>
                </div>
                <div class="weave-rule"></div>
            </section>

            <section id="categories" class="page-shell content-section">
                <div class="section-heading">
                    <div>
                        <h2>Shop by category</h2>
                        <p>Everything sorted the way your shop shelf already is.</p>
                    </div>
                    <a href="#categories" class="section-link">View all</a>
                </div>
                <div class="category-grid">
                    <a v-for="category in categories" :key="category.name" href="#best-sellers" class="category-item focus-ring">
                        <span class="category-image"><img :src="category.image" :alt="category.name" /></span>
                        <span>{{ category.name }}</span>
                    </a>
                </div>
            </section>

            <section id="best-sellers" class="page-shell content-section">
                <div class="section-heading">
                    <div>
                        <h2>Best sellers</h2>
                        <p>What Bangladeshi shoppers keep coming back for.</p>
                    </div>
                    <a href="#best-sellers" class="section-link">View all</a>
                </div>
                <div class="product-grid best-seller-grid">
                    <article v-for="product in bestSellers" :key="product.name" class="product-card">
                        <div class="product-image-wrap">
                            <img class="product-image" :src="`https://picsum.photos/seed/${product.seed}/500/500`" :alt="product.name" />
                            <button
                                class="product-wishlist focus-ring"
                                :class="{ active: isInWishlist(product.name) }"
                                :aria-label="`${isInWishlist(product.name) ? 'Remove' : 'Add'} ${product.name} ${isInWishlist(product.name) ? 'from' : 'to'} wishlist`"
                                :aria-pressed="isInWishlist(product.name)"
                                @click="toggleWishlist(product)"
                            >
                                <Heart :size="16" :fill="isInWishlist(product.name) ? 'currentColor' : 'none'" />
                            </button>
                            <span class="stock-badge" :class="{ out: !product.stock }">{{ product.stock ? 'In Stock' : 'Stock Out' }}</span>
                            <span class="price-tag"
                                ><s v-if="product.oldPrice">{{ formatPrice(product.oldPrice) }}</s
                                >{{ formatPrice(product.price) }}</span
                            >
                        </div>
                        <div class="product-info">
                            <h3>
                                <Link :href="route('products.show', { slug: product.seed })">{{ product.name }}</Link>
                            </h3>
                            <div class="rating">
                                <span
                                    ><Star
                                        v-for="star in 5"
                                        :key="star"
                                        :size="13"
                                        :fill="star <= Math.round(product.rating) ? 'currentColor' : 'none'" /></span
                                >{{ product.rating.toFixed(1) }} ({{ product.reviews }})
                            </div>
                            <div class="product-actions">
                                <button class="button button-primary" :disabled="!product.stock" @click="addToCart(product)">
                                    {{ product.stock ? 'Add to Cart' : 'Stock Out' }}
                                </button>
                                <button class="button button-outline" :disabled="!product.stock" @click="showToast('Redirecting to checkout...')">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section id="new-collection" class="page-shell content-section">
                <div class="section-heading">
                    <div>
                        <h2>New collection</h2>
                        <p>Fresh arrivals, added this week.</p>
                    </div>
                </div>
                <div class="product-grid collection-grid">
                    <article v-for="product in newCollection" :key="product.name" class="product-card">
                        <div class="product-image-wrap">
                            <img class="product-image" :src="`https://picsum.photos/seed/${product.seed}/500/500`" :alt="product.name" />
                            <button
                                class="product-wishlist focus-ring"
                                :class="{ active: isInWishlist(product.name) }"
                                :aria-label="`${isInWishlist(product.name) ? 'Remove' : 'Add'} ${product.name} ${isInWishlist(product.name) ? 'from' : 'to'} wishlist`"
                                :aria-pressed="isInWishlist(product.name)"
                                @click="toggleWishlist(product)"
                            >
                                <Heart :size="16" :fill="isInWishlist(product.name) ? 'currentColor' : 'none'" />
                            </button>
                            <span class="stock-badge" :class="{ out: !product.stock }">{{ product.stock ? 'In Stock' : 'Stock Out' }}</span>
                            <span class="price-tag"
                                ><s v-if="product.oldPrice">{{ formatPrice(product.oldPrice) }}</s
                                >{{ formatPrice(product.price) }}</span
                            >
                        </div>
                        <div class="product-info">
                            <h3>
                                <Link :href="route('products.show', { slug: product.seed })">{{ product.name }}</Link>
                            </h3>
                            <div class="rating">
                                <span
                                    ><Star
                                        v-for="star in 5"
                                        :key="star"
                                        :size="13"
                                        :fill="star <= Math.round(product.rating) ? 'currentColor' : 'none'" /></span
                                >{{ product.rating.toFixed(1) }} ({{ product.reviews }})
                            </div>
                            <div class="product-actions">
                                <button class="button button-primary" :disabled="!product.stock" @click="addToCart(product)">
                                    {{ product.stock ? 'Add to Cart' : 'Stock Out' }}</button
                                ><button class="button button-outline" :disabled="!product.stock" @click="showToast('Redirecting to checkout...')">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
            <div class="weave-rule"></div>
        </main>

        <footer id="footer" class="site-footer">
            <div class="page-shell footer-grid">
                <div class="footer-intro">
                    <div class="footer-brand"><span class="brand-mark">৳</span><span class="brand-name">NovaShop</span></div>
                    <p>A neighborhood shop's honesty, brought online, for shoppers across Bangladesh.</p>
                </div>
                <div>
                    <h3>Quick links</h3>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="#best-sellers">Shop</a></li>
                        <li><a href="#footer">Track order</a></li>
                        <li><a href="#footer">Contact us</a></li>
                    </ul>
                </div>
                <div>
                    <h3>Categories</h3>
                    <ul>
                        <li v-for="category in categories.slice(0, 5)" :key="category.name">
                            <a href="#categories">{{ category.name }}</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3>We accept</h3>
                    <div class="payment-list">
                        <span>Cash on Delivery</span><span>bKash</span><span>Nagad</span><span>Rocket</span><span>Visa/Mastercard</span>
                    </div>
                    <div class="social-links">
                        <a href="#footer" aria-label="Facebook"><Facebook :size="16" /></a
                        ><a href="#footer" aria-label="Instagram"><Instagram :size="16" /></a>
                    </div>
                </div>
            </div>
            <div class="footer-bottom"><div class="page-shell">© 2026 NovaShop. All rights reserved.</div></div>
        </footer>

        <div class="toast" :class="{ visible: toastVisible }" role="status">{{ toastMessage }}</div>
    </div>
</template>

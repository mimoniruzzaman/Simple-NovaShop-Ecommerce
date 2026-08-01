<script setup lang="ts">
import MiniCart from '@/components/MiniCart.vue';
import { useCart } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { Head, Link } from '@inertiajs/vue3';
import { ChevronLeft, ChevronRight, Heart, Menu, Minus, Plus, Search, Star, UserRound, X } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import './ProductDetails.css';

const product = {
    name: 'Handloom Jamdani Panjabi - Ivory & Gold',
    category: "Panjabi · Men's Fashion",
    price: 2850,
    originalPrice: 3200,
    rating: 4.6,
    reviews: 142,
    stock: true,
    images: [
        'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=900&q=80',
        'https://images.unsplash.com/photo-1622445275576-721325763afe?w=900&q=80',
        'https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=900&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&q=80',
    ],
    seed: 'p-panjabi-detail',
};

const relatedProducts = [
    {
        name: 'Navy Cotton Panjabi',
        price: 1950,
        stock: true,
        seed: 'navy-panjabi',
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80',
    },
    {
        name: 'Cream Linen Panjabi, Embroidered',
        price: 2400,
        stock: true,
        seed: 'cream-panjabi',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80',
    },
    {
        name: 'Maroon Silk-Blend Panjabi',
        price: 3100,
        stock: false,
        seed: 'maroon-panjabi',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80',
    },
    {
        name: 'Slate Grey Formal Panjabi',
        price: 2150,
        stock: true,
        seed: 'grey-panjabi',
        image: 'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?w=500&q=80',
    },
];

const reviews = [
    {
        name: 'Rafiqul Islam',
        date: 'July 12, 2026',
        rating: 5,
        verified: true,
        body: 'Fabric feels genuinely handloom, not the stiff machine-woven kind you get on other sites. Wore it to a wedding and got asked twice where it was from.',
    },
    {
        name: 'Tasnim Ahmed',
        date: 'July 3, 2026',
        rating: 4,
        verified: true,
        body: "Good quality overall. Runs slightly large - I'd size down if you're between sizes. Delivery was quick, three days to Mymensingh.",
    },
    {
        name: 'Shirin Akter',
        date: 'June 28, 2026',
        rating: 5,
        verified: false,
        body: 'Bought this for my husband. The gold motif is subtle in person, not gaudy at all. Very happy with it.',
    },
];

const galleryIndex = ref(0);
const quantity = ref(1);
const menuOpen = ref(false);
const toastVisible = ref(false);
const toastMessage = ref('Added to cart');
let toastTimer: number | undefined;

const { wishlistCount, isInWishlist, toggleWishlist } = useWishlist();
const { addItem } = useCart();
const wishlistProduct = {
    name: product.name,
    price: product.price,
    seed: product.seed,
    stock: product.stock,
    rating: product.rating,
    reviews: product.reviews,
};
const saved = computed(() => isInWishlist(product.name));
const totalPrice = computed(() => product.price * quantity.value);
const totalOriginalPrice = computed(() => product.originalPrice * quantity.value);
const savings = computed(() => totalOriginalPrice.value - totalPrice.value);

function formatPrice(price: number) {
    return `৳${price.toLocaleString('en-IN')}`;
}

function updateQuantity(change: number) {
    quantity.value = Math.max(1, quantity.value + change);
}

function showToast(message: string) {
    toastMessage.value = message;
    toastVisible.value = true;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        toastVisible.value = false;
    }, 2500);
}

function addToCart() {
    addItem(product, quantity.value);
    showToast(`${quantity.value} item${quantity.value === 1 ? '' : 's'} added to cart`);
}

function buyNow() {
    addItem(product, quantity.value);
    showToast('Added to cart - checkout is coming next');
}

function addRelatedToCart(item: (typeof relatedProducts)[number]) {
    if (!item.stock) return;

    addItem({ ...item, rating: 0, reviews: 0 });
    showToast('Added to cart');
}

function toggleProductWishlist() {
    toggleWishlist(wishlistProduct);
    showToast(saved.value ? 'Removed from wishlist' : 'Added to wishlist');
}

function closeMenu() {
    menuOpen.value = false;
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') closeMenu();
}

onMounted(() => document.addEventListener('keydown', handleKeydown));
onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown);
    window.clearTimeout(toastTimer);
});
</script>

<template>
    <Head :title="product.name" />
    <div class="product-page">
        <header class="product-header">
            <div class="product-container product-header-row">
                <Link href="/" class="product-brand focus-ring"
                    ><span class="product-brand-mark">৳</span><span class="product-brand-name">NovaShop</span></Link
                >
                <nav class="product-nav">
                    <Link href="/">Home</Link><Link href="/shop">Shop</Link><a href="/shop#categories">Categories</a><a href="#reviews">About</a>
                </nav>
                <label class="product-search"
                    ><span class="sr-only">Search products</span><Search :size="16" /><input type="search" placeholder="Search products..."
                /></label>
                <div class="product-header-actions">
                    <button class="product-icon focus-ring" aria-label="Wishlist" :aria-pressed="saved" @click="toggleProductWishlist">
                        <Heart :size="20" :fill="saved ? 'currentColor' : 'none'" /><span v-if="wishlistCount" class="product-badge">{{
                            wishlistCount
                        }}</span>
                    </button>
                    <button class="product-icon product-mobile-only focus-ring" aria-label="Search"><Search :size="20" /></button>
                    <button class="product-icon product-account focus-ring" aria-label="Account"><UserRound :size="20" /></button>
                    <MiniCart button-class="product-icon" />
                    <button
                        class="product-icon product-mobile-only focus-ring"
                        aria-label="Open menu"
                        :aria-expanded="menuOpen"
                        @click="menuOpen = true"
                    >
                        <Menu :size="22" />
                    </button>
                </div>
            </div>
        </header>

        <div v-if="menuOpen" class="product-drawer-overlay product-mobile-only" @click="closeMenu"></div>
        <aside class="product-drawer product-mobile-only" :class="{ open: menuOpen }">
            <div class="product-drawer-head">
                <span class="product-brand-name">Menu</span
                ><button class="product-icon focus-ring" aria-label="Close menu" @click="closeMenu"><X :size="20" /></button>
            </div>
            <nav>
                <Link href="/" @click="closeMenu">Home</Link><Link href="/shop" @click="closeMenu">Shop</Link
                ><a href="/shop#categories" @click="closeMenu">Categories</a><a href="#reviews" @click="closeMenu">About</a>
            </nav>
        </aside>

        <main>
            <div class="product-container">
                <nav class="product-breadcrumb" aria-label="Breadcrumb">
                    <Link href="/">Home</Link><span>›</span><Link href="/shop">Shop</Link><span>›</span><Link href="/shop#categories">Panjabi</Link
                    ><span>›</span><span>{{ product.name }}</span>
                </nav>
                <div class="product-layout">
                    <section class="product-gallery">
                        <div class="gallery-main">
                            <img :src="product.images[galleryIndex]" :alt="product.name" /><button
                                class="gallery-arrow gallery-prev product-desktop-only focus-ring"
                                aria-label="Previous image"
                                @click="galleryIndex = (galleryIndex + product.images.length - 1) % product.images.length"
                            >
                                <ChevronLeft :size="20" /></button
                            ><button
                                class="gallery-arrow gallery-next product-desktop-only focus-ring"
                                aria-label="Next image"
                                @click="galleryIndex = (galleryIndex + 1) % product.images.length"
                            >
                                <ChevronRight :size="20" />
                            </button>
                        </div>
                        <div class="gallery-dots product-mobile-only">
                            <button
                                v-for="(_, index) in product.images"
                                :key="index"
                                class="focus-ring"
                                :class="{ active: galleryIndex === index }"
                                :aria-label="`Show image ${index + 1}`"
                                @click="galleryIndex = index"
                            ></button>
                        </div>
                        <div class="gallery-thumbs">
                            <button
                                v-for="(image, index) in product.images"
                                :key="image"
                                class="focus-ring"
                                :class="{ active: galleryIndex === index }"
                                @click="galleryIndex = index"
                            >
                                <img :src="image" :alt="`${product.name}, image ${index + 1}`" />
                            </button>
                        </div>
                    </section>

                    <section class="product-info-panel">
                        <p class="product-eyebrow">{{ product.category }}</p>
                        <h1>{{ product.name }}</h1>
                        <div class="product-rating">
                            <span class="stars"><Star v-for="star in 5" :key="star" :size="16" fill="currentColor" /></span
                            ><span
                                ><strong>{{ product.rating }}</strong> · <a href="#reviews">{{ product.reviews }} reviews</a></span
                            ><span class="product-stock"><i></i> In Stock</span>
                        </div>
                        <div class="detail-price">
                            <span class="detail-unit-price">Unit price: {{ formatPrice(product.price) }}</span>
                            <s>{{ formatPrice(totalOriginalPrice) }}</s
                            ><span class="detail-hangtag">{{ formatPrice(totalPrice) }}</span
                            ><b>Save {{ formatPrice(savings) }}</b>
                        </div>
                        <div class="detail-quantity">
                            <span>Quantity</span>
                            <div>
                                <button class="focus-ring" aria-label="Decrease quantity" @click="updateQuantity(-1)"><Minus :size="16" /></button
                                ><output>{{ quantity }}</output
                                ><button class="focus-ring" aria-label="Increase quantity" @click="updateQuantity(1)"><Plus :size="16" /></button>
                            </div>
                        </div>
                        <div class="detail-actions product-desktop-only">
                            <button class="detail-button detail-primary" @click="addToCart">Add to Cart</button
                            ><button class="detail-button detail-secondary" @click="buyNow">Buy Now</button>
                        </div>
                        <hr />
                        <div class="detail-description">
                            <h2>Description</h2>
                            <p>
                                Hand-woven on traditional looms in Narayanganj, this panjabi pairs an ivory cotton base with a fine gold jamdani motif
                                at the yoke and cuffs - the kind of detail that reads as quiet craftsmanship rather than shine.
                            </p>
                            <ul>
                                <li>100% handloom cotton, breathable for humid weather</li>
                                <li>Regular fit, mandarin collar, single chest pocket</li>
                                <li>Motif is woven in, not printed - will not fade or crack with wash</li>
                                <li>Hand wash cold or dry clean; iron on reverse</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>

            <section id="reviews" class="reviews-section">
                <div class="product-container">
                    <div class="product-section-heading">
                        <h2>Customer Reviews</h2>
                        <p>What people are saying about this panjabi</p>
                    </div>
                    <div class="rating-summary">
                        <div class="rating-big"><strong>4.6</strong><span class="stars">★★★★★</span><small>out of 5 · 142 reviews</small></div>
                        <div class="rating-bars">
                            <div
                                v-for="row in [
                                    { label: '5 star', width: 78, count: 111 },
                                    { label: '4 star', width: 14, count: 20 },
                                    { label: '3 star', width: 5, count: 7 },
                                    { label: '2 star', width: 2, count: 2 },
                                    { label: '1 star', width: 1, count: 2 },
                                ]"
                                :key="row.label"
                            >
                                <span>{{ row.label }}</span
                                ><i><b :style="{ width: `${row.width}%` }"></b></i><em>{{ row.count }}</em>
                            </div>
                        </div>
                    </div>
                    <article v-for="review in reviews" :key="review.name" class="review-card">
                        <div class="review-top">
                            <div>
                                <strong>{{ review.name }}</strong
                                ><small v-if="review.verified">✓ Verified Purchase</small>
                            </div>
                            <time>{{ review.date }}</time>
                        </div>
                        <div class="stars">{{ '★'.repeat(review.rating) }}</div>
                        <p>{{ review.body }}</p>
                    </article>
                    <button class="review-more">Load more reviews</button>
                </div>
            </section>

            <section class="related-section">
                <div class="product-container">
                    <div class="product-section-heading">
                        <h2>You may also like</h2>
                        <p>More from Panjabi &amp; Men's Fashion</p>
                    </div>
                    <div class="related-grid">
                        <article v-for="item in relatedProducts" :key="item.name" class="related-card">
                            <img :src="item.image" :alt="item.name" /><span class="related-price">{{ formatPrice(item.price) }}</span>
                            <div>
                                <h3>{{ item.name }}</h3>
                                <small :class="{ out: !item.stock }">{{ item.stock ? '● In Stock' : 'Stock Out' }}</small
                                ><button class="detail-button detail-primary" :disabled="!item.stock" @click="addRelatedToCart(item)">
                                    {{ item.stock ? 'Add to Cart' : 'Stock Out' }}
                                </button>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </main>

        <div class="product-weave"></div>
        <footer class="product-footer">
            <div class="product-container">
                <div><strong>NovaShop</strong><a href="/">About Us</a><a href="#reviews">Contact</a></div>
                <div><strong>Shop</strong><a href="/shop">Panjabi</a><a href="/shop">Saree</a><a href="/shop">New Collection</a></div>
                <div><strong>Support</strong><a href="#footer">Track Order</a><a href="#footer">Returns</a><a href="#footer">FAQ</a></div>
                <div><strong>Payment Methods</strong><a href="#footer">Cash on Delivery</a><a href="#footer">bKash · Nagad · Rocket · Cards</a></div>
                <small>© 2026 NovaShop. All rights reserved.</small>
            </div>
        </footer>
        <div class="mobile-add-bar product-mobile-only">
            ><span>{{ formatPrice(totalPrice) }}</span
            ><button class="detail-button detail-primary" @click="addToCart">Add to Cart</button>
        </div>
        <div class="product-toast" :class="{ show: toastVisible }" role="status">{{ toastMessage }}</div>
    </div>
</template>

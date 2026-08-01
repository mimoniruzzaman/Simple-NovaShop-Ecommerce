<script setup lang="ts">
import FilterControls from '@/components/FilterControls.vue';
import MiniCart from '@/components/MiniCart.vue';
import { useBuyNow } from '@/composables/useBuyNow';
import { useCart, type CartProduct } from '@/composables/useCart';
import { useWishlist } from '@/composables/useWishlist';
import { Head, Link, router } from '@inertiajs/vue3';
import { ChevronDown, ChevronLeft, ChevronRight, Heart, Menu, Search, SlidersHorizontal, UserRound, X } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import './Shop.css';

type ShopProduct = CartProduct & { category: string; original?: number; added: number; image: string };

const products: ShopProduct[] = [
    {
        name: 'Handloom Jamdani Panjabi - Ivory & Gold',
        category: 'Panjabi',
        price: 2850,
        original: 3200,
        stock: true,
        rating: 4.6,
        reviews: 142,
        seed: 'p-panjabi-detail',
        added: 12,
        image: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=500&q=80',
    },
    {
        name: 'Navy Cotton Panjabi',
        category: 'Panjabi',
        price: 1950,
        stock: true,
        rating: 4.2,
        reviews: 58,
        seed: 'navy-panjabi',
        added: 11,
        image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=500&q=80',
    },
    {
        name: 'Cream Linen Panjabi, Embroidered',
        category: 'Panjabi',
        price: 2400,
        stock: true,
        rating: 4.4,
        reviews: 77,
        seed: 'cream-panjabi',
        added: 10,
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500&q=80',
    },
    {
        name: 'Maroon Silk-Blend Panjabi',
        category: 'Panjabi',
        price: 3100,
        stock: false,
        rating: 4.0,
        reviews: 21,
        seed: 'maroon-panjabi',
        added: 9,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80',
    },
    {
        name: 'Slate Grey Formal Panjabi',
        category: 'Panjabi',
        price: 2150,
        stock: true,
        rating: 4.3,
        reviews: 39,
        seed: 'grey-panjabi',
        added: 8,
        image: 'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?w=500&q=80',
    },
    {
        name: 'Jamdani Silk Saree - Emerald',
        category: 'Saree',
        price: 5200,
        original: 6000,
        stock: true,
        rating: 4.8,
        reviews: 203,
        seed: 'emerald-saree',
        added: 7,
        image: 'https://images.unsplash.com/photo-1610189844777-59796f739b6e?w=500&q=80',
    },
    {
        name: 'Handloom Tangail Saree',
        category: 'Saree',
        price: 3400,
        stock: true,
        rating: 4.5,
        reviews: 96,
        seed: 'tangail-saree',
        added: 6,
        image: 'https://images.unsplash.com/photo-1610030181087-540bf5442bec?w=500&q=80',
    },
    {
        name: 'Cotton Katan Saree',
        category: 'Saree',
        price: 2800,
        stock: true,
        rating: 4.1,
        reviews: 44,
        seed: 'katan-saree',
        added: 5,
        image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&q=80',
    },
    {
        name: 'Printed Cotton Kurti',
        category: 'Kurti',
        price: 1200,
        stock: true,
        rating: 3.9,
        reviews: 31,
        seed: 'cotton-kurti',
        added: 4,
        image: 'https://images.unsplash.com/photo-1583391733981-8498408e1e07?w=500&q=80',
    },
    {
        name: 'Embroidered Chikankari Kurti',
        category: 'Kurti',
        price: 1650,
        stock: false,
        rating: 4.4,
        reviews: 66,
        seed: 'chikankari-kurti',
        added: 3,
        image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500&q=80',
    },
    {
        name: 'Nakshi Kantha Stole',
        category: 'Accessories',
        price: 850,
        stock: true,
        rating: 4.7,
        reviews: 112,
        seed: 'kantha-stole',
        added: 2,
        image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=500&q=80',
    },
    {
        name: 'Leather Nagra Juti',
        category: 'Footwear',
        price: 1450,
        stock: true,
        rating: 4.2,
        reviews: 28,
        seed: 'nagra-juti',
        added: 1,
        image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&q=80',
    },
];

const categories = ['Panjabi', 'Saree', 'Kurti', 'Accessories', 'Footwear'];
const search = ref('');
const selectedCategories = ref<string[]>([]);
const minPrice = ref(0);
const maxPrice = ref(6000);
const inStockOnly = ref(false);
const minRating = ref(0);
const sort = ref('newest');
const page = ref(1);
const filterOpen = ref(false);
const pageSize = 8;

const { addItem } = useCart();
const { setBuyNow } = useBuyNow();
const { isInWishlist, toggleWishlist } = useWishlist();

const filteredProducts = computed(() => {
    const result = products.filter((product) => {
        const matchesSearch = !search.value || product.name.toLowerCase().includes(search.value.toLowerCase());
        const matchesCategory = !selectedCategories.value.length || selectedCategories.value.includes(product.category);
        const matchesPrice = product.price >= minPrice.value && product.price <= maxPrice.value;
        const matchesStock = !inStockOnly.value || product.stock;
        const matchesRating = !minRating.value || product.rating >= minRating.value;
        return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesRating;
    });

    return [...result].sort((a, b) => {
        if (sort.value === 'price-low') return a.price - b.price;
        if (sort.value === 'price-high') return b.price - a.price;
        if (sort.value === 'top-rated') return b.rating - a.rating;
        return b.added - a.added;
    });
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize)));
const visibleProducts = computed(() => filteredProducts.value.slice((page.value - 1) * pageSize, page.value * pageSize));
const activeFilterCount = computed(
    () =>
        selectedCategories.value.length +
        (inStockOnly.value ? 1 : 0) +
        (minRating.value ? 1 : 0) +
        (minPrice.value > 0 || maxPrice.value < 6000 ? 1 : 0),
);
const filterChips = computed(() => [
    ...selectedCategories.value.map((category) => ({ label: category, remove: () => toggleCategory(category) })),
    ...(inStockOnly.value
        ? [
              {
                  label: 'In Stock only',
                  remove: () => {
                      inStockOnly.value = false;
                      page.value = 1;
                  },
              },
          ]
        : []),
    ...(minRating.value
        ? [
              {
                  label: `${minRating.value}★ & up`,
                  remove: () => {
                      minRating.value = 0;
                      page.value = 1;
                  },
              },
          ]
        : []),
    ...(minPrice.value > 0 || maxPrice.value < 6000
        ? [
              {
                  label: `৳${minPrice.value}-${maxPrice.value}`,
                  remove: () => {
                      minPrice.value = 0;
                      maxPrice.value = 6000;
                      page.value = 1;
                  },
              },
          ]
        : []),
]);

watch([selectedCategories, minPrice, maxPrice, inStockOnly, minRating], () => {
    page.value = 1;
});

function formatPrice(price: number) {
    return `৳${price.toLocaleString('en-IN')}`;
}
function toggleCategory(category: string) {
    selectedCategories.value = selectedCategories.value.includes(category)
        ? selectedCategories.value.filter((item) => item !== category)
        : [...selectedCategories.value, category];
    page.value = 1;
}
function clearFilters() {
    selectedCategories.value = [];
    minPrice.value = 0;
    maxPrice.value = 6000;
    inStockOnly.value = false;
    minRating.value = 0;
    page.value = 1;
}
function addToCart(product: ShopProduct) {
    addItem(product);
}
function buyNow(product: ShopProduct) {
    setBuyNow(product, 1);
    router.visit('/checkout');
}
function goToPage(nextPage: number) {
    page.value = Math.min(Math.max(1, nextPage), totalPages.value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
    <Head title="Shop" />
    <div class="shop-page">
        <header class="shop-header">
            <div class="shop-container shop-header-row">
                <Link href="/" class="shop-brand"><span class="shop-brand-mark">৳</span><span class="shop-brand-name">NovaShop</span></Link>
                <nav class="shop-nav">
                    <Link href="/">Home</Link><Link href="/shop" class="active">Shop</Link><a href="/shop#categories">Categories</a
                    ><a href="/">About</a>
                </nav>
                <label class="shop-header-search"
                    ><Search :size="16" /><input v-model="search" type="search" placeholder="Search products..." @input="page = 1"
                /></label>
                <div class="shop-header-actions">
                    <button class="shop-icon shop-desktop-only" aria-label="Wishlist"><Heart :size="20" /></button
                    ><button class="shop-icon shop-desktop-only" aria-label="Account"><UserRound :size="20" /></button
                    ><MiniCart button-class="shop-icon" /><button class="shop-icon shop-mobile-only" aria-label="Open menu">
                        <Menu :size="22" />
                    </button>
                </div>
            </div>
        </header>
        <main>
            <div class="shop-container">
                <nav class="shop-breadcrumb"><Link href="/">Home</Link><span>›</span><span>Shop</span></nav>
                <div class="shop-page-head">
                    <h1>Shop</h1>
                    <p>Find something good for every shelf, room, and occasion.</p>
                </div>
            </div>
            <div class="shop-toolbar-wrap">
                <div class="shop-container">
                    <div class="shop-toolbar">
                        <label class="shop-search-field"
                            ><Search :size="18" /><input
                                v-model="search"
                                type="search"
                                placeholder="Search products..."
                                aria-label="Search products"
                                @input="page = 1" /></label
                        ><button class="filter-button shop-mobile-only" @click="filterOpen = true">
                            <SlidersHorizontal :size="18" /> Filter <span v-if="activeFilterCount">{{ activeFilterCount }}</span></button
                        ><label class="sort-field shop-desktop-only"
                            >Sort:
                            <select v-model="sort" @change="page = 1">
                                <option value="newest">Newest</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="top-rated">Top Rated</option></select
                            ><ChevronDown :size="15"
                        /></label>
                    </div>
                    <div v-if="filterChips.length" class="filter-chips">
                        <span v-for="chip in filterChips" :key="chip.label"
                            >{{ chip.label }} <button :aria-label="`Remove ${chip.label}`" @click="chip.remove"><X :size="12" /></button></span
                        ><button class="clear-link" @click="clearFilters">Clear all</button>
                    </div>
                </div>
            </div>
            <div class="shop-container shop-layout">
                <aside class="shop-sidebar shop-desktop-only">
                    <div class="sidebar-heading">
                        <h2>Filters</h2>
                        <button @click="clearFilters">Clear all</button>
                    </div>
                    <FilterControls
                        v-model:categories="selectedCategories"
                        v-model:min-price="minPrice"
                        v-model:max-price="maxPrice"
                        v-model:in-stock="inStockOnly"
                        v-model:min-rating="minRating"
                        :category-list="categories"
                        @update="page = 1"
                    />
                </aside>
                <section class="shop-results">
                    <div class="results-row">
                        <p>
                            Showing <strong>{{ visibleProducts.length }}</strong> of <strong>{{ filteredProducts.length }}</strong> products
                        </p>
                    </div>
                    <div v-if="visibleProducts.length" class="shop-product-grid">
                        <article v-for="product in visibleProducts" :key="product.name" class="shop-product-card">
                            <div class="shop-product-media">
                                <Link :href="route('products.show', { slug: product.seed })"
                                    ><img :src="product.image" :alt="product.name" loading="lazy" /></Link
                                ><button
                                    class="shop-heart"
                                    :class="{ active: isInWishlist(product.name) }"
                                    :aria-label="`Wishlist ${product.name}`"
                                    @click="toggleWishlist(product)"
                                >
                                    <Heart :size="16" :fill="isInWishlist(product.name) ? 'currentColor' : 'none'" /></button
                                ><span class="shop-price-tag">{{ formatPrice(product.price) }}</span>
                            </div>
                            <div class="shop-product-body">
                                <Link :href="route('products.show', { slug: product.seed })" class="shop-product-name">{{ product.name }}</Link>
                                <div class="shop-rating">
                                    <span>{{ '★'.repeat(Math.round(product.rating)) }}{{ '☆'.repeat(5 - Math.round(product.rating)) }}</span>
                                    {{ product.rating.toFixed(1) }} ({{ product.reviews }})
                                </div>
                                <span class="stock-badge" :class="{ out: !product.stock }">{{ product.stock ? 'In Stock' : 'Stock Out' }}</span>
                                <div class="shop-product-actions">
                                    <button class="shop-add-button" :disabled="!product.stock" @click="addToCart(product)">
                                        {{ product.stock ? 'Add to Cart' : 'Stock Out' }}</button
                                    ><button class="shop-buy-button" :disabled="!product.stock" @click="buyNow(product)">Buy Now</button>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div v-else class="shop-empty">
                        <h2>No products match your filters</h2>
                        <p>Try widening your price range or clearing a filter.</p>
                        <button @click="clearFilters">Clear all filters</button>
                    </div>
                    <nav v-if="totalPages > 1" class="pagination" aria-label="Pagination">
                        <button :disabled="page === 1" aria-label="Previous page" @click="goToPage(page - 1)"><ChevronLeft :size="16" /></button
                        ><button
                            v-for="pageNumber in totalPages"
                            :key="pageNumber"
                            :class="{ active: page === pageNumber }"
                            @click="goToPage(pageNumber)"
                        >
                            {{ pageNumber }}</button
                        ><button :disabled="page === totalPages" aria-label="Next page" @click="goToPage(page + 1)">
                            <ChevronRight :size="16" />
                        </button>
                    </nav>
                </section>
            </div>
        </main>
        <div class="shop-weave"></div>
        <footer class="shop-footer">
            <div class="shop-container shop-footer-grid">
                <div>
                    <strong>NovaShop</strong>
                    <p>A neighborhood shop's honesty, brought online.</p>
                </div>
                <div><strong>Shop</strong><a href="/shop">Panjabi</a><a href="/shop">Saree</a><a href="/shop">New Collection</a></div>
                <div><strong>Support</strong><a href="/">Track Order</a><a href="/">Returns</a><a href="/">FAQ</a></div>
                <div>
                    <strong>Payment Methods</strong>
                    <p>Cash on Delivery</p>
                    <p>bKash · Nagad · Rocket · Cards</p>
                </div>
            </div>
        </footer>
        <div v-if="filterOpen" class="filter-backdrop" @click="filterOpen = false"></div>
        <aside class="filter-sheet" :class="{ open: filterOpen }">
            <div class="sheet-handle"></div>
            <div class="sheet-heading">
                <h2>Filters</h2>
                <button aria-label="Close filters" @click="filterOpen = false"><X :size="20" /></button>
            </div>
            <div class="sheet-body">
                <label class="mobile-sort"
                    >Sort by
                    <select v-model="sort">
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="top-rated">Top Rated</option>
                    </select></label
                ><FilterControls
                    v-model:categories="selectedCategories"
                    v-model:min-price="minPrice"
                    v-model:max-price="maxPrice"
                    v-model:in-stock="inStockOnly"
                    v-model:min-rating="minRating"
                    :category-list="categories"
                    @update="page = 1"
                />
            </div>
            <div class="sheet-footer">
                <button class="secondary-button" @click="clearFilters">Clear all</button
                ><button class="primary-button" @click="filterOpen = false">Show results</button>
            </div>
        </aside>
    </div>
</template>

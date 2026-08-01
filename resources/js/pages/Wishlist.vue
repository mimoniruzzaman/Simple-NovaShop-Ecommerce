<script setup lang="ts">
import MiniCart from '@/components/MiniCart.vue';
import { useWishlist } from '@/composables/useWishlist';
import { Head, Link } from '@inertiajs/vue3';
import { Heart, Trash2 } from 'lucide-vue-next';
import './Home.css';

const { wishlistItems, wishlistCount, removeFromWishlist } = useWishlist();

function formatPrice(price: number) {
    return `৳ ${price.toLocaleString('en-IN')}`;
}
</script>

<template>
    <Head title="Wishlist" />
    <div class="home-page wishlist-page">
        <header class="site-header">
            <div class="page-shell header-inner">
                <Link href="/" class="brand focus-ring"><span class="brand-mark">৳</span><span class="brand-name">NovaShop</span></Link>
                <div class="header-actions">
                    <MiniCart />
                    <Link href="/" class="button button-outline">Continue Shopping</Link>
                </div>
            </div>
        </header>
        <main class="page-shell content-section">
            <div class="section-heading">
                <div>
                    <h1>Your Wishlist ({{ wishlistCount }})</h1>
                    <p>Your saved products, ready whenever you are.</p>
                </div>
            </div>
            <div v-if="wishlistItems.length" class="product-grid">
                <article v-for="item in wishlistItems" :key="item.name" class="product-card">
                    <div class="product-image-wrap">
                        <img class="product-image" :src="`https://picsum.photos/seed/${item.seed}/500/500`" :alt="item.name" />
                    </div>
                    <div class="product-info">
                        <h3>{{ item.name }}</h3>
                        <strong>{{ formatPrice(item.price) }}</strong
                        ><span class="wishlist-stock" :class="{ out: !item.stock }">{{ item.stock ? 'In Stock' : 'Out of Stock' }}</span
                        ><button class="button button-outline" @click="removeFromWishlist(item.name)"><Trash2 :size="15" /> Remove</button>
                    </div>
                </article>
            </div>
            <div v-else class="wishlist-empty wishlist-page-empty">
                <Heart :size="64" stroke-width="1.5" /><strong>Your wishlist is empty</strong>
                <p>Looks like you haven't added anything yet.</p>
                <Link href="/shop" class="button button-primary">Explore Products</Link>
            </div>
        </main>
    </div>
</template>

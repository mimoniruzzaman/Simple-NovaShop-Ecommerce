<script setup lang="ts">
import MiniCart from '@/components/MiniCart.vue';
import { useBuyNow } from '@/composables/useBuyNow';
import { useCart } from '@/composables/useCart';
import { Head, Link } from '@inertiajs/vue3';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-vue-next';
import { onMounted } from 'vue';
import './Cart.css';

const { cartItems, cartCount, cartSubtotal, removeItem, updateItemQuantity } = useCart();
const deliveryCharge = 60;
const { clearBuyNow } = useBuyNow();

onMounted(() => {
    clearBuyNow();
});

function formatPrice(price: number) {
    return `৳ ${price.toLocaleString('en-IN')}`;
}
function totalWithDelivery() {
    return cartSubtotal.value + (cartItems.value.length ? deliveryCharge : 0);
}
</script>

<template>
    <Head title="Your Cart" />
    <div class="cart-page">
        <header class="cart-header">
            <div class="cart-container cart-header-row">
                <Link href="/" class="cart-brand"><span class="cart-brand-mark">৳</span><span class="cart-brand-name">NovaShop</span></Link>
                <nav class="cart-nav">
                    <Link href="/">Home</Link><Link href="/shop">Shop</Link><a href="/shop#categories">Categories</a><a href="/">About</a>
                </nav>
                <div class="cart-header-actions"><MiniCart button-class="cart-icon" /></div>
            </div>
        </header>
        <main class="cart-container cart-main">
            <nav class="cart-breadcrumb"><Link href="/">Home</Link><span>›</span><span>Your Cart</span></nav>
            <h1>Your Cart</h1>
            <div v-if="cartItems.length" class="cart-content">
                <section class="cart-items">
                    <article v-for="item in cartItems" :key="item.name" class="cart-line-item">
                        <img :src="`https://picsum.photos/seed/${item.seed}/180/180`" :alt="item.name" />
                        <div class="cart-line-info">
                            <Link :href="route('products.show', { slug: item.seed })">{{ item.name }}</Link
                            ><span>{{ formatPrice(item.price) }} each</span>
                            <div class="cart-stepper">
                                <button aria-label="Decrease quantity" @click="updateItemQuantity(item.name, -1)"><Minus :size="15" /></button
                                ><output>{{ item.quantity }}</output
                                ><button aria-label="Increase quantity" @click="updateItemQuantity(item.name, 1)"><Plus :size="15" /></button>
                            </div>
                        </div>
                        <div class="cart-line-total">
                            <strong>{{ formatPrice(item.price * item.quantity) }}</strong
                            ><button aria-label="Remove item" @click="removeItem(item.name)"><Trash2 :size="17" /></button>
                        </div>
                    </article>
                </section>
                <aside class="cart-summary">
                    <h2>Order Summary</h2>
                    <div>
                        <span>Subtotal</span><strong>{{ formatPrice(cartSubtotal) }}</strong>
                    </div>
                    <div>
                        <span>Delivery Charge</span><strong>{{ formatPrice(deliveryCharge) }}</strong>
                    </div>
                    <hr />
                    <div class="summary-total">
                        <span>Total</span><strong>{{ formatPrice(totalWithDelivery()) }}</strong>
                    </div>
                    <Link href="/checkout" class="cart-primary-button">Proceed to Checkout</Link
                    ><Link href="/shop" class="cart-secondary-button">Continue Shopping</Link>
                </aside>
            </div>
            <div v-else class="cart-empty">
                <span><ShoppingCart :size="34" /></span>
                <h2>Your cart is empty</h2>
                <p>Start adding products you love.</p>
                <Link href="/shop" class="cart-primary-button">Continue Shopping</Link>
            </div>
        </main>
        <div class="cart-weave"></div>
        <footer class="cart-footer">
            <div class="cart-container cart-footer-grid">
                <div>
                    <strong>NovaShop</strong>
                    <p>A neighborhood shop's honesty, brought online.</p>
                </div>
                <div>
                    <strong>Shop</strong><Link href="/shop">Panjabi</Link><Link href="/shop">Saree</Link><Link href="/shop">New Collection</Link>
                </div>
                <div><strong>Support</strong><a href="#footer">Track Order</a><a href="#footer">Returns</a><a href="#footer">FAQ</a></div>
                <div>
                    <strong>Payment Methods</strong>
                    <p>Cash on Delivery</p>
                    <p>bKash · Nagad · Rocket · Cards</p>
                </div>
            </div>
        </footer>
    </div>
</template>

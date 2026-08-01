<script setup lang="ts">
import { useBuyNow } from '@/composables/useBuyNow';
import { useCart } from '@/composables/useCart';
import { Link } from '@inertiajs/vue3';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-vue-next';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import './MiniCart.css';

defineProps<{ buttonClass?: string }>();

const { cartItems, cartCount, cartSubtotal, removeItem, updateItemQuantity } = useCart();
const { clearBuyNow } = useBuyNow();
const cartOpen = ref(false);
const cartRoot = ref<HTMLElement | null>(null);

function formatPrice(price: number) {
    return `৳ ${price.toLocaleString('en-IN')}`;
}

function closeCart() {
    cartOpen.value = false;
}

function checkoutCart() {
    clearBuyNow();
    closeCart();
}

function handleDocumentClick(event: MouseEvent) {
    if (cartOpen.value && !cartRoot.value?.contains(event.target as Node)) {
        closeCart();
    }
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') closeCart();
}

onMounted(() => {
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick);
    document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <div ref="cartRoot" class="mini-cart-root">
        <button :class="[buttonClass ?? 'icon-button', 'focus-ring']" aria-label="Cart" :aria-expanded="cartOpen" @click="cartOpen = !cartOpen">
            <ShoppingCart :size="20" />
            <span class="count-badge">{{ cartCount }}</span>
        </button>

        <aside v-if="cartOpen" class="cart-panel" aria-label="Shopping cart">
            <div class="cart-panel-header">
                <h2>Your Cart ({{ cartCount }})</h2>
                <button class="icon-button focus-ring" aria-label="Close cart" @click="closeCart"><X :size="20" /></button>
            </div>
            <div v-if="cartItems.length" class="cart-item-list">
                <div v-for="item in cartItems" :key="item.name" class="cart-item">
                    <img :src="`https://picsum.photos/seed/${item.seed}/120/120`" :alt="item.name" />
                    <div class="cart-item-details">
                        <h3>{{ item.name }}</h3>
                        <strong>{{ formatPrice(item.price) }}</strong>
                        <div class="cart-quantity">
                            <button
                                class="quantity-button focus-ring"
                                :aria-label="`Decrease ${item.name} quantity`"
                                @click="updateItemQuantity(item.name, -1)"
                            >
                                <Minus :size="13" />
                            </button>
                            <span>Qty: {{ item.quantity }}</span>
                            <button
                                class="quantity-button focus-ring"
                                :aria-label="`Increase ${item.name} quantity`"
                                @click="updateItemQuantity(item.name, 1)"
                            >
                                <Plus :size="13" />
                            </button>
                        </div>
                    </div>
                    <div class="cart-item-end">
                        <strong>{{ formatPrice(item.price * item.quantity) }}</strong>
                        <button class="remove-button focus-ring" :aria-label="`Remove ${item.name}`" @click="removeItem(item.name)">
                            <Trash2 :size="16" />
                        </button>
                    </div>
                </div>
            </div>
            <div v-else class="cart-empty">
                <ShoppingCart :size="48" stroke-width="1.5" aria-hidden="true" />
                <strong>Your cart is empty</strong>
                <p>Looks like you haven't added anything yet.</p>
                <a class="button button-primary" href="/shop" @click="closeCart">Shop Now</a>
            </div>
            <div v-if="cartItems.length" class="cart-panel-footer">
                <div class="cart-subtotal">
                    <span>Subtotal</span><strong>{{ formatPrice(cartSubtotal) }}</strong>
                </div>
                <Link class="button button-outline" href="/cart" @click="closeCart">View Cart</Link>
                <Link class="button button-primary" href="/checkout" @click="checkoutCart">Checkout</Link>
            </div>
        </aside>
    </div>
</template>

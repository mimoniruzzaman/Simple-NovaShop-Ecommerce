<script setup lang="ts">
import { useBuyNow } from '@/composables/useBuyNow';
import { useCart } from '@/composables/useCart';
import { Head, Link } from '@inertiajs/vue3';
import { Check, CreditCard, Truck } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import './Checkout.css';

const { cartItems } = useCart();
const { buyNowItem, clearBuyNow } = useBuyNow();
const city = ref('');
const payment = ref('cod');
const submitted = ref(false);
const checkoutItems = computed(() => (buyNowItem.value ? [buyNowItem.value] : cartItems.value));
const checkoutCount = computed(() => checkoutItems.value.reduce((count, item) => count + item.quantity, 0));
const checkoutSubtotal = computed(() => checkoutItems.value.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0));
const deliveryFee = computed(() => (!checkoutItems.value.length ? 0 : city.value === 'Dhaka' ? 60 : city.value ? 120 : 0));
const total = computed(() => checkoutSubtotal.value + deliveryFee.value);

function formatPrice(price: number) {
    return `৳ ${price.toLocaleString('en-IN')}`;
}
function placeOrder() {
    clearBuyNow();
    submitted.value = true;
}
</script>

<template>
    <Head title="Checkout" />
    <div class="checkout-page">
        <header class="checkout-header">
            <div class="checkout-container checkout-header-row">
                <Link href="/" class="checkout-brand"
                    ><span class="checkout-brand-mark">৳</span><span class="checkout-brand-name">NovaShop</span></Link
                >
                <nav class="checkout-nav">
                    <Link href="/">Home</Link><Link href="/shop">Shop</Link><a href="/shop#categories">Categories</a><a href="/">About</a>
                </nav>
                <Link href="/cart" class="checkout-cart-link">Cart ({{ checkoutCount }})</Link>
            </div>
        </header>
        <main class="checkout-container checkout-main">
            <nav class="checkout-steps">
                <Link href="/cart">Cart</Link><span>›</span><strong>Checkout</strong><span>›</span><span>Confirmation</span>
            </nav>
            <h1>Checkout</h1>
            <p class="checkout-lead">Confirm your details below - your order ships as soon as it's placed.</p>
            <div v-if="submitted" class="checkout-success">
                <Check :size="22" /><strong>Order placed successfully.</strong><span>Thank you for shopping with NovaShop.</span
                ><Link href="/shop">Continue Shopping</Link>
            </div>
            <form v-else class="checkout-layout" @submit.prevent="placeOrder">
                <div class="checkout-form-column">
                    <section class="checkout-card">
                        <h2><span>1</span> Contact</h2>
                        <div class="form-grid">
                            <label class="wide">Full name<input required type="text" placeholder="e.g. Farhana Islam" /></label
                            ><label>Phone number<input required type="tel" placeholder="01XXX-XXXXXX" /></label
                            ><label>Email <small>(optional)</small><input type="email" placeholder="you@example.com" /></label>
                        </div>
                    </section>
                    <section class="checkout-card">
                        <h2><span>2</span> Delivery Address</h2>
                        <div class="form-grid">
                            <label class="wide">House / Road / Area<input required type="text" placeholder="House 12, Road 5, Dhanmondi" /></label
                            ><label
                                >City<select v-model="city" required>
                                    <option value="">Select city</option>
                                    <option>Dhaka</option>
                                    <option>Chattogram</option>
                                    <option>Mymensingh</option>
                                    <option>Khulna</option>
                                    <option>Rajshahi</option>
                                    <option>Sylhet</option></select
                                ><small>Dhaka: ৳60 delivery · Outside Dhaka: ৳120 delivery</small></label
                            ><label>Postal code <small>(optional)</small><input type="text" placeholder="1205" /></label
                            ><label class="wide"
                                >Delivery notes <small>(optional)</small
                                ><textarea rows="2" placeholder="Landmark, gate code, preferred delivery time..."></textarea>
                            </label>
                        </div>
                    </section>
                    <section class="checkout-card">
                        <h2><span>3</span> Payment Method</h2>
                        <label class="payment-option" :class="{ selected: payment === 'cod' }"
                            ><input v-model="payment" type="radio" value="cod" /><Truck :size="22" /><span
                                ><strong>Cash on Delivery</strong><small>Pay in cash when your order arrives at your door.</small></span
                            ></label
                        ><label class="payment-option" :class="{ selected: payment === 'online' }"
                            ><input v-model="payment" type="radio" value="online" /><CreditCard :size="22" /><span
                                ><strong>Pay Online - SSLCommerz</strong
                                ><small>Cards, bKash, Nagad, Rocket and more via a secure payment page.</small></span
                            ></label
                        >
                    </section>
                </div>
                <aside class="checkout-summary">
                    <h2>Order Summary</h2>
                    <div class="checkout-order-items">
                        <div v-for="item in checkoutItems" :key="item.name">
                            <img :src="`https://picsum.photos/seed/${item.seed}/80/80`" :alt="item.name" /><span
                                >{{ item.name }} <small>Qty: {{ item.quantity }}</small></span
                            ><strong>{{ formatPrice(item.price * item.quantity) }}</strong>
                        </div>
                        <p v-if="!checkoutItems.length">Your cart is empty.</p>
                    </div>
                    <div class="checkout-total-lines">
                        <div>
                            <span>Subtotal</span><strong>{{ formatPrice(checkoutSubtotal) }}</strong>
                        </div>
                        <div>
                            <span>Delivery fee</span><strong>{{ deliveryFee ? formatPrice(deliveryFee) : 'Select city' }}</strong>
                        </div>
                        <hr />
                        <div class="grand-total">
                            <span>Total</span><strong>{{ formatPrice(total) }}</strong>
                        </div>
                    </div>
                    <button class="place-order-button" type="submit" :disabled="!checkoutItems.length">Place Order</button>
                </aside>
            </form>
        </main>
        <footer class="checkout-footer">
            <div class="checkout-container checkout-footer-grid">
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

import { computed, ref } from 'vue';

export type CartProduct = {
    name: string;
    price: number;
    oldPrice?: number;
    seed: string;
    stock: boolean;
    rating: number;
    reviews: number;
};

export type CartItem = CartProduct & {
    quantity: number;
};

const cartItems = ref<CartItem[]>([]);

export function useCart() {
    const cartCount = computed(() => cartItems.value.reduce((total, item) => total + item.quantity, 0));
    const cartSubtotal = computed(() => cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0));

    function addItem(product: CartProduct, quantity = 1) {
        if (!product.stock || quantity < 1) return;

        const existingItem = cartItems.value.find((item) => item.name === product.name);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.value.push({ ...product, quantity });
        }
    }

    function removeItem(productName: string) {
        cartItems.value = cartItems.value.filter((item) => item.name !== productName);
    }

    function updateItemQuantity(productName: string, change: number) {
        const item = cartItems.value.find((cartItem) => cartItem.name === productName);

        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            removeItem(productName);
        }
    }

    return { cartItems, cartCount, cartSubtotal, addItem, removeItem, updateItemQuantity };
}

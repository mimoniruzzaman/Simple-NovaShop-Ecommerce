import { ref } from 'vue';
import type { CartItem, CartProduct } from './useCart';

const buyNowItem = ref<CartItem | null>(null);

export function useBuyNow() {
    function setBuyNow(product: CartProduct, quantity: number) {
        if (!product.stock || quantity < 1) return;

        buyNowItem.value = { ...product, quantity };
    }

    function clearBuyNow() {
        buyNowItem.value = null;
    }

    return { buyNowItem, setBuyNow, clearBuyNow };
}

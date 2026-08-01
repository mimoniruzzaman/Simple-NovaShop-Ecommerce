import { computed, ref } from 'vue';

export type WishlistProduct = {
    name: string;
    price: number;
    oldPrice?: number;
    seed: string;
    stock: boolean;
    rating: number;
    reviews: number;
};

const wishlistItems = ref<WishlistProduct[]>([]);

export function useWishlist() {
    const wishlistCount = computed(() => wishlistItems.value.length);

    function toggleWishlist(product: WishlistProduct) {
        const existingIndex = wishlistItems.value.findIndex((item) => item.name === product.name);

        if (existingIndex >= 0) {
            wishlistItems.value.splice(existingIndex, 1);
            return false;
        }

        wishlistItems.value.push({ ...product });
        return true;
    }

    function isInWishlist(productName: string) {
        return wishlistItems.value.some((item) => item.name === productName);
    }

    function removeFromWishlist(productName: string) {
        wishlistItems.value = wishlistItems.value.filter((item) => item.name !== productName);
    }

    return { wishlistItems, wishlistCount, toggleWishlist, isInWishlist, removeFromWishlist };
}

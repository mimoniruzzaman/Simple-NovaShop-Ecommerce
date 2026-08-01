<script setup lang="ts">
defineProps<{
    categories: string[];
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
    minRating: number;
    categoryList: string[];
}>();

defineEmits<{
    'update:categories': [value: string[]];
    'update:minPrice': [value: number];
    'update:maxPrice': [value: number];
    'update:inStock': [value: boolean];
    'update:minRating': [value: number];
    update: [];
}>();
</script>

<template>
    <div class="filter-controls">
        <div class="filter-group">
            <h3>Category</h3>
            <label v-for="category in categoryList" :key="category" class="check-row">
                <input
                    type="checkbox"
                    :checked="categories.includes(category)"
                    @change="
                        $emit(
                            'update:categories',
                            categories.includes(category) ? categories.filter((item) => item !== category) : [...categories, category],
                        )
                    "
                />
                <span>{{ category }}</span>
            </label>
        </div>
        <div class="filter-group">
            <h3>Price Range</h3>
            <div class="price-inputs">
                <input
                    type="number"
                    :value="minPrice"
                    min="0"
                    max="6000"
                    step="50"
                    aria-label="Minimum price"
                    @input="$emit('update:minPrice', Number(($event.target as HTMLInputElement).value))"
                />
                <span>-</span>
                <input
                    type="number"
                    :value="maxPrice"
                    min="0"
                    max="6000"
                    step="50"
                    aria-label="Maximum price"
                    @input="$emit('update:maxPrice', Number(($event.target as HTMLInputElement).value))"
                />
            </div>
        </div>
        <div class="filter-group filter-toggle">
            <span>In Stock only</span>
            <input type="checkbox" :checked="inStock" @change="$emit('update:inStock', ($event.target as HTMLInputElement).checked)" />
        </div>
        <div class="filter-group">
            <h3>Rating</h3>
            <label v-for="rating in [0, 4, 3, 2]" :key="rating" class="check-row">
                <input type="radio" name="shop-rating" :checked="minRating === rating" @change="$emit('update:minRating', rating)" />
                <span>{{ rating ? `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)} & up` : 'Any rating' }}</span>
            </label>
        </div>
    </div>
</template>

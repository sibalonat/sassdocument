<script setup>
const size = ref(0);

const increment = () => {
    size.value++;
};

const decrement = () => {
    size.value--;
};

</script>
<template>
    <div class="flex">
        <button type="button" class="bassis-4" @click="decrement">-</button>
        <p>{{ size }}</p>
        <button type="button" class="bassis-4" @click="increment">+</button>
    </div>
</template>

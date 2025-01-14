<script setup>
defineProps({
    title: {
        type: String,
        default: ''
    }
});

</script>

<template>
    <input type="text" class="w-full px-2 py-1 border rounded-md" placeholder="Title" :value="title" />
</template>
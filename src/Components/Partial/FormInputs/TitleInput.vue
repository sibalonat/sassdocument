<script setup>
import { onMounted } from 'vue';
//composables
// props
defineProps({
    title: Object
});
// hooks
onMounted(() => {});
</script>

<template>
    <input 
    v-if="title" 
    type="text" 
    class="w-full px-2 py-1 border rounded-md" 
    placeholder="Title" 
    :value="title.name" />
</template>
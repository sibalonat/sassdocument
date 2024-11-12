<script setup>
import { onMounted, reactive, ref } from 'vue';
const prop = defineProps({
  header: Array
});

onMounted(() => {
  console.log(prop.header);
  
});

</script>
<template>
    <div class="grid mb-2 gap-x-0" 
    :class="header.length ? `grid-cols-${header.length}` : 'grid-cols-16'">
        <div v-for="letter in header" :key="letter" class="text-center border-b">
            {{ letter }}
        </div>
    </div>
</template>


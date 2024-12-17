<script setup>
import DynamicHeroIcon from '@/Components/General/HeroIcon/DynamicHeroIcon.vue';
import { useDraggable } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

// composables
const el = ref(null)
const prop = defineProps({ aX: Number, open: Boolean, trigger: Function });

const showCondition = computed(() => { 
  return prop.open && prop.aX !== 0;
})

const { x, y, style } = useDraggable(el, {
  initialValue: { x: prop.aX, y: 40 },
})

onMounted(() => {
  nextTick(() => {
    x.value = prop.aX;
  })
})

</script>
<template>
  <div class="fixed bottom-0 right-0 w-[300px] h-[70vh] bg-gray-100" ref="el" v-if="showCondition" :style="style">
      <button @click="trigger">Toggle Sidebar</button>
        sidebar
        

    </div>
</template>

<style scoped>

</style>
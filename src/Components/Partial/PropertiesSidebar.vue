<script setup>
import DynamicHeroIcon from '@/Components/General/HeroIcon/DynamicHeroIcon.vue';
import { useDraggable } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

// composables
const el = ref(null)
const dragEl = ref(null)  
const prop = defineProps({ aX: Number, open: Boolean, trigger: Function });

const showCondition = computed(() => { 
  return prop.open && prop.aX !== 0;
})

const { x, y, style } = useDraggable(el, {
  initialValue: { x: prop.aX, y: 100 },
  draggingElement: dragEl,
  preventDefault: true,
})

onMounted(() => {
  nextTick(() => {
    x.value = prop.aX;
  })
})

</script>
<template>
  <div 
  ref="el" 
  class="fixed bottom-0 right-0 p-3 bg-white border rounded-l-lg w-120 h-7vh" 
  v-if="showCondition" 
  :style="style">
  <div class="relative top-0 left-0 w-full h-full">
    <div class="flex flex-row w-full h-14">
      <button ref="dragEl" class="basis-1/2">
        <DynamicHeroIcon name="hand-raised" :size="5" class="mx-auto"  />
      </button>
      <button @click="trigger" class="basis-1/2">
        <DynamicHeroIcon name="arrow-uturn-right" :size="5" class="mx-auto"  />
      </button>

    </div>
      sidebar
      

  </div>

    </div>
</template>

<style scoped>

</style>
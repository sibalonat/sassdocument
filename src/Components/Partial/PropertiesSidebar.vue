<script setup>
import DynamicHeroIcon from '@/Components/General/HeroIcon/DynamicHeroIcon.vue';
import { useDraggable } from '@vueuse/core'
// import { useElementSize } from '@vueuse/core'
import useUiInteractions from '@/Composables/Ui/UiInteractions';
import { useResizableElement } from '@/Composables/Ui/UseResizable';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

// composables
const { handleResize, handleResizeStart } = useUiInteractions();
// state
const el = ref(null)
const dragEl = ref(null)  
const prop = defineProps({ aX: Number, open: Boolean, trigger: Function });

// const { width, height } = useElementSize(el);
const { initialHW, onMouseDown } = useResizableElement(el, {
    minH: 100,
    maxH: 500,
    minW: 100,
    maxW: 500,
    width: false,
    height: true,
    initialHW: { width: 300, height: 667 },
    handler: handleResize,
    startHandler: handleResizeStart, // Use the new start handler
});


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
  if (el.value) {
      el.value.addEventListener('mousedown', onMouseDown);
      console.log('Event listener added for mousedown in PropertiesSidebar');
  }
})


onUnmounted(() => {
  if (el.value) {
    el.value.removeEventListener('mousedown', onMouseDown);
    console.log('Event listener removed for mousedown in PropertiesSidebar');
  }
});

watch(el, (val) => {
  console.log('el', val);
  // const { minH, maxH, minW, maxW, width, height, initialHW, handler } = useResizableElement(el, {
  //   minH: 100,
  //   maxH: 500,
  //   minW: 100,
  //   maxW: 500,
  //   width: false,
  //   height: true,
  //   initialHW: { width: 300, height: 7 },
  //   handler: handleResize,
  // });
})
  

// watch(() => prop.aX, (val) => {
//   const { minH, maxH, minW, maxW, width, height, initialHW } = useResizableElement(el, {
//     minH: 100,
//     maxH: 500,
//     minW: 100,
//     maxW: 500,
//     width: false,
//     height: true,
//     initialHW: { width: 300, height: 7 },
//     handler: handleResize,
//   });
// })

</script>
<template>
  <!-- w-120 h-7vh -->
  <div 
  ref="el" 
  class="fixed bottom-0 right-0 overflow-y-auto bg-white border rounded-l-lg shadow-md resize-y" 
  v-if="showCondition" 
  @mousedown="onMouseDown($event)"
  :style="[style, { width: `${initialHW.width}px`, height: `${initialHW.height}px` }]">
  <div class="relative top-0 left-0 w-full h-full p-3">
    <div class="flex flex-row w-full h-14">
      <button ref="dragEl" class="h-full basis-1/2">
        <DynamicHeroIcon name="hand-raised" :size="5" class="mx-auto"  />
      </button>
      <button @click="trigger" class="basis-1/2">
        <DynamicHeroIcon name="arrow-uturn-right" :size="5" class="mx-auto"  />
      </button>

    </div>
      sidebar
    
      <!-- <DynamicHeroIcon 
      name="arrows-up-down" 
      :size="5" 
      class="absolute bottom-0 right-0 cursor-pointer"
      @mousedown="onMouseDown" /> -->
  </div>

    </div>
</template>

<style scoped>

</style>
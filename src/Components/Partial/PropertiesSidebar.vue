<script setup>
import DynamicHeroIcon from '@/Components/General/HeroIcon/DynamicHeroIcon.vue';
import { useDraggable } from '@vueuse/core'
// import { useElementSize } from '@vueuse/core'
import useUiInteractions from '@/Composables/Ui/UiInteractions';
import { useResizableElement } from '@/Composables/Ui/UseResizable';

import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

// composables
const { handleResizeStart } = useUiInteractions();
const { 
  isFunction, 
  snapToGrid, 
  getSize, 
  computeWidth, 
  computeHeight, 
  restrictToBounds, 
  matchesSelectorToParentElements, 
  getComputedSize, 
  addEvent, 
  removeEvent 
} = useGridUtils();

// state
const element = ref(null)
const el = ref(null)
const dragEl = ref(null)  
const prop = defineProps({ aX: Number, open: Boolean, trigger: Function });

// const { width, height } = useElementSize(el);
const { initialHW, onMouseDown } = useResizableElement(element, {
    minH: 100,
    maxH: 500,
    minW: 100,
    maxW: 500,
    width: false,
    height: true,
    initialHW: { width: 300, height: 667 },
    startHandler: handleResizeStart, // Use the new start handler
});


const showCondition = computed(() => { 
  return prop.open && prop.aX !== 0;
})

const { x, y, style } = useDraggable(element, {
  initialValue: { x: prop.aX, y: 100 },
  draggingElement: dragEl,
  preventDefault: true,
})

onMounted(() => {
  nextTick(() => {
    x.value = prop.aX;
  })
})



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
  

</script>
<template>
  <!-- ref="el" -->
  <!-- w-120 h-7vh -->
  <!-- v-if="showCondition"  -->
  <!-- border rounded-l-lg shadow-md -->
  <!-- :style="style" -->
   <!-- {{ style }} -->
   <!-- <div class="fixed top-0 right-0 w-32 h-full overflow-y-auto resize-y bg-slate-400"></div> -->
   <!-- ref="el"  -->
   <div
    ref="element" 
    class="fixed bg-white border rounded-l-lg shadow-md"
    :style="style">
    <div class="relative p-3 overflow-y-auto resize-y w-120 h-7vh">
      <div class="flex flex-row w-full h-14">
        <button ref="dragEl" class="h-full basis-1/2">
          <DynamicHeroIcon name="hand-raised" :size="5" class="mx-auto"  />
        </button>
        <button @click="trigger" class="basis-1/2">
          <DynamicHeroIcon name="arrow-uturn-right" :size="5" class="mx-auto"  />
        </button>
      </div>
      sidebar

    </div>
    <!-- <div class="relative top-0 left-0 w-full h-full p-3"> -->
    <!-- </div> -->
  </div>
</template>

<style scoped>

</style>
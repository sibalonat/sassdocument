<script setup>
import DynamicHeroIcon from '@/Components/General/HeroIcon/DynamicHeroIcon.vue';
import Resize from '@/Components/VueDragResize/DragResize.vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

// composables

// state
const prop = defineProps({ 
  aX: Number, 
  open: Boolean, 
  trigger: Function 
});

const showCondition = computed(() => { 
  return prop.open && prop.aX !== 0;
})

// const { x, y, style } = useDraggable(element, {
//   initialValue: { x: prop.aX, y: 100 },
//   draggingElement: dragEl,
//   preventDefault: true,
// })

onMounted(() => {})
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
   <!-- <div
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
  </div> -->
  <!-- <div class="relative top-0 left-0 w-full h-full p-3"> -->
  <!-- </div> -->
  <Resize 
        :x="0" 
        :y="0" 
        :w="300" 
        :h="200" 
        :minWidth="50" 
        :minHeight="50" 
        :maxWidth="500" 
        :maxHeight="500" 
        :grid="[10, 10]" 
        :parent="true" 
        :active="true" 
        :className="'bg-white'"
        :handles="['bl']"
        :resizeAxis="'y'" 
        @resizeStop="(left, top, width, height) => console.log('Resize stopped:', left, top, width, height)" 
        @dragStop="(left, top) => console.log('Drag stopped:', left, top)" 
      />
</template>

<style scoped>

</style>
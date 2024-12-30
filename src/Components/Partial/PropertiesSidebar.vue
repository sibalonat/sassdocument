<script setup>
import DynamicHeroIcon from '@/Components/General/HeroIcon/DynamicHeroIcon.vue';
import Resize from '@/Components/VueDragResize/DragResize.vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch, toRefs } from 'vue'

// composables

// state
const prop = defineProps({ 
  open: Boolean, 
  trigger: Function, 
  parent: Object
});

const x = ref(0);
const y = ref(0);

// const handlePositionUpdate = (coord, value) => {
//   console.log('coord', coord, 'value', value);
  
//   if (coord === 'x') {
//     aX.value = value;
//   } else {
//     y.value = value;
//   }
// };
const handlePositionUpdate = (left, top) => {
  // console.log('coord', coord, 'value', value);
  x.value = left;
  y.value = top;
};

onMounted(() => {
  console.log('mounted');
  if (x.value === 0) {
    console.log(prop.parent.clientWidth);
    
    x.value = prop.parent.clientWidth - 320;
    console.log('x', x.value);
    
  } else {
    x.value = x.value;
  }
  // console.log('parent', parent);
  // console.log('parent', parent.value.clientWidth);
  // x.value = parent.value.clientWidth - 320;
  // console.log('x', x.value);
});
</script>
<template>
    <!-- @update:x="(val) => handlePositionUpdate('x', val)"
    @update:y="(val) => handlePositionUpdate('y', val)"  -->
  <Resize 
      :x="x" 
      :y="y"
      :w="300" 
      :h="200" 
      :minWidth="50" 
      :minHeight="50" 
      :maxWidth="500" 
      :maxHeight="500" 
      :grid="[10, 10]" 
      :parent="true" 
      :active="true" 
      :className="'bg-white border rounded-lg shadow-md absolute pointer-events-auto'"
      classNameHandle="handle-class"
      :drag-handle="'.hand-raised'"
      :handles="['bl']"
      :resizeAxis="'y'" 
      @resizeStop="(left, top, width, height) => console.log('Resize stopped:', left, top, width, height)" 
      @dragStop="(left, top) => handlePositionUpdate(left, top)" 
    >
      <!-- @dragStop="(left, top) => console.log('Drag stopped:', left, top)"  -->
    <div class="relative p-3 overflow-y-auto">
    <div class="flex flex-row w-full h-14">
      <button class="h-full basis-1/2 hand-raised">
        <DynamicHeroIcon name="hand-raised" :size="5" class="mx-auto"  />
      </button>
      <button @click="trigger" class="basis-1/2">
        <DynamicHeroIcon name="power" :size="5" class="mx-auto"  />
      </button>
    </div>
    {{ x }}
    {{ y }}

  </div>
    <template #bl>
      <!-- -bottom-3 -left-3 -->
        <DynamicHeroIcon 
        name="chevron-left" 
        :size="4" 
        class="absolute -rotate-45 cursor-pointer -bottom-3 -left-3" />
    </template>

  </Resize>
</template>

<style>
/* .resizeClass {
  @apply bg-white border rounded-lg shadow-md;
} */
 .handle-class {
  @apply bg-transparent;
 }
</style>
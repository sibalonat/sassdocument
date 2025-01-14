<script setup>
import DynamicHeroIcon from '@/Components/General/HeroIcon/DynamicHeroIcon.vue';
import Resize from '@/Components/VueDragResize/DragResize.vue';
import { computed, onMounted, ref, toRef, nextTick } from 'vue'
import TitleInput from '@/Components/Partial/FormInputs/TitleInput.vue';


// props
const prop = defineProps({ 
  open: Boolean, 
  trigger: Function, 
  parent: Object,
  refresh: String
});

// state
const display = toRef(prop, 'open');
const x = ref(0);
const y = ref(80);
// const refresh = ref(0)

// computed
const showCondition = computed(() => { 
  return display.value && x.value !== 0;
});

// const active = computed(() => {
//   // refresh.value++;
//   if (!prop.open) {
//     return
//   }
//   return refresh.value++;
//   // return prop.open;
// });

// methods
const handlePositionUpdate = (left, top) => {  
  x.value = left;
  y.value = top;
};

function displaySidebar() { 
  return showCondition.value;
}

// function setActive() {
//   if (prop.open) {
//     ;
//   }
//   active.value = !active.value;
// }

// lifecycle
onMounted(() => {   
  nextTick(() => {
    if (prop.parent) {      
      x.value = prop.parent.clientWidth - 320; 
    } else {
      x.value = x.value;
    }
  });
});

</script>
<template>
  <!-- :minWidth="50" 
  :minHeight="500"  -->
  <Resize
      :key="refresh"
      v-if="displaySidebar()" 
      :x="x" 
      :y="y"
      :w="300" 
      :h="500" 
      :maxWidth="500" 
      :maxHeight="700" 
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
    <div class="flex flex-col w-full">
      <TitleInput />
    </div>
    {{ x }}
    {{ y }}

  </div>
    <template #bl>
        <DynamicHeroIcon 
        name="chevron-left" 
        :size="4" 
        class="absolute -rotate-45 cursor-pointer -bottom-3 -left-3" />
    </template>

  </Resize>
</template>

<style>
 .handle-class {
  @apply bg-transparent;
 }
</style>
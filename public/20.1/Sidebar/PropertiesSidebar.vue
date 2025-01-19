<script setup>
import DynamicHeroIcon from '@/Components/General/HeroIcon/DynamicHeroIcon.vue';
import Resize from '@/Components/VueDragResize/DragResize.vue';
import { computed, onMounted, ref, toRef, nextTick, onUpdated, watch } from 'vue'
import General from '@/Components/Partial/Sidebar/General.vue';
import BooleanType from '@/Components/Partial/Sidebar/SelectedType/BooleanType.vue';
import TextType from '@/Components/Partial/Sidebar/SelectedType/TextType.vue';
import IntegerType from '@/Components/Partial/Sidebar/SelectedType/IntegerType.vue';
import DateTimeType from '@/Components/Partial/Sidebar/SelectedType/DateTimeType.vue';


// props
const prop = defineProps({ 
  open: Boolean, 
  trigger: Function, 
  parent: Object,
  refresh: String,
  list: Array
});

// BooleanType = 'boolean';
// state
const display = toRef(prop, 'open');
const x = ref(0);
const y = ref(80);
const dataType = ref('');
const dynamHeight = ref(0);
const header = ref(null)
const component_types = {
  boolean: BooleanType,
  text: TextType,
  integer: IntegerType,
  datetime: DateTimeType	
};
// computed
const showCondition = computed(() => { 
  return display.value && x.value !== 0;
});

const selectedDataType = computed({
  get: () => {
    return dataType.value;
  },
  set: (value) => {
    dataType.value = value;
  }
})

const allHeight = computed({
  get: () => {
    return dynamHeight.value;
  },
  set: (value) => {
    dynamHeight.value = value;
  }
})

// methods
const handlePositionUpdate = (left, top) => {  
  x.value = left;
  y.value = top;
};

function displaySidebar() { 
  return showCondition.value;
}

function handleDataTypeChange(value) {  
  selectedDataType.value = value;
}

function getHeightOfSidebar(left, top, width, height) {  
  return dynamHeight.value = height;
}

// lifecycle
onMounted(() => { 
  nextTick(() => {
    dynamHeight.value = 500;
    
    if (prop.parent) {      
      x.value = prop.parent.clientWidth - 320; 
    } else {
      x.value = x.value;
    }
  });
});

onUpdated(() => {
  // console.log();
  console.log(header.value);
  if (header.value) {
    console.log(header.value.clientHeight);
    
  }
  

});

// watch(x, (value) => {
//   console.log(value);
  

// });


</script>
<template>
  <!-- :minWidth="50" 
  :minHeight="500"  -->
  <!-- @resizeStop="(left, top, width, height) => console.log('Resize stopped:', left, top, width, height)"  -->
  <!-- @dragStop="(left, top) => console.log('Drag stopped:', left, top)"  -->
  <Resize
      :key="refresh"
      v-if="displaySidebar()" 
      :x="x" 
      :y="y"
      :w="300" 
      :h="dynamHeight" 
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
      @resizeStop="getHeightOfSidebar"
      @dragStop="(left, top) => handlePositionUpdate(left, top)" 
    >
    <div class="relative p-3 overflow-y-auto" >
      <div class="flex flex-row w-full h-12" ref="header">
        <button class="h-full basis-1/2 hand-raised">
          <DynamicHeroIcon name="hand-raised" :size="5" class="mx-auto"  />
        </button>
        <button @click="trigger" class="basis-1/2">
          <DynamicHeroIcon name="power" :size="5" class="mx-auto"  />
        </button>
      </div>
      <General 
      v-if="!selectedDataType" 
      @type="handleDataTypeChange($event)" />
      <component 
      :height="dynamHeight"
      :header="header"
      :is="component_types[selectedDataType]" 
      v-else />
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
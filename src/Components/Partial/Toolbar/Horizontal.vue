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
const x = ref(0);
const y = ref(0);
const width = ref(0);
const dataType = ref('');
const dynamHeight = ref(70);
const header = ref(null)
const component_types = {
  boolean: BooleanType,
  text: TextType,
  integer: IntegerType,
  datetime: DateTimeType	
};
// computed
const selectedDataType = computed({
  get: () => {
    return dataType.value;
  },
  set: (value) => {
    dataType.value = value;
  }
})

const loadComponent = computed(() => {
  return width.value && dynamHeight.value;
})

// methods
const handlePositionUpdate = (left, top) => {  
  x.value = left;
  y.value = top;
};

// lifecycle
onMounted(() => { 
  nextTick(() => {
    dynamHeight.value = 70;
    
    if (prop.parent) {      
    //   x.value = prop.parent.clientWidth - 320; 
      x.value = 0; 
      width.value = prop.parent.clientWidth;
    } else {
      x.value = x.value;
    }
  });
});

onUpdated(() => {
  console.log(header.value);
  if (header.value) {
    console.log(header.value.clientHeight);
  }
});

</script>
<template>
  <Resize
      v-if="loadComponent"
      :key="refresh"
      :x="x" 
      :y="y"
      :w="width" 
      :h="dynamHeight" 
      :resizable="false"
      :grid="[10, 10]" 
      :parent="true" 
      :active="true" 
      :className="'bg-white border rounded-lg shadow-md pointer-events-auto'"
      classNameHandle="handle-class"
      :drag-handle="'.hand-raised'"
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
      hey
      <!-- <General 
      v-if="!selectedDataType" 
      @type="handleDataTypeChange($event)" /> -->
      <!-- <component 
      :height="dynamHeight"
      :header="header"
      :is="component_types[selectedDataType]" 
      v-else /> -->
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
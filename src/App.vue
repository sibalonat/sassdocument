<script setup>
import { onMounted, ref, watch } from 'vue';
import DocumentWrapper from '@/Components/DocumentWrapper.vue';
import PropertiesSidebar from '@/Components/Partial/PropertiesSidebar.vue';
// DragResize
import useUiInteractions from '@/Composables/Ui/UiInteractions';
import { useDynamicSheets } from '@/Spreadsheet/DynamicSheets';
import Resize from '@/Components/VueDragResize/DragResize.vue';

const { trigger, opened } = useUiInteractions();

const parent = ref(null);
const xAxis = ref(0);
const dragElement = ref(null)

const store = useDynamicSheets();
const { createRowOnClick } = store;
onMounted(() => xAxis.value = parent.value.clientWidth - 320);
watch(opened, (val) => console.log(val));
</script>

<template>
  <main class="relative w-screen h-screen overflow-x-hidden" ref="parent">
    <div class="grid grid-cols-9 gap-x3">
      <div class="col-span-6">
        <p class="w-full px-1 py-4 text-xs">
          This is the application aims to streamline creation of spreadsheet for simple scenarios. It will provide an easy way to add groups, with certain styles and different input fields based on the type of data it needs inserting.
        </p>
      </div>
      <div class="grid grid-cols-5 col-span-3 my-auto gap-x-2">
        <button type="button" class="col-span-4 px-4 text-sm border rounded-md" @click="createRowOnClick()">
          Add Group
        </button>
        <button type="button" class="px-4 text-sm border rounded-md" @click="trigger()">
          Menu
        </button>
      </div>
    </div>
    <DocumentWrapper />
    <!-- {{ xAxis }} -->
    
    <div class="absolute top-0 left-0 w-full h-full">
      <PropertiesSidebar :aX="xAxis" :open="opened" :trigger="trigger" />
      <!-- <Resize 
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
        :className="'bg-white border rounded-lg shadow-md'"
        :handles="['bl']"
        :resizeAxis="'y'" 
        @resizeStop="(left, top, width, height) => console.log('Resize stopped:', left, top, width, height)" 
        @dragStop="(left, top) => console.log('Drag stopped:', left, top)" 
      /> -->
    </div>
  </main>
</template>



<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import DocumentWrapper from '@/Components/DocumentWrapper.vue';
import PropertiesSidebar from '@/Components/Partial/PropertiesSidebar.vue';
// DragResize
import useUiInteractions from '@/Composables/Ui/UiInteractions';
import { useDynamicSheets } from '@/Spreadsheet/DynamicSheets';

const { trigger, opened } = useUiInteractions();

const parent = ref(null);
const xAxis = ref(0);

//computed
const showCondition = computed(() => { 
  return opened.value && xAxis.value !== 0;
})

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
        <button type="button" class="px-4 text-sm border rounded-md cursor-pointer" @click="trigger()">
          Menu
        </button>
      </div>
    </div>
    <DocumentWrapper />
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none" v-if="showCondition">
      <PropertiesSidebar :trigger="trigger" :parent="parent" />
    </div>
  </main>
</template>



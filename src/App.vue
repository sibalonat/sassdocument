<script setup>
import { onMounted, ref } from 'vue';
import DocumentWrapper from './components/DocumentWrapper.vue';
import PropertiesSidebar from './components/Partial/PropertiesSidebar.vue';

import { useDynamicSheets } from './Spreadsheet/DynamicSheets';

const parent = ref(null);
const xAxis = ref(0);

const store = useDynamicSheets();
const { createRowOnClick } = store;
onMounted(() => xAxis.value = parent.value.clientWidth - 300);
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
        <button type="button" class="px-4 text-sm border rounded-md " @click="createRowOnClick()">
          Menu
        </button>
      </div>
    </div>
    <DocumentWrapper />
    <!-- {{ xAxis }} -->
    <PropertiesSidebar xAxis />
  </main>
</template>



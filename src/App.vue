<script setup>
import DocumentWrapper from './components/DocumentWrapper.vue';
import { useDynamicSheets } from './Spreadsheet/DynamicSheets';

const store = useDynamicSheets();
const { createRow } = store;
</script>

<template>
  <main class="w-screen h-screen overflow-x-hidden">
    <div class="grid grid-cols-9 gap-x3">
      <div class="col-span-6">
        <p class="w-full px-1 py-4 text-xs">
          This is the application aims to streamline creation of spreadsheet for simple scenarios. It will provide an easy way to add groups, with certain styles and different input fields based on the type of data it needs inserting.
        </p>
      </div>
      <div class="col-span-3 my-auto">
        <button type="button" class="px-4 text-sm border rounded-md" @click="createRow">
          Add Group
        </button>
      </div>
    </div>
    <DocumentWrapper />
  </main>
</template>



<script setup>
import { onMounted, ref, watch } from 'vue';
import DocumentWrapper from '@/Components/DocumentWrapper.vue';
import PropertiesSidebar from '@/Components/Partial/PropertiesSidebar.vue';
import useUiInteractions from '@/Composables/Ui/UiInteractions';
import { useDynamicSheets } from '@/Spreadsheet/DynamicSheets';

const { trigger, opened } = useUiInteractions();

const parent = ref(null);
const xAxis = ref(0);

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
    <PropertiesSidebar :aX="xAxis" :open="opened" :trigger="trigger" />
    <!-- <div class="fixed top-0 w-32 overflow-y-auto resize-y bg-slate-400 h-44 "></div> -->
  </main>
</template>



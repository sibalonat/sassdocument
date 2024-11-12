<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useDynamicSheets } from '../Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';
import Draggable from './VueDraggable/Draggable';
import AlphabetHeader from './Header/AlphabetHeader.vue';

const store = useDynamicSheets();
const { createRow, getTailwindGridClasses } = store;
const { data, base, alphabet } = storeToRefs(store);
const order = ref(15);
const enabled = ref(true);
// const list = reactive([
//   { name: "\u00A0", id: 0, col: 1, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
//   { name: "\u00A0", id: 2, col: 5, row: 1, colSpan: 1 }
// ]);
const list = ref([...base.value])

// methods
function checkMove(e) {
  console.log(e);
  window.console.log("Future index: " + e.draggedContext.futureIndex);
}


onMounted(() => {
  console.log(alphabet.value);
  console.log(base.value);
  
  
});
</script>

<template>
  <div class="w-full h-full">
    <AlphabetHeader :header="alphabet" />
    <draggable
      :list="base"
      :disabled="!enabled"
      item-key="id"
      class="grid w-full gap-0 grid-cols-16"
      ghost-class="ghost"
      :move="checkMove"
      @start="dragging = true"
      @end="dragging = false"
    >
      <template #item="{ element }">
        <div
          :class="['list-group-item', getTailwindGridClasses(element), { 'not-draggable': !enabled }]"
        >
          <div class="border">
            {{ element.name }}
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

<style>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
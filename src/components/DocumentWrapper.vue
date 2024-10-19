<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useDynamicSheets } from '../Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';
import Group from './Partial/Group.vue';
import Item from './Partial/Items/ItemElement.vue';
import NestedDraggable from './Partial/Items/NestedDraggable.vue';
import Draggable from './VueDraggable/Draggable';

const store = useDynamicSheets();
const { data, base } = storeToRefs(store);
const order = ref(15);
const enabled = ref(true);
const list = reactive([
  { name: "John", id: 0, col: 1, row: 1 },
  { name: "Joao", id: 1, col: 2, row: 1 },
  { name: "Jean", id: 2, col: 3, row: 1 }
]);

// methods
function checkMove(e) {
  console.log(e);
  
  window.console.log("Future index: " + e.draggedContext.futureIndex);
}

function addItemAtPosition(event) {
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const colWidth = rect.width / 16;
  const rowHeight = 50; // Assuming each row has a fixed height of 50px
  const col = Math.floor(x / colWidth) + 1; // +1 to start from 1 instead of 0
  const row = Math.floor(y / rowHeight) + 1; // +1 to start from 1 instead of 0

  // Ensure the column index iterates until 16 and then restarts from the beginning on the next row
  const adjustedCol = col % 16 === 0 ? 16 : col % 16;
  const adjustedRow = col % 16 === 0 ? row + Math.floor(col / 16) - 1 : row + Math.floor(col / 16);

  const newItem = {
    name: `New Item ${list.length + 1}`,
    id: list.length,
    col: adjustedCol,
    row: adjustedRow
  };

  // Add the new item to the list
  list.push(newItem);
}

onMounted(() => {});
</script>

<template>
  <div class="w-full h-full" @click="addItemAtPosition">
    <draggable
      :list="list"
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
          class="col-span-2 list-group-item"
          :class="{ 'not-draggable': !enabled }"
          :style="{ gridColumnStart: element.col, gridRowStart: element.row }"
        >
          <div class="col-span-2 border">
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
.list-group-item {
  grid-column: span 2;
}
</style>
<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useDynamicSheets } from '../Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';
import Draggable from './VueDraggable/Draggable';

const store = useDynamicSheets();
const { data, base } = storeToRefs(store);
const order = ref(15);
const enabled = ref(true);
const list = reactive([
  { name: "John", id: 0, col: 1, row: 1, colSpan: 2 },
  { name: "Joao", id: 1, col: 3, row: 1, colSpan: 2 },
  { name: "Jean", id: 2, col: 5, row: 1, colSpan: 2 }
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
  let adjustedCol = col;
  let adjustedRow = row;

  // Adjust the column and row based on existing items
  list.forEach(item => {
    if (item.row === row && item.col <= col && col < item.col + item.colSpan) {
      adjustedCol = item.col + item.colSpan;
    }
  });

  // Calculate the total occupied columns in the current row
  const occupiedCols = list
    .filter(item => item.row === adjustedRow)
    .reduce((acc, item) => acc + item.colSpan, 0);

  // Adjust the column to account for the occupied columns
  adjustedCol += occupiedCols;

  // If the adjusted column exceeds 16, move to the next row
  while (adjustedCol > 16) {
    adjustedCol -= 16;
    adjustedRow += 1;
  }

  // Add empty items to fill the grid until the new item position
  for (let r = 1; r <= adjustedRow; r++) {
    let currentCol = 1;
    while (currentCol <= 16) {
      if (!list.some(item => item.row === r && item.col === currentCol)) {
        list.push({ name: ' ', id: `empty-${r}-${currentCol}`, col: currentCol, row: r, colSpan: 1 });
      }
      currentCol++;
    }
  }

  // Adjust the column to the correct position based on the click
  adjustedCol = col;
  adjustedRow = row;

  // Ensure the column index iterates until 16 and then restarts from the beginning on the next row
  while (adjustedCol > 16) {
    adjustedCol -= 16;
    adjustedRow += 1;
  }

  const newItem = {
    name: `New Item ${list.length + 1}`,
    id: list.length,
    col: adjustedCol,
    row: adjustedRow,
    colSpan: 2 // Default colSpan
  };

  // Add the new item to the list
  list.push(newItem);
}

function getTailwindGridClasses(element) {
  return `col-start-${element.col} row-start-${element.row} col-span-${element.colSpan}`;
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
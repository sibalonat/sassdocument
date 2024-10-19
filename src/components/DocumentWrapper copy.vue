<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useDynamicSheets } from '../Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';
import Group from './Partial/Group.vue';
import Item from './Partial/Items/ItemElement.vue';
import NestedDraggable from './Partial/Items/NestedDraggable.vue';
import Draggable from './VueDraggable/Draggable';

const store = useDynamicSheets();
// const { sheets, addSheet, removeSheet } = store;
const { data, base } = storeToRefs(store);
const order = ref(15)
const enabled = ref(true)
const list = reactive([
{ name: "John", id: 0 },
{ name: "Joao", id: 1 },
{ name: "Jean", id: 2 }
])

// const list = reactive([
//   {
//     name: "task 1",
//     tasks: [
//       {
//         name: "task 2",
//         tasks: []
//       }
//     ]
//   },
//   {
//     name: "task 3",
//     tasks: [
//       {
//         name: "task 4",
//         tasks: []
//       }
//     ]
//   },
//   {
//     name: "task 5",
//     tasks: []
//   }
// ])
// methods
function checkMove(e) {
  window.console.log("Future index: " + e.draggedContext.futureIndex);
}

// function addItemAtPosition(event) {
//   const container = event.currentTarget;
//   const rect = container.getBoundingClientRect();
//   const x = event.clientX - rect.left;
//   const y = event.clientY - rect.top;

//   const colWidth = rect.width / 16;
//   const col = Math.floor(x / colWidth);
//   const row = Math.floor(y / colWidth);

//   const newItem = {
//     name: `New Item ${list.length + 1}`,
//     id: list.length
//   };

//   // Add the new item to the list
//   list.push(newItem);

//   // Update the grid layout
//   const newItemElement = document.createElement('div');
//   newItemElement.className = 'list-group-item col-span-2';
//   newItemElement.style.gridColumnStart = col + 1;
//   newItemElement.style.gridRowStart = row + 2; // +2 to place it on the next row
//   newItemElement.innerHTML = `<div class="border">${newItem.name}</div>`;
//   container.appendChild(newItemElement);
// }

function addItemAtPosition(event) {
  const container = event.currentTarget;
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const colWidth = rect.width / 16;
  const col = Math.floor(x / colWidth);
  const row = Math.floor(y / colWidth) + 1; // +1 to place it on the next row

  const colLetter = String.fromCharCode(65 + col); // Convert column index to letter (A, B, C, ...)

  const newItem = {
    name: `New Item ${list.length + 1}`,
    id: list.length,
    col: colLetter,
    row: row
  };

  // Add the new item to the list
  list.push(newItem);
}

onMounted(() => {});
</script>

<template>
  <!-- grid grid-cols-16 list-group auto-cols-auto -->
  <div class="w-full h-full" @click="addItemAtPosition">
          <draggable
          :list="list"
          :disabled="!enabled"
          item-key="name"
          class="grid grid-cols-16 list-group auto-cols-auto"
          ghost-class="ghost"
          :move="checkMove"
          @start="dragging = true"
          @end="dragging = false"
        >
          <template #item="{ element }">
            <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
              <div class="border ">
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
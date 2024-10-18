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

onMounted(() => {});
</script>

<template>
  <div class="w-full">
          <draggable
          :list="list"
          :disabled="!enabled"
          item-key="name"
          class="grid grid-cols-16 list-group"
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
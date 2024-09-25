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
  <div class="grid w-9/12 grid-cols-12">
    <!-- <nested-draggable :tasks="list" /> -->
    <!-- <Item class="transition color swappable-item">
      <template #default="{ item }">
        {{ item.name }}
      </template>
    </Item> -->
          <!-- <Draggable :list="list" :itemKey="item => item.name" tag="div" :disabled="!enabled" class="grid grid-cols-12 col-span-12 gap-4">
            <template #default="{ item }">
              <div class="col-span-12 box">
                {{ item }}
              </div>
            </template>
          </Draggable> -->

          <draggable
          :list="list"
          :disabled="!enabled"
          item-key="name"
          class="list-group"
          ghost-class="ghost"
          :move="checkMove"
          @start="dragging = true"
          @end="dragging = false"
        >
          <template #item="{ element }">
            <div class="list-group-item" :class="{ 'not-draggable': !enabled }">
              <div>
                {{ element.name }}
              </div>
            </div>
          </template>
        </draggable>


  </div>
  <!-- <div class="grid w-9/12 grid-cols-12">
    <nested-draggable :tasks="list" />

  </div> -->
  <!-- <div class="grid w-9/12 h-full grid-cols-12 gap-4 swappable-wrapper">
    <div class="grid col-span-9 grid-rows-6 gap-4">
      <div class="row-span-4 box">

        <Item class="transition-colors swappable-item">
          <template #default>
            5
          </template>
</Item>
</div>
<div class="grid grid-cols-12 row-span-2 gap-4">
  <div class="col-span-5 box ">
    <Item class="transition-colors swappable-item">
      <template #default>
              1
            </template>
    </Item>
  </div>
  <div class="col-span-7 box">
    <Item class="transition-colors swappable-item">
      <template #default>
              2
            </template>
    </Item>
  </div>
</div>
</div>
<div class="grid col-span-3 grid-rows-6 gap-4">
  <div class="row-span-2 box ">
    <Item class="transition-colors swappable-item">
      <template #default>
            3
          </template>
    </Item>
  </div>
  <div class="row-span-4 box">
    <Item class="transition-colors swappable-item">
      <template #default>
            4
          </template>
    </Item>
  </div>
</div>
</div> -->
</template>
<style>
.resizing {
  border: 2px dashed red;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
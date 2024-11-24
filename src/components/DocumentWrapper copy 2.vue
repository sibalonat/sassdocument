<script setup>
import { nextTick, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useDynamicSheets } from '../Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';
import Draggable from './VueDraggable/Draggable';
import AlphabetHeader from './Header/AlphabetHeader.vue';
import { watch } from 'vue';
import DynamicHeroIcon from './General/HeroIcon/DynamicHeroIcon.vue';
import { useDynamicResizeCell } from '../Spreadsheet/DynamicSizeForCell';

const store = useDynamicSheets();
const { createRow, getTailwindGridClasses, initialIfListEmpty, updateColSpan, cleanUpRows } = store;
const { data, list, alphabet } = storeToRefs(store);
const cell = useDynamicResizeCell(list);
const { 
  div,
  handleMouseDown
} = cell;
const enabled = ref(true);

// computed
// methods
function checkMove(e) {
  // console.log(e);
  // window.console.log("Future index: " + e.draggedContext);
  // futureIndex
}

function getRowId(row) {
  if (row.children.lenth !== 0) {
    row.children[0].getAttribute('data-row');
  } 
  return;
}

function handleDragStart(evt) {
  const element = evt.item;
  element.setAttribute('data-from-row', element.getAttribute('data-row'));
}

function handleDragEnd(evt) {
  const element = evt.item;
  const fromRow = element.getAttribute('data-from-row');
  console.log(evt.to);
  const toRow = evt.to.closest('[data-row]').getAttribute('data-row');


  console.log(`Moved from row ${fromRow} to row ${toRow}`);
  element.removeAttribute('data-from-row');

  // Update data-row for all elements in the target container
  Array.from(evt.to.children).forEach((child) => {
    child.setAttribute('data-row', toRow);
  });

  // Update data-row for the dragged element
  element.setAttribute('data-row', toRow);
}

// Watcher to observe changes to the list array
// watch(list, (newList, oldList) => {
//   console.log('list changed');
//   if(newList !== oldList) {
//     // cleanUpRows()
//     console.log('newList === newList');
//   }
// }, { deep: true });

onBeforeMount(() => {
  initialIfListEmpty()
});

onMounted(() => {
  console.log(alphabet.value);
  console.log(list.value);
  // initialIfListEmpty()
  // nextTick(() => {
  //   cleanUpRows();
  // }); 
});
</script>

<template>
  <div class="w-full h-full">
    <AlphabetHeader :header="alphabet" />
    <div v-for="(row, rowIndex) in list" :key="rowIndex">
      <draggable
        :list="row"
        :data-parent-row="rowIndex+1"
        :disabled="!enabled"
        item-key="id"
        group="rows"
        class="grid w-full gap-0 grid-cols-16 columns list-group"
        ghost-class="ghost"
        handle=".handle"
        :dragging="false"
        @move="checkMove"
        @start="handleDragStart"
        @end="handleDragEnd"
      >
        <template #item="{ element }">
          <div
            :id="element.id"
            :data-row="rowIndex+1"
            :class="['list-group-item', getTailwindGridClasses(element), { 'not-draggable': !enabled }]"
            :ref="(el) => { div[element.id] = el }">
            <div class="relative border">
              <DynamicHeroIcon name="equals" :size="3" class="absolute cursor-pointer top-1/3 handle" />
              {{ element.name }}
              <DynamicHeroIcon
                name="chevron-right"
                :size="3"
                @mousedown="(event) => handleMouseDown(event, div[element.id], row)"
                class="absolute bottom-0 right-0 rotate-45 cursor-ew-resize" />
              {{ rowIndex+1 }}
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
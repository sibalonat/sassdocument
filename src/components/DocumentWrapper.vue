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
const {  
  getTailwindGridClasses, 
  initialIfListEmpty,  
  cleanUpOnDragEnd,
  cleanUpOnDragStart,
  getRowIndexPlusOne,
} = store;
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
}


function handleDragStart(evt) {
  const element = evt.item;
  console.log('handleDragStart', element);
  
  element.setAttribute('data-from-row', element.getAttribute('data-row'));
}

function handleDragEnd(evt) {
  const element = evt.item;
  const elementId = element.getAttribute('id');
  const fromRow = element.getAttribute('data-from-row');
  const toRow = evt.to.getAttribute('data-parent-row');
  // const rowStart = list.value.find(row => row.some(item => item.row == fromRow));
  // const rowEnd = list.value.find(row => row.some(item => item.row == toRow));
 
  element.removeAttribute('data-from-row');

  // Update data-row for all elements in the target container
  Array.from(evt.to.children).forEach((child) => {
    child.setAttribute('data-row', toRow);
  });
  
  const item = list.value.flatMap(row => row).find(el => el.id == elementId);
  
  if (item) {
    item.row = Number(toRow);
  }

  const rowStart = list.value.find(row => row.some(item => item.row == fromRow));
  const rowEnd = list.value.find(row => row.some(item => item.row == toRow));

  console.log(rowStart);
  console.log(rowEnd);
  console.log(fromRow);
  console.log(toRow);

  if (fromRow === toRow) {
    return;
  } else {
    console.log('fromRow', fromRow);
    console.log('rowStart', rowStart);
    // setTimeout(() => {
    //   cleanUpOnDragStart(fromRow, rowStart);
    //   // cleanUpOnDragEnd(toRow, rowEnd);
    // }, 200);
    // setTimeout(() => {
    // }, 200);
    cleanUpOnDragEnd(fromRow, toRow, rowStart, rowEnd);
    // cleanUpOnDragEnd(toRow, rowEnd);
  }

  // Update data-row for the dragged element
  element.setAttribute('data-row', toRow);
}

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
        :data-parent-row="getRowIndexPlusOne(rowIndex)"
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
            :data-row="getRowIndexPlusOne(rowIndex)"
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
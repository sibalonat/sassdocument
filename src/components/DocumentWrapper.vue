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
  console.log(e);
}

function checkOther(e) {
  console.log(e);
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
  const targetElement = evt.to;

  element.removeAttribute('data-from-row');

  Array.from(evt.to.children).forEach((child) => {
    child.setAttribute('data-row', toRow);
  });

  const item = list.value.flatMap(row => row).find(el => el.id == elementId);

  if (item) {
    item.row = Number(toRow);
  }

  const rowStart = list.value.find(row => row.some(item => item.row == fromRow));
  const rowEnd = list.value.find(row => row.some(item => item.row == toRow));

  if (fromRow !== toRow) {
    cleanUpOnDragEnd(fromRow, toRow, rowStart, rowEnd);
  }

  element.setAttribute('data-row', toRow);

  console.log('Moved element:', element);
  console.log('Target element:', targetElement);
  console.log('From row:', fromRow);
  console.log('To row:', toRow);
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
        @add="checkOther"
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
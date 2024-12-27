<script setup>
import { nextTick, onBeforeMount, onMounted, reactive, ref } from 'vue';
import { useDynamicSheets } from '@/Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';
import Draggable from '@/Components/VueDraggable/Draggable';
import AlphabetHeader from '@/Components/Header/AlphabetHeader.vue';
import { watch } from 'vue';
import DynamicHeroIcon from '@/Components/General/HeroIcon/DynamicHeroIcon.vue';
import { useDynamicResizeCell } from '@/Spreadsheet/DynamicSizeForCell';
import { get } from 'lodash';

const store = useDynamicSheets();
const {  
  getTailwindGridClasses, 
  initialIfListEmpty,  
  cleanUpOnDragEnd,
} = store;
const { data, list, alphabet } = storeToRefs(store);
const cell = useDynamicResizeCell(list);
const { 
  div,
  handleMouseDown,
  getRowFromDraggableElement,
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
}

function handleDragEnd(evt) {
  const element = evt.item;
  const elementId = element.getAttribute('id');
  const toRow = getRowFromDraggableElement(evt.to);
  const fromRow = getRowFromDraggableElement(evt.from);

  const item = list.value.flatMap(row => row).find(el => el.id == elementId);

  if (item) {
    item.row = Number(toRow);
  }

  const rowStart = list.value.find(row => row.some(item => item.row == fromRow));
  const rowEnd = list.value.find(row => row.some(item => item.row == toRow));

  if (fromRow !== toRow) {
    cleanUpOnDragEnd(fromRow, toRow, rowStart, rowEnd);
  }
}

onBeforeMount(() => {
  initialIfListEmpty()
});

onMounted(() => {});
</script>

<template>
  <div class="w-full h-full">
    <AlphabetHeader :header="alphabet" />
    <div v-for="(row, rowIndex) in list" :key="rowIndex">
      <draggable
        :list="row"
        :disabled="!enabled"
        item-key="id"
        group="rows"
        class="grid w-full gap-0 grid-cols-16 columns list-group"
        ghost-class="ghost"
        handle=".handler"
        :dragging="false"
        @move="checkMove"
        @start="handleDragStart"
        @end="handleDragEnd"
      >
        <template #item="{ element }">
          <div
            :id="element.id"
            :class="['list-group-item', getTailwindGridClasses(element), { 'not-draggable': !enabled }]"
            :ref="(el) => { div[element.id] = el }">
            <div class="relative border">
              <DynamicHeroIcon name="equals" :size="3" class="absolute cursor-pointer top-1/3 handler" />
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
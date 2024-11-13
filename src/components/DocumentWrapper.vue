<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useDynamicSheets } from '../Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';
import Draggable from './VueDraggable/Draggable';
import AlphabetHeader from './Header/AlphabetHeader.vue';
import { watch } from 'vue';
import DynamicHeroIcon from './General/HeroIcon/DynamicHeroIcon.vue';
import { useDynamicResizeCell } from '../Spreadsheet/DynamicSizeForCell';


const store = useDynamicSheets();
const { createRow, getTailwindGridClasses, initialIfListEmpty, updateColSpan } = store;
const { data, base, alphabet } = storeToRefs(store);
const cell = useDynamicResizeCell(base);
const { 
  handleDragStart,
  handleDrag,
  handleDragEnd
} = cell;
const order = ref(15);
const enabled = ref(true);

const list = base.value

// methods
function checkMove(e) {
  console.log(e);
  window.console.log("Future index: " + e.draggedContext.futureIndex);
}


function cleanUpRows() {
  const rows = {};

  // Group columns by row
  list.forEach(item => {
    if (!rows[item.row]) {
      rows[item.row] = [];
    }
    rows[item.row].push(item);
  });

  // Process each row
  Object.keys(rows).forEach(rowKey => {
    const row = rows[rowKey];
    const totalColSpan = row.reduce((acc, item) => acc + item.colSpan, 0);

    if (totalColSpan === 16) {
      // Filter out columns that don't have a name property or have a name property equal to "\u00A0"
      rows[rowKey] = row.filter(item => item.name && item.name !== "\u00A0");
    }
  });

  // Flatten the rows back into the list
  list.value = Object.values(rows).flat();
}

// function handleResize(event, id) {
//   const container = event.currentTarget;
//   const rect = container.getBoundingClientRect();
//   const colWidth = rect.width / 16;
//   const newColSpan = Math.floor(event.clientX / colWidth) + 1;

//   updateColSpan(id, newColSpan);
// }

// Watcher to observe changes to the list array
watch(list, (newList, oldList) => {
  cleanUpRows();
}, { deep: true });



onMounted(() => {
  console.log(alphabet.value);
  console.log(base.value);
  initialIfListEmpty()
  
  
});
</script>

<template>
  <div class="w-full h-full">
    <AlphabetHeader :header="alphabet" />
    <draggable
      :list="list"
      :disabled="!enabled"
      item-key="id"
      class="grid w-full gap-0 grid-cols-16 columns"
      ghost-class="ghost"
      handle=".handle"
      :move="checkMove"
      :dragging="false"
      @start="dragging = true"
      @end="dragging = false"
    >
      <template #item="{ element }">
        <div
          :class="['list-group-item', getTailwindGridClasses(element), { 'not-draggable': !enabled }]"
        >
        <div class="relative border">
          <DynamicHeroIcon name="equals" :size="3" class="absolute cursor-pointer top-1/3 handle"  />
          {{ element.name }}
          <DynamicHeroIcon
          @dragstart="handleDragStart(event, element.id)"
          @drag="handleDrag(event)"
          @dragend="handleDragEnd" 
          draggable
          name="chevron-right" 
          :size="3" 
          class="absolute bottom-0 right-0 rotate-45 cursor-pointer"  />
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
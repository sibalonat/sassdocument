<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
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
  console.log(e);
  window.console.log("Future index: " + e.draggedContext.futureIndex);
}

// Watcher to observe changes to the list array
watch(list, (newList, oldList) => {
  console.log('list changed');
  if(newList !== oldList) {
    // cleanUpRows()
    console.log('newList === newList');
  }
}, { deep: true });

onMounted(() => {
  console.log(alphabet.value);
  console.log(list.value);
  initialIfListEmpty()
  // nextTick(() => {
  //   cleanUpRows();
  // }); 
});
</script>

<template>
  <div class="w-full h-full">
    <AlphabetHeader :header="alphabet" />
      <!-- // :move="checkMove" -->
    <draggable
      :list="list"
      :disabled="!enabled"
      item-key="id"
      class="grid w-full gap-0 grid-cols-16 columns"
      ghost-class="ghost"
      handle=".handle"
      :dragging="false"
      @move="checkMove"
      @start="dragging = true"
      @end="dragging = false"
    >
    <!-- v-resize-observer="onResizeObserver" -->
    <template #item="{ element }">
      <div
          :id="element.id"
          :class="['list-group-item', getTailwindGridClasses(element), { 'not-draggable': !enabled }]"
          :ref="(el) => { div[element.id] = el }">
          <div class="relative border">
            <DynamicHeroIcon name="equals" :size="3" class="absolute cursor-pointer top-1/3 handle"  />
            {{ element.name }}
            <DynamicHeroIcon
              name="chevron-right" 
              :size="3" 
              @mousedown="(event) => handleMouseDown(event, div[element.id], list)"
              class="absolute bottom-0 right-0 rotate-45 cursor-ew-resize"  />
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
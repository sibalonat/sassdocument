<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useDynamicSheets } from '../Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';
import Draggable from './VueDraggable/Draggable';
import AlphabetHeader from './Header/AlphabetHeader.vue';
import { watch } from 'vue';
import DynamicHeroIcon from './General/HeroIcon/DynamicHeroIcon.vue';


const store = useDynamicSheets();
const { createRow, getTailwindGridClasses, initialIfListEmpty } = store;
const { data, base, alphabet } = storeToRefs(store);
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
      class="grid w-full gap-0 grid-cols-16"
      ghost-class="ghost"
      handler=".handle"
      :move="checkMove"
      @start="dragging = true"
      @end="dragging = false"
    >
      <template #item="{ element }">
        <div
          :class="['list-group-item', getTailwindGridClasses(element), { 'not-draggable': !enabled }]"
        >
            <DynamicHeroIcon name="equals" :size="3" />
            <!-- classes="w-3 h-3 handle my-auto" -->
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
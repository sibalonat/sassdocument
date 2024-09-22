<script setup>
import { onMounted, ref } from 'vue';
import { useDynamicSheets } from '../Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';
import Group from './Partial/Group.vue';
import Item from './Partial/Items/ItemElement.vue';
import { Swappable, Plugins } from '@shopify/draggable';

const store = useDynamicSheets();
// const { sheets, addSheet, removeSheet } = store;
const { data, base } = storeToRefs(store);

onMounted(() => {
  const swappable = new Swappable(document.querySelectorAll('.swappable-wrapper'), {
    draggable: '.swappable-item',
    mirror: {
      appendTo: '.swappable-wrapper',
      constrainDimensions: true,
    },
  });
  swappable.on('swappable:swapped', () => {
    console.log('swapped');
  });
});


</script>

<template>
    <!-- <div class="grid w-9/12 grid-cols-12">
        <div v-for="i in 12" :key="i">
            {{ i }}
            not
        </div>
    </div> -->
    <div class="grid w-9/12 h-full grid-cols-12 gap-4 swappable-wrapper">
    <div class="grid col-span-9 grid-rows-6 gap-4">
      <div class="row-span-4 box">
        
        <Item class="transition-colors swappable-item">
            <template #default>
                5
            </template>
        </Item>
        <!-- <WidgetGallery class="transition-colors swappable-item" /> -->
      </div>
      <div class="grid grid-cols-12 row-span-2 gap-4">
        <div class="col-span-5 box ">
            <Item class="transition-colors swappable-item">
                <template #default>
                    1
                </template>
            </Item>
          <!-- <WidgetCamera class="transition-colors swappable-item" /> -->
        </div>
        <div class="col-span-7 box">
            <Item class="transition-colors swappable-item">
                <template #default>
                    2
                </template>
            </Item>
          <!-- <WidgetVideo class="transition-colors swappable-item" /> -->
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
        <!-- <WidgetGame class="transition-colors swappable-item" /> -->
      </div>
      <div class="row-span-4 box">
        <Item class="transition-colors swappable-item">
            <template #default>
                4
            </template>
        </Item>
        <!-- <WidgetMusic class="transition-colors swappable-item" /> -->
      </div>
    </div>
  </div>
</template>


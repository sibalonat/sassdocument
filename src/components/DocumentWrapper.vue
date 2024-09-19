<script setup>
import { ref } from 'vue';
import { useDynamicSheets } from '../Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';

const store = useDynamicSheets();
// const { sheets, addSheet, removeSheet } = store;
const { data, base } = storeToRefs(store);

</script>

<template>
    <div class="grid grid-cols-12">
        <div v-for="i in 12" :key="i">
            {{ i }}
        </div>
        <!-- <div class="col-span-12">
            <slot></slot>
        </div> -->

    </div>
</template>


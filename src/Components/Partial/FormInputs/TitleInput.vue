<script setup>
import { useDynamicResizeCell } from '@/Spreadsheet/DynamicSizeForCell';
//composables
const { activeElement } = useDynamicResizeCell(list);
</script>

<template>
    <input type="text" class="w-full px-2 py-1 border rounded-md" placeholder="Title" :value="activeElement.name" />
</template>
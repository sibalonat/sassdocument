<script setup>
import Percent from '@/Components/Icons/Spreadsheet/Integers/Percent.vue';
import Dollar from '@/Components/Icons/Spreadsheet/Integers/Dollar.vue';
import More from '@/Components/Icons/Spreadsheet/Integers/MoreFormats.vue';
import Increase from '@/Components/Icons/Spreadsheet/Integers/Decimal/Increase.vue';
import Decrease from '@/Components/Icons/Spreadsheet/Integers/Decimal/Decrease.vue';
</script>
<template>
    <div class="grid grid-cols-12 gap-x-1">
       <div class="grid grid-cols-5 col-span-2 gap-x-2">
        <Dollar class="h-4" />
        <Percent class="h-4" />
        <Decrease />
        <Increase />
        <More class="mb-auto" />
            
       </div> 
    </div>
</template>
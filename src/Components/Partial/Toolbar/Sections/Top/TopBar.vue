<script setup>
import Percent from '@/Components/Icons/Spreadsheet/Integers/Percent.vue';
import Dollar from '@/Components/Icons/Spreadsheet/Integers/Dollar.vue';
import More from '@/Components/Icons/Spreadsheet/Integers/MoreFormats.vue';
import Increase from '@/Components/Icons/Spreadsheet/Integers/Decimal/Increase.vue';
import Decrease from '@/Components/Icons/Spreadsheet/Integers/Decimal/Decrease.vue';
import TextIncrease from '@/Components/Icons/Spreadsheet/General/Increase.vue';
import TextDecrease from '@/Components/Icons/Spreadsheet/General/Decrease.vue';
</script>
<template>
    <div class="grid grid-cols-12 divide-x gap-x-1" >
       <div class="grid grid-cols-5 pr-3 gap-x-2.5">
        <Dollar />
        <Percent />
        <Decrease />
        <Increase />
        <More class="mb-auto" />
       </div> 
       <div class="grid grid-cols-3 px-2 gap-x-2">
        <TextDecrease class="m-auto" />
        <input type="text" class="w-full h-8 text-center border rounded-md" />
        <TextIncrease class="m-auto" />
       </div>
    </div>
</template>
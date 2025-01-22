<script setup>
import Percent from '@/Components/Icons/Spreadsheet/Integers/Percent.vue';
import Dollar from '@/Components/Icons/Spreadsheet/Integers/Dollar.vue';
import More from '@/Components/Icons/Spreadsheet/Integers/MoreFormats.vue';
import Increase from '@/Components/Icons/Spreadsheet/Integers/Decimal/Increase.vue';
import Decrease from '@/Components/Icons/Spreadsheet/Integers/Decimal/Decrease.vue';
import TextIncrease from '@/Components/Icons/Spreadsheet/General/Increase.vue';
import TextDecrease from '@/Components/Icons/Spreadsheet/General/Decrease.vue';
import Fill from '@/Components/Icons/Spreadsheet/General/FillColor.vue';
import Bold from '@/Components/Icons/Spreadsheet/General/FontStyle/Bold.vue';
import Italic from '@/Components/Icons/Spreadsheet/General/FontStyle/Italic.vue';
import Color from '@/Components/Icons/Spreadsheet/General/FontStyle/Color.vue';
import StrikeThrough from '@/Components/Icons/Spreadsheet/General/FontStyle/StrikeThrough.vue';

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
       <div class="grid grid-cols-3 px-3 gap-x-2">
        <TextDecrease class="m-auto" />
        <input type="text" class="w-full h-8 text-center border rounded-md" />
        <TextIncrease class="m-auto" />
       </div>
       <div class="grid grid-cols-5 px-3 gap-x-2">
        <Bold />
        <Italic />
        <StrikeThrough />
        <Color />
        <Fill />
       </div>
    </div>
</template>
<script setup>
import DynamicHeroIcon from '../General/HeroIcon/DynamicHeroIcon.vue';

import { useDraggable } from '@vueuse/core'
import { ref } from 'vue'

const el = ref(null)
// const xAxis = ref(0);

const prop = defineProps({ xAxis: Number });

// console.log(props.parent);
// xAxis.value = props.parent.clientWidth - 300;



const { x, y, style } = useDraggable(el, {
  initialValue: { x: prop.xAxis, y: 40 },
})

</script>
<template>
    <div class="fixed bottom-0 right-0 w-[300px] h-full bg-gray-100" ref="el" :style="style">
        sidebar
        

    </div>
</template>

<style scoped>

</style>
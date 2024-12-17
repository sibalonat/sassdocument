<script setup>
import DynamicHeroIcon from '../General/HeroIcon/DynamicHeroIcon.vue';
import useUiInteractions from '@/Composables/Ui/UiInteractions';

import { useDraggable } from '@vueuse/core'
import { nextTick, onMounted, ref } from 'vue'

// composables

const { trigger, opened } = useUiInteractions();

const el = ref(null)
// const xAxis = ref(0);

const prop = defineProps({ aX: Number });

// console.log(props.parent);
// xAxis.value = props.parent.clientWidth - 300;



const { x, y, style } = useDraggable(el, {
  initialValue: { x: prop.aX, y: 40 },
})

onMounted(() => {
  nextTick(() => {
    x.value = prop.aX;
  })
  // x.value = prop.aX;
})

</script>
<template>
    <div class="fixed bottom-0 right-0 w-[300px] h-[70vh] bg-gray-100" ref="el" v-if="aX" :style="style">
        sidebar
        

    </div>
</template>

<style scoped>

</style>
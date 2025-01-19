<script setup>
import Options from '@/Components/Partial/Sidebar/SelectedType/TypeOptions/TxtOpts.vue'
import Text from '@/Components/Icons/Text.vue';	
import { ref, onMounted, onBeforeUnmount } from 'vue';

//props
const props = defineProps({
    height: String,
});
//data
const image = ref(null);
const optionsHeight = ref('0px');
//methods
const calculateHeight = () => {
    const parentHeight = window.innerHeight;
    const booleanElement = image.value;
    if (booleanElement) {
        const { height } = booleanElement.$el.getBoundingClientRect();
        optionsHeight.value = `${parentHeight - height}px`;
    }
}
// hooks
onMounted(() => {
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', calculateHeight);
});
</script>
<template>
    <div class="relative w-full" :class="`h-${optionsHeight}`" >
        <Text class="opacity-10 boolean-element" ref="image" />
        <Options />
        <!-- <img src="" alt=""> -->

    </div>
</template>

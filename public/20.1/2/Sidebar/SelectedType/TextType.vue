<script setup>
import Options from '@/Components/Partial/Sidebar/SelectedType/TypeOptions/TxtOpts.vue'
import Text from '@/Components/Icons/Text.vue';	
import { ref, onMounted, onBeforeUnmount } from 'vue';

//props
const props = defineProps({
    height: Number,
    header: Object
});
//data
const image = ref(null);
const parent = ref(null);
const optionsHeight = ref('0px');
//methods
const calculateHeight = () => {
    const parentHeight = props.height;
    const header = props.header.offsetHeight;
    
    const booleanElement = image.value;
    if (booleanElement) {
        // const { height } = booleanElement.$el.getBoundingClientRect();
        
        optionsHeight.value = `${parentHeight - header - 40}px`;
        // optionsHeight.value = `${parentHeight - height}px`;
        // optionsHeight.value = `${parentHeight}px`;
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
    <div class="relative w-full" :style="{ height: optionsHeight }" ref="parent" >
        <Text class="object-contain opacity-10" ref="image" />
        <Options class="absolute bottom-0 w-full" />
    </div>
</template>

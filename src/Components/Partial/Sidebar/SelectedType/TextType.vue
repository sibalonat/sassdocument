<script setup>
import Options from '@/Components/Partial/Sidebar/SelectedType/TypeOptions/TxtOpts.vue'
import Text from '@/Components/Icons/Text.vue';	
import { ref, onMounted, onBeforeUnmount } from 'vue';

//props
const props = defineProps({
    height: Number,
});
//data
const image = ref(null);
const parent = ref(null);
const optionsHeight = ref('0px');
//methods
const calculateHeight = () => {
    const parentHeight = props.height;
    console.log(parentHeight);
    
    const booleanElement = image.value;
    if (booleanElement) {
        const { height } = booleanElement.$el.getBoundingClientRect();
        optionsHeight.value = `${parentHeight - height}px`;
        // optionsHeight.value = `${parentHeight}px`;
    }
}
// hooks
onMounted(() => {
    console.log(props.height);
    

    
    
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', calculateHeight);
});
</script>
<template>
    <div class="relative w-full" :style="{ height: optionsHeight }" ref="parent" >
        <Text class="h-full opacity-10" ref="image" />
        <Options class="absolute" />
        <!-- <img src="" alt=""> -->

    </div>
</template>

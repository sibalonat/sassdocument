<script setup>
import { ref, watch, onMounted } from 'vue';
import { useDynamicSheets } from '@/Spreadsheet/DynamicSheets';
import { storeToRefs } from 'pinia';
// props
// const props = defineProps({
//   title: Object
// });
// piniastore    
const store = useDynamicSheets();
const { actel } = storeToRefs(store);
//state
const inputValue = ref(actel.value?.name || '');
const isFocused = ref(false);

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  if (!inputValue.value || inputValue.value.trim() === '') {
    isFocused.value = false;
  }
};

// watch(() => props.title?.name, (newVal) => {   
//   inputValue.value = newVal;
// });

// watch(() => inputValue.value, (newVal) => {
//   emit('update:title', newVal);
// });

watch(inputValue, (newVal) => {
    console.log(newVal);
    actel.value.name = newVal;
    

//   emit('update:title', newVal);
});

onMounted(() => {
  if (inputValue.value && inputValue.value.trim() !== '') {
      isFocused.value = true;
  } else {
    isFocused.value = false;
  }
});
</script>

<template>
  <div class="relative w-full">
    <label :class="['floating-label', { 'floating-label-active': isFocused }]">
      Title
    </label>
    <input 
      type="text" 
      class="w-full px-2 py-1 border rounded-md" 
      placeholder="Title" 
      v-model="inputValue"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<style scoped>
.floating-label {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  transition: all 0.2s ease;
  pointer-events: none;
  font-size: 16px;
  color: #aaa;
}

.floating-label-active {
  top: -10px;
  left: 10px;
  font-size: 12px;
  color: #333;
}
</style>
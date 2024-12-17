<template>
    <component :class="sizeClasses" :is="icon" />
</template>

<script setup>
import * as solid from '@heroicons/vue/24/solid';
import * as outline from '@heroicons/vue/24/outline';
import { computed, onMounted } from 'vue';

const prop = defineProps({
      name: {
        type: String,
        required: true,
      },
      outline: {
        type: Boolean,
        required: false,
        default: false,
      },
      size: {
        type: Number,
        required: false,
        default: 6,
      },
      color: {
        type: String,
        required: false,
      },
      classes: {
        type: String,
        required: false,
      },
});
// computed
const icons = computed(() => {
  return { solid, outline };
});

const icon = computed(() => {
  return icons.value[prop.outline ? 'outline' : 'solid'][buildIconComponentName(prop.name)];
});

const sizeClasses = computed(() => {
  const size = prop.size && prop.size >= 3 ? prop.size : 6;
  return [`h-${size} w-${size}`];
});

// const colorClasses = computed(() => {
//     let colorClass = {}
//     if (this.color) {
//         colorClass['text-' + this.color] = true;
//         return colorClass;
//     }
//     return
// });

// methods
function buildIconComponentName(iconName) {
  return iconName.replace(/(^\w|-\w)/g, clearAndUpper) + 'Icon';

  function clearAndUpper(text) {
    return text.replace(/-/, "").toUpperCase();
  }
}
</script>



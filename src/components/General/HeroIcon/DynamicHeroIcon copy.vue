<template>
    <component :class="sizeClasses" :is="icon" />
</template>

<script setup>
import * as solid from '@heroicons/vue/24/solid';
import * as outline from '@heroicons/vue/24/outline';
import { computed, onMounted } from 'vue';

// export default {
//   props: {
//     name: {
//       type: String,
//       required: true,
//     },
//     outline: {
//       type: Boolean,
//       required: false,
//       default: false,
//     },
//     size: {
//       type: Number,
//       required: false,
//       default: 6,
//     },
//     color: {
//       type: String,
//       required: false,
//     }
//   },
//   computed: {
//     icons() {
//       return { solid, outline };
//     },
//     icon() {
//       return this.icons[this.outline ? 'outline' : 'solid'][this.buildIconComponentName(this.name)];
//     },
//     // colorClasses() {
//     //     let colorClass = {}
//     //     if (this.color) {
//     //         colorClass['text-' + this.color] = true;
//     //         return colorClass;
//     //     }
//     //     return
//     // },
//     sizeClasses() {
//       let finalClasses = {};
//       // default and/or min button size is 6
//       const size = this.size && this.size >= 3 ? this.size : 6;
//       finalClasses['h-' + size.toString()] = true;
//       finalClasses['w-' + size.toString()] = true;
//       return finalClasses;
//     },
//   },
//   methods: {
//     buildIconComponentName(iconName) {
//       return iconName.replace(/(^\w|-\w)/g, clearAndUpper) + 'Icon';

//       function clearAndUpper(text) {
//         return text.replace(/-/, "").toUpperCase();
//       }
//     },
//   },
// };

// const icons = { solid, outline };
const props = defineProps({
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
      }
});
// computed
const icons = computed(() => {
  return { solid, outline };
});

const icon = computed(() => {
  return icons.value[props.outline ? 'outline' : 'solid'][buildIconComponentName(props.name)];
});

const sizeClasses = computed(() => {
    let finalClasses = {};
    // default and/or min button size is 6
    const size = props.size && props.size >= 3 ? props.size : 6;
    finalClasses['h-' + size.toString()] = true;
    finalClasses['w-' + size.toString()] = true;
    return finalClasses
});

const colorClasses = computed(() => {
    let colorClass = {}
    if (this.color) {
        colorClass['text-' + this.color] = true;
        return colorClass;
    }
    return
});

// methods
function buildIconComponentName(iconName) {
  return iconName.replace(/(^\w|-\w)/g, clearAndUpper) + 'Icon';

  function clearAndUpper(text) {
    return text.replace(/-/, "").toUpperCase();
  }
}

onMounted(() => {
  console.log('mounted');
});
</script>

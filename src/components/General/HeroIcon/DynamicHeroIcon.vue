<template>
    <component :class="sizeClasses" :is="icon" />
</template>

<script>
import * as solid from '@heroicons/vue/24/solid';
import * as outline from '@heroicons/vue/24/outline';

export default {
  props: {
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
  },
  computed: {
    icons() {
      return { solid, outline };
    },
    icon() {
      return this.icons[this.outline ? 'outline' : 'solid'][this.buildIconComponentName(this.name)];
    },
    // colorClasses() {
    //     let colorClass = {}
    //     if (this.color) {
    //         colorClass['text-' + this.color] = true;
    //         return colorClass;
    //     }
    //     return
    // },
    sizeClasses() {
      let finalClasses = {};
      // default and/or min button size is 6
      const size = this.size && this.size >= 3 ? this.size : 6;
      finalClasses['h-' + size.toString()] = true;
      finalClasses['w-' + size.toString()] = true;
      return finalClasses;
    },
  },
  methods: {
    buildIconComponentName(iconName) {
      return iconName.replace(/(^\w|-\w)/g, clearAndUpper) + 'Icon';

      function clearAndUpper(text) {
        return text.replace(/-/, "").toUpperCase();
      }
    },
  },
};
</script>

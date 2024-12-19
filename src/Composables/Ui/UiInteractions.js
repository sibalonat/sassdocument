import { min } from 'lodash';
import { onMounted, onUnmounted, reactive, ref, toRefs } from 'vue';

export default function useUiInteractions() {
    const opened = ref(false);

    function trigger() {
        opened.value = !opened.value;        
    }

    function handleResize(event, el, resizable) {
      if (resizable.width) {
        el.style.width = `${event.clientX - el.getBoundingClientRect().left}px`;
      }
      if (resizable.height) {
        el.style.height = `${event.clientY - el.getBoundingClientRect().top}px`;
      }
    }

    function handleResizeStart(event, el) {
      console.log('Resize started', event, el);
    }

  return {
    opened,
    trigger,
    handleResize,
    handleResizeStart, // Export the new handler
  };
}

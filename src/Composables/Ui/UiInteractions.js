import { min } from 'lodash';
import { onMounted, onUnmounted, reactive, ref, toRefs } from 'vue';

export default function useUiInteractions() {
    const opened = ref(false);

    function trigger() {
        opened.value = !opened.value;        
    }

    // function handleResize(event, el, resizable) {
    //   if (resizable.width) {
    //     el.style.width = `${event.clientX - el.getBoundingClientRect().left}px`;
    //   }
    //   if (resizable.height) {
    //     el.style.height = `${event.clientY - el.getBoundingClientRect().top}px`;
    //   }
    // }

    // function useResizableElement(el, {
    //   minH, maxH, minW, maxW, width = true, height = true, initialHW
    // }) {
    //   minH = minH || 0;
    //   maxH = maxH || Infinity;
    //   minW = minW || 0;
    //   maxW = maxW || Infinity;
    //   width = width || true;
    //   height = height || true;
    //   initialHW = initialHW || { width: 0, height: 0 };
    //   handler = handleResize;
  
    //   return { minH, maxH, minW, maxW, width, height, initialHW, el };
    // }

    function handleResize(event, el, resizable) {
      if (resizable.width) {
        el.style.width = `${event.clientX - el.getBoundingClientRect().left}px`;
      }
      if (resizable.height) {
        el.style.height = `${event.clientY - el.getBoundingClientRect().top}px`;
      }
    }
  
    function useResizableElement(el, {
      minH = 0, 
      maxH = Infinity, 
      minW = 0, 
      maxW = Infinity, 
      width = true, 
      height = true, 
      initialHW = { width: 0, height: 0 }, 
      handler = handleResize
    }) {
      const resizing = ref(false);
  
      function onMouseMove(event) {
        if (resizing.value) {
          handler(event, el.value, { width, height, minH, maxH, minW, maxW });
        }
      }
  
      function onMouseUp() {
        resizing.value = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
  
      function onMouseDown() {
        resizing.value = true;
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }
  
      onMounted(() => {
        el.value.addEventListener('mousedown', onMouseDown);
      });
  
      onUnmounted(() => {
        el.value.removeEventListener('mousedown', onMouseDown);
      });
  
      return { minH, maxH, minW, maxW, width, height, initialHW, el };
    }



  return {
    opened,
    trigger,
    useResizableElement,
  };
}

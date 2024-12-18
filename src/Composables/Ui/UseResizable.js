import { ref, onMounted, onUnmounted } from 'vue';

export function useResizableElement(el, {
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

//   onMounted(() => {
//     if (el.value) {
//       el.value.addEventListener('mousedown', onMouseDown);
//     }
//   });

//   onUnmounted(() => {
//     if (el.value) {
//       el.value.removeEventListener('mousedown', onMouseDown);
//     }
//   });

  return { minH, maxH, minW, maxW, width, height, initialHW, el, onMouseDown };
}
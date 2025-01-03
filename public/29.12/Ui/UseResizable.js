import { ref, onMounted, onUnmounted } from 'vue';

export function useResizableElement(element, {
  minH = 0, 
  maxH = Infinity, 
  minW = 0, 
  maxW = Infinity, 
  width = true, 
  height = true, 
  initialHW = { width: 0, height: 0 }, 
  startHandler = () => {} // New start handler
}) {
  const resizing = ref(false);

  function handleResize(event) {
    if (resizing.value) {
      if (width) {
        element.value.style.width = `${event.clientX - element.value.getBoundingClientRect().left}px`;
      }
      if (height) {
        element.value.style.height = `${event.clientY - element.value.getBoundingClientRect().top}px`;
      }
    }
  }

  function onMouseMove(event) {
    console.log('onMouseMove');
    handleResize(event);
  }

  function onMouseUp() {
    console.log('onMouseUp');
    resizing.value = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  function onMouseDown(event) {
    console.log('onMouseDown');
    resizing.value = true;
    startHandler(event, element.value); // Call start handler
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  onMounted(() => {
    if (element.value) {
      element.value.addEventListener('mousedown', onMouseDown);
      console.log('Event listener added for mousedown');
    }
  });

  onUnmounted(() => {
    if (element.value) {
      element.value.removeEventListener('mousedown', onMouseDown);
      console.log('Event listener removed for mousedown');
    }
  });

  return { minH, maxH, minW, maxW, width, height, initialHW, onMouseDown };
}
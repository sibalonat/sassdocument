import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const useDynamicResizeCell = defineStore('cell-resize', () => {
    // state
    let resizingElementId = ref(null);
    let initialMouseX = ref(null);
    let initialColSpan = ref(null);

    function handleMouseDown(event, id) {
        resizingElementId = id;
        initialMouseX = event.clientX;
        const element = list.find(item => item.id === id);
        initialColSpan = element.colSpan;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }
    
    function handleMouseMove(event) {
        if (resizingElementId !== null) {
            const container = document.querySelector('.grid');
            const rect = container.getBoundingClientRect();
            const colWidth = rect.width / 16;
            const deltaX = event.clientX - initialMouseX;
            const newColSpan = initialColSpan + Math.floor(deltaX / colWidth);
            store.updateColSpan(resizingElementId, newColSpan);
        }
    }
    
    function handleMouseUp() {
        resizingElementId = null;
        initialMouseX = null;
        initialColSpan = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
    return {
        handleMouseDown,
    };
})
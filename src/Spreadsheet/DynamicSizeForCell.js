import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export function useDynamicResizeCell(list, gridColumns = 16) {
    // state
    let resizingElementId = ref(null);
    let initialMouseX = ref(null);
    let initialColSpan = ref(null);
    
    function handleResize(event, id) {
        console.log('handleDragStart', event);
        const container = document.querySelector(`#${id}`);
        const rect = container.getBoundingClientRect();
        const colWidth = rect.width / gridColumns;
    
        const deltaX = event.clientX - initialMouseX.value;
        const additionalColSpan = Math.floor(Math.abs(deltaX) / colWidth);
    
        // Optional validation:
        const newColSpan = Math.max(1, Math.min(initialColSpan.value + additionalColSpan, gridColumns));
    
        updateColSpan(resizingElementId.value, newColSpan);
    }


    function updateColSpan(id, newColSpan) {
        const item = list.value.find(item => item.id === id);
        if (item) {
            item.colSpan = newColSpan;
        }
    }

    return {
        handleResize,
    };
}
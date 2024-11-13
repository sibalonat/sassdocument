import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export function useDynamicResizeCell(list) {
    // state
    let resizingElementId = ref(null);
    let initialMouseX = ref(null);
    let initialColSpan = ref(null);

    function handleDragStart(event, id) {
        resizingElementId.value = id;
        initialMouseX.value = event.clientX;
        const element = list.value.find(item => item.id === id);
        initialColSpan.value = element.colSpan;
    }
    
    function handleDrag(event) {
        if (resizingElementId.value !== null) {
            const container = document.querySelector('.grid');
            const rect = container.getBoundingClientRect();
            const colWidth = rect.width / 16;
            console.log('colWidth', colWidth);
            
            const deltaX = event.clientX - initialMouseX.value;
            const newColSpan = initialColSpan.value + Math.floor(deltaX / colWidth);
            updateColSpan(resizingElementId.value, newColSpan);
        }
    }
    
    function handleDragEnd() {
        resizingElementId.value = null;
        initialMouseX.value = null;
        initialColSpan.value = null;
    }

    function updateColSpan(id, newColSpan) {
        const item = list.value.find(item => item.id === id);
        if (item) {
            item.colSpan = newColSpan;
        }
    }

    return {
        handleDragStart,
        handleDrag,
        handleDragEnd
    };
}
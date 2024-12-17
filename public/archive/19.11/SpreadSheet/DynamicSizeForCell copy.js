import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export function useDynamicResizeCell(list, gridColumns = 16) {
    // state
    let resizingElementId = ref(null);
    let initialMouseX = ref(null);
    let initialColSpan = ref(null);

    function handleDragStart(event, id) {
        // console.log('handleDragStart', id);
        
        resizingElementId.value = id;
        initialMouseX.value = event.clientX;
        const element = list.value.find(item => item.id === id);
        initialColSpan.value = element.colSpan;
    }
    
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
        // if (resizingElementId.value !== null) {
        //     // const container = document.querySelector(`#${id}`);
        //     // // console.log('container', container);
            
        //     // const rect = container.getBoundingClientRect();
        //     // const colWidth = rect.width / 16;
        //     // console.log('colWidth', colWidth);
            
        //     // const deltaX = event.clientX - initialMouseX.value;
        //     // console.log('deltaX', deltaX);
        //     // const additionalColSpan = Math.floor(deltaX / colWidth); // Determine how many times the width has been passed
        //     // const newColSpan = initialColSpan.value + additionalColSpan;
        //     // console.log('newColSpan', newColSpan);
        //     // updateColSpan(resizingElementId.value, newColSpan);


        // }
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
        // handleDrag,
        handleResize,
        handleDragEnd
    };
}
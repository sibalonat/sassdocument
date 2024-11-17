import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useDynamicSheets } from './DynamicSheets';


export function useDynamicResizeCell(list, gridColumns = 16) {
    const store = useDynamicSheets();
    const { updateColSpan } = store;
    // state
    let resizingElementId = ref(null);
    let initialWidth = ref(null);
    let initialColSpan = ref(null);

    function calculateInitialStart(id) {
        console.log('handleDragStart', id);
        resizingElementId.value = id;
        const container = document.querySelector(`#${id}`);
        
        console.log(container.getBoundingClientRect().width);
        initialWidth.value = container.getBoundingClientRect().width;
        const element = list.value.find(item => item.id === id);
        initialColSpan.value = element.colSpan;
    }
    
    function handleResize(contentRect, id) {
        
        console.log('handleResize', contentRect.width, id);
        
        // calculateInitialStart(id);
        
        // const colWidth = contentRect.width / initialColSpan.value;

        // // log

        // // Optional validation:
        // const newColSpan = Math.max(1, Math.min(initialColSpan.value + colWidth, gridColumns));
        // console.log('newColSpan', newColSpan);
        
    
        // updateColSpan(resizingElementId.value, newColSpan);
    }


    // function updateColSpan(id, newColSpan) {
    //     const item = list.value.find(item => item.id === id);
    //     console.log('item', item);
        
    //     if (item) {
    //         item.colSpan = newColSpan;
    //     }
    // }

    return {
        handleResize,
    };
}
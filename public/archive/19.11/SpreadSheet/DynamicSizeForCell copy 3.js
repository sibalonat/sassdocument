import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useDynamicSheets } from '../../../../src/Spreadsheet/DynamicSheets';
import { useResizeObserver } from '@vueuse/core'

export function useDynamicResizeCell(list, gridColumns = 16) {
    const store = useDynamicSheets();
    const { updateColSpan } = store;
    const div = ref([]);
    // state
    let resizingElement = ref(null);
    let proxyElement = ref(null);
    let baseWidth = ref(null);
    // let initialWidth = ref(null);
    // let initialColSpan = ref(null);

    // function calculateInitialStart(id) {
    //     console.log('handleDragStart', id);
    //     resizingElement.value = div.value[id];
    //     const container = document.querySelector(`#${id}`);
        
    //     console.log(container.getBoundingClientRect().width);
    //     initialWidth.value = container.getBoundingClientRect().width;
    //     const element = list.value.find(item => item.id === id);
    //     initialColSpan.value = element.colSpan;
    // }
    
    function handleResize(contentRect, id) {
        console.log('handleResize', contentRect.width, id);

        useResizeObserver(contentRect, (entries) => {
            const entry = entries[0]
            const { width, height } = entry.contentRect
            console.log(width, height);
            
        })
        
        // const element = div.value[id];
        // if (element) {
        //     const newWidth = contentRect.width;
        //     element.style.width = newWidth + 'px';
        //     // Optionally, update colSpan based on new width
        //     // const newColSpan = Math.floor(newWidth / colWidth);
        //     // updateColSpan(id, newColSpan);
        // }
    }

    function handleMouseDown(event, element, list) {
        // console.log('handleMouseDown', element);
        // console.log('handleMouseDown', event);
        
        // event.preventDefault();
        // if (element) {
        //     resizingElement.value = element;
        //     proxyElement.value = list.find(item => item.id === element.id);
        //     console.log(proxyElement.value);
        
            
        //     window.addEventListener('mousemove', handleMouseMove);
        //     window.addEventListener('mouseup', handleMouseUp);
        // }
        event.preventDefault();
        if (element) {
            // resizingElementId.value = id;
            resizingElement.value = element;
            // initialMouseX.value = event.clientX;
            proxyElement.value = list.value.find(item => item.id === element.id);
            // initialColSpan.value = element.colSpan;
            const container = document.querySelector('.grid');
            const rect = container.getBoundingClientRect();
            baseWidth.value = rect.width / 16; // Calculate base width per column
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
    }

    function handleMouseMove(event) {
        console.log('handleMouseMove', resizingElement.value);
        
        const element = resizingElement.value;
        // handleResize(event, element);
        console.log(element);
        
        if (element) {
            const newWidth = event.clientX - element.offsetLeft;
            const newColSpan = Math.min(16, Math.max(1, Math.round(newWidth / baseWidth.value)));
            element.style.width = newColSpan * baseWidth.value + 'px';
            // console.log('newWidth', newWidth);
            
            updateColSpan(resizingElement.value.id, newColSpan);
            // Ensure proxyElement exists before updating colSpan
            if (proxyElement.value) {
                proxyElement.value.colSpan = newColSpan;
            }
        }
    }

    function handleMouseUp() {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        resizingElement.value = null;
    }

    return {
        div,
        handleResize,
        handleMouseDown,
    };
}
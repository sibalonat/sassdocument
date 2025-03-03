import { computed, reactive, ref, getCurrentInstance } from 'vue'
import { useDynamicSheets } from './DynamicSheets';
import { head } from 'lodash';
import { storeToRefs } from 'pinia';

export function useDynamicResizeCell() {
    const store = useDynamicSheets();
    const { updateColSpan, cleanUpRow } = store;
    const { actel } = storeToRefs(store);
    const div = ref([]);
    // state
    let resizingElement = ref(null);
    let proxyElement = ref(null);
    let baseWidth = ref(null);
    let activeRow = ref(null);

    // trck that it doesnt remove the entire row while dragging and resizing one 
    let initialY = ref(null);

    function handleMouseDown(event, element, list) {
        activeRow.value = list;
        initialY.value = event.clientY;
        
        event.preventDefault();
        if (element) {
            resizingElement.value = element;
            proxyElement.value = activeRow.value.find(item => item.id === element.id);
            const container = document.querySelector('.grid');
            const rect = container.getBoundingClientRect();
            baseWidth.value = rect.width / 16; // Calculate base width per column

            // Track cell boundaries
            resizingElement.value.boundaries = element.getBoundingClientRect();
            
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
    }

    function handleMouseMove(event) {
        if (!resizingElement.value) return;

        // Check vertical movement
        const boundaries = resizingElement.value.boundaries;
        const mouseY = event.clientY;
    
        // Check if the mouse leaves the cell boundaries vertically
        if (mouseY < boundaries.top || mouseY > boundaries.bottom) {
            resetWhenMouseExeedsHeight();
            return;
        }
        const element = resizingElement.value;

        if (element) {
            const newWidth = event.clientX - element.offsetLeft;
            const newColSpan = Math.min(16, 
                Math.max(1, Math.round(newWidth / baseWidth.value)
            )); // Ensure newColSpan does not exceed 16
            
            updateColSpan(resizingElement.value.id, newColSpan);
            if (proxyElement.value) {
                proxyElement.value.colSpan = newColSpan;
            }
        }
    }

    function handleMouseUp() {
        cleanUpRow(proxyElement.value, activeRow.value, 'move');
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        resizingElement.value = null;
        baseWidth.value = null;
        proxyElement.value = null;
        activeRow.value = null;
        initialY.value = null; 
    }

    function resetWhenMouseExeedsHeight() {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        resizingElement.value = null;
        baseWidth.value = null;
        proxyElement.value = null;
        activeRow.value = null;
        initialY.value = null; 
    }

    function getRowFromDraggableElement(evt) {
        const draggableComponent = evt.__draggable_component__;        
        const list = draggableComponent.list;
        
        if (list.length > 0) {
            const rowFrequency = {};
            
            // Count the frequency of each row value
            list.forEach(item => {
                if (rowFrequency[item.row]) {
                    rowFrequency[item.row]++;
                } else {
                    rowFrequency[item.row] = 1;
                }
            });
            
            // Find the most common row value
            let mostCommonRow = null;
            let maxCount = 0;
            for (const row in rowFrequency) {
                if (rowFrequency[row] > maxCount) {
                    maxCount = rowFrequency[row];
                    mostCommonRow = row;
                }
            }
            
            return mostCommonRow;
        }
        return null;
    }

    function resetActiveElement(list) {
        if (!actel.value) return;
        const element = list.value
        .flatMap(row => row)
        .find(el => el.id == actel.value.id);
        
        if (element) {
            element.active = false;  
        }
        actel.value = null;      
    }

    function setActiveElement(element) {
        actel.value = element;        
        element.active = true;
    }

    function findRows(list, fromRow, toRow) {
        const rowStart = list.value.find(
          row => row.some(item => item.row == fromRow)
        );
        
        const rowEnd = list.value.find(
            row => row.some(item => item.row == toRow)
        );
      
        return { rowStart, rowEnd };
    }

    return {
        div,
        findRows,
        handleMouseDown,
        setActiveElement,
        resetActiveElement,
        getRowFromDraggableElement,
    };
}
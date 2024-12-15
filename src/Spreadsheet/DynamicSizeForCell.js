import { computed, reactive, ref } from 'vue'
import { useDynamicSheets } from './DynamicSheets';
import { head } from 'lodash';

export function useDynamicResizeCell() {
    const store = useDynamicSheets();
    const { updateColSpan, cleanUpRow } = store;
    const div = ref([]);
    // state
    let resizingElement = ref(null);
    let proxyElement = ref(null);
    let baseWidth = ref(null);
    let activeRow = ref(null);

    function handleMouseDown(event, element, list) {
        activeRow.value = list;
        
        event.preventDefault();
        if (element) {
            resizingElement.value = element;
            proxyElement.value = activeRow.value.find(item => item.id === element.id);
            const container = document.querySelector('.grid');
            const rect = container.getBoundingClientRect();
            baseWidth.value = rect.width / 16; // Calculate base width per column
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
    }

    function handleMouseMove(event) {
        const element = resizingElement.value;

        if (element) {
            const newWidth = event.clientX - element.offsetLeft;
            const newColSpan = Math.min(16, Math.max(1, Math.round(newWidth / baseWidth.value))); // Ensure newColSpan does not exceed 16
            console.log(newColSpan);
            
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
    }

    function getRowFromDraggableElement(evt) {
        const draggableComponent = evt.__draggable_component__;
        const list = draggableComponent.list;
        
        if (list.length > 0) {
            return list[0].row; // Directly access the first element's row
        }
        return null;
    }

    return {
        div,
        handleMouseDown,
        getRowFromDraggableElement,
    };
}
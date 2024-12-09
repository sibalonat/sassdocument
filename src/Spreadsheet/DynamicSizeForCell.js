import { computed, reactive, ref } from 'vue'
import { useDynamicSheets } from './DynamicSheets';

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
            // resizingElementId.value = id;
            resizingElement.value = element;
            // initialMouseX.value = event.clientX;
            proxyElement.value = activeRow.value.find(item => item.id === element.id);
            // initialColSpan.value = element.colSpan;
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
            
            // element.style.width = newColSpan * baseWidth.value + 'px';
            
            updateColSpan(resizingElement.value.id, newColSpan);
            // Ensure proxyElement exists before updating colSpan
            if (proxyElement.value) {
                proxyElement.value.colSpan = newColSpan;
            }
        }
    }

    function handleMouseUp() {
        cleanUpRow(proxyElement.value, activeRow.value);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        resizingElement.value = null;
        baseWidth.value = null;
        proxyElement.value = null;
        activeRow.value = null;
    }

    return {
        div,
        handleMouseDown,
    };
}
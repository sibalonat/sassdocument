import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const useDynamicSheets = defineStore('sheets', () => {
    // state
    // const base = reactive({
    //     name: '',
    //     rows: null,
    //     columns: null,
    //     data: [],
    // })
    const base = ref([])
    const data = ref([]);

    // computed
    // const alphabetArray = ref();
    const alphabet = computed(() => Array.from({ length: 16 }, (_, i) => String.fromCharCode(65 + i)));

    // TODO: Create a function to generate a new id for each cell
    // Function to generate a unique and complex ID
    const generateUniqueId = () => {
        return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Example function to create a new row with 16 columns, each having a unique ID
    const createRow = () => {
        // Determine the row number for the new row
        let newRowNumber = 1;
        if (base.value.length > 0) {
            const lastElement = base.value[base.value.length - 1];
            newRowNumber = lastElement.row + 1;
        }

        // Create a new row with 16 columns
        for (let i = 0; i < 16; i++) {
            const data = {
                id: generateUniqueId(),
                name: "\u00A0",
                col: i + 1, // Set the column number
                row: newRowNumber,
                colSpan: 1,
            };
            base.value.push(data);
        }        
    }

    function updateColSpan(id, newColSpan) {
        const item = base.value.find(item => item.id === id);
        if (item) {
            item.colSpan = newColSpan;
            // Trigger reactivity update
            base.value = [...base.value];
        }
    }

    // Function to add a new column to the right of the last column
    // Function to get the Tailwind CSS grid classes for each cell
    function getTailwindGridClasses(element) {
        return `col-span-${String(element.colSpan)}`;
    }

    function initialIfListEmpty() {
        if (base.value.length === 0) {
            for (let index = 0; index < 16; index++) {
                createRow();
            }
        }
    }

    return {
        alphabet,
        base,
        data,
        createRow,
        updateColSpan,
        getTailwindGridClasses, 
        initialIfListEmpty,
    };
})
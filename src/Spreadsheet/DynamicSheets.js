import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

export const useDynamicSheets = defineStore('sheets', () => {
    // state
    const base = reactive({
        name: '',
        rows: null,
        columns: null,
        data: [],
    })

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
        const newRow = [];
        for (let i = 0; i < 16; i++) {
            newRow.push({
                id: generateUniqueId(),
                value: '',
                col: 1,
                row: 1,
                colSpan: 1,
            });
        }
        base.data.push(newRow);
    }

    createRow();

    // Function to add a new column to the right of the last column
    // Function to get the Tailwind CSS grid classes for each cell
    function getTailwindGridClasses(element) {
        return `
        col-start-${String(element.col)} 
        row-start-${String(element.row)} 
        col-span-${String(element.colSpan)}
        `;
    }
    

    // const createSheet = (name, rows, columns) => {



    // { name: "John", id: 0, col: 1, row: 1, colSpan: 1 },
    // { name: "Joao", id: 1, col: 3, row: 1, colSpan:  },
    // { name: "Jean", id: 2, col: 5, row: 1, colSpan: 1 }


    const data = ref([]);
    return {
        alphabet,
        base,
        createRow,
        getTailwindGridClasses,
        data,
    };
})
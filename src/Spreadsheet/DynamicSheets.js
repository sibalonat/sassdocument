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

    // const row = ref([
    //     { name: "\u00A0", id: 0, col: 1, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 1, col: 3, row: 1, colSpan: 1 },
    //     { name: "\u00A0", id: 2, col: 5, row: 1, colSpan: 1 }
    //   ])

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
        console.log(base.value);
        
    }

    function updateColSpan(id, newColSpan) {
        const item = base.value.find(item => item.id === id);
        if (item) {
            item.colSpan = newColSpan;
        }
    }

    // createRow();

    // Function to add a new column to the right of the last column
    // Function to get the Tailwind CSS grid classes for each cell
    function getTailwindGridClasses(element) {
        // console.log(element);
        
        // const first = `col-start-${String(element.col)}`;
        // const second = `row-start-${String(element.row)}`;
        const third = `col-span-${String(element.colSpan)}`;
        // const string = `${first} ${second} ${third}`;
        const string = `${third}`;
        return string;
    }

    function initialIfListEmpty() {
        if (base.value.length === 0) {
            for (let index = 0; index < 16; index++) {
                createRow();
            }
        }
    }
    

    // const createSheet = (name, rows, columns) => {



    // { name: "John", id: 0, col: 1, row: 1, colSpan: 1 },
    // { name: "Joao", id: 1, col: 3, row: 1, colSpan:  },
    // { name: "Jean", id: 2, col: 5, row: 1, colSpan: 1 }


    const data = ref([]);
    return {
        alphabet,
        base,
        data,
        createRow,
        updateColSpan,
        getTailwindGridClasses,
        initialIfListEmpty,
        // row,
    };
})
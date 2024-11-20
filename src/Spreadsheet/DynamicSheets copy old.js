import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { groupBy } from 'lodash';

export const useDynamicSheets = defineStore('sheets', () => {
    // state
    // const list = reactive({
    //     name: '',
    //     rows: null,
    //     columns: null,
    //     data: [],
    // })
    const list = ref([])
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
        if (list.value.length > 0) {
            const lastElement = list.value[list.value.length - 1];
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
            list.value.push(data);
        }        
    }

    function cleanUpRows() {
        // Group columns by row using Lodash's groupBy
        const rows = groupBy(list.value, 'row');
      
        // Process each row
        Object.keys(rows).forEach(rowKey => {
          const row = rows[rowKey];
          let totalColSpan = row.reduce((acc, item) => acc + item.colSpan, 0);
      
          // If the total colSpan exceeds 16, remove items with no name
          if (totalColSpan > 16) {
            const itemsToRemove = totalColSpan - 16;
            let removed = 0;
            for (let i = row.length - 1; i >= 0 && removed < itemsToRemove; i--) {
              if (!row[i].name || row[i].name.trim() === "") {
                const index = list.value.findIndex(item => item.id === row[i].id);
                if (index !== -1) {
                  list.value.splice(index, 1);
                  removed++;
                }
              }
            }
          }
      
          // If the total colSpan is exactly 16, remove items with no name
          if (totalColSpan === 16) {
            for (let i = row.length - 1; i >= 0; i--) {
              if (!row[i].name || row[i].name.trim() === "") {
                const index = list.value.findIndex(item => item.id === row[i].id);
                if (index !== -1) {
                  list.value.splice(index, 1);
                }
              }
            }
          }
        });
    }

    function updateColSpan(id, newColSpan) {
        const item = list.value.find(item => item.id === id);
        if (item) {
            item.colSpan = newColSpan;
            // Trigger reactivity update
           
            // list.value = cleanUpRows();
            list.value = [...list.value];
        }
    }

    // Function to add a new column to the right of the last column
    // Function to get the Tailwind CSS grid classes for each cell
    function getTailwindGridClasses(element) {
        return `col-span-${String(element.colSpan)}`;
    }

    function initialIfListEmpty() {
        if (list.value.length === 0) {
            for (let index = 0; index < 16; index++) {
                createRow();
            }
        }
    }

    return {
        alphabet,
        list,
        data,
        createRow,
        cleanUpRows,
        updateColSpan,
        getTailwindGridClasses, 
        initialIfListEmpty,
    };
})
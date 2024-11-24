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

    function cleanUpRow(element) {
      // Find the row items in the list
      const rowItems = list.value.filter(item => item.row === element.row);
    
      if (rowItems.length === 0) return; // Skip if the row is empty
    
      let totalColSpan = rowItems.reduce((acc, item) => acc + item.colSpan, 0);
    
      // Track IDs of items to be removed for this row
      const itemsToRemove = new Set();
    
      // If the total colSpan exceeds 16, remove items with no name
      if (totalColSpan > 16) {
        const excessColSpan = totalColSpan - 16;
        let removedColSpan = 0;
        for (let i = rowItems.length - 1; i >= 0 && removedColSpan < excessColSpan; i--) {
          if (!rowItems[i].name || rowItems[i].name.trim() === "") {
            itemsToRemove.add(rowItems[i].id);
            removedColSpan += rowItems[i].colSpan;
            rowItems.splice(i, 1);
          }
        }
      }
    
      // If the total colSpan is exactly 16, remove items with no name
      if (totalColSpan === 16) {
        for (let i = rowItems.length - 1; i >= 0; i--) {
          if (!rowItems[i].name || rowItems[i].name.trim() === "") {
            itemsToRemove.add(rowItems[i].id);
            rowItems.splice(i, 1);
          }
        }
      }

      console.log(itemsToRemove);
      
    
      // Remove items with no name from the list for this row
      for (let i = list.value.length - 1; i >= 0; i--) {
        if (itemsToRemove.has(list.value[i].id) && list.value[i].row === element.row) {
          list.value.splice(i, 1);
        }
      }
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
        cleanUpRow,
        updateColSpan,
        getTailwindGridClasses, 
        initialIfListEmpty,
    };
})
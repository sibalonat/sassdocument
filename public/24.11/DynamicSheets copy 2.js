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

    // function cleanUpRows() {
    //     // Group columns by row using Lodash's groupBy
    //     const rows = groupBy(list.value, 'row');
      
    //     // Process each row
    //     Object.keys(rows).forEach(rowKey => {
    //       const row = rows[rowKey];
    //       let totalColSpan = row.reduce((acc, item) => acc + item.colSpan, 0);
      
    //       // If the total colSpan exceeds 16, remove items with no name
    //       if (totalColSpan > 16) {
    //         const itemsToRemove = totalColSpan - 16;
    //         let removed = 0;
    //         for (let i = row.length - 1; i >= 0 && removed < itemsToRemove; i--) {
    //           if (!row[i].name || row[i].name.trim() === "") {
    //             const index = list.value.findIndex(item => item.id === row[i].id && item.row === rowKey);
    //             if (index !== -1) {
    //               list.value.splice(index, 1);
    //               removed++;
    //             }
    //           }
    //         }
    //       }
      
    //       // If the total colSpan is exactly 16, remove items with no name
    //       if (totalColSpan === 16) {
    //         for (let i = row.length - 1; i >= 0; i--) {
    //           if (!row[i].name || row[i].name.trim() === "") {
    //             const index = list.value.findIndex(item => item.id === row[i].id && item.row === rowKey);
    //             if (index !== -1) {
    //               list.value.splice(index, 1);
    //             }
    //           }
    //         }
    //       }
    //     });
    //   }

    function cleanUpRows() {
        // Group columns by row using Lodash's groupBy
        const rows = groupBy(list.value, 'row');

        // Track IDs of items to be removed
        const itemsToRemove = new Set();
      
        // Process each row
        Object.keys(rows).forEach(rowKey => {
          const row = rows[rowKey];
          let totalColSpan = row.reduce((acc, item) => acc + item.colSpan, 0);
      
          // If the total colSpan exceeds 16, remove items with no name
          if (totalColSpan > 16) {
            const excessColSpan = totalColSpan - 16;
            let removed = 0;
            for (let i = row.length - 1; i >= 0 && removed < excessColSpan; i--) {
              if (!row[i].name || row[i].name.trim() === "" && row[i].row == rowKey) {
                itemsToRemove.add(row[i].id);
                row.splice(i, 1);
                removed++;
              }
            }
          }
      
          // If the total colSpan is exactly 16, remove items with no name
          if (totalColSpan === 16) {
            for (let i = row.length - 1; i >= 0; i--) {
              if (!row[i].name || row[i].name.trim() === "" && row[i].row == rowKey) {
                itemsToRemove.add(row[i].id);
                row.splice(i, 1);
              }
            }
          }

          console.log(itemsToRemove);
          


          // Filter items from the list with the same id as the row collection
          // const rowItems = list.value.filter(item => item.row == rowKey);

          
          

          // Iterate over them to update the values of their properties from the row
          // Remove items with no name from the list
          for (let i = list.value.length - 1; i >= 0; i--) {
            if (itemsToRemove.has(list.value[i].id)) {
              list.value.splice(i, 1);
            }
          }
      
          // // Replace the original items in the list with the cleaned row
          // const rowIndices = list.value.reduce((indices, item, index) => {
          //   if (item.row == rowKey) {
          //     console.log(item);
          //     indices.push(index);
          //   }
            
          //   return indices;
          // }, []);

          // // Remove excess items first to avoid index shifting issues
          // for (let i = rowIndices.length - 1; i >= row.length; i--) {
          //   list.value.splice(rowIndices[i], 1);
          // }
          
      
          // // rowIndices.forEach((index, i) => {
          // //   if (i < row.length) {
          // //     list.value[index] = row[i];
          // //   } else {
          // //     list.value.splice(index, 1);
          // //   }
          // // });
          // // Update the remaining items
          // rowIndices.forEach((index, i) => {
          //   if (i < row.length) {
          //     list.value[index] = row[i];
          //   }
          // });
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
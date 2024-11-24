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

    // function cleanUpRows() {
    //     // Group columns by row using Lodash's groupBy
    //     const rows = groupBy(list.value, 'row');

    //     const itemsToRemove = new Set();
        
    //     // Process each row
    //     Object.keys(rows).forEach(rowKey => {
    //       const row = rows[rowKey];
    //       if (row.length === 0) return;
    //       let totalColSpan = row.reduce((acc, item) => acc + item.colSpan, 0);
          
    //       // Track IDs of items to be removed

    //       // If the total colSpan exceeds 16, remove items with no name
    //       if (row.length !== 0) {
    //         console.log(row);
            
    //         if (totalColSpan > 16) {
    //           const excessColSpan = totalColSpan - 16;
    //           let removed = 0;
    //           for (let i = row.length - 1; i >= 0 && removed < excessColSpan; i--) {
    //             if (!row[i].name || row[i].name.trim() === "") {
    //               itemsToRemove.add(row[i].id);
    //               row.splice(i, 1);
    //               removed++;
    //             }
    //           }
    //         }
        
    //         // If the total colSpan is exactly 16, remove items with no name
    //         if (totalColSpan === 16) {
    //           for (let i = row.length - 1; i >= 0; i--) {
    //             if (!row[i].name || row[i].name.trim() === "") {
    //               itemsToRemove.add(row[i].id);
    //               row.splice(i, 1);
    //             }
    //           }
    //         }
    //       }

    //       console.log(itemsToRemove);
          

          
          
    //       // Iterate over them to update the values of their properties from the row
    //       // Remove items with no name from the list
    //       for (let i = list.value.length - 1; i >= 0; i--) {
    //         console.log(itemsToRemove.has(list.value[i].id));
    //         if (itemsToRemove.has(list.value[i].id) && list.value[i].row == rowKey) {
    //           list.value.splice(i, 1);
    //         }
    //       }
      
    //     });
    // }

    // function cleanUpRows(element) {
    //   const groupedRows = groupBy(list.value, 'row');
    
    //   const removedIds = [];
    
    //   Object.values(groupedRows).forEach(rowItems => {
    //     const totalColSpan = rowItems.reduce((sum, item) => sum + item.colSpan, 0);
    
    //     const filteredRow = rowItems.filter(item => {
    //       const shouldKeep = item.colSpan === totalColSpan && !!item.name;
    //       return shouldKeep;
    //     });
    
    //     // Track removed IDs for the current row
    //     const rowRemovedIds = rowItems.filter(item => !filteredRow.includes(item)).map(item => item.id);
    //     removedIds.push(...rowRemovedIds);
    
    //     // Update original items with filtered items
    //     filteredRow.forEach(filteredItem => {
    //       const originalItem = rowItems.find(item => item.id === filteredItem.id);
    //       if (originalItem) {
    //         // Update properties as needed
    //         originalItem.colSpan = filteredItem.colSpan;
    //         originalItem.name = filteredItem.name;
    //         originalItem.row = filteredItem.row;
    //         originalItem.col = filteredItem.col;
    //         originalItem.id = filteredItem.id;
    //         originalItem.colSpan = filteredItem.colSpan;
    //         // ... other properties
    //       }
    //     });
    //   });
    //   console.log(removedIds);
      
    
    //   // Remove items with removed IDs from the main array
    //   list.value = list.value.filter(item => !removedIds.includes(item.id));
    // }

    // function cleanUpRows(element) {
    //   const removedIds = [];

    //   console.log(element);
      
    
    //   // Calculate total colSpan for the element's row
    //   const row = list.value.find(item => item.row === element.row);
    //   if (!row) {
    //     // Handle the case where the row doesn't exist
    //     console.warn(`Row with id ${element.row} not found`);
    //     return;
    //   }
    
    //   const totalColSpan = list.value.reduce((sum, item) => sum + item.colSpan, 0) - element.colSpan;
    
    //   // Filter items based on the combined conditions
    //   list.value.filter(item => {
    //     if (item.id === element.id) return true;
    //     const shouldKeep = item.colSpan === totalColSpan && !!item.name;
    //     if (!shouldKeep) {
    //       removedIds.push(item.id);
    //     }
    //     return shouldKeep;
    //   });
    
    //   // Update the original item's properties as needed
    //   // const originalItem = list.value.find(item => item.id === element.id);
    //   // if (originalItem) {
    //   //   originalItem.colSpan = element.colSpan;
    //   //   originalItem.name = element.name;
    //   //   originalItem.name = element.name;
    //   //   originalItem.row = element.row;
    //   //   originalItem.col = element.col;
    //   //   originalItem.colSpan = element.colSpan;
    //   // }

    //   console.log(removedIds);
      
    
    //   // Remove items with removed IDs from the main array
    //   list.value = list.value.filter(item => {
    //     return item.row !== element.row || !removedIds.includes(item.id);
    //   });
    // }

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
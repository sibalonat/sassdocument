import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { groupBy, head } from 'lodash';

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

    const alphabet = computed(() => Array.from({ length: 16 }, (_, i) => String.fromCharCode(65 + i)));

    // TODO: Create a function to generate a new id for each cell
    // Function to generate a unique and complex ID
    const generateUniqueId = () => {
        return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
    }

    function initialRows(numRows) {
      const rows = [];
      let newRowNumber = 1;
      let existingRows = list.value.length; 
      
      for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {         
          // Determine the row number for the new row
          if (existingRows > 0) {
            newRowNumber = existingRows + 1;
            existingRows = existingRows + 1;
          } else if (rows.length > 0 && list.value.length <= 0) {
            const lastElement = rows[rows.length - 1][0]; // Get the first element of the last row
            newRowNumber = lastElement.row + 1;
          }
          // Create a new row with 16 columns
          const newRow = [];
          for (let i = 0; i < 16; i++) {
              const data = {
                  id: generateUniqueId(),
                  name: "\u00A0",
                  col: i + 1, // Set the column number
                  row: newRowNumber,
                  colSpan: 1,
              };
              newRow.push(data);
          }
          rows.push(newRow);
      }
      return rows;
    }

    function normalizeRows() {
      // Create a new row with 16 columns
      const rows = [];
      const newRow = [];
      
      for (let i = 0; i < 16; i++) {
          const data = {
              id: generateUniqueId(),
              name: "\u00A0",
              col: i + 1, // Set the column number
              row: list.value.length + 1,
              colSpan: 1,
          };
          newRow.push(data);
      }
      rows.push(newRow);
      return rows;
    }

    // Example function to create a new row with 16 columns, each having a unique ID
    function createRow(numRows) {
      if (numRows > 0) {     
        return initialRows(numRows)
      } else {
        return normalizeRows()
      }
    }

    function cleanUpRow(element, row) {
        const rowItems = row.filter(item => item.row === element.row);
        if (rowItems.length === 0) return;
        let totalColSpan = rowItems.reduce((acc, item) => acc + item.colSpan, 0);
        console.log(element);
        
        const itemsToRemove = new Set();
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
        if (totalColSpan === 16) {
            for (let i = rowItems.length - 1; i >= 0; i--) {
                if (!rowItems[i].name || rowItems[i].name.trim() === "") {
                    itemsToRemove.add(rowItems[i].id);
                    rowItems.splice(i, 1);
                }
            }
        }
        for (let i = row.length - 1; i >= 0; i--) {
            if (itemsToRemove.has(row[i].id) && row[i].row === element.row) {
                row.splice(i, 1);
            }
        }
    }

    function cleanUpOnDragStart(rowNumber, list) {
        const rowItems = list.filter(item => item.row == rowNumber);
        if (rowItems.length === 0) return;
        let totalColSpan = rowItems.reduce((acc, item) => acc + item.colSpan, 0);
        const itemsToRemove = new Set();
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
        if (totalColSpan === 16) {
            for (let i = rowItems.length - 1; i >= 0; i--) {
                if (!rowItems[i].name || rowItems[i].name.trim() === "") {
                    itemsToRemove.add(rowItems[i].id);
                    rowItems.splice(i, 1);
                }
            }
        }
        for (let i = list.length - 1; i >= 0; i--) {
            if (itemsToRemove.has(list[i].id) && list[i].row == rowNumber) {
                list.splice(i, 1);
            }
        }
        if (totalColSpan < 16) {
            const itemsToAdd = 16 - totalColSpan;
            for (let i = 0; i < itemsToAdd; i++) {
                const data = {
                    id: generateUniqueId(),
                    name: "\u00A0",
                    col: rowItems.length + i + 1,
                    row: rowNumber,
                    colSpan: 1,
                };
                list.push(data);
            }
        }
    }

    function cleanUpOnDragEnd(rowStart, rowEnd, listStart, listEnd) {
      cleanUpOnDragStart(rowStart, listStart);
      cleanUpOnDragStart(rowEnd, listEnd);
    }

    function updateColSpan(id, newColSpan) {
      console.log(id);
      console.log(list.value);
      
        const item = list.value.find(item => item.id === id);
        console.log(item);
        
        if (item) {
            item.colSpan = newColSpan;
        }
    }

    // Function to get the Tailwind CSS grid classes for each cell
    function getTailwindGridClasses(element) {
        return `col-span-${String(element.colSpan)}`;
    }

    function initialIfListEmpty() {
        if (list.value.length === 0) {
          const rows = createRow(10);
          list.value.push(...rows);
        }
    }

    function createRowOnClick() {
        const rows = createRow();       
        list.value.push(...rows);
        console.log(list.value);
        
    }

    return {
        alphabet,
        list,
        data,
        createRow,
        cleanUpRow,
        updateColSpan,
        cleanUpOnDragStart,
        cleanUpOnDragEnd,
        createRowOnClick,
        getTailwindGridClasses, 
        initialIfListEmpty,
        generateUniqueId,
    };
})
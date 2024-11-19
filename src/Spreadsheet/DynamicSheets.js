import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

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
      const rows = {};
      console.log(list);
    

      // Group columns by row
      list.value.forEach(item => {
        console.log(item.row);
        
        if (!rows[item.row]) {
          rows[item.row] = [];
        }
        rows[item.row].push(item);
        console.log(rows);
        
      });

      console.log(rows);
    
      // Process each row
      Object.keys(rows).forEach(rowKey => {
        
        const row = rows[rowKey];
        const totalColSpan = row.reduce((acc, item) => acc + item.colSpan, 0);
        console.log(totalColSpan);

        if (totalColSpan === 16) {
            console.log('Row is full');
            
          // Filter out columns that don't have a name property or have a name property equal to "\u00A0"
          rows[rowKey] = row.filter(item => {
            const keep = item.name && item.name !== "\u00A0";
            console.log(`Item ${item.id} (${item.name}): ${keep ? 'kept' : 'removed'}`);
            return keep;
          });
        }
      });

      console.log('Processed rows:', rows);
      

      // Flatten the rows back into the list
    //   list.value = Object.values(rows).flat();
    }

    function updateColSpan(id, newColSpan) {
        const item = list.value.find(item => item.id === id);
        if (item) {
            item.colSpan = newColSpan;
            // Trigger reactivity update
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
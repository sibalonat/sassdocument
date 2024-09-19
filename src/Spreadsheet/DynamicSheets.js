import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useDynamicSheets = defineStore('sheets', () => {
    // state
    const base = reactive({
        name: '',
        rows: null,
        columns: null,
        data: {},
    })
    const data = ref([]);
    return base, data;
})
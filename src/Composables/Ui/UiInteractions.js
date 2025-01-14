import { min } from 'lodash';
import { onMounted, onUnmounted, reactive, ref, toRefs } from 'vue';
import { useDynamicSheets } from '@/Spreadsheet/DynamicSheets';
import { useDynamicResizeCell } from '@/Spreadsheet/DynamicSizeForCell';
import { storeToRefs } from 'pinia';

export default function useUiInteractions() {
    // state
    const store = useDynamicSheets();
    const { list } = storeToRefs(store);

    const { resetActiveElement, activeElement } = useDynamicResizeCell(list);
  
    const opened = ref(false);

    function trigger() {
        opened.value = !opened.value;
        // console.log('opened', activeElement.value);
        
        // if (!opened.value) {
          
        //   resetActiveElement(list);
        //   console.log(activeElement.value);
        // }        
    }

  return {
    opened,
    trigger,
  };
}

import { min } from 'lodash';
import { ref } from 'vue';

export default function useUiInteractions() {
    // state 
    const opened = ref(false);

    function trigger() {
        opened.value = !opened.value;      
    }

  return {
    opened,
    trigger,
  };
}

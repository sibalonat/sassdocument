import { reactive, ref, toRefs } from 'vue';

export default function useUiInteractions() {
    const opened = ref(false);

    function trigger() {
      console.log('trigger');
      
        opened.value = !opened.value;
        console.log(opened.value);
        
    }



  return {
    opened,
    trigger,
  };
}

import { reactive, ref, toRefs } from 'vue';

export default function useUiInteractions() {
    const opened = ref(false);

    function trigger() {
        opened.value = !opened.value;
    }



  return {
    opened,
  };
}

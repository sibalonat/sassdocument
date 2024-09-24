// useComponentStructure.js
import { ref, h } from 'vue';

const getHtmlElementFromNode = ({ el }) => el;
const addContext = (domElement, context) =>
  (domElement.__draggable_context = context);
const getContext = domElement => domElement.__draggable_context;

export function useComponentStructure({ nodes, root, realList }) {
  const defaultNodes = ref(nodes.default);
  const children = ref([...nodes.header, ...nodes.default, ...nodes.footer]);
  const externalComponent = ref(root.externalComponent);
  const rootTransition = ref(root.transition);
  const tag = ref(root.tag);
  const realListRef = ref(realList);

  const _isRootComponent = computed(() => externalComponent.value || rootTransition.value);

  function render(attributes) {
    console.log('attributes', attributes);
    
    const option = !_isRootComponent.value ? children.value : { default: () => children.value };
    return h(tag.value, attributes, option);
  }

  function updated() {
    defaultNodes.value.forEach((node, index) => {
      addContext(getHtmlElementFromNode(node), {
        element: realListRef.value[index],
        index
      });
    });
  }

  function getUnderlyingVm(domElement) {
    return getContext(domElement);
  }

  function getVmIndexFromDomIndex(domIndex, element) {
    const { length } = defaultNodes.value;
    const domChildren = element.children;
    const domElement = domChildren.item(domIndex);

    if (domElement === null) {
      return length;
    }
    const context = getContext(domElement);
    if (context) {
      return context.index;
    }

    if (length === 0) {
      return 0;
    }
    const firstDomListElement = getHtmlElementFromNode(defaultNodes.value[0]);
    const indexFirstDomListElement = [...domChildren].findIndex(
      element => element === firstDomListElement
    );
    return domIndex < indexFirstDomListElement ? 0 : length;
  }

  return {
    render,
    updated,
    getUnderlyingVm,
    getVmIndexFromDomIndex
  };
}
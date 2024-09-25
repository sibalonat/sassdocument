import { ref, h, computed } from 'vue';

export function useComponentStructure({ nodes, root, realList }) {
  const defaultNodes = ref(nodes.default);
  const children = ref([...nodes.header, ...nodes.default, ...nodes.footer]);
  const externalComponent = ref(root.externalComponent);
  const rootTransition = ref(root.transition);
  const tag = ref(root.tag);
  const realListRef = ref(realList);

  const _isRootComponent = computed(() => externalComponent.value || rootTransition.value);

  function render(attributes) {
    console.log('render attributes:', attributes);
    
    const option = !_isRootComponent.value ? children.value : { default: () => children.value };
    return h(tag.value, attributes, option);
  }

  const getContext = domElement => domElement.__draggable_context;

  const getHtmlElementFromNode = ({ el }) => {
    console.log('getHtmlElementFromNode:', el);
    return el;
  };

  const addContext = (domElement, context) => {
    if (!domElement) {
      console.warn('addContext: domElement is null or undefined', context);
      return;
    }
  
    if (!(domElement instanceof HTMLElement)) {
      console.warn('addContext: domElement is not a valid HTML element', domElement, context);
      return;
    }
  
    console.log('addContext: setting context', domElement, context);
    domElement.__draggable_context = context;
  };

  function updated() {
    console.log('updated defaultNodes:', defaultNodes.value);
    
    defaultNodes.value.forEach((node, index) => {
      console.log('node:', node);
      const el = getHtmlElementFromNode(node);
      console.log('el:', el);
      
      if (el) {
        addContext(el, {
          element: realListRef.value[index],
          index
        });
      } else {
        console.warn('Element not found for node:', node);
      }
    });
  }

  function getUnderlyingVm(domElement) {
    console.log('getUnderlyingVm domElement:', domElement);
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
    console.log('context:', context);
    
    if (context) {
      return context.index;
    }

    if (length === 0) {
      return 0;
    }
    console.log('defaultNodes:', defaultNodes.value);
    
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
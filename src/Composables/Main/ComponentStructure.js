import { reactive, toRefs } from 'vue';

const getHtmlElementFromNode = ({ el }) => el;
const addContext = (domElement, context) =>
  (domElement.__draggable_context = context);
const getContext = domElement => domElement.__draggable_context;

function useComponentStructure({ nodes: { header, default: defaultNodes, footer }, root, realList }) {
  const state = reactive({
    defaultNodes,
    children: [...header, ...defaultNodes, ...footer],
    externalComponent: root.externalComponent,
    rootTransition: root.transition,
    tag: root.tag,
    realList
  });

  const _isRootComponent = () => state.externalComponent || state.rootTransition;

  const render = (h, attributes) => {
    const { tag, children } = state;
    const option = !_isRootComponent() ? children : { default: () => children };
    return h(tag, attributes, option);
  };

  const updated = () => {
    state.defaultNodes.forEach((node, index) => {
      addContext(getHtmlElementFromNode(node), {
        element: state.realList[index],
        index
      });
    });
  };

  const getUnderlyingVm = (domElement) => {
    return getContext(domElement);
  };

  const getVmIndexFromDomIndex = (domIndex, element) => {
    const { defaultNodes } = state;
    const { length } = defaultNodes;
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
    const firstDomListElement = getHtmlElementFromNode(defaultNodes[0]);
    const indexFirstDomListElement = [...domChildren].findIndex(
      element => element === firstDomListElement
    );
    return domIndex < indexFirstDomListElement ? 0 : length;
  };

  return {
    ...toRefs(state),
    _isRootComponent,
    render,
    updated,
    getUnderlyingVm,
    getVmIndexFromDomIndex
  };
}

export { useComponentStructure };
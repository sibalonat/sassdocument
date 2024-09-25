// useRenderHelper.js
// import { ComponentStructure } from "./componentStructure";
// import { isHtmlTag, isTransition } from "../util/tags";
// import { isHtmlTag, isTransition } from "../Utils/Tags";
import { useComponentStructure } from "../src/Composables/Main/ComponentStructure";
import { useHtmlUtils } from "../src/Composables/Utils/Tags";
import { resolveComponent, TransitionGroup } from "vue";

// composables
const { isHtmlTag, isTransition } = useHtmlUtils();

function getSlot(slots, key) {
  const slotValue = slots[key];
  return slotValue ? slotValue() : [];
}

function computeNodes({ slots, realList, getKey }) {
  const normalizedList = realList || [];
  const [header, footer] = ["header", "footer"].map(name =>
    getSlot(slots, name)
  );
  
  const { item } = slots;
  console.log(item);
  if (!item) {
    throw new Error("draggable element must have an item slot");
  }
  const defaultNodes = normalizedList.flatMap((element, index) =>
    item({ element, index }).map(node => {
      node.key = getKey(element);
      node.props = { ...(node.props || {}), "data-draggable": true };
      return node;
    })
  );
  console.log(defaultNodes);
  
  if (defaultNodes.length !== normalizedList.length) {
    throw new Error("Item slot must have only one child");
  }
  return {
    header,
    footer,
    default: defaultNodes
  };
}

function getRootInformation(tag) {
  const transition = isTransition(tag);
  const externalComponent = !isHtmlTag(tag) && !transition;
  return {
    transition,
    externalComponent,
    tag: externalComponent
      ? resolveComponent(tag)
      : transition
      ? TransitionGroup
      : tag
  };
}

function computeComponentStructure({ slots, tag, realList, getKey }) {
  const nodes = computeNodes({ slots, realList, getKey });
  const root = getRootInformation(tag);
  console.log(nodes);
  
  return useComponentStructure({ nodes, root, realList });
}

export function useRenderHelper() {
  return {
    computeComponentStructure
  };
}
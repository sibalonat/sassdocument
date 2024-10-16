import Sortable from "sortablejs";
import { useHtmlHelper } from '../../src/Composables/Utils/HtmlHelper';
import {
  getComponentAttributes,
  createSortableOption,
  getValidSortableEntries
} from "../../src/Composables/Main/ComponentBuilder";
import { computeComponentStructure } from "../../src/Composables/Main/RenderHelper";
import { emitsArray } from "../../src/Composables/Main/SortableEvents";
import { h, defineComponent, nextTick, ref, computed, onMounted, onUpdated, onBeforeUnmount, watch, getCurrentInstance } from "vue";

// composables
const { insertNodeAt, removeNode } = useHtmlHelper();

const props = {
  list: {
    type: Array,
    required: false,
    default: null
  },
  modelValue: {
    type: Array,
    required: false,
    default: null
  },
  itemKey: {
    type: [String, Function],
    required: true
  },
  clone: {
    type: Function,
    default: original => {
      return original;
    }
  },
  tag: {
    type: String,
    default: "div"
  },
  move: {
    type: Function,
    default: null
  },
  componentData: {
    type: Object,
    required: false,
    default: null
  }
};

const emits = emitsArray;

export default defineComponent({
  name: "draggable",
  inheritAttrs: false,
  props,
  emits,
  setup(props, { emit, attrs, slots }) {
    
    const error = ref(false);
    const draggingElement = ref(null);
    const sortableInstance = ref(null);
    const targetDomElement = ref(null);
    const componentStructure = ref(null);

    const realList = computed(() => props.list || props.modelValue);

    const getKey = computed(() => {
      if (typeof props.itemKey === 'function') {
        return props.itemKey;
      }
      return element => element[props.itemKey];
    });

    function emitEvent(evtName, evtData) {
      nextTick(() => emit(evtName.toLowerCase(), evtData));
    }

    function manage(evtName) {
      return (evtData, originalElement) => {
        if (realList.value !== null) {
          return this[`onDrag${evtName}`](evtData, originalElement);
        }
      };
    }

    function manageAndEmit(evtName) {
      const delegateCallBack = manage(evtName);
      return (evtData, originalElement) => {
        delegateCallBack(evtData, originalElement);
        emitEvent(evtName, evtData);
      };
    }

    function getUnderlyingVm(domElement) {
      return componentStructure.value.getUnderlyingVm(domElement) || null;
    }

    function getUnderlyingPotencialDraggableComponent(htmElement) {
      return htmElement.__draggable_component__;
    }

    function emitChanges(evt) {
      nextTick(() => emit("change", evt));
    }

    function alterList(onList) {
      if (props.list) {
        onList(props.list);
        return;
      }
      const newList = [...props.modelValue];
      onList(newList);
      emit("update:modelValue", newList);
    }

    function spliceList(...args) {
      const spliceList = list => list.splice(...args);
      alterList(spliceList);
    }

    function updatePosition(oldIndex, newIndex) {
      const updatePosition = list => list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
      alterList(updatePosition);
    }

    function getRelatedContextFromMoveEvent({ to, related }) {
      const component = getUnderlyingPotencialDraggableComponent(to);
      if (!component) {
        return { component };
      }
      const list = component.realList;
      const context = { list, component };
      if (to !== related && list) {
        const destination = component.getUnderlyingVm(related) || {};
        return { ...destination, ...context };
      }
      return context;
    }

    function getVmIndexFromDomIndex(domIndex) {
      return componentStructure.value.getVmIndexFromDomIndex(domIndex, targetDomElement.value);
    }

    function onDragStart(evt) {
      const context = getUnderlyingVm(evt.item);
      evt.item._underlying_vm_ = props.clone(context.element);
      draggingElement.value = evt.item;
    }

    function onDragAdd(evt) {
      const element = evt.item._underlying_vm_;
      if (element === undefined) {
        return;
      }
      removeNode(evt.item);
      const newIndex = getVmIndexFromDomIndex(evt.newIndex);
      spliceList(newIndex, 0, element);
      const added = { element, newIndex };
      emitChanges({ added });
    }

    function onDragRemove(evt) {
      insertNodeAt(targetDomElement.value, evt.item, evt.oldIndex);
      if (evt.pullMode === "clone") {
        removeNode(evt.clone);
        return;
      }
      const { index: oldIndex, element } = context;
      spliceList(oldIndex, 1);
      const removed = { element, oldIndex };
      emitChanges({ removed });
    }

    function onDragUpdate(evt) {
      removeNode(evt.item);
      insertNodeAt(evt.from, evt.item, evt.oldIndex);
      const oldIndex = context.index;
      const newIndex = getVmIndexFromDomIndex(evt.newIndex);
      updatePosition(oldIndex, newIndex);
      const moved = { element: context.element, oldIndex, newIndex };
      emitChanges({ moved });
    }

    function computeFutureIndex(relatedContext, evt) {
      if (!relatedContext.element) {
        return 0;
      }
      const domChildren = [...evt.to.children].filter(el => el.style["display"] !== "none");
      const currentDomIndex = domChildren.indexOf(evt.related);
      const currentIndex = relatedContext.component.getVmIndexFromDomIndex(currentDomIndex);
      const draggedInList = domChildren.indexOf(draggingElement.value) !== -1;
      return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1;
    }

    function onDragMove(evt, originalEvent) {
      const { move, realList } = props;
      if (!move || !realList) {
        return true;
      }

      const relatedContext = getRelatedContextFromMoveEvent(evt);
      const futureIndex = computeFutureIndex(relatedContext, evt);
      const draggedContext = {
        ...context,
        futureIndex
      };
      const sendEvent = {
        ...evt,
        relatedContext,
        draggedContext
      };
      return move(sendEvent, originalEvent);
    }

    function onDragEnd() {
      draggingElement.value = null;
    }

    onMounted(() => {
      if (error.value) {
        return;
      }

      const { $el } = getCurrentInstance().proxy;
      
      targetDomElement.value = $el.nodeType === 1 ? $el : $el.parentElement;

      componentStructure.value = computeComponentStructure({
        slots,
        tag: props.tag,
        realList: realList.value,
        getKey: getKey.value
      });
      attributes.value = getComponentAttributes({ $attrs: attrs, componentData: props.componentData });

      sortableInstance.value = new Sortable(targetDomElement.value, createSortableOption({
        $attrs: attrs,
        callBackBuilder: {
          manageAndEmit: event => manageAndEmit(event),
          emit: event => emitEvent(event),
          manage: event => manage(event)
        }
      }));
      targetDomElement.value.__draggable_component__ = getCurrentInstance().proxy;
    });

    onUpdated(() => {
      componentStructure.value.updated();
    });

    onBeforeUnmount(() => {
      if (sortableInstance.value) sortableInstance.value.destroy();
    });

    watch(
      () => attrs,
      (newOptionValue) => {
        if (!sortableInstance.value) return;
        getValidSortableEntries(newOptionValue).forEach(([key, value]) => {
          sortableInstance.value.option(key, value);
        });
      },
      { deep: true }
    );

    function render() {
      try {
        error.value = false;
        const { slots, attrs, tag, componentData, realList, getKey } = getCurrentInstance().proxy;
        const componentStructure = computeComponentStructure({
          slots,
          tag,
          realList,
          getKey
        });
        componentStructure.value = componentStructure;
        const attributes = getComponentAttributes({ $attrs, componentData });
        return componentStructure.render(h, attributes);
      } catch (err) {
        error.value = true;
        return h("pre", { style: { color: "red" } }, err.stack);
      }
    }

    return {
      render,
      error,
      draggingElement,
      sortableInstance,
      targetDomElement,
      componentStructure,
      realList,
      getKey,
      emitEvent,
      manage,
      manageAndEmit,
      getUnderlyingVm,
      getUnderlyingPotencialDraggableComponent,
      emitChanges,
      alterList,
      spliceList,
      updatePosition,
      getRelatedContextFromMoveEvent,
      getVmIndexFromDomIndex,
      onDragStart,
      onDragAdd,
      onDragRemove,
      onDragUpdate,
      computeFutureIndex,
      onDragMove,
      onDragEnd
    };
  }
});
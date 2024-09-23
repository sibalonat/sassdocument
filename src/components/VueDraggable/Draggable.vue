<template>
  <div :is="tag" v-bind="attributes">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUpdated, onBeforeUnmount, nextTick, h } from 'vue';
import Sortable from 'sortablejs';
// import { insertNodeAt, removeNode } from './util/htmlHelper';
import { useHtmlHelper } from '../../Composables/Utils/Console';
import { console } from '../../Composables/Utils/Console';
import {
  getComponentAttributes,
  createSortableOption,
  getValidSortableEntries
} from './core/componentBuilderHelper';
import { computeComponentStructure } from './core/renderHelper';
import { events } from './core/sortableEvents';

// composables
const { insertNodeAt, removeNode } = useHtmlHelper();

const props = defineProps({
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
    default: original => original
  },
  tag: {
    type: String,
    default: 'div'
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
});

const emit = defineEmits([
  'update:modelValue',
  'change',
  ...[...events.manageAndEmit, ...events.emit].map(evt => evt.toLowerCase())
]);

const error = ref(false);
let draggingElement = null;
let sortableInstance = null;
let targetDomElement = null;
let componentStructure = null;

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
  return componentStructure.getUnderlyingVm(domElement) || null;
}

function getUnderlyingPotencialDraggableComponent(htmElement) {
  return htmElement.__draggable_component__;
}

function emitChanges(evt) {
  nextTick(() => emit('change', evt));
}

function alterList(onList) {
  if (props.list) {
    onList(props.list);
    return;
  }
  const newList = [...props.modelValue];
  onList(newList);
  emit('update:modelValue', newList);
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
  return componentStructure.getVmIndexFromDomIndex(domIndex, targetDomElement);
}

function onDragStart(evt) {
  const context = getUnderlyingVm(evt.item);
  evt.item._underlying_vm_ = props.clone(context.element);
  draggingElement = evt.item;
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
  insertNodeAt(targetDomElement, evt.item, evt.oldIndex);
  if (evt.pullMode === 'clone') {
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
  const domChildren = [...evt.to.children].filter(el => el.style['display'] !== 'none');
  const currentDomIndex = domChildren.indexOf(evt.related);
  const currentIndex = relatedContext.component.getVmIndexFromDomIndex(currentDomIndex);
  const draggedInList = domChildren.indexOf(draggingElement) !== -1;
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
  draggingElement = null;
}

onMounted(() => {
  if (error.value) {
    return;
  }

  const { $attrs, $el } = getCurrentInstance().proxy;
  componentStructure = computeComponentStructure({
    $slots,
    tag: props.tag,
    realList: realList.value,
    getKey: getKey.value
  });

  const attributes = getComponentAttributes({ $attrs, componentData: props.componentData });
  targetDomElement = $el.nodeType === 1 ? $el : $el.parentElement;
  sortableInstance = new Sortable(targetDomElement, createSortableOption({
    $attrs,
    callBackBuilder: {
      manageAndEmit: event => manageAndEmit(event),
      emit: event => emitEvent(event),
      manage: event => manage(event)
    }
  }));
  targetDomElement.__draggable_component__ = getCurrentInstance().proxy;
});

onUpdated(() => {
  componentStructure.updated();
});

onBeforeUnmount(() => {
  if (sortableInstance) sortableInstance.destroy();
});

watch(
  () => $attrs,
  (newOptionValue) => {
    if (!sortableInstance) return;
    getValidSortableEntries(newOptionValue).forEach(([key, value]) => {
      sortableInstance.option(key, value);
    });
  },
  { deep: true }
);
</script>
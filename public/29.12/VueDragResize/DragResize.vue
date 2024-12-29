<script setup>
import { useGridUtils } from '@/Composables/Ui/UseGridUtils';
// import { reactive } from 'vue';
import { 
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon
} from '@heroicons/vue/24/solid'
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, computed, watch, ref } from 'vue';

const { 
  isFunction, 
  snapToGrid, 
  getSize, 
  computeWidth, 
  computeHeight, 
  restrictToBounds, 
  matchesSelectorToParentElements, 
  getComputedSize, 
  addEvent, 
  removeEvent 
} = useGridUtils();
  
const events = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  }
}
  
const userSelectNone = {
  userSelect: 'none',
  MozUserSelect: 'none',
  WebkitUserSelect: 'none',
  MsUserSelect: 'none'
}

const userSelectAuto = {
  userSelect: 'auto',
  MozUserSelect: 'auto',
  WebkitUserSelect: 'auto',
  MsUserSelect: 'auto'
}

const handleIcons = {
  'tl': ArrowsPointingInIcon,
  'tr': ArrowsPointingInIcon,
  'bl': ArrowsPointingInIcon,
  'br': ArrowsPointingInIcon,
  'ml': ArrowsRightLeftIcon,
  'mr': ArrowsRightLeftIcon,
  'tm': ArrowsUpDownIcon,
  'bm': ArrowsUpDownIcon
}

let eventsFor = events.mouse

const props = defineProps({
  // elementRef: {
  //     type: Object,
  //     required: true
  // },
  className: {
      type: String,
      default: 'vdr'
  },

  classNameDraggable: {
      type: String,
      default: 'draggable'
  },

  classNameResizable: {
      type: String,
      default: 'resizable'
  },

  classNameDragging: {
      type: String,
      default: 'dragging'
  },

  classNameResizing: {
      type: String,
      default: 'resizing'
  },

  classNameActive: {
      type: String,
      default: 'active'
  },

  classNameHandle: {
      type: String,
      default: 'handle'
  },

  disableUserSelect: {
      type: Boolean,
      default: true
  },

  enableNativeDrag: {
      type: Boolean,
      default: false
  },

  preventDeactivation: {
      type: Boolean,
      default: false
  },

  active: {
      type: Boolean,
      default: false
  },

  draggable: {
      type: Boolean,
      default: true
  },

  resizable: {
      type: Boolean,
      default: true
  },

  lockAspectRatio: {
      type: Boolean,
      default: false
  },

  w: {
      type: [Number, String],
      default: 200,
      validator: (val) => {
          if (typeof val === 'number') {
              return val > 0
          }
          return val === 'auto'
      }
  },

  h: {
      type: [Number, String],
      default: 200,
      validator: (val) => {
          if (typeof val === 'number') {
              return val > 0
          }
          return val === 'auto'
      }
  },

  minWidth: {
      type: Number,
      default: 0,
      validator: (val) => val >= 0
  },

  minHeight: {
      type: Number,
      default: 0,
      validator: (val) => val >= 0
  },

  maxWidth: {
      type: Number,
      default: null,
      validator: (val) => val >= 0
  },

  maxHeight: {
      type: Number,
      default: null,
      validator: (val) => val >= 0
  },

  x: {
      type: Number,
      default: 0
  },

  y: {
      type: Number,
      default: 0
  },

  z: {
      type: [String, Number],
      default: 'auto',
      validator: (val) => (typeof val === 'string' ? val === 'auto' : val >= 0)
  },

  handles: {
      type: Array,
      default: () => ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
      validator: (val) => {
          const s = new Set(['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'])
          return new Set(val.filter(h => s.has(h))).size === val.length
      }
  },
  scale: {
      type: [Number, Array],
      default: 1,
      validator: (val) => {
          if (typeof val === 'number') {
              return val > 0
          }
          return val.length === 2 && val[0] > 0 && val[1] > 0
      }
  },

  onDragStart: {
      type: Function,
      default: () => true
  },

  onDrag: {
      type: Function,
      default: () => true
  },

  onResizeStart: {
      type: Function,
      default: () => true
  },

  onResize: {
      type: Function,
      default: () => true
  },

  dragHandle: {
      type: String,
      default: null
  },

  dragCancel: {
      type: String,
      default: null
  },

  axis: {
      type: String,
      default: 'both',
      validator: (val) => ['x', 'y', 'both'].includes(val)
  },

  grid: {
      type: Array,
      default: () => [1, 1]
  },

  parent: {
      type: Boolean,
      default: false
  },

  resizeAxis: {
    type: String,
    default: 'both',
    validator: (val) => ['x', 'y', 'both'].includes(val)
  },
})

const emit = defineEmits([
  'activated', 
  'update:active', 
  'deactivated', 
  'dragging', 
  'resizeStop', 
  'dragStop', 
  'resizing'
]);
  
// data
const state = reactive({
  left: props.x,
  top: props.y,
  right: null,
  bottom: null,
  width: null,
  height: null,
  widthTouched: false,
  heightTouched: false,
  aspectFactor: null,
  parentWidth: null,
  parentHeight: null,
  handle: null,
  enabled: props.active,
  resizing: false,
  dragging: false,
  dragEnable: false,
  resizeEnable: false,
  zIndex: props.z,
  bounds: {
    minLeft: null,
    maxLeft: null,
    minRight: null,
    maxRight: null,
    minTop: null,
    maxTop: null,
    minBottom: null,
    maxBottom: null
  }
});

// Remove mouseClickPosition from state and make it a ref
const mousePosition = ref({
  mouseX: 0,
  mouseY: 0,
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  width: 0,
  height: 0
});

const element = ref(null);
const minW = ref(props.minWidth);
const minH = ref(props.minHeight);
const maxW = ref(props.maxWidth);
const maxH = ref(props.maxHeight);

// computed
const style = computed(() => ({
  transform: `translate(${state.left}px, ${state.top}px)`,
  width: computedWidth.value,
  height: computedHeight.value,
  zIndex: state.zIndex,
  ...(state.dragging && props.disableUserSelect ? userSelectNone : userSelectAuto)
}));

const actualHandles = computed(() => {
  if (!props.resizable) return [];
  return props.handles;
});

const computedWidth = computed(() => {
  if (props.w === 'auto') {
    if (!state.widthTouched) {
      return 'auto';
    }
  }
  return state.width + 'px';
});

const computedHeight = computed(() => {
  if (props.h === 'auto') {
    if (!state.heightTouched) {
      return 'auto';
    }
  }
  return state.height + 'px';
});

const resizingOnX = computed(() => Boolean(state.handle) && (state.handle.includes('l') || state.handle.includes('r')));
const resizingOnY = computed(() => Boolean(state.handle) && (state.handle.includes('t') || state.handle.includes('b')));
const isCornerHandle = computed(() => Boolean(state.handle) && ['tl', 'tr', 'br', 'bl'].includes(state.handle));

// const mouseClickPosition = ref({ mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 })

// methods
const resetBoundsAndMouseState = () => {
  mousePosition.value = {
    mouseX: 0,
    mouseY: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: 0,
    height: 0
  };
  
  state.bounds = {
    minLeft: null,
    maxLeft: null,
    minRight: null,
    maxRight: null,
    minTop: null,
    maxTop: null,
    minBottom: null,
    maxBottom: null
  };
};

const checkParentSize = () => {
  if (props.parent) {
    const [newParentWidth, newParentHeight, parentLeft, parentTop] = getParentSize();
    state.parentWidth = newParentWidth;
    state.parentHeight = newParentHeight;
    state.parentLeft = parentLeft;
    state.parentTop = parentTop;
    state.right = state.parentWidth - state.width - state.left;
    state.bottom = state.parentHeight - state.height - state.top;
  }
};

const getParentSize = () => {
  if (props.parent) {
    const parent = element.value.parentNode;
    const style = window.getComputedStyle(parent, null);
    const rect = parent.getBoundingClientRect();
    return [
      parseInt(style.getPropertyValue('width'), 10),
      parseInt(style.getPropertyValue('height'), 10),
      rect.left,
      rect.top
    ];
  }
  return [null, null, null, null];
};


const elementTouchDown = (e) => {
  eventsFor = events.touch;
  elementDown(e);
};

const elementMouseDown = (e) => {
  eventsFor = events.mouse;
  elementDown(e);
};

const updateMousePosition = (e) => {
  const clientX = Number(e.clientX || (e.touches && e.touches[0].clientX));
  const clientY = Number(e.clientY || (e.touches && e.touches[0].clientY));
  
  // Create a new object to ensure the ref is updated
  mousePosition.value = {
    mouseX: clientX,
    mouseY: clientY,
    left: state.left,
    right: state.right,
    top: state.top,
    bottom: state.bottom,
    width: state.width,
    height: state.height
  };
};

const elementDown = (e) => {
  console.log('Element down:', e); // Debug
  
  if (e instanceof MouseEvent && e.button !== 0) {
    return;
  }
  const target = e.target || e.srcElement;
  if (element.value.contains(target)) {
    if (props.onDragStart(e) === false) {
      return;
    }
    if (
      (props.dragHandle && !matchesSelectorToParentElements(target, props.dragHandle, element.value)) ||
      (props.dragCancel && matchesSelectorToParentElements(target, props.dragCancel, element.value))
    ) {
      state.dragging = false;
      return;
    }
    if (!state.enabled) {
      state.enabled = true;
      emit('activated');
      emit('update:active', true);
    }
    if (props.draggable) {
      state.dragEnable = true;
      updateMousePosition(e);
    }
    if (props.parent) {
      state.bounds = calcDragLimits();
    }
    addEvent(document.documentElement, eventsFor.move, move);
    addEvent(document.documentElement, eventsFor.stop, handleUp);
  }
};

const calcDragLimits = () => ({
  minLeft: state.left % props.grid[0],
  maxLeft: Math.floor((state.parentWidth - state.width - state.left) / props.grid[0]) * props.grid[0] + state.left,
  minRight: state.right % props.grid[0],
  maxRight: Math.floor((state.parentWidth - state.width - state.right) / props.grid[0]) * props.grid[0] + state.right,
  minTop: state.top % props.grid[1],
  maxTop: Math.floor((state.parentHeight - state.height - state.top) / props.grid[1]) * props.grid[1] + state.top,
  minBottom: state.bottom % props.grid[1],
  maxBottom: Math.floor((state.parentHeight - state.height - state.bottom) / props.grid[1]) * props.grid[1] + state.bottom
});

const calcResizeLimits = () => {
  console.log('minW', minW.value);
  
  // let minW = minW.value;
  // let minH = minH.value;
  // let maxW = maxW.value;
  // let maxH = maxH.value;
  const aspectFactor = state.aspectFactor;
  const [gridX, gridY] = props.grid;
  const width = state.width;
  const height = state.height;
  const left = state.left;
  const top = state.top;
  const right = state.right;
  const bottom = state.bottom;
  if (props.lockAspectRatio) {
    if (minW.value / minH.value > aspectFactor) {
      minH.value = minW.value / aspectFactor;
    } else {
      minW.value = aspectFactor * minH.value;
    }
    if (maxW.value && maxH.value) {
      maxW.value = Math.min(maxW.value, aspectFactor * maxH.value);
      maxH.value = Math.min(maxH.value, maxW.value / aspectFactor);
    } else if (maxW.value) {
      maxH.value = maxW.value / aspectFactor;
    } else if (maxH.value) {
      maxW.value = aspectFactor * maxH.value;
    }
  }
  maxW.value = maxW.value - (maxW.value % gridX);
  maxH.value = maxH.value - (maxH.value % gridY);
  const limits = {
    minLeft: null,
    maxLeft: null,
    minTop: null,
    maxTop: null,
    minRight: null,
    maxRight: null,
    minBottom: null,
    maxBottom: null
  };
  if (props.parent) {
    limits.minLeft = left % gridX;
    limits.maxLeft = left + Math.floor((width - minW.value) / gridX) * gridX;
    limits.minTop = top % gridY;
    limits.maxTop = top + Math.floor((height - minH.value) / gridY) * gridY;
    limits.minRight = right % gridX;
    limits.maxRight = right + Math.floor((width - minW.value) / gridX) * gridX;
    limits.minBottom = bottom % gridY;
    limits.maxBottom = bottom + Math.floor((height - minH.value) / gridY) * gridY;
    if (maxW.value) {
      limits.minLeft = Math.max(limits.minLeft, state.parentWidth - right - maxW.value);
      limits.minRight = Math.max(limits.minRight, state.parentWidth - left - maxW.value);
    }
    if (maxH) {
      limits.minTop = Math.max(limits.minTop, state.parentHeight - bottom - maxH.value);
      limits.minBottom = Math.max(limits.minBottom, state.parentHeight - top - maxH.value);
    }
    if (props.lockAspectRatio) {
      limits.minLeft = Math.max(limits.minLeft, left - top * aspectFactor);
      limits.minTop = Math.max(limits.minTop, top - left / aspectFactor);
      limits.minRight = Math.max(limits.minRight, right - bottom * aspectFactor);
      limits.minBottom = Math.max(limits.minBottom, bottom - right / aspectFactor);
    }
  } else {
    limits.minLeft = null;
    limits.maxLeft = left + Math.floor((width - minW.value) / gridX) * gridX;
    limits.minTop = null;
    limits.maxTop = top + Math.floor((height - minH.value) / gridY) * gridY;
    limits.minRight = null;
    limits.maxRight = right + Math.floor((width - minW.value) / gridX) * gridX;
    limits.minBottom = null;
    limits.maxBottom = bottom + Math.floor((height - minH.value) / gridY) * gridY;
    if (maxW.value) {
      limits.minLeft = -(right + maxW.value);
      limits.minRight = -(left + maxW.value);
    }
    if (maxH.value) {
      limits.minTop = -(bottom + maxH);
      limits.minBottom = -(top + maxH);
    }
    if (props.lockAspectRatio && (maxW.value && maxH.value)) {
      limits.minLeft = Math.min(limits.minLeft, -(right + maxW.value));
      limits.minTop = Math.min(limits.minTop, -(maxH.value + bottom));
      limits.minRight = Math.min(limits.minRight, -left - maxW.value);
      limits.minBottom = Math.min(limits.minBottom, -top - maxH.value);
    }
  }
  return limits;
};

const deselect = (e) => {
  const target = e.target || e.srcElement;
  const regex = new RegExp(props.className + '-([trmbl]{2})', '');
  if (!element.value.contains(target) && !regex.test(target.className)) {
    if (state.enabled && !props.preventDeactivation) {
      state.enabled = false;
      emit('deactivated');
      emit('update:active', false);
    }
    removeEvent(document.documentElement, eventsFor.move, handleResize);
  }
  resetBoundsAndMouseState();
};

const handleTouchDown = (handle, e) => {
  eventsFor = events.touch;
  handleDown(handle, e);
};

const handleDown = (handle, e) => {
  if (e instanceof MouseEvent && e.which !== 1) {
    return;
  }
  
  if (props.onResizeStart(handle, e) === false) {
    return;
  }
  
  if (e.stopPropagation) e.stopPropagation();
  
  // Initialize current dimensions if they're not set
  if (!state.width || !state.height) {
    const [width, height] = getComputedSize(element.value);
    state.width = width;
    state.height = height;
    state.right = state.parentWidth - width - state.left;
    state.bottom = state.parentHeight - height - state.top;
  }
  
  if (props.lockAspectRatio && !handle.includes('m')) {
    state.handle = 'm' + handle.substring(1);
  } else {
    state.handle = handle;
  }
  
  state.resizing = true;
  state.resizeEnable = true;
  
  // Store initial positions and current dimensions
  const clientX = Number(e.clientX || (e.touches && e.touches[0].clientX));
  const clientY = Number(e.clientY || (e.touches && e.touches[0].clientY));
  mousePosition.value = {
    mouseX: clientX,
    mouseY: clientY,
    left: state.left,
    right: state.right,
    top: state.top,
    bottom: state.bottom,
    width: state.width,
    height: state.height
  };
  
  state.bounds = calcResizeLimits();
  
  addEvent(document.documentElement, eventsFor.move, handleResize);
  addEvent(document.documentElement, eventsFor.stop, handleUp);
};

const move = (e) => {
  if (state.resizing) {
    handleResize(e);
  } else if (state.dragEnable) {
    handleDrag(e);
  }
};

const handleUp = (e) => {
  if (e.touches && e.touches.length > 1) {
    return;
  }
  if (state.resizing) {
    emit('resizeStop', state.left, state.top, state.width, state.height);
  } else if (state.dragging) {
    emit('dragStop', state.left, state.top);
  }
  state.resizing = false;
  state.dragEnable = false;
  state.dragging = false;
  removeEvent(document.documentElement, eventsFor.move, move);
  removeEvent(document.documentElement, eventsFor.stop, handleUp);
  resetBoundsAndMouseState();
};

const handleDrag = (e) => {
    const axis = props.axis;
    const grid = props.grid;
    const bounds = state.bounds;

    const tmpDeltaX = axis && axis !== 'y' ? mousePosition.value.mouseX - (e.touches ? e.touches[0].pageX : e.pageX) : 0;
    const tmpDeltaY = axis && axis !== 'x' ? mousePosition.value.mouseY - (e.touches ? e.touches[0].pageY : e.pageY) : 0;

    const [deltaX, deltaY] = snapToGrid(grid, tmpDeltaX, tmpDeltaY, props.scale);

    const left = restrictToBounds(mousePosition.value.left - deltaX, bounds.minLeft, bounds.maxLeft);
    const top = restrictToBounds(mousePosition.value.top - deltaY, bounds.minTop, bounds.maxTop);

    if (props.onDrag(left, top) === false) {
        return;
    }

    const right = restrictToBounds(
      mousePosition.value.right + deltaX, 
      bounds.minRight, 
      bounds.maxRight
    );
    const bottom = restrictToBounds(
      mousePosition.value.bottom + deltaY, 
      bounds.minBottom,
      bounds.maxBottom
    );

    state.left = left;
    state.top = top;
    state.right = right;
    state.bottom = bottom;

    emit('dragging', state.left, state.top);
    state.dragging = true;
};

const moveHorizontally = (val) => {
    const [deltaX, _] = snapToGrid(
      props.grid, val, state.top, 1
    );
    const left = restrictToBounds(deltaX, state.bounds.minLeft, state.bounds.maxLeft);

    state.left = left;
    state.right = state.parentWidth - state.width - left;
};

const moveVertically = (val) => {
    const [_, deltaY] = snapToGrid(props.grid, state.left, val, 1);

    const top = restrictToBounds(deltaY, state.bounds.minTop, state.bounds.maxTop);

    state.top = top;
    state.bottom = state.parentHeight - state.height - top;
};

const handleResize = (e) => {
  if (!state.resizing) return;

  let left = state.left;
  let top = state.top;
  let right = state.right;
  let bottom = state.bottom;

  const tmpDeltaX = mousePosition.value.mouseX - (e.touches ? e.touches[0].pageX : e.pageX);
  const tmpDeltaY = mousePosition.value.mouseY - (e.touches ? e.touches[0].pageY : e.pageY);

  const [deltaX, deltaY] = snapToGrid(props.grid, tmpDeltaX, tmpDeltaY, props.scale);

  if (props.resizeAxis !== 'x') {
    if (state.handle.includes('b')) {
      bottom = restrictToBounds(mousePosition.value.bottom + deltaY, state.bounds.minBottom, state.bounds.maxBottom);
    } else if (state.handle.includes('t')) {
      top = restrictToBounds(mousePosition.value.top - deltaY, state.bounds.minTop, state.bounds.maxTop);
    }
  }

  if (props.resizeAxis !== 'y') {
    if (state.handle.includes('r')) {
      right = restrictToBounds(mousePosition.value.right + deltaX, state.bounds.minRight, state.bounds.maxRight);
    } else if (state.handle.includes('l')) {
      left = restrictToBounds(mousePosition.value.left - deltaX, state.bounds.minLeft, state.bounds.maxLeft);
    }
  }

  const width = computeWidth(state.parentWidth, left, right);
  const height = computeHeight(state.parentHeight, top, bottom);

  if (props.onResize(state.handle, left, top, width, height) === false) {
    return;
  }

  state.left = left;
  state.top = top;
  state.right = right;
  state.bottom = bottom;
  state.width = width;
  state.height = height;

  emit('resizing', state.left, state.top, state.width, state.height);
};

const changeWidth = (val) => {
    const [newWidth, _] = snapToGrid(props.grid, val, 0, 1);

    const right = restrictToBounds(state.parentWidth - newWidth - state.left, state.bounds.minRight, state.bounds.maxRight);
    let bottom = state.bottom;

    if (props.lockAspectRatio) {
        bottom = state.bottom - (state.right - right) / state.aspectFactor;
    }

    const width = computedWidth(state.parentWidth, state.left, right);
    const height = computedHeight(state.parentHeight, state.top, bottom);

    state.right = right;
    state.bottom = bottom;
    state.width = width;
    state.height = height;
};

const changeHeight = (val) => {
    const [_, newHeight] = snapToGrid(props.grid, 0, val, 1);

    const bottom = restrictToBounds(state.parentHeight - newHeight - state.top, state.bounds.minBottom, state.bounds.maxBottom);
    let right = state.right;

    if (props.lockAspectRatio) {
        right = state.right - (state.bottom - bottom) * state.aspectFactor;
    }

    const width = computeWidth(state.parentWidth, state.left, right);
    const height = computeHeight(state.parentHeight, state.top, bottom);

    state.right = right;
    state.bottom = bottom;
    state.width = width;
    state.height = height;
};

const getHandleStyle = (handle) => ({
  position: 'absolute',
  width: '16px', 
  height: '16px',
  cursor: 'pointer',
  ...(handle.includes('t') && { top: '-8px' }),
  ...(handle.includes('b') && { bottom: '-8px' }),
  ...(handle.includes('l') && { left: '-8px' }),
  ...(handle.includes('r') && { right: '-8px' }),
  ...(handle.includes('m') && { 
    [handle.includes('t') || handle.includes('b') ? 'left' : 'top']: 'calc(50% - 8px)'
  })
})

// hooks
onBeforeMount(() => {
    // eslint-disable-next-line
    if (props.maxWidth && props.minWidth > props.maxWidth) console.warn('[Vdr warn]: Invalid prop: minWidth cannot be greater than maxWidth')
    // eslint-disable-next-line
    if (props.maxHeight && props.minHeight > props.maxHeight) console.warn('[Vdr warn]: Invalid prop: minHeight cannot be greater than maxHeight')

    resetBoundsAndMouseState()
})

onMounted(() => {
  console.log(props.className);
  
  const el = element.value;
  if (!props.enableNativeDrag) {
    el.ondragstart = () => false;
  }

  const [parentWidth, parentHeight, parentLeft, parentTop] = getParentSize();

  state.parentWidth = parentWidth;
  state.parentHeight = parentHeight;
  state.parentLeft = parentLeft;
  state.parentTop = parentTop;

  const [width, height] = getComputedSize(element.value);
  
  // Ensure initial dimensions are set
  state.width = props.w !== 'auto' ? props.w : width;
  state.height = props.h !== 'auto' ? props.h : height;
  state.aspectFactor = state.width / state.height;
  state.right = parentWidth - state.width - state.left;
  state.bottom = parentHeight - state.height - state.top;

  if (props.active) {
    emit('activated');
  }

  addEvent(
    document.documentElement, 'mousedown', deselect
  )

  addEvent(
    document.documentElement, 'touchend touchcancel', deselect
  )
  addEvent(window, 'resize', checkParentSize)
})


onBeforeUnmount(() => {
    removeEvent(document.documentElement, 'mousedown', deselect)
    removeEvent(document.documentElement, 'touchstart', handleUp)
    removeEvent(document.documentElement, 'mousemove', move)
    removeEvent(document.documentElement, 'touchmove', move)
    removeEvent(document.documentElement, 'mouseup', handleUp)
    removeEvent(document.documentElement, 'touchend touchcancel', deselect)

    removeEvent(window, 'resize', checkParentSize)
})

// watch
watch(() => props.active, (val) => {
    state.enabled = val;

    if (val) {
        emit('activated');
    } else {
        emit('deactivated');
    }
});

watch(() => props.z, (val) => {
    if (val >= 0 || val === 'auto') {
        state.zIndex = val;
    }
});

watch(() => props.x, (val) => {
    if (state.resizing || state.dragging) {
        return;
    }

    if (props.parent) {
        state.bounds = calcDragLimits();
    }

    moveHorizontally(val);
});

watch(() => props.y, (val) => {
    if (state.resizing || state.dragging) {
        return;
    }

    if (props.parent) {
        state.bounds = calcDragLimits();
    }

    moveVertically(val);
});

watch(() => props.lockAspectRatio, (val) => {
    if (val) {
        state.aspectFactor = state.width / state.height;
    } else {
        state.aspectFactor = undefined;
    }
});

watch(() => props.w, (val) => {
    if (state.resizing || state.dragging) {
        return;
    }

    if (props.parent) {
        state.bounds = calcResizeLimits();
    }

    changeWidth(val);
});

watch(() => props.h, (val) => {
    if (state.resizing || state.dragging) {
        return;
    }

    if (props.parent) {
        state.bounds = calcResizeLimits();
    }

    changeHeight(val);
});

watch(
  () => props.minWidth, (val) => minW.value = val
);

watch(
  () => props.minHeight, (val) => minH.value = val
);

watch(
  () => props.maxWidth, (val) => maxW.value = val
);

watch((
) => props.maxHeight, (val) => maxH.value = val);
</script>

<template>
  <div
    ref="element"
    :style="style"
    :class="[{
      [props.classNameActive]: state.enabled,
      [props.classNameDragging]: state.dragging,
      [props.classNameResizing]: state.resizing,
      [props.classNameDraggable]: props.draggable,
      [props.classNameResizable]: props.resizable
    }, props.className]"
    @mousedown="elementMouseDown"
    @touchstart="elementTouchDown"
  >
    <div
      v-for="handle in actualHandles"
      :key="handle"
      :class="[props.classNameHandle, props.classNameHandle + '-' + handle]"
      :style="{display: state.enabled ? 'block' : 'none'}"
      @mousedown.stop.prevent="handleDown(handle, $event)"
      @touchstart.stop.prevent="handleTouchDown(handle, $event)"
    >
    <slot :name="handle"></slot>
    </div>    
    <slot></slot>
  </div>
  <!-- <div ref="element" :style="style" :class="[...]">
    <component
      v-for="handle in actualHandles"
      :key="handle" 
      :is="handleIcons[handle]"
      :style="getHandleStyle(handle)"
      :class="[props.classNameHandle, props.classNameHandle + '-' + handle]"
      @mousedown.stop.prevent="handleDown(handle, $event)"
      @touchstart.stop.prevent="handleTouchDown(handle, $event)"
    />
    <slot></slot>
  </div> -->
</template>

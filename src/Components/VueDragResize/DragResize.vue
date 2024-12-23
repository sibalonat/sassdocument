<script setup>
import { useGridUtils } from '@/Composables/Ui/UseGridUtils';
import { onBeforeMount, onBeforeUnmount, onMounted } from 'vue';

  
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
  
  let eventsFor = events.mouse

  const props = defineProps({
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
    draggHandle: {
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
  })
  
  // data
    const left = ref(props.x)
    const top = ref(props.y)
    const right = ref(null)
    const bottom = ref(null)

    const width = ref(null)
    const height = ref(null)

    const widthTouched = ref(false)
    const heightTouched = ref(false)

    const aspectFactor = ref(null)

    const parentWidth = ref(null)
    const parentHeight = ref(null)

    const handle = ref(null)
    const enabled = ref(props.active)
    const resizing = ref(false)
    const dragging = ref(false)
    const dragEnable = ref(false)
    const resizeEnable = ref(false)
    const zIndex = ref(props.z)

    // const mouseClickPosition = ref({ mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 })
    // hooks
    onBeforeMount(() => {
        // eslint-disable-next-line
        if (props.maxWidth && props.minWidth > props.maxWidth) console.warn('[Vdr warn]: Invalid prop: minWidth cannot be greater than maxWidth')
        // eslint-disable-next-line
        if (props.maxHeight && props.minHeight > props.maxHeight) console.warn('[Vdr warn]: Invalid prop: minHeight cannot be greater than maxHeight')
    
        resetBoundsAndMouseState()
    })

    onMounted(() => {
        if (!props.enableNativeDrag) {
            // $el.ondragstart = () => false
        }
    
        const [parentWidth, parentHeight] = getParentSize()
    
        parentWidth.value = parentWidth
        parentHeight.value = parentHeight
    
        const [width, height] = getComputedSize(element.value)
    
        aspectFactor.value = (props.w !== 'auto' ? props.w : width) / (props.h !== 'auto' ? props.h : height)
    
        width.value = props.w !== 'auto' ? props.w : width
        height.value = props.h !== 'auto' ? props.h : height
    
        right.value = parentWidth - width - left
        bottom.value = parentHeight - height - top
    
        if (props.active) {
            // $emit('activated')
        }
    
        addEvent(document.documentElement, 'mousedown', deselect)
        addEvent(document.documentElement, 'touchend touchcancel', deselect)
    
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

    // methods
    const resetBoundsAndMouseState = () => {
        // mouseClickPosition.value = { mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 }
    
        bounds.value = {
            minLeft: null,
            maxLeft: null,
            minRight: null,
            maxRight: null,
            minTop: null,
            maxTop: null,
            minBottom: null,
            maxBottom: null
        }
    }

    const checkParentSize = () => {
        if (props.parent) {
            const [newParentWidth, newParentHeight] = getParentSize()
    
            parentWidth.value = newParentWidth
            parentHeight.value = newParentHeight
            right.value = parentWidth - width - left
            bottom.value = parentHeight - height - top
        }
    }

    const getParentSize = () => {
        if (props.parent) {
            const style = window.getComputedStyle(element.value.parentNode, null)
    
            return [
                parseInt(style.getPropertyValue('width'), 10),
                parseInt(style.getPropertyValue('height'), 10)
            ]
        }
    
        return [null, null]
    }

    const elementTouchDown = (e) => {
        eventsFor = events.touch
    
        elementDown(e)
    }

    const elementMouseDown = (e) => {
        eventsFor = events.mouse
    
        elementDown(e)
    }

    const elementDown = (e) => {
        if (e instanceof MouseEvent && e.button !== 0) {
            return
        }
    
        const target = e.target || e.srcElement
    
        if (element.value.contains(target)) {
            if (props.onDragStart(e) === false) {
                return
            }
    
            if (
                (props.dragHandle && !matchesSelectorToParentElements(target, props.dragHandle, element.value)) ||
                (props.dragCancel && matchesSelectorToParentElements(target, props.dragCancel, element.value))
            ) {
                dragging.value = false
    
                return
            }
    
            if (!enabled.value) {
                enabled.value = true
    
                // $emit('activated')
            }
    
            if (props.draggable) {
                dragEnable.value = true
            }
    
            // mouseClickPosition.value.mouseX = e.touches ? e.touches[0].pageX : e.pageX
            // mouseClickPosition.value.mouseY = e.touches ? e.touches[0].pageY : e.pageY
    
            // mouseClickPosition.value.left = left.value
            // mouseClickPosition.value.right = right.value
            // mouseClickPosition.value.top = top.value
            // mouseClickPosition.value.bottom = bottom.value
    
            if (props.parent) {
                bounds.value = calcDragLimits()
            }
    
            addEvent(document.documentElement, eventsFor.move, move)
            addEvent(document.documentElement, eventsFor.stop, handleUp)
        }
    }

    const calcDragLimits = () => {
        return {
            minLeft: left.value % props.grid[0],
            maxLeft: Math.floor((parentWidth.value - width.value - left.value) / props.grid[0]) * props.grid[0] + left.value,
            minRight: right.value % props.grid[0],
            maxRight: Math.floor((parentWidth.value - width.value - right.value) / props.grid[0]) * props.grid[0] + right.value,
            minTop: top.value % props.grid[1],
            maxTop: Math.floor((parentHeight.value - height.value - top.value) / props.grid[1]) * props.grid[1] + top.value,
            minBottom: bottom.value % props.grid[1],
            maxBottom: Math.floor((parentHeight.value - height.value - bottom.value) / props.grid[1]) * props.grid[1] + bottom.value
        }
    }

    const deselect = (e) => {
        const target = e.target || e.srcElement
        const regex = new RegExp(props.className + '-([trmbl]{2})', '')
    
        if (!element.value.contains(target) && !regex.test(target.className)) {
            if (enabled.value && !props.preventDeactivation) {
                enabled.value = false
    
                // $emit('deactivated')
            }
    
            removeEvent(document.documentElement, eventsFor.move, handleResize)
        }
    
        resetBoundsAndMouseState()
    }

    const handleTouchDown = (handle, e) => {
        eventsFor = events.touch
    
        handleDown(handle, e)
    }

    const handleDown = (handle, e) => {
        if (e instanceof MouseEvent && e.which !== 1) {
            return
        }
    
        if (props.onResizeStart(handle, e) === false) {
            return
        }
    
        if (e.stopPropagation) e.stopPropagation()
    
        // Here we avoid a dangerous recursion by faking
        // corner handles as middle handles
        if (props.lockAspectRatio && !handle.includes('m')) {
            handle = 'm' + handle.substring(1)
        } else {
            handle = handle
        }
    
        handle.value = handle
    
        resizeEnable.value = true
    
        // mouseClickPosition.value.mouseX = e.touches ? e.touches[0].pageX : e.pageX
        // mouseClickPosition.value.mouseY = e.touches ? e.touches[0].pageY : e.pageY
        // mouseClickPosition.value.left = left.value
        // mouseClickPosition.value.right = right.value
        // mouseClickPosition.value.top = top.value
        // mouseClickPosition.value.bottom = bottom.value
    
        bounds.value = calcResizeLimits()
    
        addEvent(document.documentElement, eventsFor.move, handleResize)
        addEvent(document.documentElement, eventsFor.stop, handleUp)
    }

    const calcResizeLimits = () => {
        let minW = props.minW
        let minH = props.minH
        let maxW = props.maxW
        let maxH = props.maxH
    
        const aspectFactor = aspectFactor.value
        const [gridX, gridY] = props.grid
        const width = width.value
        const height = height.value
        const left = left.value
        const top = top.value
        const right = right.value
        const bottom = bottom.value
    
        if (props.lockAspectRatio) {
            if (minW / minH > aspectFactor) {
                minH = minW / aspectFactor
            } else {
                minW = aspectFactor * minH
            }
    
            if (maxW && maxH) {
                maxW = Math.min(maxW, aspectFactor * maxH)
                maxH = Math.min(maxH, maxW / aspectFactor)
            } else if (maxW) {
                maxH = maxW / aspectFactor
            } else if (maxH) {
                maxW = aspectFactor * maxH
            }
        }
    
        maxW = maxW - (maxW % gridX)
        maxH = maxH - (maxH % gridY)
    
        const limits = {
            minLeft: null,
            maxLeft: null,
            minTop: null,
            maxTop: null,
            minRight: null,
            maxRight: null,
            minBottom: null,
            maxBottom: null
        }
    
        if (props.parent) {
            limits.minLeft = left % gridX
            limits.maxLeft = left + Math.floor((width - minW) / gridX) * gridX
            limits.minTop = top % gridY
            limits.maxTop = top + Math.floor((height - minH) / gridY) * gridY
            limits.minRight = right % gridX
            limits.maxRight = right + Math.floor((width - minW) / gridX) * gridX
            limits.minBottom = bottom % gridY
            limits.maxBottom = bottom + Math.floor((height - minH) / gridY) * gridY
    
            if (maxW) {
                limits.minLeft = Math.max(limits.minLeft, parentWidth.value - right - maxW)
                limits.minRight = Math.max(limits.minRight, parentWidth.value - left - maxW)
            } 

            if (maxH) {
                limits.minTop = Math.max(limits.minTop, parentHeight.value - bottom - maxH)
                limits.minBottom = Math.max(limits.minBottom, parentHeight.value - top - maxH)
            }

            if (props.lockAspectRatio) {
                limits.minLeft = Math.max(limits.minLeft, left - top * aspectFactor)
                limits.minTop = Math.max(limits.minTop, top - left / aspectFactor)
                limits.minRight = Math.max(limits.minRight, right - bottom * aspectFactor)
                limits.minBottom = Math.max(limits.minBottom, bottom - right / aspectFactor)
            }

        } else {
            limits.minLeft = null
            limits.maxLeft = left + Math.floor((width - minW) / gridX) * gridX
            limits.minTop = null
            limits.maxTop = top + Math.floor((height - minH) / gridY) * gridY
            limits.minRight = null
            limits.maxRight = right + Math.floor((width - minW) / gridX) * gridX
            limits.minBottom = null
            limits.maxBottom = bottom + Math.floor((height - minH) / gridY) * gridY
    
            if (maxW) {
                limits.minLeft = -(right + maxW)
                limits.minRight = -(left + maxW)
            }
    
            if (maxH) {
                limits.minTop = -(bottom + maxH)
                limits.minBottom = -(top + maxH)
            }
    
            if (props.lockAspectRatio && (maxW && maxH)) {
                limits.minLeft = Math.min(limits.minLeft, -(right + maxW))
                limits.minTop = Math.min(limits.minTop, -(maxH + bottom))
                limits.minRight = Math.min(limits.minRight, -left - maxW)
                limits.minBottom = Math.min(limits.minBottom, -top - maxH)
            }
        }
    }

    const handleResize = (e) => {
        if (e.touches && e.touches.length > 1) {
            return
        }
    
        if (props.onResize(e) === false) {
            return
        }
    
        if (e.preventDefault) e.preventDefault()
    
        const x = e.touches ? e.touches[0].pageX : e.pageX
        const y = e.touches ? e.touches[0].pageY : e.pageY
    
        const deltaX = x - mouseClickPosition.value.mouseX
        const deltaY = y - mouseClickPosition.value.mouseY
    
        const [gridX, gridY] = props.grid
    
        if (props.lockAspectRatio) {
            if (handle.value === 'tl') {
                if (deltaX > deltaY) {
                    deltaX = deltaY
                } else {
                    deltaY = deltaX
                }
            } else if (handle.value === 'tr') {
                if (-deltaX > deltaY) {
                    deltaX = -deltaY
                } else {
                    deltaY = -deltaX
                }
            } else if (handle.value === 'bl') {
                if (deltaX > -deltaY) {
                    deltaX = -deltaY
                } else {
                    deltaY = -deltaX
                }
            } else if (handle.value === 'br') {
                if (-deltaX > -deltaY) {
                    deltaX = deltaY
                } else {
                    deltaY = deltaX
                }
            }
        }
    
        if (handle.value.includes('t')) {
            if (top.value + deltaY < bounds.value.minTop) {
                deltaY = bounds.value.minTop - top.value
            } else if (top.value + deltaY > bounds.value.maxTop) {
                deltaY = bounds.value.maxTop - top.value
            }
        } else if (handle.value.includes('b')) {
            if (bottom.value - deltaY < bounds.value.minBottom) {
                deltaY = bottom.value - bounds.value.minBottom
            } else if (bottom.value - deltaY > bounds.value.maxBottom) {
                deltaY = bottom.value - bounds.value.maxBottom
            }
        }
    
        if (handle.value.includes('l')) {
            if (left.value + deltaX < bounds.value.minLeft) {
                deltaX = bounds.value.minLeft - left.value
            } else if (left.value + deltaX > bounds.value.maxLeft) {
                deltaX = bounds.value.maxLeft - left.value
            } 
        } else if (handle.value.includes('r')) {
            if (right.value - deltaX < bounds.value.minRight) {
                deltaX = right.value - bounds.value.minRight
            } else if (right.value - deltaX > bounds.value.maxRight) {
                deltaX = right.value - bounds.value.maxRight
            }
        } 
    }

    const handleUp = (e) => {
        if (e.touches && e.touches.length > 1) {
            return
        }
    
        if (props.onResize(e) === false) {
            return
        }
    
        if (e.preventDefault) e.preventDefault()
    
        removeEvent(document.documentElement, eventsFor.move, handleResize)
        removeEvent(document.documentElement, eventsFor.stop, handleUp)
    
        resizing.value = false
        resizeEnable.value = false
    
        // $emit('resized', { width: width.value, height: height.value })
    
        resetBoundsAndMouseState()
    }

    const handleDrag = (e) => {
        if (e.touches && e.touches.length > 1) {
            return
        }
    
        if (props.onDrag(e) === false) {
            return
        }
    
        if (e.preventDefault) e.preventDefault()
    
        const x = e.touches ? e.touches[0].pageX : e.pageX
        const y = e.touches ? e.touches[0].pageY : e.pageY
    
        const deltaX = x - mouseClickPosition.value.mouseX
        const deltaY = y - mouseClickPosition.value.mouseY
    
        const [gridX, gridY] = props.grid
    
        if (handle.value.includes('t')) {
            if (top.value + deltaY < bounds.value.minTop) {
                deltaY = bounds.value.minTop - top.value
            } else if (top.value + deltaY > bounds.value.maxTop) {
                deltaY = bounds.value.maxTop - top.value
            }
        } else if (handle.value.includes('b')) {
            if (bottom.value - deltaY < bounds.value.minBottom) {
                deltaY = bottom.value - bounds.value.minBottom
            } else if (bottom.value - deltaY > bounds.value.maxBottom) {
                deltaY = bottom.value - bounds.value.maxBottom
            }
        }
    
        if (handle.value.includes('l')) {
            if (left.value + deltaX < bounds.value.minLeft) {
                deltaX = bounds.value.minLeft - left.value
            } else if (left.value + deltaX > bounds.value.maxLeft) {
                deltaX = bounds.value.maxLeft - left.value
            }
        } else if (handle.value.includes('r')) {
            if (right.value - deltaX < bounds.value.minRight) {
                deltaX = right.value - bounds.value.minRight
            } else if (right.value - deltaX > bounds.value.maxRight) {
                deltaX = right.value - bounds.value.maxRight
            }
        }
    
        left.value += deltaX
        right.value -= deltaX
        top.value += deltaY
        bottom.value -= deltaY
    
        // $emit('dragged', { left: left.value, top: top.value })
    }

    // const handleUp = (e) => {
    //     if (e.touches && e.touches.length > 1) {
    //         return
    //     }
    
    //     if (props.onDrag(e) === false) {
    //         return
    //     }
    
    //     if (e.preventDefault) e.preventDefault()
    
    //     removeEvent(document.documentElement, eventsFor.move, handleDrag)
    //     removeEvent(document.documentElement, eventsFor.stop, handleUp)
    
    //     dragging.value = false
    //     dragEnable.value = false
    
    //     // $emit('dragged', { left: left.value, top: top.value })
    
    //     resetBoundsAndMouseState()
    // }
  
//     methods: {
//       resetBoundsAndMouseState () {
//         this.mouseClickPosition = { mouseX: 0, mouseY: 0, x: 0, y: 0, w: 0, h: 0 }
  
//         this.bounds = {
//           minLeft: null,
//           maxLeft: null,
//           minRight: null,
//           maxRight: null,
//           minTop: null,
//           maxTop: null,
//           minBottom: null,
//           maxBottom: null
//         }
//       },
//       checkParentSize () {
//         if (this.parent) {
//           const [newParentWidth, newParentHeight] = this.getParentSize()
  
//           this.parentWidth = newParentWidth
//           this.parentHeight = newParentHeight
//           this.right = this.parentWidth - this.width - this.left
//           this.bottom = this.parentHeight - this.height - this.top
//         }
//       },
//       getParentSize () {
//         if (this.parent) {
//           const style = window.getComputedStyle(this.$el.parentNode, null)
  
//           return [
//             parseInt(style.getPropertyValue('width'), 10),
//             parseInt(style.getPropertyValue('height'), 10)
//           ]
//         }
  
//         return [null, null]
//       },
//       elementTouchDown (e) {
//         eventsFor = events.touch
  
//         this.elementDown(e)
//       },
//       elementMouseDown (e) {
//         eventsFor = events.mouse
  
//         this.elementDown(e)
//       },
//       elementDown (e) {
//         if (e instanceof MouseEvent && e.button !== 0) {
//           return
//         }
  
//         const target = e.target || e.srcElement
  
//         if (this.$el.contains(target)) {
//           if (this.onDragStart(e) === false) {
//             return
//           }
  
//           if (
//             (this.dragHandle && !matchesSelectorToParentElements(target, this.dragHandle, this.$el)) ||
//             (this.dragCancel && matchesSelectorToParentElements(target, this.dragCancel, this.$el))
//           ) {
//             this.dragging = false
  
//             return
//           }
  
//           if (!this.enabled) {
//             this.enabled = true
  
//             this.$emit('activated')
//             this.$emit('update:active', true)
//           }
  
//           if (this.draggable) {
//             this.dragEnable = true
//           }
  
//           this.mouseClickPosition.mouseX = e.touches ? e.touches[0].pageX : e.pageX
//           this.mouseClickPosition.mouseY = e.touches ? e.touches[0].pageY : e.pageY
  
//           this.mouseClickPosition.left = this.left
//           this.mouseClickPosition.right = this.right
//           this.mouseClickPosition.top = this.top
//           this.mouseClickPosition.bottom = this.bottom
  
//           if (this.parent) {
//             this.bounds = this.calcDragLimits()
//           }
  
//           addEvent(document.documentElement, eventsFor.move, this.move)
//           addEvent(document.documentElement, eventsFor.stop, this.handleUp)
//         }
//       },
//       calcDragLimits () {
//         return {
//           minLeft: this.left % this.grid[0],
//           maxLeft: Math.floor((this.parentWidth - this.width - this.left) / this.grid[0]) * this.grid[0] + this.left,
//           minRight: this.right % this.grid[0],
//           maxRight: Math.floor((this.parentWidth - this.width - this.right) / this.grid[0]) * this.grid[0] + this.right,
//           minTop: this.top % this.grid[1],
//           maxTop: Math.floor((this.parentHeight - this.height - this.top) / this.grid[1]) * this.grid[1] + this.top,
//           minBottom: this.bottom % this.grid[1],
//           maxBottom: Math.floor((this.parentHeight - this.height - this.bottom) / this.grid[1]) * this.grid[1] + this.bottom
//         }
//       },
//       deselect (e) {
//         const target = e.target || e.srcElement
//         const regex = new RegExp(this.className + '-([trmbl]{2})', '')
  
//         if (!this.$el.contains(target) && !regex.test(target.className)) {
//           if (this.enabled && !this.preventDeactivation) {
//             this.enabled = false
  
//             this.$emit('deactivated')
//             this.$emit('update:active', false)
//           }
  
//           removeEvent(document.documentElement, eventsFor.move, this.handleResize)
//         }
  
//         this.resetBoundsAndMouseState()
//       },
//       handleTouchDown (handle, e) {
//         eventsFor = events.touch
  
//         this.handleDown(handle, e)
//       },
//       handleDown (handle, e) {
//         if (e instanceof MouseEvent && e.which !== 1) {
//           return
//         }
  
//         if (this.onResizeStart(handle, e) === false) {
//           return
//         }
  
//         if (e.stopPropagation) e.stopPropagation()
  
//         // Here we avoid a dangerous recursion by faking
//         // corner handles as middle handles
//         if (this.lockAspectRatio && !handle.includes('m')) {
//           this.handle = 'm' + handle.substring(1)
//         } else {
//           this.handle = handle
//         }
  
//         this.resizeEnable = true
  
//         this.mouseClickPosition.mouseX = e.touches ? e.touches[0].pageX : e.pageX
//         this.mouseClickPosition.mouseY = e.touches ? e.touches[0].pageY : e.pageY
//         this.mouseClickPosition.left = this.left
//         this.mouseClickPosition.right = this.right
//         this.mouseClickPosition.top = this.top
//         this.mouseClickPosition.bottom = this.bottom
  
//         this.bounds = this.calcResizeLimits()
  
//         addEvent(document.documentElement, eventsFor.move, this.handleResize)
//         addEvent(document.documentElement, eventsFor.stop, this.handleUp)
//       },
//       calcResizeLimits () {
//         let minW = this.minW
//         let minH = this.minH
//         let maxW = this.maxW
//         let maxH = this.maxH
  
//         const aspectFactor = this.aspectFactor
//         const [gridX, gridY] = this.grid
//         const width = this.width
//         const height = this.height
//         const left = this.left
//         const top = this.top
//         const right = this.right
//         const bottom = this.bottom
  
//         if (this.lockAspectRatio) {
//           if (minW / minH > aspectFactor) {
//             minH = minW / aspectFactor
//           } else {
//             minW = aspectFactor * minH
//           }
  
//           if (maxW && maxH) {
//             maxW = Math.min(maxW, aspectFactor * maxH)
//             maxH = Math.min(maxH, maxW / aspectFactor)
//           } else if (maxW) {
//             maxH = maxW / aspectFactor
//           } else if (maxH) {
//             maxW = aspectFactor * maxH
//           }
//         }
  
//         maxW = maxW - (maxW % gridX)
//         maxH = maxH - (maxH % gridY)
  
//         const limits = {
//           minLeft: null,
//           maxLeft: null,
//           minTop: null,
//           maxTop: null,
//           minRight: null,
//           maxRight: null,
//           minBottom: null,
//           maxBottom: null
//         }
  
//         if (this.parent) {
//           limits.minLeft = left % gridX
//           limits.maxLeft = left + Math.floor((width - minW) / gridX) * gridX
//           limits.minTop = top % gridY
//           limits.maxTop = top + Math.floor((height - minH) / gridY) * gridY
//           limits.minRight = right % gridX
//           limits.maxRight = right + Math.floor((width - minW) / gridX) * gridX
//           limits.minBottom = bottom % gridY
//           limits.maxBottom = bottom + Math.floor((height - minH) / gridY) * gridY
  
//           if (maxW) {
//             limits.minLeft = Math.max(limits.minLeft, this.parentWidth - right - maxW)
//             limits.minRight = Math.max(limits.minRight, this.parentWidth - left - maxW)
//           }
  
//           if (maxH) {
//             limits.minTop = Math.max(limits.minTop, this.parentHeight - bottom - maxH)
//             limits.minBottom = Math.max(limits.minBottom, this.parentHeight - top - maxH)
//           }
  
//           if (this.lockAspectRatio) {
//             limits.minLeft = Math.max(limits.minLeft, left - top * aspectFactor)
//             limits.minTop = Math.max(limits.minTop, top - left / aspectFactor)
//             limits.minRight = Math.max(limits.minRight, right - bottom * aspectFactor)
//             limits.minBottom = Math.max(limits.minBottom, bottom - right / aspectFactor)
//           }
//         } else {
//           limits.minLeft = null
//           limits.maxLeft = left + Math.floor((width - minW) / gridX) * gridX
//           limits.minTop = null
//           limits.maxTop = top + Math.floor((height - minH) / gridY) * gridY
//           limits.minRight = null
//           limits.maxRight = right + Math.floor((width - minW) / gridX) * gridX
//           limits.minBottom = null
//           limits.maxBottom = bottom + Math.floor((height - minH) / gridY) * gridY
  
//           if (maxW) {
//             limits.minLeft = -(right + maxW)
//             limits.minRight = -(left + maxW)
//           }
  
//           if (maxH) {
//             limits.minTop = -(bottom + maxH)
//             limits.minBottom = -(top + maxH)
//           }
  
//           if (this.lockAspectRatio && (maxW && maxH)) {
//             limits.minLeft = Math.min(limits.minLeft, -(right + maxW))
//             limits.minTop = Math.min(limits.minTop, -(maxH + bottom))
//             limits.minRight = Math.min(limits.minRight, -left - maxW)
//             limits.minBottom = Math.min(limits.minBottom, -top - maxH)
//           }
//         }
  
//         return limits
//       },
//       move (e) {
//         if (this.resizing) {
//           this.handleResize(e)
//         } else if (this.dragEnable) {
//           this.handleDrag(e)
//         }
//       },
//       handleDrag (e) {
//         const axis = this.axis
//         const grid = this.grid
//         const bounds = this.bounds
//         const mouseClickPosition = this.mouseClickPosition
  
//         const tmpDeltaX = axis && axis !== 'y' ? mouseClickPosition.mouseX - (e.touches ? e.touches[0].pageX : e.pageX) : 0
//         const tmpDeltaY = axis && axis !== 'x' ? mouseClickPosition.mouseY - (e.touches ? e.touches[0].pageY : e.pageY) : 0
  
//         const [deltaX, deltaY] = snapToGrid(grid, tmpDeltaX, tmpDeltaY, this.scale)
  
//         const left = restrictToBounds(mouseClickPosition.left - deltaX, bounds.minLeft, bounds.maxLeft)
//         const top = restrictToBounds(mouseClickPosition.top - deltaY, bounds.minTop, bounds.maxTop)
  
//         if (this.onDrag(left, top) === false) {
//           return
//         }
  
//         const right = restrictToBounds(mouseClickPosition.right + deltaX, bounds.minRight, bounds.maxRight)
//         const bottom = restrictToBounds(mouseClickPosition.bottom + deltaY, bounds.minBottom, bounds.maxBottom)
  
//         this.left = left
//         this.top = top
//         this.right = right
//         this.bottom = bottom
  
//         this.$emit('dragging', this.left, this.top)
//         this.dragging = true
//       },
//       moveHorizontally (val) {
//         // should calculate with scale 1.
//         const [deltaX, _] = snapToGrid(this.grid, val, this.top, 1)
  
//         const left = restrictToBounds(deltaX, this.bounds.minLeft, this.bounds.maxLeft)
  
//         this.left = left
//         this.right = this.parentWidth - this.width - left
//       },
//       moveVertically (val) {
//         // should calculate with scale 1.
//         const [_, deltaY] = snapToGrid(this.grid, this.left, val, 1)
  
//         const top = restrictToBounds(deltaY, this.bounds.minTop, this.bounds.maxTop)
  
//         this.top = top
//         this.bottom = this.parentHeight - this.height - top
//       },
//       handleResize (e) {
//         let left = this.left
//         let top = this.top
//         let right = this.right
//         let bottom = this.bottom
  
//         const mouseClickPosition = this.mouseClickPosition
//         const aspectFactor = this.aspectFactor
  
//         const tmpDeltaX = mouseClickPosition.mouseX - (e.touches ? e.touches[0].pageX : e.pageX)
//         const tmpDeltaY = mouseClickPosition.mouseY - (e.touches ? e.touches[0].pageY : e.pageY)
  
//         if (!this.widthTouched && tmpDeltaX) {
//           this.widthTouched = true
//         }
  
//         if (!this.heightTouched && tmpDeltaY) {
//           this.heightTouched = true
//         }
  
//         const [deltaX, deltaY] = snapToGrid(this.grid, tmpDeltaX, tmpDeltaY, this.scale)
  
//         if (this.handle.includes('b')) {
//           bottom = restrictToBounds(
//             mouseClickPosition.bottom + deltaY,
//             this.bounds.minBottom,
//             this.bounds.maxBottom
//           )
  
//           if (this.lockAspectRatio && this.resizingOnY) {
//             right = this.right - (this.bottom - bottom) * aspectFactor
//           }
//         } else if (this.handle.includes('t')) {
//           top = restrictToBounds(
//             mouseClickPosition.top - deltaY,
//             this.bounds.minTop,
//             this.bounds.maxTop
//           )
  
//           if (this.lockAspectRatio && this.resizingOnY) {
//             left = this.left - (this.top - top) * aspectFactor
//           }
//         }
  
//         if (this.handle.includes('r')) {
//           right = restrictToBounds(
//             mouseClickPosition.right + deltaX,
//             this.bounds.minRight,
//             this.bounds.maxRight
//           )
  
//           if (this.lockAspectRatio && this.resizingOnX) {
//             bottom = this.bottom - (this.right - right) / aspectFactor
//           }
//         } else if (this.handle.includes('l')) {
//           left = restrictToBounds(
//             mouseClickPosition.left - deltaX,
//             this.bounds.minLeft,
//             this.bounds.maxLeft
//           )
  
//           if (this.lockAspectRatio && this.resizingOnX) {
//             top = this.top - (this.left - left) / aspectFactor
//           }
//         }
  
//         const width = computeWidth(this.parentWidth, left, right)
//         const height = computeHeight(this.parentHeight, top, bottom)
  
//         if (this.onResize(this.handle, left, top, width, height) === false) {
//           return
//         }
  
//         this.left = left
//         this.top = top
//         this.right = right
//         this.bottom = bottom
//         this.width = width
//         this.height = height
  
//         this.$emit('resizing', this.left, this.top, this.width, this.height)
//         this.resizing = true
//       },
//       changeWidth (val) {
//         // should calculate with scale 1.
//         const [newWidth, _] = snapToGrid(this.grid, val, 0, 1)
  
//         const right = restrictToBounds(
//           (this.parentWidth - newWidth - this.left),
//           this.bounds.minRight,
//           this.bounds.maxRight
//         )
//         let bottom = this.bottom
  
//         if (this.lockAspectRatio) {
//           bottom = this.bottom - (this.right - right) / this.aspectFactor
//         }
  
//         const width = computeWidth(this.parentWidth, this.left, right)
//         const height = computeHeight(this.parentHeight, this.top, bottom)
  
//         this.right = right
//         this.bottom = bottom
//         this.width = width
//         this.height = height
//       },
//       changeHeight (val) {
//         // should calculate with scale 1.
//         const [_, newHeight] = snapToGrid(this.grid, 0, val, 1)
  
//         const bottom = restrictToBounds(
//           (this.parentHeight - newHeight - this.top),
//           this.bounds.minBottom,
//           this.bounds.maxBottom
//         )
//         let right = this.right
  
//         if (this.lockAspectRatio) {
//           right = this.right - (this.bottom - bottom) * this.aspectFactor
//         }
  
//         const width = computeWidth(this.parentWidth, this.left, right)
//         const height = computeHeight(this.parentHeight, this.top, bottom)
  
//         this.right = right
//         this.bottom = bottom
//         this.width = width
//         this.height = height
//       },
//       handleUp (e) {
//         this.handle = null
  
//         this.resetBoundsAndMouseState()
  
//         this.dragEnable = false
//         this.resizeEnable = false
  
//         if (this.resizing) {
//           this.resizing = false
//           this.$emit('resizeStop', this.left, this.top, this.width, this.height)
//         }
  
//         if (this.dragging) {
//           this.dragging = false
//           this.$emit('dragStop', this.left, this.top)
//         }
  
//         removeEvent(document.documentElement, eventsFor.move, this.handleResize)
//       }
//     },
//     computed: {
//       style () {
//         return {
//           transform: `translate(${this.left}px, ${this.top}px)`,
//           width: this.computedWidth,
//           height: this.computedHeight,
//           zIndex: this.zIndex,
//           ...(this.dragging && this.disableUserSelect ? userSelectNone : userSelectAuto)
//         }
//       },
//       actualHandles () {
//         if (!this.resizable) return []
  
//         return this.handles
//       },
//       computedWidth () {
//         if (this.w === 'auto') {
//           if (!this.widthTouched) {
//             return 'auto'
//           }
//         }
  
//         return this.width + 'px'
//       },
//       computedHeight () {
//         if (this.h === 'auto') {
//           if (!this.heightTouched) {
//             return 'auto'
//           }
//         }
  
//         return this.height + 'px'
//       },
//       minW () {
//         return this.minWidth
//       },
//       minH () {
//         return this.minHeight
//       },
//       maxW () {
//         return this.maxWidth
//       },
//       maxH () {
//         return this.maxHeight
//       },
//       resizingOnX () {
//         return (Boolean(this.handle) && (this.handle.includes('l') || this.handle.includes('r')))
//       },
//       resizingOnY () {
//         return (Boolean(this.handle) && (this.handle.includes('t') || this.handle.includes('b')))
//       },
//       isCornerHandle () {
//         return (Boolean(this.handle) && ['tl', 'tr', 'br', 'bl'].includes(this.handle))
//       }
//     },
  
//     watch: {
//       active (val) {
//         this.enabled = val
  
//         if (val) {
//           this.$emit('activated')
//         } else {
//           this.$emit('deactivated')
//         }
//       },
//       z (val) {
//         if (val >= 0 || val === 'auto') {
//           this.zIndex = val
//         }
//       },
//       x (val) {
//         if (this.resizing || this.dragging) {
//           return
//         }
  
//         if (this.parent) {
//           this.bounds = this.calcDragLimits()
//         }
  
//         this.moveHorizontally(val)
//       },
//       y (val) {
//         if (this.resizing || this.dragging) {
//           return
//         }
  
//         if (this.parent) {
//           this.bounds = this.calcDragLimits()
//         }
  
//         this.moveVertically(val)
//       },
//       lockAspectRatio (val) {
//         if (val) {
//           this.aspectFactor = this.width / this.height
//         } else {
//           this.aspectFactor = undefined
//         }
//       },
//       w (val) {
//         if (this.resizing || this.dragging) {
//           return
//         }
  
//         if (this.parent) {
//           this.bounds = this.calcResizeLimits()
//         }
  
//         this.changeWidth(val)
//       },
//       h (val) {
//         if (this.resizing || this.dragging) {
//           return
//         }
  
//         if (this.parent) {
//           this.bounds = this.calcResizeLimits()
//         }
  
//         this.changeHeight(val)
//       }
//     }
//   }
</script>
<template>
    <div
      :style="style"
      :class="[{
        [classNameActive]: enabled,
        [classNameDragging]: dragging,
        [classNameResizing]: resizing,
        [classNameDraggable]: draggable,
        [classNameResizable]: resizable
      }, className]"
      @mousedown="elementMouseDown"
      @touchstart="elementTouchDown"
    >
      <div
        v-for="handle in actualHandles"
        :key="handle"
        :class="[classNameHandle, classNameHandle + '-' + handle]"
        :style="{display: enabled ? 'block' : 'none'}"
        @mousedown.stop.prevent="handleDown(handle, $event)"
        @touchstart.stop.prevent="handleTouchDown(handle, $event)"
      >
        <slot :name="handle"></slot>
      </div>
      <slot></slot>
    </div>
</template>

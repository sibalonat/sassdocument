import { ref } from 'vue';

export function useGridUtils() {
  const isFunction = (func) => {
    return (typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]');
  };

  const snapToGrid = (grid, pendingX, pendingY, scale = 1) => {
    const [scaleX, scaleY] = typeof scale === 'number' ? [scale, scale] : scale;
    const x = Math.round((pendingX / scaleX) / grid[0]) * grid[0];
    const y = Math.round((pendingY / scaleY) / grid[1]) * grid[1];
    return [x, y];
  };

  const getSize = (el) => {
    const rect = el.getBoundingClientRect();
    return [
      parseInt(rect.width),
      parseInt(rect.height)
    ];
  };

  const computeWidth = (parentWidth, left, right) => {
    return parentWidth - left - right;
  };

  const computeHeight = (parentHeight, top, bottom) => {
    return parentHeight - top - bottom;
  };

  const restrictToBounds = (value, min, max) => {
    if (min !== null && value < min) {
      return min;
    }
    if (max !== null && max < value) {
      return max;
    }
    return value;
  };

  const matchesSelectorToParentElements = (el, selector, baseNode) => {
    let node = el;

    const matchesSelectorFunc = [
      'matches',
      'webkitMatchesSelector',
      'mozMatchesSelector',
      'msMatchesSelector',
      'oMatchesSelector'
    ].find(func => isFunction(node[func]));

    if (!isFunction(node[matchesSelectorFunc])) return false;

    do {
      if (node[matchesSelectorFunc](selector)) return true;
      if (node === baseNode) return false;
      node = node.parentNode;
    } while (node);

    return false;
  };

  const getComputedSize = ($el) => {
    const style = window.getComputedStyle($el);

    return [
      parseFloat(style.getPropertyValue('width'), 10),
      parseFloat(style.getPropertyValue('height'), 10)
    ];
  };

  const addEvent = (el, event, handler) => {
    if (!el) {
      return;
    }
    if (el.attachEvent) {
      el.attachEvent('on' + event, handler);
    } else if (el.addEventListener) {
      el.addEventListener(event, handler, true);
    } else {
      el['on' + event] = handler;
    }
  };

  const removeEvent = (el, event, handler) => {
    if (!el) {
      return;
    }
    if (el.detachEvent) {
      el.detachEvent('on' + event, handler);
    } else if (el.removeEventListener) {
      el.removeEventListener(event, handler, true);
    } else {
      el['on' + event] = null;
    }
  };

  return {
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
  };
}
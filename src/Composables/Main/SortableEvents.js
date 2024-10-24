// useSortableEvents.js
const manageAndEmit = ["Start", "Add", "Remove", "Update", "End"];
const emit = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];
const manage = ["Move"];
const eventHandlerNames = [...manage, ...manageAndEmit, ...emit].map(evt => `on${evt}`);

const events = {
  manage,
  manageAndEmit,
  emit
};

const emitsArray = [
  'update:modelValue',
  'change',
  ...[...events.manageAndEmit, ...events.emit].map(evt => evt.toLowerCase())
];

function isReadOnly(eventName) {
  return eventHandlerNames.includes(eventName);
}

export function useSortableEvents() {
  return {
    events,
    isReadOnly
  };
}

export { emitsArray };
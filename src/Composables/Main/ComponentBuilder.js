// useComponentBuilder.js
// import { useStringUtils } from "../util/string";
// import { isHtmlAttribute } from "../util/tags";
// import { events, isReadOnly } from "../Main/SortableEvents";
import { useStringUtils } from "../Utils/String";
import { useSortableEvents } from "../Main/SortableEvents";
import { useHtmlUtils } from "../Utils/Tags";
// cache
const { camelize } = useStringUtils();
const { isHtmlAttribute } = useHtmlUtils();
const { events, isReadOnly } = useSortableEvents();

function project(entries) {
    console.log('here');
    
  return entries.reduce((res, [key, value]) => {
    res[key] = value;
    return res;
  }, {});
}

function getComponentAttributes({ $attrs, componentData = {} }) {
  const attributes = project(
    Object.entries($attrs).filter(([key, _]) => isHtmlAttribute(key))
  );
  return {
    ...attributes,
    ...componentData
  };
}

function createSortableOption({ $attrs, callBackBuilder }) {
  const options = project(getValidSortableEntries($attrs));
  Object.entries(callBackBuilder).forEach(([eventType, eventBuilder]) => {
    events[eventType].forEach(event => {
      options[`on${event}`] = eventBuilder(event);
    });
  });
  const draggable = `[data-draggable]${options.draggable || ""}`;
  return {
    ...options,
    draggable
  };
}

function getValidSortableEntries(value) {
  return Object.entries(value)
    .filter(([key, _]) => !isHtmlAttribute(key))
    .map(([key, value]) => [camelize(key), value])
    .filter(([key, _]) => !isReadOnly(key));
}

export function useComponentBuilder() {
  return {
    getComponentAttributes,
    createSortableOption,
    getValidSortableEntries
  };
}
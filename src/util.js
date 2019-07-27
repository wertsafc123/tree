/* eslint-disable */

export function findComponentUpward(ctx, componentName, componentNames) {
  let parent;
  if (typeof componentName === 'string') {
    componentNames = componentName;
  } else {
    componentNames = [componentName];
  }
  parent = ctx.$parent;
  let { name } = parent.$options;
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent;
    if (parent) {
      name = parent.$options.name;
    }
  }
  return parent;
}
export function distinct(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }
  const obj = {};
  const newArr = [];
  arr.forEach(item => {
    if (item && !obj[item.userId]) {
      newArr.push(item);
      obj[item.userId] = true;
    }
  });
  return newArr;
}

export function decodeToken(encoded) {
  if (encoded === undefined) {
    return {};
  } else {
    return JSON.parse(atob(encoded));
  }
}

export const isEmpty = (array) => {
  return array === undefined ||
         array.length === undefined ||
         array.length <= 0;
}


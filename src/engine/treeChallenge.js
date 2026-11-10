export const CHALLENGE_KEYS = Object.freeze([20, 30, 40, 50, 60, 70, 80]);

export const CHALLENGE_SLOTS = Object.freeze([
  { id: 'root', label: 'Root', expectedKey: 50, parentKey: null, relation: null, x: 50, y: 17 },
  { id: 'left', label: 'Left child of 50', expectedKey: 30, parentKey: 50, relation: 'left', x: 28, y: 48 },
  { id: 'right', label: 'Right child of 50', expectedKey: 70, parentKey: 50, relation: 'right', x: 72, y: 48 },
  { id: 'left-left', label: 'Left child of 30', expectedKey: 20, parentKey: 30, relation: 'left', x: 15, y: 82 },
  { id: 'left-right', label: 'Right child of 30', expectedKey: 40, parentKey: 30, relation: 'right', x: 41, y: 82 },
  { id: 'right-left', label: 'Left child of 70', expectedKey: 60, parentKey: 70, relation: 'left', x: 59, y: 82 },
  { id: 'right-right', label: 'Right child of 70', expectedKey: 80, parentKey: 70, relation: 'right', x: 85, y: 82 },
]);

function findTargetSlot(key) {
  return CHALLENGE_SLOTS.find((slot) => slot.expectedKey === key);
}

export function getPlacementFeedback(key, slot) {
  if (key === slot.expectedKey) {
    if (slot.id === 'root') {
      return { correct: true, message: 'Correct. 50 is the root, the starting point for every search in this tree.' };
    }

    const relation = slot.relation === 'left' ? 'less than' : 'greater than';
    const ancestor = slot.parentKey === 50
      ? ` This places it in the ${slot.relation} subtree of the root.`
      : ` Since ${slot.parentKey} is in the ${slot.parentKey < 50 ? 'left' : 'right'} subtree of 50, this whole subtree stays on the correct side of the root.`;
    return {
      correct: true,
      message: `Correct. ${key} is ${relation} ${slot.parentKey}, so it is the ${slot.relation} child of ${slot.parentKey}.${ancestor}`,
    };
  }

  const target = findTargetSlot(key);
  if (!target) {
    return { correct: false, message: `${key} is not one of the available nodes in this challenge.` };
  }
  if (target.id === 'root') {
    return {
      correct: false,
      message: `50 belongs in the root, not the ${slot.label.toLowerCase()} position.`,
    };
  }

  const rootComparison = key < 50 ? `${key} < 50, so go left` : `${key} > 50, so go right`;
  if (target.parentKey === 50) {
    return {
      correct: false,
      message: `${key} belongs in the ${target.label.toLowerCase()}: ${rootComparison}.`,
    };
  }
  const parentComparison = key < target.parentKey
    ? `${key} < ${target.parentKey}, so go left`
    : `${key} > ${target.parentKey}, so go right`;
  return {
    correct: false,
    message: `${key} belongs in the ${target.label.toLowerCase()}: ${rootComparison}; then ${parentComparison}.`,
  };
}

import { buildTree } from '../engine/bst.js';

export const quizDiagrams = {
  M1: buildTree([25, 12, 40, 6, 18, 33, 50]),
  M2: {
    key: 40,
    left: { key: 20, left: { key: 10, left: null, right: null }, right: { key: 45, left: null, right: null } },
    right: { key: 60, left: { key: 50, left: null, right: null }, right: { key: 70, left: null, right: null } },
  },
  M3: buildTree([40, 20, 60, 10, 30, 50, 70]),
  M4: buildTree([40, 20, 60, 10, 30, 50, 70]),
  M6: buildTree([45, 25, 65, 15, 35, 55, 75, 70]),
  Q1: buildTree([8, 3, 10, 1, 6, 14, 4, 7, 13]),
  Q2: buildTree([8, 3, 10, 1, 6, 14, 4, 7, 13]),
  // Not a BST on purpose: 12 sits in 10's left subtree. buildTree() always
  // makes a valid BST, so invalid examples must be written out by hand.
  Q4: {
    key: 10,
    left: { key: 5, left: null, right: { key: 12, left: null, right: null } },
    right: { key: 15, left: null, right: null },
  },
  Q6: buildTree([50, 30, 70, 20, 40, 60, 80]),
  Q7: buildTree([50, 30, 70, 20, 40, 60, 80]),
  Q8: buildTree([50, 30, 70, 20, 40, 60, 80]),
  Q9: buildTree([50, 30, 70, 20, 40, 60, 80]),
  Q10: buildTree([50, 30, 70, 20, 40, 60, 80]),
  Q14: buildTree([40, 20, 60, 10, 30, 50, 70]),
  Q15: buildTree([40, 20, 60, 10, 30, 50, 70]),
  Q16: buildTree([8, 3, 10, 1, 6, 14, 4, 7, 13]),
  Q18: {
    key: 10,
    left: { key: 15, left: null, right: null },
    right: { key: 5, left: null, right: null },
  },
};

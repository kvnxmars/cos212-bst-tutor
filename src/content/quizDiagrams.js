import { buildTree } from '../engine/bst.js';

export const quizDiagrams = {
  Q1: buildTree([8, 3, 10, 1, 6, 14, 4, 7, 13]),
  Q2: buildTree([8, 3, 10, 1, 6, 14, 4, 7, 13]),
  Q4: buildTree([10, 5, 12, 15]),
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

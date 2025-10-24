// Утилиты
import { NodeDef } from '../types'
export const uid = (p = '') => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}${p}`;

export function evaluateNode(node: NodeDef, inputsValues: boolean[]): boolean {
  switch (node.type) {
    case 'INPUT':
      return !!node.value;
    case 'OUTPUT':
      return !!inputsValues[0];
    case 'LED':
      return !!inputsValues[0];
    case 'NOT':
      return !inputsValues[0];
    case 'AND':
      return inputsValues.every(Boolean);
    case 'OR':
      return inputsValues.some(Boolean);
    case 'NAND':
      return !inputsValues.every(Boolean); // NOT (A AND B)
    case 'NOR':
      return !inputsValues.some(Boolean); // NOT (A OR B)
    case 'XOR':
      return inputsValues.filter(Boolean).length === 1; // Exactly one true
    case 'XNOR':
      return inputsValues.filter(Boolean).length !== 1; // NOT (A XOR B)
    case 'COUNTER':
      // Counts rising edges on first input
      return !!inputsValues[0];
    case 'CLOCK':
      return !!node.clockActive;
    case 'DISPLAY':
      return !!inputsValues[0];
    case 'DFF':
      // D Flip-Flop: Q = D on clock rising edge
      return !!node.state;
    case 'TFF':
      // T Flip-Flop: Q toggles on clock rising edge
      return !!node.state;
    case 'MUX':
      // Multiplexer: output depends on select line
      const selectIndex = node.select || 0;
      return inputsValues[selectIndex] || false;
    case 'CUSTOM':
      return inputsValues.some(Boolean);
    default:
      return false;
  }
}
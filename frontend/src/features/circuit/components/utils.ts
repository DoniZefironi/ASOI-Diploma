import { NodeDef } from '../types/circuit.types';

export function evaluateNode(node: NodeDef, inputsValues: boolean[]): boolean {
  switch (node.type) {
    case 'INPUT':
      return !!node.value;
    case 'OUTPUT':
    case 'LED':
      return !!inputsValues[0];
    case 'NOT':
      return !inputsValues[0];
    case 'AND':
      return inputsValues.every(Boolean);
    case 'OR':
      return inputsValues.some(Boolean);
    case 'NAND':
      return !inputsValues.every(Boolean);
    case 'NOR':
      return !inputsValues.some(Boolean);
    case 'XOR':
      return inputsValues.filter(Boolean).length === 1;
    case 'XNOR':
      return inputsValues.filter(Boolean).length !== 1;
    case 'COUNTER':
      return !!inputsValues[0];
    case 'CLOCK':
      return !!node.clockActive;
    case 'DFF':
      return !!node.state;
    case 'TFF':
      return !!node.state;
    case 'MUX':
      const selectIndex = node.select || 0;
      return inputsValues[selectIndex] || false;
    case 'DECODER':
      if (inputsValues.length >= 2) {
        const index = (inputsValues[0] ? 1 : 0) + (inputsValues[1] ? 2 : 0);
        return index === 0;
      }
      return false;
    case 'ENCODER':
      const activeInput = inputsValues.findIndex(val => val);
      return activeInput >= 0;
    case 'COMPARATOR':
      if (inputsValues.length >= 4) {
        const A = (inputsValues[0] ? 1 : 0) + (inputsValues[1] ? 2 : 0);
        const B = (inputsValues[2] ? 1 : 0) + (inputsValues[3] ? 2 : 0);
        return A === B;
      }
      return false;
    default:
      return false;
  }
}

export function binaryToDecimal(bits: boolean[]): number {
  return bits.reduce((acc, bit, index) => acc + (bit ? Math.pow(2, bits.length - 1 - index) : 0), 0);
}

export function getNodeColor(type: string): string {
  const colors: Record<string, string> = {
    INPUT: '#2563eb',
    OUTPUT: '#16a34a',
    AND: '#7c3aed',
    OR: '#7c3aed',
    NOT: '#7c3aed',
    NAND: '#7c3aed',
    NOR: '#7c3aed',
    XOR: '#7c3aed',
    XNOR: '#7c3aed',
    LED: '#ca8a04',
    CLOCK: '#ea580c',
    COUNTER: '#0891b2',
    DISPLAY: '#db2777',
    SEVEN_SEGMENT: '#dc2626',
    DFF: '#4f46e5',
    TFF: '#4f46e5',
    MUX: '#0d9488',
    DECODER: '#059669',
    ENCODER: '#65a30d',
    SHIFT_REGISTER: '#7c3aed',
    COMPARATOR: '#ea580c',
  };
  return colors[type] || '#6b7280';
}

export function getActiveColor(type: string): string {
  const colors: Record<string, string> = {
    INPUT: '#3b82f6',
    OUTPUT: '#22c55e',
    AND: '#8b5cf6',
    OR: '#8b5cf6',
    NOT: '#8b5cf6',
    NAND: '#8b5cf6',
    NOR: '#8b5cf6',
    XOR: '#8b5cf6',
    XNOR: '#8b5cf6',
    LED: '#eab308',
    CLOCK: '#f97316',
    COUNTER: '#06b6d4',
    DISPLAY: '#ec4899',
    SEVEN_SEGMENT: '#ef4444',
    DFF: '#6366f1',
    TFF: '#6366f1',
    MUX: '#14b8a6',
    DECODER: '#10b981',
    ENCODER: '#84cc16',
    SHIFT_REGISTER: '#8b5cf6',
    COMPARATOR: '#f97316',
  };
  return colors[type] || '#8b5cf6';
}
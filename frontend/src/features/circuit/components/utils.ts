import { NodeDef } from '../types/circuit.types';

export function evaluateNode(node: NodeDef, inputsValues: boolean[]): boolean {
  switch (node.type) {
    case 'INPUT':  return !!node.value;
    case 'OUTPUT':
    case 'LED':    return !!inputsValues[0];
    case 'NOT':    return !inputsValues[0];
    case 'AND':    return inputsValues.every(Boolean);
    case 'OR':     return inputsValues.some(Boolean);
    case 'NAND':   return !inputsValues.every(Boolean);
    case 'NOR':    return !inputsValues.some(Boolean);
    case 'XOR':    return inputsValues.filter(Boolean).length % 2 === 1;
    case 'XNOR':   return inputsValues.filter(Boolean).length % 2 === 0;
    case 'COUNTER': return !!inputsValues[0];
    case 'CLOCK':   return !!node.clockActive;
    case 'DFF':
    case 'TFF':    return !!node.state;
    case 'MUX': {
      const sel = node.select || 0;
      return inputsValues[sel] || false;
    }
    case 'DECODER':
      if (inputsValues.length >= 2) {
        const index = (inputsValues[0] ? 1 : 0) + (inputsValues[1] ? 2 : 0);
        return index === 0;
      }
      return false;
    case 'ENCODER': {
      const active = inputsValues.findIndex(v => v);
      return active >= 0;
    }
    case 'COMPARATOR':
      if (inputsValues.length >= 4) {
        const A = (inputsValues[0] ? 1 : 0) + (inputsValues[1] ? 2 : 0);
        const B = (inputsValues[2] ? 1 : 0) + (inputsValues[3] ? 2 : 0);
        return A === B;
      }
      return false;
    case 'HALF_ADDER':
      return (inputsValues[0] || false) !== (inputsValues[1] || false); // SUM = XOR
    case 'FULL_ADDER': {
      const a = inputsValues[0] || false;
      const b = inputsValues[1] || false;
      const c = inputsValues[2] || false;
      return (a !== b) !== c; // SUM
    }
    case 'HALF_SUBTRACTOR':
      return (inputsValues[0] || false) !== (inputsValues[1] || false); // DIFF = XOR
    case 'FULL_SUBTRACTOR': {
      const a = inputsValues[0] || false;
      const b = inputsValues[1] || false;
      const bin = inputsValues[2] || false;
      return (a !== b) !== bin; // DIFF
    }
    default:
      return false;
  }
}

export function evaluateOutputValues(node: NodeDef, inputsValues: boolean[]): boolean[] | undefined {
  switch (node.type) {
    case 'HALF_ADDER': {
      const a = inputsValues[0] || false;
      const b = inputsValues[1] || false;
      return [a !== b, a && b]; // [SUM, CARRY]
    }
    case 'FULL_ADDER': {
      const a = inputsValues[0] || false;
      const b = inputsValues[1] || false;
      const cin = inputsValues[2] || false;
      const sum = (a !== b) !== cin;
      const cout = (a && b) || (b && cin) || (a && cin);
      return [sum, cout]; // [SUM, COUT]
    }
    case 'HALF_SUBTRACTOR': {
      const a = inputsValues[0] || false;
      const b = inputsValues[1] || false;
      return [a !== b, !a && b]; // [DIFF, BORROW]
    }
    case 'FULL_SUBTRACTOR': {
      const a = inputsValues[0] || false;
      const b = inputsValues[1] || false;
      const bin = inputsValues[2] || false;
      const diff = (a !== b) !== bin;
      const bout = (!a && b) || (b && bin) || (!a && bin);
      return [diff, bout]; // [DIFF, BOUT]
    }
    default:
      return undefined;
  }
}

export function binaryToDecimal(bits: boolean[]): number {
  return bits.reduce((acc, bit, index) => acc + (bit ? Math.pow(2, bits.length - 1 - index) : 0), 0);
}

export function getNodeColor(type: string): string {
  const colors: Record<string, string> = {
    INPUT:           '#2563eb',
    OUTPUT:          '#16a34a',
    AND:             '#7c3aed',
    OR:              '#7c3aed',
    NOT:             '#7c3aed',
    NAND:            '#7c3aed',
    NOR:             '#7c3aed',
    XOR:             '#7c3aed',
    XNOR:            '#7c3aed',
    LED:             '#ca8a04',
    CLOCK:           '#ea580c',
    COUNTER:         '#0891b2',
    DISPLAY:         '#db2777',
    SEVEN_SEGMENT:   '#dc2626',
    DFF:             '#4f46e5',
    TFF:             '#4f46e5',
    MUX:             '#0d9488',
    DECODER:         '#059669',
    ENCODER:         '#65a30d',
    SHIFT_REGISTER:  '#7c3aed',
    COMPARATOR:      '#ea580c',
    HALF_ADDER:      '#b45309',
    FULL_ADDER:      '#92400e',
    HALF_SUBTRACTOR: '#0f766e',
    FULL_SUBTRACTOR: '#115e59',
  };
  return colors[type] || '#6b7280';
}

export function getActiveColor(type: string): string {
  const colors: Record<string, string> = {
    INPUT:           '#3b82f6',
    OUTPUT:          '#22c55e',
    AND:             '#8b5cf6',
    OR:              '#8b5cf6',
    NOT:             '#8b5cf6',
    NAND:            '#8b5cf6',
    NOR:             '#8b5cf6',
    XOR:             '#8b5cf6',
    XNOR:            '#8b5cf6',
    LED:             '#eab308',
    CLOCK:           '#f97316',
    COUNTER:         '#06b6d4',
    DISPLAY:         '#ec4899',
    SEVEN_SEGMENT:   '#ef4444',
    DFF:             '#6366f1',
    TFF:             '#6366f1',
    MUX:             '#14b8a6',
    DECODER:         '#10b981',
    ENCODER:         '#84cc16',
    SHIFT_REGISTER:  '#8b5cf6',
    COMPARATOR:      '#f97316',
    HALF_ADDER:      '#f59e0b',
    FULL_ADDER:      '#d97706',
    HALF_SUBTRACTOR: '#14b8a6',
    FULL_SUBTRACTOR: '#0d9488',
  };
  return colors[type] || '#8b5cf6';
}

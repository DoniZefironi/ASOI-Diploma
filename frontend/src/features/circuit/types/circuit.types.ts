export type ID = string;

export type NodeType =
  | 'INPUT'
  | 'OUTPUT'
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'LED'
  | 'COUNTER'
  | 'CLOCK'
  | 'DISPLAY'
  | 'NAND'
  | 'NOR'
  | 'XOR'
  | 'XNOR'
  | 'DFF'
  | 'TFF'
  | 'MUX'
  | 'SEVEN_SEGMENT'
  | 'DECODER'
  | 'ENCODER'
  | 'SHIFT_REGISTER'
  | 'COMPARATOR'
  | 'HALF_ADDER'
  | 'FULL_ADDER'
  | 'HALF_SUBTRACTOR'
  | 'FULL_SUBTRACTOR';

export interface NodeDef {
  id: ID;
  type: NodeType;
  x: number;
  y: number;
  label?: string;
  inputs: Array<{ id: string | null }>;
  value?: boolean;
  values?: boolean[];
  outputValues?: boolean[];
  counter?: number;
  clockSpeed?: number;
  clockActive?: boolean;
  state?: boolean;
  select?: number;
  bits?: number;
  maxCount?: number;
  displayValue?: number;
}

export interface Wire {
  id: ID;
  from: { nodeId: ID; slot: number };
  to: { nodeId: ID; slot: number };
}

export const MULTI_OUTPUT_TYPES: NodeType[] = [
  'HALF_ADDER', 'FULL_ADDER', 'HALF_SUBTRACTOR', 'FULL_SUBTRACTOR',
];

export function getOutputCount(type: NodeType): number {
  if (MULTI_OUTPUT_TYPES.includes(type)) return 2;
  return 1;
}

export function getOutputPortY(slot: number, outputCount: number, height: number): number {
  if (outputCount === 1) return 0;
  return -height / 2 + (slot + 1) * (height / (outputCount + 1));
}

export function getNodeSize(type: NodeType): { width: number; height: number } {
  if (type === 'DISPLAY' || type === 'SEVEN_SEGMENT') return { width: 160, height: 80 };
  if (MULTI_OUTPUT_TYPES.includes(type)) return { width: 130, height: 80 };
  return { width: 120, height: 60 };
}

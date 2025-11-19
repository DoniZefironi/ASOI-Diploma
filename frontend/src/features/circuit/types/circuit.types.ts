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
  | 'COMPARATOR';

export interface NodeDef {
  id: ID;
  type: NodeType;
  x: number;
  y: number;
  label?: string;
  inputs: Array<{ id: string | null }>;
  value?: boolean;
  values?: boolean[]; // Для многобитных элементов
  counter?: number;
  clockSpeed?: number;
  clockActive?: boolean;
  state?: boolean;
  select?: number;
  bits?: number; // Разрядность для счетчиков и регистров
  maxCount?: number; // Максимальное значение для счетчиков
  displayValue?: number; // Числовое значение для дисплеев
}

export interface Wire {
  id: ID;
  from: { nodeId: ID; slot: number };
  to: { nodeId: ID; slot: number };
}
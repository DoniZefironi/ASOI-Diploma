// Типы для симулятора

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
  | 'CUSTOM'
  | 'NAND' 
  | 'NOR' 
  | 'XOR' 
  | 'XNOR' 
  | 'DFF' 
  | 'TFF' 
  | 'MUX';

export type NodeDef = {
  id: ID;
  type: NodeType;
  x: number;
  y: number;
  label?: string;
  inputs: Array<{ id: string | null }>;
  value?: boolean;
  counter?: number;
  clockSpeed?: number;
  clockActive?: boolean;
  state?: boolean; // Для DFF, TFF
  select?: number; // Для MUX
};

export type Wire = {
  id: ID;
  from: { nodeId: ID; slot: number };
  to: { nodeId: ID; slot: number };
};
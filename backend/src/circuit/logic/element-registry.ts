// src/circuit/logic/element-registry.ts
import { BadRequestException } from '@nestjs/common';

export type NodeType =
  | 'INPUT' | 'OUTPUT' | 'AND' | 'OR' | 'NOT' | 'LED' | 'COUNTER' | 'CLOCK'
  | 'DISPLAY' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'DFF' | 'TFF' | 'MUX';

export interface NodeInputs {
  [slot: number]: boolean;
}

export interface ElementState {
  value?: boolean;
  clockActive?: boolean;
  state?: boolean;
}

export interface ElementBehavior {
  minInputs: number;
  maxInputs?: number;
  evaluate(inputs: NodeInputs, state?: ElementState): boolean;
  hasSideEffects?: boolean; 
}

const registry: Record<NodeType, ElementBehavior> = {
  INPUT: {
    minInputs: 0,
    evaluate: (inputs, state) => state?.value ?? false,
  },
  OUTPUT: {
    minInputs: 1,
    evaluate: (inputs) => inputs[0] ?? false,
  },
  NOT: {
    minInputs: 1,
    evaluate: (inputs) => !(inputs[0] ?? false),
  },
  AND: {
    minInputs: 2,
    evaluate: (inputs) => Object.values(inputs).every(Boolean),
  },
  OR: {
    minInputs: 2,
    evaluate: (inputs) => Object.values(inputs).some(Boolean),
  },
  NAND: {
    minInputs: 2,
    evaluate: (inputs) => !Object.values(inputs).every(Boolean),
  },
  NOR: {
    minInputs: 2,
    evaluate: (inputs) => !Object.values(inputs).some(Boolean),
  },
  XOR: {
    minInputs: 2,
    evaluate: (inputs) => Object.values(inputs).filter(Boolean).length === 1,
  },
  XNOR: {
    minInputs: 2,
    evaluate: (inputs) => Object.values(inputs).filter(Boolean).length !== 1,
  },
  LED: {
    minInputs: 1,
    evaluate: (inputs) => inputs[0] ?? false,
  },
  CLOCK: {
    minInputs: 0,
    evaluate: (inputs, state) => state?.clockActive ?? false,
  },
  COUNTER: {
    minInputs: 1,
    hasSideEffects: true,
    evaluate: (inputs) => inputs[0] ?? false,
  },
  DISPLAY: {
    minInputs: 1,
    evaluate: (inputs) => inputs[0] ?? false,
  },
  DFF: {
    minInputs: 2,
    hasSideEffects: true,
    evaluate: (inputs, state) => state?.state ?? false,
  },
  TFF: {
    minInputs: 2,
    hasSideEffects: true,
    evaluate: (inputs, state) => state?.state ?? false,
  },
  MUX: {
    minInputs: 3,
    evaluate: (inputs) => {
      const select = inputs[2] ? 1 : 0;
      return inputs[select] ?? false;
    },
  },
};

export function getBehavior(type: NodeType): ElementBehavior {
  const behavior = registry[type];
  if (!behavior) {
    throw new BadRequestException(`Unknown node type: ${type}`);
  }
  return behavior;
}
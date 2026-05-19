// src/circuit/circuit.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { Assignment } from '../assignments/entities/assignment.entity';
import { getBehavior, NodeType as RegistryNodeType, NodeInputs } from './logic/element-registry';

type ID = string;

interface NodeDef {
  id: ID;
  type: RegistryNodeType | 'CUSTOM'; 
  inputs: Array<{ id: string | null }>;
  value?: boolean;
  counter?: number;
  clockActive?: boolean;
  state?: boolean;
  select?: number;
}

interface Wire {
  id: ID;
  from: { nodeId: ID; slot: number };
  to: { nodeId: ID; slot: number };
}

interface TestCase {
  inputs: Record<string, boolean>;
  expectedOutputs: Record<string, boolean>;
}

@Injectable()
export class CircuitService {

  private evaluateNode(node: NodeDef, inputValues: boolean[]): boolean {
    const inputs: NodeInputs = {};
    inputValues.forEach((val, i) => {
      inputs[i] = val;
    });

    if (node.type === 'CUSTOM') {
      return false;
    }

    const behavior = getBehavior(node.type as RegistryNodeType);
    return behavior.evaluate(inputs, node); 
  }

  simulate(circuit: { nodes: Record<ID, NodeDef>; wires: Record<ID, Wire> }) {
    const nodes: Record<ID, NodeDef> = JSON.parse(JSON.stringify(circuit.nodes));
    const wires = Object.values(circuit.wires) as Wire[];

    const incoming: Record<ID, Wire[]> = {};
    Object.keys(nodes).forEach(id => (incoming[id] = []));
    wires.forEach(w => {
      if (!incoming[w.to.nodeId]) incoming[w.to.nodeId] = [];
      incoming[w.to.nodeId].push(w);
    });

    const getInputValue = (nodeId: ID, slot: number): boolean => {
      const wiresToSlot = incoming[nodeId]?.filter(w => w.to.slot === slot) || [];
      if (wiresToSlot.length === 0) return false;
      return wiresToSlot.some(w => !!nodes[w.from.nodeId]?.value);
    };

    Object.values(nodes).forEach(node => {
      if (node.type === 'DFF') {
        const d = getInputValue(node.id, 0);
        const clk = getInputValue(node.id, 1);
        const prevClk = circuit.nodes[node.id]?.value;
        if (clk && !prevClk) node.state = d;
      } else if (node.type === 'TFF') {
        const t = getInputValue(node.id, 0);
        const clk = getInputValue(node.id, 1);
        const prevClk = circuit.nodes[node.id]?.value;
        if (clk && !prevClk && t) node.state = !node.state;
      } else if (node.type === 'MUX') {
        const sel = getInputValue(node.id, 2);
        node.select = sel ? 1 : 0;
      }
    });

    let changed = true;
    let iter = 0;
    const MAX = 50;
    while (changed && iter++ < MAX) {
      changed = false;
      Object.values(nodes).forEach(node => {
        const inputs = node.inputs.map((_, i) => getInputValue(node.id, i));
        const newVal = this.evaluateNode(node, inputs);
        if (node.value !== newVal) {
          node.value = newVal;
          changed = true;
        }
      });
    }

    Object.values(nodes).forEach(node => {
      if (node.type === 'DFF' || node.type === 'TFF') {
        node.value = node.state;
      }
    });

    return nodes;
  }

  validateCircuit(circuitData: any, testCases: TestCase[]): { score: number; maxScore: number; feedback: string; isPassed: boolean } {
    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      throw new BadRequestException('Assignment has no test cases');
    }

    let passed = 0;
    const feedbackLines: string[] = [];

    for (let i = 0; i < testCases.length; i++) {
      const { inputs, expectedOutputs } = testCases[i];
      const cloned = JSON.parse(JSON.stringify(circuitData));

      Object.entries(inputs).forEach(([id, value]) => {
        if (cloned.nodes[id]?.type === 'INPUT') {
          cloned.nodes[id].value = value;
        }
      });

      const resultNodes = this.simulate(cloned);

      let ok = true;
      const errors: string[] = [];
      Object.entries(expectedOutputs).forEach(([id, expected]) => {
        const actual = resultNodes[id]?.value;
        if (actual !== expected) {
          ok = false;
          errors.push(`${id}: expected ${expected}, got ${actual}`);
        }
      });

      if (ok) {
        passed++;
      } else {
        feedbackLines.push(`Test ${i + 1}: ${errors.join('; ')}`);
      }
    }

    const maxScore = testCases.length;
    const score = passed;
    const isPassed = score === maxScore;
    const feedback = feedbackLines.length > 0 ? feedbackLines.join('\n') : 'All tests passed!';

    return { score, maxScore, feedback, isPassed };
  }
}
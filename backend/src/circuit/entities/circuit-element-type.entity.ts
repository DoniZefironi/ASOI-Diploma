// src/circuit/entities/circuit-element-type.entity.ts
import { Entity, PrimaryColumn, Column } from 'typeorm';
@Entity('circuit_element_types')
export class CircuitElementType {
  @PrimaryColumn()
  type: string; // 'AND', 'OR', ...

  @Column({ type: 'json' })
  metadata: {
    label: string;
    color: string;
    inputCount: number;
  };
}
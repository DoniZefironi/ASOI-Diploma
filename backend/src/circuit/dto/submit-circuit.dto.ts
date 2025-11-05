// src/circuit/dto/submit-circuit.dto.ts
import { IsNotEmpty, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitCircuitDto {
  @IsNotEmpty()
  @IsObject()
  @Type(() => Object)
  circuitData: {
    nodes: Record<string, any>;
    wires: Record<string, any>;
  };
}
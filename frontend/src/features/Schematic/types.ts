export type ComponentType = 'arduino-un' | 'led' | 'button' | 'resistor';

export interface Pin {
  id: string;      // 'D13', 'GND', 'anode' и т.д.
  type: 'input' | 'output' | 'power' | 'ground';
  x: number;       // смещение относительно компонента
  y: number;
}

export interface Component {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  pins: Pin[];
}

export interface Wire {
  id: string;
  from: { compId: string; pinId: string };
  to: { compId: string; pinId: string };
}
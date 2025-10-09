// features/circuit/CircuitSimulator.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { 
  Save, Download, Upload, RotateCcw, Play, Square, 
  ZoomIn, ZoomOut, Grid, HelpCircle, Settings 
} from 'lucide-react';

// Типы для компонентов схемы
interface CircuitComponent {
  id: string;
  type: 'gate' | 'input' | 'output';
  x: number;
  y: number;
  properties: any;
}

interface CircuitState {
  components: CircuitComponent[];
  wires: any[];
  zoom: number;
  pan: { x: number; y: number };
}

export default function CircuitSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [circuit, setCircuit] = useState<CircuitState>({
    components: [],
    wires: [],
    zoom: 1,
    pan: { x: 0, y: 0 }
  });
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedTool, setSelectedTool] = useState<'select' | 'wire' | 'gate' | 'input' | 'output'>('select');
  const [showGrid, setShowGrid] = useState(true);

  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cursor, setCursor] = useState<'default' | 'grab' | 'grabbing'>('default');

  // Базовые логические элементы
  const logicGates = [
    { type: 'AND', symbol: '&', inputs: 2, outputs: 1 },
    { type: 'OR', symbol: '≥1', inputs: 2, outputs: 1 },
    { type: 'NOT', symbol: '1', inputs: 1, outputs: 1 },
    { type: 'XOR', symbol: '=1', inputs: 2, outputs: 1 },
  ];

  // Упрощенная функция для преобразования координат
  const getWorldCoords = (screenX: number, screenY: number) => {
    return {
      x: (screenX / circuit.zoom) - circuit.pan.x,
      y: (screenY / circuit.zoom) - circuit.pan.y
    };
  };

  const getScreenCoords = (worldX: number, worldY: number) => {
    return {
      x: (worldX + circuit.pan.x) * circuit.zoom,
      y: (worldY + circuit.pan.y) * circuit.zoom
    };
  };

  // Простая проверка попадания
  const isPointInComponent = (worldX: number, worldY: number, comp: CircuitComponent) => {
    const screenPos = getScreenCoords(comp.x, comp.y);
    const compWidth = comp.type === 'gate' ? 60 * circuit.zoom : 30 * circuit.zoom;
    const compHeight = comp.type === 'gate' ? 40 * circuit.zoom : 30 * circuit.zoom;
    
    const screenX = (worldX + circuit.pan.x) * circuit.zoom;
    const screenY = (worldY + circuit.pan.y) * circuit.zoom;
    
    const left = screenPos.x - compWidth / 2;
    const right = screenPos.x + compWidth / 2;
    const top = screenPos.y - compHeight / 2;
    const bottom = screenPos.y + compHeight / 2;

    return screenX >= left && screenX <= right && screenY >= top && screenY <= bottom;
  };

  const findComponentAt = (worldX: number, worldY: number) => {
    // Ищем с конца (последние добавленные элементы сверху)
    for (let i = circuit.components.length - 1; i >= 0; i--) {
      const comp = circuit.components[i];
      if (isPointInComponent(worldX, worldY, comp)) {
        return comp;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    
    const worldPos = getWorldCoords(screenX, screenY);
    
    console.log('=== MOUSE DOWN ===');
    console.log('Screen:', screenX, screenY);
    console.log('World:', worldPos.x, worldPos.y);
    console.log('Pan:', circuit.pan.x, circuit.pan.y);
    console.log('Zoom:', circuit.zoom);

    const component = findComponentAt(worldPos.x, worldPos.y);

    if (component && selectedTool === 'select') {
      console.log('FOUND COMPONENT:', component.id, 'at', component.x, component.y);
      setSelectedComponent(component.id);
      setIsDragging(true);
      setCursor('grabbing');
      setDragStart({ x: worldPos.x, y: worldPos.y });
    } else {
      console.log('NO COMPONENT FOUND');
      setSelectedComponent(null);
      if (selectedTool !== 'select') {
        handleCanvasClick(e);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = getWorldCoords(screenX, screenY);

    // Hover эффект
    if (!isDragging && selectedTool === 'select') {
      const component = findComponentAt(worldPos.x, worldPos.y);
      setCursor(component ? 'grab' : 'default');
    }

    // Перетаскивание
    if (isDragging && selectedComponent) {
      const deltaX = worldPos.x - dragStart.x;
      const deltaY = worldPos.y - dragStart.y;
      
      setCircuit(prev => ({
        ...prev,
        components: prev.components.map(comp => 
          comp.id === selectedComponent 
            ? { 
                ...comp, 
                x: comp.x + deltaX,
                y: comp.y + deltaY
              }
            : comp
        )
      }));
      
      setDragStart({ x: worldPos.x, y: worldPos.y });
    }
  };

  const handleMouseUp = () => {
    console.log('=== MOUSE UP ===');
    setIsDragging(false);
    setCursor('default');
  };

  const handleDeleteSelected = () => {
    if (!selectedComponent) return;
    
    setCircuit(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== selectedComponent)
    }));
    setSelectedComponent(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponent) {
        handleDeleteSelected();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedComponent]);

  // Отрисовка
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очистка
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Сетка
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Компоненты
    circuit.components.forEach(component => {
      drawComponent(ctx, component);
    });

  }, [circuit, showGrid]);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    
    const gridSize = 20 * circuit.zoom;
    const offsetX = (circuit.pan.x * circuit.zoom) % gridSize;
    const offsetY = (circuit.pan.y * circuit.zoom) % gridSize;

    for (let x = offsetX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = offsetY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawComponent = (ctx: CanvasRenderingContext2D, component: CircuitComponent) => {
    const { type, x, y, properties } = component;
    
    const screenPos = getScreenCoords(x, y);

    // Выделение
    if (component.id === selectedComponent) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      
      if (type === 'gate') {
        ctx.strokeRect(
          screenPos.x - 35, 
          screenPos.y - 25, 
          70, 
          50
        );
      } else {
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, 20, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    }

    // Основная отрисовка
    ctx.fillStyle = '#1F2937';
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 2;

    switch (type) {
      case 'gate':
        ctx.fillRect(screenPos.x - 30, screenPos.y - 20, 60, 40);
        ctx.strokeRect(screenPos.x - 30, screenPos.y - 20, 60, 40);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(properties.symbol, screenPos.x, screenPos.y);
        break;

      case 'input':
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('IN', screenPos.x, screenPos.y);
        break;

      case 'output':
        ctx.beginPath();
        ctx.arc(screenPos.x, screenPos.y, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('OUT', screenPos.x, screenPos.y);
        break;
    }

    // Отладочная информация - координаты компонента
    ctx.fillStyle = '#FF0000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${component.id.slice(0, 4)}: ${Math.round(x)},${Math.round(y)}`, screenPos.x - 30, screenPos.y - 30);
  };

  const handleAddComponent = (type: string, properties: any) => {
    const newComponent: CircuitComponent = {
      id: `comp-${Date.now()}`,
      type: type as any,
      x: 200,
      y: 200,
      properties
    };

    console.log('Adding component at:', newComponent.x, newComponent.y);

    setCircuit(prev => ({
      ...prev,
      components: [...prev.components, newComponent]
    }));
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool === 'select') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = getWorldCoords(screenX, screenY);

    console.log('Adding component at world pos:', worldPos.x, worldPos.y);

    switch (selectedTool) {
      case 'gate':
        handleAddComponent('gate', { type: 'AND', symbol: '&', inputs: 2, outputs: 1 });
        break;
      case 'input':
        handleAddComponent('input', { value: false });
        break;
      case 'output':
        handleAddComponent('output', { value: false });
        break;
    }
  };

  const handleZoomIn = () => {
    setCircuit(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 3) }));
  };

  const handleZoomOut = () => {
    setCircuit(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.5) }));
  };

  const handleResetView = () => {
    setCircuit(prev => ({ ...prev, zoom: 1, pan: { x: 0, y: 0 } }));
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 1000);
  };

  const handleSaveCircuit = () => {
    const circuitData = JSON.stringify(circuit, null, 2);
    const blob = new Blob([circuitData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadCircuit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const circuitData = JSON.parse(e.target?.result as string);
        setCircuit(circuitData);
      } catch (error) {
        console.error('Error loading circuit:', error);
        alert('Ошибка загрузки файла схемы');
      }
    };
    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex gap-1">
              <Button
                variant={selectedTool === 'select' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedTool('select')}
              >
                Выбор
              </Button>
              <Button
                variant={selectedTool === 'wire' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedTool('wire')}
              >
                Провод
              </Button>
            </div>

            <div className="border-l border-gray-600 pl-2 ml-2">
              <span className="text-sm text-gray-400 mr-2">Элементы:</span>
              <div className="flex gap-1">
                {logicGates.slice(0, 4).map(gate => (
                  <Button
                    key={gate.type}
                    variant={selectedTool === 'gate' ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => {
                      setSelectedTool('gate');
                      handleAddComponent('gate', gate);
                    }}
                    title={gate.type}
                  >
                    {gate.symbol}
                  </Button>
                ))}
                <Button
                  variant={selectedTool === 'input' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedTool('input')}
                >
                  Вход
                </Button>
                <Button
                  variant={selectedTool === 'output' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setSelectedTool('output')}
                >
                  Выход
                </Button>
              </div>
            </div>

            <div className="border-l border-gray-600 pl-2 ml-2 flex gap-1">
              <Button variant="secondary" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="secondary" size="sm" onClick={handleResetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant={showGrid ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>

            <div className="border-l border-gray-600 pl-2 ml-2 flex gap-1">
              <Button
                variant={isSimulating ? 'primary' : 'secondary'}
                size="sm"
                onClick={handleSimulate}
                disabled={isSimulating}
              >
                {isSimulating ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isSimulating ? 'Стоп' : 'Симуляция'}
              </Button>
            </div>

            <div className="border-l border-gray-600 pl-2 ml-2 flex gap-1">
              <Button variant="secondary" size="sm" onClick={handleSaveCircuit}>
                <Save className="h-4 w-4 mr-1" />
                Сохранить
              </Button>
              <Button variant="secondary" size="sm" onClick={handleUploadClick}>
                <Upload className="h-4 w-4 mr-1" />
                Загрузить
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleLoadCircuit}
                className="hidden"
              />
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Экспорт
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardContent className="p-0 h-full">
          <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={1200}
              height={800}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`w-full h-full ${
                cursor === 'grab' ? 'cursor-grab' : 
                cursor === 'grabbing' ? 'cursor-grabbing' : 
                'cursor-crosshair'
              }`}
              style={{
                background: 'linear-gradient(45deg, #111827 25%, transparent 25%), linear-gradient(-45deg, #111827 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111827 75%), linear-gradient(-45deg, transparent 75%, #111827 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-2 text-sm">
              <div className="flex justify-between items-center">
                <div>
                  Масштаб: {Math.round(circuit.zoom * 100)}% | 
                  Элементов: {circuit.components.length} | 
                  Проводов: {circuit.wires.length}
                  {selectedComponent && ' | Выбран элемент'}
                </div>
                <div className="flex gap-4">
                  <span>Pan: {Math.round(circuit.pan.x)},{Math.round(circuit.pan.y)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// features/admin/CircuitSimManagement.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Edit, Trash2, Loader2, Code, Play, Settings } from 'lucide-react';
import CircuitSimulator from '../circuit/CircuitSimulator';
import CircuitSimForm from './CircuitSimForm';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

const Badge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Dialog = ({ open, onClose, children }: any) =>
  !open ? null : (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );

const DialogContent = ({ children }: any) => <div className="p-6">{children}</div>;
const DialogHeader = ({ children }: any) => (
  <div className="mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">{children}</div>
);
const DialogTitle = ({ children }: any) => (
  <h3 className="text-lg font-semibold text-white">{children}</h3>
);

interface CircuitProject {
  id: number;
  title: string;
  description: string;
  courseId: number;
  course?: {
    id: number;
    name: string;
  };
  isActive: boolean;
  circuitData?: any;
  createdAt: string;
  updatedAt: string;
}

const mockCircuits: CircuitProject[] = [
  {
    id: 1,
    title: 'Базовые логические элементы',
    description: 'Изучение AND, OR, NOT гейтов',
    courseId: 1,
    course: { id: 1, name: 'Основы электроники' },
    isActive: true,
    circuitData: { components: [], wires: [] },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Полусумматор',
    description: 'Схема сложения двух битов',
    courseId: 1,
    course: { id: 1, name: 'Основы электроники' },
    isActive: true,
    circuitData: { components: [], wires: [] },
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: 3,
    title: 'D-триггер',
    description: 'Элемент памяти на логических элементах',
    courseId: 2,
    course: { id: 2, name: 'Цифровая схемотехника' },
    isActive: false,
    circuitData: { components: [], wires: [] },
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-01T09:15:00Z'
  }
];

export default function CircuitSimManagement() {
  const [circuits, setCircuits] = useState<CircuitProject[]>(mockCircuits);
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitProject | null>(mockCircuits[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCircuit, setEditingCircuit] = useState<CircuitProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = () => {
    setEditingCircuit(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (circuit: CircuitProject) => {
    setEditingCircuit(circuit);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить проект схемы?')) return;
    try {
      setIsLoading(true);
      setCircuits(prev => prev.filter(circuit => circuit.id !== id));
      if (selectedCircuit?.id === id) {
        setSelectedCircuit(circuits[0] || null);
      }
    } catch (error) {
      console.error('Ошибка при удалении схемы:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: any) => {
    try {
      setIsLoading(true);
      if (editingCircuit) {
        setCircuits(prev => prev.map(circuit => 
          circuit.id === editingCircuit.id 
            ? { ...circuit, ...data, updatedAt: new Date().toISOString() }
            : circuit
        ));
      } else {
        const newCircuit: CircuitProject = {
          id: Math.max(...circuits.map(c => c.id)) + 1,
          ...data,
          circuitData: { components: [], wires: [] },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCircuits(prev => [...prev, newCircuit]);
      }
      setIsDialogOpen(false);
      setEditingCircuit(null);
    } catch (error) {
      console.error('Ошибка при сохранении схемы:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCircuit = (circuit: CircuitProject) => {
    setSelectedCircuit(circuit);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Симулятор логических схем</h1>
          <p className="text-gray-400 mt-2">
            Создание и симуляция цифровых логических схем
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Проектов: {circuits.length}
          </Badge>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> 
            Новый проект
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Проекты схем</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {circuits.map((circuit) => (
                  <div
                    key={circuit.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCircuit?.id === circuit.id
                        ? 'bg-blue-500/10 border-blue-500'
                        : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                    }`}
                    onClick={() => handleSelectCircuit(circuit)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Code className="h-4 w-4 text-blue-400" />
                          <h3 className="font-medium text-white">{circuit.title}</h3>
                          <Badge variant={circuit.isActive ? 'default' : 'secondary'}>
                            {circuit.isActive ? 'Активен' : 'Неактивен'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{circuit.description}</p>
                        <div className="text-xs text-gray-500">
                          Курс: {circuit.course?.name || `ID: ${circuit.courseId}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Обновлено: {new Date(circuit.updatedAt).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(circuit);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(circuit.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {circuits.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Проекты не найдены</p>
                  <p className="text-sm mt-2">
                    Создайте первый проект схемы
                  </p>
                  <Button onClick={handleCreate} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Новый проект
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Play className="h-5 w-5" />
                {selectedCircuit ? selectedCircuit.title : 'Симулятор логических схем'}
                {selectedCircuit && (
                  <Badge variant="outline" className="ml-2">
                    Редактирование
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100vh-200px)]">
              <CircuitSimulator />
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCircuit ? 'Редактирование проекта' : 'Создание проекта'}
            </DialogTitle>
          </DialogHeader>
          <CircuitSimForm
            circuit={editingCircuit}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
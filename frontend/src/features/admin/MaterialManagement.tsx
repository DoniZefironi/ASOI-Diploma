'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Edit, Trash2, Loader2, FileText, Video, Image, Code, FolderGit } from 'lucide-react';
import MaterialForm from './MaterialForm';
import { useMaterials } from '@/shared/api/admin';

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
    outline: 'border border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-300',
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
      <div className="bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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

const getMaterialTypeIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    lecture_slides: <Image className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    document: <FileText className="h-4 w-4" />,
    code_example: <Code className="h-4 w-4" />,
    project_template: <FolderGit className="h-4 w-4" />,
    reference: <FileText className="h-4 w-4" />,
  };
  return icons[type] || <FileText className="h-4 w-4" />;
};

const getMaterialTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    lecture_slides: 'Презентация',
    video: 'Видео',
    document: 'Документ',
    code_example: 'Пример кода',
    project_template: 'Шаблон проекта',
    reference: 'Справочник',
  };
  return types[type] || type;
};

export default function MaterialManagement() {
  const { 
    materials, 
    isLoading, 
    isError, 
    createMaterial, 
    updateMaterial, 
    deleteMaterial, 
    isCreating,
    isUpdating,
    isDeleting,
    mutate 
  } = useMaterials();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any | null>(null); 

  const handleCreate = () => {
    setEditingMaterial(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (material: any) => { 
    setEditingMaterial(material);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить материал?')) return;
    try {
      await deleteMaterial(id);
    } catch (error) {
      console.error('Ошибка при удалении материала:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingMaterial) {
        await updateMaterial({ id: editingMaterial.id, data });
      } else {
        await createMaterial(data);
      }
      setIsDialogOpen(false);
      setEditingMaterial(null);
    } catch (error) {
      console.error('Ошибка при сохранении материала:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-500">
          Ошибка загрузки материалов
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Библиотека материалов</h1>
          <p className="text-gray-400 mt-2">
            Управление учебными материалами и ресурсами
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Всего: {materials?.length || 0}
          </Badge>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> 
            Добавить материал
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-white">Список материалов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 border-b-2 border-b-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Материал
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Курс
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Дата
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {materials?.map((material: any) => ( 
                  <tr key={material.id} className="bg-gray-800 border-b-2 border-b-white">
                    <td className="px-4 py-3 text-sm text-white">{material.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          {getMaterialTypeIcon(material.type)}
                          <span className="font-medium text-white">{material.title}</span>
                        </div>
                        <span className="text-sm text-gray-400 line-clamp-1 mt-1">
                          {material.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">
                        {getMaterialTypeLabel(material.type)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-white">
                      {material.course?.name || `Курс ${material.courseId}`}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={material.isPublic ? 'default' : 'secondary'}>
                        {material.isPublic ? 'Публичный' : 'Приватный'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-white text-sm">
                      {new Date(material.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => handleEdit(material)}
                          disabled={isUpdating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDelete(material.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!materials || materials.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Материалы не найдены</p>
              <p className="text-sm mt-2">
                Добавьте первый материал в библиотеку
              </p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Добавить материал
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? 'Редактирование материала' : 'Добавление материала'}
            </DialogTitle>
          </DialogHeader>
          <MaterialForm
            material={editingMaterial}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
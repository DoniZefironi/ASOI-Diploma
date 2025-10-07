// features/admin/ScheduleManagement.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Plus, Edit, Trash2, Loader2, Calendar, Clock, MapPin, Video } from 'lucide-react';
import ScheduleForm from './ScheduleForm';
import { useSchedule } from '@/shared/api/admin';

// UI компоненты
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

const getScheduleTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    lecture: 'Лекция',
    practice: 'Практика',
    test: 'Тест',
    hackathon: 'Хакатон',
    olympiad: 'Олимпиада',
    facultative: 'Факультатив',
    internship: 'Стажировка',
  };
  return types[type] || type;
};

const getLocationLabel = (location: string) => {
  const locations: Record<string, string> = {
    online: 'Онлайн',
    auditory_1: 'Аудитория 1',
    auditory_2: 'Аудитория 2',
    auditory_3: 'Аудитория 3',
    lab_1: 'Лаборатория 1',
    lab_2: 'Лаборатория 2',
  };
  return locations[location] || location;
};

interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  type: string;
  startTime: string;
  endTime: string;
  location: string;
  meetingUrl?: string;
  courseGroupId: number;
  courseGroup?: {
    id: number;
    name: string;
    course?: {
      id: number;
      name: string;
    };
  };
  instructor?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  instructorId?: number;
  createdAt: string;
  updatedAt: string;
}

export default function ScheduleManagement() {
  const { 
    schedule, 
    isLoading, 
    isError, 
    createScheduleItem, 
    updateScheduleItem, 
    deleteScheduleItem, 
    isCreating,
    isUpdating,
    isDeleting,
    mutate 
  } = useSchedule();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState<ScheduleItem | null>(null);

  const handleCreate = () => {
    setEditingScheduleItem(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (scheduleItem: ScheduleItem) => {
    setEditingScheduleItem(scheduleItem);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить занятие из расписания?')) return;
    try {
      await deleteScheduleItem(id);
    } catch (error) {
      console.error('Error deleting schedule item:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingScheduleItem) {
        await updateScheduleItem({ id: editingScheduleItem.id, data });
      } else {
        await createScheduleItem(data);
      }
      setIsDialogOpen(false);
      setEditingScheduleItem(null);
    } catch (error) {
      console.error('Error saving schedule item:', error);
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ru-RU'),
      time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString('ru-RU')
    };
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
          Ошибка загрузки расписания
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Управление расписанием</h1>
          <p className="text-gray-400 mt-2">
            Создание и редактирование учебного расписания
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Всего: {schedule?.length || 0}
          </Badge>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> 
            Добавить занятие
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5" />
            Расписание занятий
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Занятие
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Время
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Место
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Группа
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {(schedule as ScheduleItem[]).map((item: ScheduleItem) => {
                  const startTime = formatDateTime(item.startTime);
                  const endTime = formatDateTime(item.endTime);
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 text-sm text-white">{item.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-white">{item.title}</span>
                          <span className="text-sm text-gray-400 line-clamp-1 mt-1">
                            {item.description}
                          </span>
                          {item.instructor && (
                            <span className="text-xs text-blue-400 mt-1">
                              Ментор: {item.instructor.firstName} {item.instructor.lastName}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {getScheduleTypeLabel(item.type)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-1 text-sm text-white">
                            <Calendar className="h-3 w-3" />
                            <span>{startTime.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>{startTime.time} - {endTime.time}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center space-x-1 text-sm text-white">
                            <MapPin className="h-3 w-3" />
                            <span>{getLocationLabel(item.location)}</span>
                          </div>
                          {item.meetingUrl && (
                            <div className="flex items-center space-x-1 text-sm text-blue-400">
                              <Video className="h-3 w-3" />
                              <span>Онлайн</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white">
                        {item.courseGroup?.name || `Группа ${item.courseGroupId}`}
                        {item.courseGroup?.course && (
                          <div className="text-xs text-gray-400">
                            {item.courseGroup.course.name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            onClick={() => handleEdit(item)}
                            disabled={isUpdating}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {(!schedule || schedule.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Занятия не найдены</p>
              <p className="text-sm mt-2">
                Добавьте первое занятие в расписание
              </p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Добавить занятие
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingScheduleItem ? 'Редактирование занятия' : 'Добавление занятия'}
            </DialogTitle>
          </DialogHeader>
          <ScheduleForm
            scheduleItem={editingScheduleItem}
            onSave={handleSave}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
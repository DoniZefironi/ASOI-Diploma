// components/admin/CourseManagement.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCourses } from '@/lib/api/admin';
import { BookOpen, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import CourseForm from './CourseForm';

export default function CourseManagement() {
  const { 
    courses, 
    isLoading, 
    isError, 
    createCourse, 
    updateCourse, 
    deleteCourse,
    isCreating,
    isUpdating,
    isDeleting 
  } = useCourses();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const handleCreate = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return;
    
    try {
      await deleteCourse(courseId);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingCourse) {
        await updateCourse({ id: editingCourse.id, data });
      } else {
        await createCourse(data);
      }
      setIsDialogOpen(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const getCourseTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      computer_science: 'Информатика',
      electronics: 'Электроника',
      english: 'Английский',
      iot: 'IoT',
    };
    return types[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            Ошибка загрузки курсов
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление курсами</h1>
          <p className="text-muted-foreground">
            Создание и редактирование учебных курсов
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Всего: {courses?.length || 0}
          </Badge>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Создать курс
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Список курсов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses?.map((course: any) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{course.name}</span>
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {course.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getCourseTypeLabel(course.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.duration} недель</TableCell>
                  <TableCell>
                    <Badge variant={course.isActive ? "default" : "secondary"}>
                      {course.isActive ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(course)}
                        disabled={isUpdating}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(course.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(!courses || courses.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Курсы не найдены</p>
              <p className="text-sm mt-2">
                Создайте первый курс, чтобы начать работу
              </p>
              <Button onClick={handleCreate} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Создать курс
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CourseDialog
        course={editingCourse}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingCourse(null);
        }}
        onSave={handleSave}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}

// Диалог создания/редактирования курса
function CourseDialog({ course, isOpen, onClose, onSave, isSubmitting }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {course ? 'Редактирование курса' : 'Создание курса'}
          </DialogTitle>
        </DialogHeader>
        
        <CourseForm
          course={course}
          onSave={onSave}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
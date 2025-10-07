// components/admin/CourseForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

// Zod схема валидации
const courseSchema = z.object({
  name: z.string().min(1, 'Название курса обязательно'),
  type: z.enum(['computer_science', 'electronics', 'english', 'iot']),
  description: z.string().min(10, 'Описание должно быть не менее 10 символов'),
  duration: z.coerce.number().min(1, 'Длительность должна быть не менее 1 недели'),
  imageUrl: z.string().url('Некорректный URL').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: any;
  onSave: (data: CourseFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function CourseForm({ course, onSave, onCancel, isSubmitting = false }: CourseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: course?.name || '',
      type: course?.type || 'computer_science',
      description: course?.description || '',
      duration: course?.duration || 12,
      imageUrl: course?.imageUrl || '',
      isActive: course?.isActive ?? true,
    },
  });

  const courseTypes = [
    { value: 'computer_science', label: 'Информатика' },
    { value: 'electronics', label: 'Электроника' },
    { value: 'english', label: 'Английский язык' },
    { value: 'iot', label: 'Интернет вещей (IoT)' },
  ];

  const onSubmit = (data: CourseFormData) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Название курса *</Label>
          <Input
            id="name"
            placeholder="Введите название курса"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Тип курса *</Label>
          <Select 
            defaultValue={course?.type || 'computer_science'}
            onValueChange={(value: any) => setValue('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип курса" />
            </SelectTrigger>
            <SelectContent>
              {courseTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание курса *</Label>
        <Textarea
          id="description"
          placeholder="Опишите содержание курса, цели обучения и требования..."
          rows={4}
          {...register('description')}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="duration">Длительность (недели) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            placeholder="12"
            {...register('duration')}
          />
          {errors.duration && (
            <p className="text-sm text-destructive">{errors.duration.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL изображения</Label>
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://example.com/course-image.jpg"
            {...register('imageUrl')}
          />
          {errors.imageUrl && (
            <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          defaultChecked={course?.isActive ?? true}
          onCheckedChange={(checked) => setValue('isActive', checked as boolean)}
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Активный курс
        </Label>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Отмена
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          {course ? 'Обновить курс' : 'Создать курс'}
        </Button>
      </div>
    </form>
  );
}
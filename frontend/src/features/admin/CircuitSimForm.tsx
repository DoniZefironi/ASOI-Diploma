// features/admin/CircuitSimForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Loader2 } from 'lucide-react';
import { useCourses } from '@/shared/api/admin';
import { useAuth, getCourseTypeFromRole } from '@/shared/lib/auth-context';

const courseTypeLabels: Record<string, string> = {
  'english': 'Английский язык',
  'electronics': 'Электроника',
  'computer_science': 'Информатика',
  'iot': 'IoT (Интернет вещей)',
};

const Label = ({ children, htmlFor, className = '' }: {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-white mb-2 ${className}`}>
    {children}
  </label>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  id,
  className = '',
  ...props
}: InputProps) => (
  <input
    type={type}
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white ${className}`}
    {...props}
  />
);

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Select = ({
  value,
  onChange,
  children,
  className = ''
}: SelectProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white ${className}`}
  >
    {children}
  </select>
);

interface CircuitSimFormData {
  title: string;
  description: string;
  courseId: number;
  isActive: boolean;
}

interface CircuitSimFormProps {
  circuit?: any;
  onSave: (data: CircuitSimFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function CircuitSimForm({ circuit, onSave, onCancel, isSubmitting = false }: CircuitSimFormProps) {
  const { user } = useAuth();
  const { courses, isLoading: coursesLoading } = useCourses();
  
  // Получаем тип курса ментора
  const userRoles = user?.roles || [];
  const mentorCourseType = getCourseTypeFromRole(userRoles);
  
  // Фильтруем курсы по типу курса ментора (если это ментор)
  const filteredCourses = mentorCourseType
    ? courses?.filter((c: any) => c.type === mentorCourseType)
    : courses;
    
  const [formData, setFormData] = useState<CircuitSimFormData>({
    title: circuit?.title || '',
    description: circuit?.description || '',
    courseId: circuit?.courseId || 0,
    isActive: circuit?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CircuitSimFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CircuitSimFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название проекта обязательно';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание проекта обязательно';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Выберите курс';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof CircuitSimFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {mentorCourseType && (
          <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-sm text-blue-400">
              🔬 Доступные курсы: <span className="font-semibold">{courseTypeLabels[mentorCourseType]}</span>
            </p>
          </div>
        )}
      
        <div className="space-y-2">
          <Label htmlFor="title">Название проекта *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Введите название проекта"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание проекта *</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Опишите содержание проекта..."
            rows={4}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white`}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="courseId">Курс *</Label>
          <Select
            value={formData.courseId.toString()}
            onChange={(value) => handleChange('courseId', parseInt(value))}
          >
            <option value="0">Выберите курс</option>
            {(filteredCourses as any[])?.map((course: any) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </Select>
          {errors.courseId && (
            <p className="text-sm text-red-500">{errors.courseId}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm text-gray-400">Активен</label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

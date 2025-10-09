// features/admin/CircuitSimForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Loader2 } from 'lucide-react';
import { useCourses } from '@/shared/api/admin';

// UI компоненты
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

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}

const Textarea = ({ 
  value,
  onChange,
  placeholder,
  id,
  rows = 4,
  className = '',
  ...props
}: TextareaProps) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white ${className}`}
    {...props}
  />
);

const Select = ({ 
  value, 
  onChange, 
  children,
  className = ''
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white ${className}`}
  >
    {children}
  </select>
);

const Checkbox = ({ 
  checked, 
  onChange,
  id,
  className = ''
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  className?: string;
}) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    className={`w-4 h-4 text-blue-600 rounded focus:ring-blue-500 ${className}`}
  />
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
  const { courses, isLoading: coursesLoading } = useCourses();
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
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Опишите назначение и цели проекта..."
            rows={3}
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
            {(courses as any[])?.map((course: any) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </Select>
          {errors.courseId && (
            <p className="text-sm text-red-500">{errors.courseId}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onChange={(checked) => handleChange('isActive', checked)}
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Активный проект
          </Label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {circuit ? 'Обновить проект' : 'Создать проект'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
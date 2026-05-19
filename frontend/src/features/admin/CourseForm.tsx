'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Loader2 } from 'lucide-react';

const Label = ({ children, htmlFor, className = '' }: { 
  children: React.ReactNode; 
  htmlFor?: string;
  className?: string;
}) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-white mb-2 ${className}`}>
    {children}
  </label>
);

const Input = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  id,
  min,
  max,
  className = ''
}: {
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  min?: number;
  max?: number;
  className?: string;
}) => (
  <input
    type={type}
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    min={min}
    max={max}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white ${className}`}
  />
);

const Textarea = ({ 
  value, 
  onChange, 
  placeholder,
  id,
  rows = 4,
  className = ''
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  id?: string;
  rows?: number;
  className?: string;
}) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white ${className}`}
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

interface CourseFormData {
  name: string;
  type: 'computer_science' | 'electronics' | 'english' | 'iot';
  description: string;
  duration: number;
  imageUrl: string;
  isActive: boolean;
}

interface CourseFormProps {
  course?: any;
  onSave: (data: CourseFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function CourseForm({ course, onSave, onCancel, isSubmitting = false }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    name: course?.name || '',
    type: course?.type || 'computer_science',
    description: course?.description || '',
    duration: course?.duration || 12,
    imageUrl: course?.imageUrl || '',
    isActive: course?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});

  const courseTypes = [
    { value: 'computer_science', label: 'Информатика' },
    { value: 'electronics', label: 'Электроника' },
    { value: 'english', label: 'Английский язык' },
    { value: 'iot', label: 'Интернет вещей (IoT)' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CourseFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название курса обязательно';
    }

    if (!formData.description.trim() || formData.description.length < 10) {
      newErrors.description = 'Описание должно быть не менее 10 символов';
    }

    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = 'Длительность должна быть не менее 1 недели';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Некорректный URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field: keyof CourseFormData, value: any) => {
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

  const handleNumberChange = (field: keyof CourseFormData, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    handleChange(field, isNaN(numValue) ? 0 : numValue);
  };

  const handleStringChange = (field: keyof CourseFormData, value: string) => {
    handleChange(field, value);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Название курса *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleStringChange('name', e.target.value)}
              placeholder="Введите название курса"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Тип курса *</Label>
            <Select
              value={formData.type}
              onChange={(value) => handleStringChange('type', value)}
            >
              {courseTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание курса *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleStringChange('description', e.target.value)}
            placeholder="Опишите содержание курса, цели обучения и требования..."
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="duration">Длительность (недели) *</Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => handleNumberChange('duration', e.target.value)}
              placeholder="12"
              min={1}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL изображения</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleStringChange('imageUrl', e.target.value)}
              placeholder="https://example.com/course-image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onChange={(checked) => handleChange('isActive', checked)}
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Активный курс
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
            {course ? 'Обновить курс' : 'Создать курс'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
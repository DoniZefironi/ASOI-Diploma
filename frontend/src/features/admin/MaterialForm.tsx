'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Loader2 } from 'lucide-react';
import { useCourses } from '@/shared/api/admin';

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

interface MaterialFormData {
  title: string;
  description: string;
  type: 'lecture_slides' | 'video' | 'document' | 'code_example' | 'project_template' | 'reference';
  fileUrl: string;
  thumbnailUrl?: string;
  courseId: number;
  isPublic: boolean;
}

interface MaterialFormProps {
  material?: any;
  onSave: (data: MaterialFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function MaterialForm({ material, onSave, onCancel, isSubmitting = false }: MaterialFormProps) {
  const { courses, isLoading: coursesLoading } = useCourses();
  const [formData, setFormData] = useState<MaterialFormData>({
    title: material?.title || '',
    description: material?.description || '',
    type: material?.type || 'document',
    fileUrl: material?.fileUrl || '',
    thumbnailUrl: material?.thumbnailUrl || '',
    courseId: material?.courseId || 0,
    isPublic: material?.isPublic ?? true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MaterialFormData, string>>>({});

  const materialTypes = [
    { value: 'lecture_slides', label: 'Презентация' },
    { value: 'video', label: 'Видео' },
    { value: 'document', label: 'Документ' },
    { value: 'code_example', label: 'Пример кода' },
    { value: 'project_template', label: 'Шаблон проекта' },
    { value: 'reference', label: 'Справочный материал' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MaterialFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название материала обязательно';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание материала обязательно';
    }

    if (!formData.fileUrl.trim()) {
      newErrors.fileUrl = 'URL файла обязателен';
    } else if (!isValidUrl(formData.fileUrl)) {
      newErrors.fileUrl = 'Некорректный URL';
    }

    if (formData.thumbnailUrl && !isValidUrl(formData.thumbnailUrl)) {
      newErrors.thumbnailUrl = 'Некорректный URL для превью';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Выберите курс';
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

  const handleChange = (field: keyof MaterialFormData, value: any) => {
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
          <Label htmlFor="title">Название материала *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Введите название материала"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание материала *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Опишите содержание материала..."
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Тип материала *</Label>
            <Select
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
            >
              {materialTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="fileUrl">URL файла *</Label>
          <Input
            id="fileUrl"
            type="url"
            value={formData.fileUrl}
            onChange={(e) => handleChange('fileUrl', e.target.value)}
            placeholder="https://example.com/material.pdf"
          />
          {errors.fileUrl && (
            <p className="text-sm text-red-500">{errors.fileUrl}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnailUrl">URL превью (опционально)</Label>
          <Input
            id="thumbnailUrl"
            type="url"
            value={formData.thumbnailUrl || ''}
            onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
            placeholder="https://example.com/preview.jpg"
          />
          {errors.thumbnailUrl && (
            <p className="text-sm text-red-500">{errors.thumbnailUrl}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPublic"
            checked={formData.isPublic}
            onChange={(checked) => handleChange('isPublic', checked)}
          />
          <Label htmlFor="isPublic" className="cursor-pointer">
            Публичный материал
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
            {material ? 'Обновить материал' : 'Создать материал'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
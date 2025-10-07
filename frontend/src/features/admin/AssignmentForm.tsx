// features/admin/AssignmentForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Loader2 } from 'lucide-react';
import { useCourseGroups } from '@/shared/api/admin';

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

// Обновленный Input с поддержкой всех HTML атрибутов
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

// Обновленный Textarea с поддержкой всех HTML атрибутов
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

interface AssignmentFormData {
  title: string;
  description: string;
  type: 'lecture' | 'practice' | 'test' | 'hackathon' | 'olympiad' | 'facultative';
  maxScore: number;
  deadline: string;
  courseGroupId: number;
  isActive: boolean;
  requirements?: string;
}

interface AssignmentFormProps {
  assignment?: any;
  onSave: (data: AssignmentFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function AssignmentForm({ assignment, onSave, onCancel, isSubmitting = false }: AssignmentFormProps) {
  const { groups, isLoading: groupsLoading } = useCourseGroups();
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: assignment?.title || '',
    description: assignment?.description || '',
    type: assignment?.type || 'practice',
    maxScore: assignment?.maxScore || 100,
    deadline: assignment?.deadline ? new Date(assignment.deadline).toISOString().slice(0, 16) : '',
    courseGroupId: assignment?.courseGroupId || 0,
    isActive: assignment?.isActive ?? true,
    requirements: assignment?.requirements || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AssignmentFormData, string>>>({});

  const assignmentTypes = [
    { value: 'lecture', label: 'Лекция' },
    { value: 'practice', label: 'Практика' },
    { value: 'test', label: 'Тест' },
    { value: 'hackathon', label: 'Хакатон' },
    { value: 'olympiad', label: 'Олимпиада' },
    { value: 'facultative', label: 'Факультатив' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AssignmentFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название задания обязательно';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание задания обязательно';
    }

    if (!formData.maxScore || formData.maxScore < 1) {
      newErrors.maxScore = 'Максимальный балл должен быть положительным числом';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Срок выполнения обязателен';
    }

    if (!formData.courseGroupId) {
      newErrors.courseGroupId = 'Выберите учебную группу';
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

  const handleChange = (field: keyof AssignmentFormData, value: any) => {
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

  const handleNumberChange = (field: keyof AssignmentFormData, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    handleChange(field, isNaN(numValue) ? 0 : numValue);
  };

  if (groupsLoading) {
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
          <Label htmlFor="title">Название задания *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Введите название задания"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание задания *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Опишите задание, требования и критерии оценки..."
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Тип задания *</Label>
            <Select
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
            >
              {assignmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxScore">Максимальный балл *</Label>
            <Input
              id="maxScore"
              type="number"
              value={formData.maxScore}
              onChange={(e) => handleNumberChange('maxScore', e.target.value)}
              placeholder="100"
              min={1}
            />
            {errors.maxScore && (
              <p className="text-sm text-red-500">{errors.maxScore}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="deadline">Срок выполнения *</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
            />
            {errors.deadline && (
              <p className="text-sm text-red-500">{errors.deadline}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseGroupId">Учебная группа *</Label>
            <Select
              value={formData.courseGroupId.toString()}
              onChange={(value) => handleChange('courseGroupId', parseInt(value))}
            >
              <option value="0">Выберите группу</option>
              {(groups as any[])?.map((group: any) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
            {errors.courseGroupId && (
              <p className="text-sm text-red-500">{errors.courseGroupId}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Дополнительные требования (JSON)</Label>
          <Textarea
            id="requirements"
            value={formData.requirements || ''}
            onChange={(e) => handleChange('requirements', e.target.value)}
            placeholder='{"minLength": 100, "format": "markdown", "attachments": true}'
            rows={3}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onChange={(checked) => handleChange('isActive', checked)}
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Активное задание
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
            {assignment ? 'Обновить задание' : 'Создать задание'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
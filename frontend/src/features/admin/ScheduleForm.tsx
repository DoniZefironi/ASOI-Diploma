'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Loader2 } from 'lucide-react';
import { useCourseGroups, useUsers } from '@/shared/api/admin';
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

interface ScheduleFormData {
  title: string;
  description: string;
  type: 'lecture' | 'practice' | 'test' | 'hackathon' | 'olympiad' | 'facultative' | 'internship';
  content?: string;
  videoUrl?: string;
  materialsUrl?: string;
  assignmentDescription?: string;
  startTime: string;
  endTime: string;
  location: string;
  meetingUrl?: string;
  courseGroupId: number;
  instructorId?: number;
}

interface ScheduleFormProps {
  scheduleItem?: any;
  onSave: (data: ScheduleFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ScheduleForm({ scheduleItem, onSave, onCancel, isSubmitting = false }: ScheduleFormProps) {
  const { user } = useAuth();
  const { groups, isLoading: groupsLoading } = useCourseGroups();
  const { users: allUsers, isLoading: usersLoading } = useUsers('/users/mentors');
  
  // Получаем тип курса ментора
  const userRoles = user?.roles || [];
  const mentorCourseType = getCourseTypeFromRole(userRoles);
  
  // Фильтруем группы по типу курса ментора (если это ментор)
  const filteredGroups = mentorCourseType
    ? groups?.filter((g: any) => g.course?.type === mentorCourseType)
    : groups;
  
  // Фильтруем менторов по типу курса (показываем только менторов своего направления)
  const filteredMentors = mentorCourseType
    ? allUsers?.filter((u: any) => {
        const userRole = u.roles?.find((r: any) => {
          const roleName = typeof r === 'string' ? r : r?.role || r?.name;
          return roleName && roleName.startsWith('mentor_');
        });
        if (!userRole) return false;
        const roleName = typeof userRole === 'string' ? userRole : userRole?.role || userRole?.name;
        const mentorType = roleName.split('_')[1];
        return mentorType === mentorCourseType;
      })
    : allUsers?.filter((u: any) => u.roles?.some((r: any) => {
        const roleName = typeof r === 'string' ? r : r?.role || r?.name;
        return roleName && roleName.startsWith('mentor_');
      }));
  
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: scheduleItem?.title || '',
    description: scheduleItem?.description || '',
    type: scheduleItem?.type || 'lecture',
    content: scheduleItem?.content || '',
    videoUrl: scheduleItem?.videoUrl || '',
    materialsUrl: scheduleItem?.materialsUrl || '',
    assignmentDescription: scheduleItem?.assignmentDescription || '',
    startTime: scheduleItem?.startTime ? new Date(scheduleItem.startTime).toISOString().slice(0, 16) : '',
    endTime: scheduleItem?.endTime ? new Date(scheduleItem.endTime).toISOString().slice(0, 16) : '',
    location: scheduleItem?.location || 'online',
    meetingUrl: scheduleItem?.meetingUrl || '',
    courseGroupId: scheduleItem?.courseGroupId ? Number(scheduleItem.courseGroupId) : 0,
    instructorId: scheduleItem?.instructorId ? Number(scheduleItem.instructorId) : 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ScheduleFormData, string>>>({});

  const scheduleTypes = [
    { value: 'lecture', label: 'Лекция' },
  ];

  const locations = [
    { value: 'online', label: 'Онлайн' },
    { value: 'auditory_1', label: 'Аудитория 1' },
    { value: 'auditory_2', label: 'Аудитория 2' },
    { value: 'auditory_3', label: 'Аудитория 3' },
    { value: 'lab_1', label: 'Лаборатория 1' },
    { value: 'lab_2', label: 'Лаборатория 2' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ScheduleFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название занятия обязательно';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание занятия обязательно';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Время начала обязательно';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Время окончания обязательно';
    } else if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (end <= start) {
        newErrors.endTime = 'Время окончания должно быть позже времени начала';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Место проведения обязательно';
    }

    if (!formData.courseGroupId) {
      newErrors.courseGroupId = 'Выберите учебную группу';
    }

    if (formData.meetingUrl && !isValidUrl(formData.meetingUrl)) {
      newErrors.meetingUrl = 'Некорректный URL встречи';
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

  const handleChange = (field: keyof ScheduleFormData, value: any) => {
    let newValue: any = value;
    
    // Конвертируем числовые поля в числа
    if (['courseGroupId', 'instructorId'].includes(field)) {
      newValue = value === '' || value === '0' ? undefined : parseInt(value, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (groupsLoading || usersLoading) {
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
          <Label htmlFor="title">Название занятия *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Введите название занятия"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание занятия *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Опишите содержание занятия..."
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {mentorCourseType && (
          <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
            <p className="text-sm text-blue-400">
              📅 Доступные группы: <span className="font-semibold">{courseTypeLabels[mentorCourseType]}</span>
            </p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">Тип занятия *</Label>
            <Select
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
            >
              {scheduleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Место проведения *</Label>
            <Select
              value={formData.location}
              onChange={(value) => handleChange('location', value)}
            >
              {locations.map((location) => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </Select>
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="startTime">Время начала *</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
            />
            {errors.startTime && (
              <p className="text-sm text-red-500">{errors.startTime}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">Время окончания *</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
            />
            {errors.endTime && (
              <p className="text-sm text-red-500">{errors.endTime}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="courseGroupId">Учебная группа *</Label>
            <Select
              value={formData.courseGroupId.toString()}
              onChange={(value) => handleChange('courseGroupId', parseInt(value))}
            >
              <option value="0">Выберите группу</option>
              {(filteredGroups as any[])?.map((group: any) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </Select>
            {errors.courseGroupId && (
              <p className="text-sm text-red-500">{errors.courseGroupId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructorId">Ментор</Label>
            <Select
              value={formData.instructorId?.toString() || '0'}
              onChange={(value) => handleChange('instructorId', value === '0' ? undefined : parseInt(value))}
            >
              <option value="0">Выберите ментора</option>
              {filteredMentors?.map((mentor: any) => (
                <option key={mentor.id} value={mentor.id}>
                  {mentor.firstName} {mentor.lastName}
                  {mentor.email && ` (${mentor.email})`}
                </option>
              ))}
            </Select>
            {filteredMentors?.length === 0 && !usersLoading && (
              <p className="text-sm text-yellow-500 mt-1">
                Менторы не найдены. Сначала создайте пользователей с ролью MENTOR.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetingUrl">Ссылка на онлайн-встречу</Label>
          <Input
            id="meetingUrl"
            type="url"
            value={formData.meetingUrl || ''}
            onChange={(e) => handleChange('meetingUrl', e.target.value)}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
          />
          {errors.meetingUrl && (
            <p className="text-sm text-red-500">{errors.meetingUrl}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="videoUrl">Ссылка на YouTube видео</Label>
          <Input
            id="videoUrl"
            type="url"
            value={formData.videoUrl || ''}
            onChange={(e) => handleChange('videoUrl', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-xs text-gray-400">
            Видео с YouTube будет автоматически встроено в страницу занятия
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="materialsUrl">Ссылка на материалы</Label>
          <Input
            id="materialsUrl"
            type="url"
            value={formData.materialsUrl || ''}
            onChange={(e) => handleChange('materialsUrl', e.target.value)}
            placeholder="https://drive.google.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignmentDescription">Описание задания</Label>
          <Textarea
            id="assignmentDescription"
            value={formData.assignmentDescription || ''}
            onChange={(e) => handleChange('assignmentDescription', e.target.value)}
            placeholder="Опишите задание для студентов..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Дополнительный контент</Label>
          <Textarea
            id="content"
            value={formData.content || ''}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder="Дополнительная информация, заметки, ссылки..."
            rows={4}
          />
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
            {scheduleItem ? 'Обновить занятие' : 'Создать занятие'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
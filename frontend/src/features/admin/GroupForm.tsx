'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useCourses } from '@/shared/api/admin';
import { useAuth, getCourseTypeFromRole } from '@/shared/lib/auth-context';

const courseTypeLabels: Record<string, string> = {
  'english': 'Английский язык',
  'electronics': 'Электроника',
  'computer_science': 'Информатика',
  'iot': 'IoT (Интернет вещей)',
};

export default function GroupForm({ group, onSave, onCancel, isSubmitting }: any) {
  const { user } = useAuth();
  const { courses } = useCourses();
  
  // Получаем тип курса ментора
  const userRoles = user?.roles || [];
  const mentorCourseType = getCourseTypeFromRole(userRoles);
  
  // Фильтруем курсы по типу курса ментора (если это ментор)
  const filteredCourses = mentorCourseType
    ? courses?.filter((c: any) => c.type === mentorCourseType)
    : courses;

  const [formData, setFormData] = useState({
    name: group?.name || '',
    year: group?.year || new Date().getFullYear(),
    semester: group?.semester || 1,
    maxStudents: group?.maxStudents || 20,
    isActive: group?.isActive ?? true,
    startDate: group?.startDate?.split('T')[0] || '',
    endDate: group?.endDate?.split('T')[0] || '',
    courseId: group?.course?.id || '',
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    let newValue: any = type === 'checkbox' ? checked : value;
    
    // Конвертируем числовые поля в числа
    if (['year', 'semester', 'maxStudents', 'courseId'].includes(name)) {
      newValue = value === '' ? 0 : parseInt(value, 10);
    }
    
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название группы обязательно';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Выберите курс';
    }

    if (!formData.year || formData.year < 1900 || formData.year > 2100) {
      newErrors.year = 'Введите корректный год';
    }

    if (!formData.semester || formData.semester < 1 || formData.semester > 2) {
      newErrors.semester = 'Семестр должен быть 1 или 2';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Дата начала обязательна';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Дата окончания обязательна';
    }

    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'Дата окончания должна быть позже даты начала';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mentorCourseType && (
        <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-400">
            📚 Доступные курсы: <span className="font-semibold">{courseTypeLabels[mentorCourseType]}</span>
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Название</label>
          <Input name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-400">Курс</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-background text-black"
          >
            <option value="">Выберите курс</option>
            {filteredCourses?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.courseId && <p className="text-sm text-red-500">{errors.courseId}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-400">Год</label>
          <Input type="number" name="year" value={formData.year} onChange={handleChange} />
          {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-400">Семестр</label>
          <Input type="number" name="semester" value={formData.semester} onChange={handleChange} />
          {errors.semester && <p className="text-sm text-red-500">{errors.semester}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-400">Макс. студентов</label>
          <Input type="number" name="maxStudents" value={formData.maxStudents} onChange={handleChange} />
        </div>

        <div className="flex items-center gap-2 mt-6">
          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
          <label className="text-sm text-gray-400">Активна</label>
        </div>

        <div>
          <label className="text-sm text-gray-400">Дата начала</label>
          <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
        </div>

        <div>
          <label className="text-sm text-gray-400">Дата окончания</label>
          <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>
    </form>
  );
}

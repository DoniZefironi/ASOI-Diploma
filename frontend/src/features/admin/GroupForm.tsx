'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useCourses } from '@/shared/api/admin';

export default function GroupForm({ group, onSave, onCancel, isSubmitting }: any) {
  const { courses } = useCourses();
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
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Название</label>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label className="text-sm text-gray-400">Курс</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="w-full border rounded p-2 bg-background text-black"
            required
          >
            <option value="">Выберите курс</option>
            {courses?.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-400">Год</label>
          <Input type="number" name="year" value={formData.year} onChange={handleChange} required />
        </div>

        <div>
          <label className="text-sm text-gray-400">Семестр</label>
          <Input type="number" name="semester" value={formData.semester} onChange={handleChange} required />
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
          <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>

        <div>
          <label className="text-sm text-gray-400">Дата окончания</label>
          <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
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

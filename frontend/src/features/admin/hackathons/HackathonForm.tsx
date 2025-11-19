'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';

interface HackathonFormProps {
  hackathon?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function HackathonForm({ hackathon, onSave, onCancel, isSubmitting }: HackathonFormProps) {
  const [formData, setFormData] = useState({
    name: hackathon?.name || '',
    description: hackathon?.description || '',
    startDate: hackathon?.startDate ? new Date(hackathon.startDate).toISOString().split('T')[0] : '',
    endDate: hackathon?.endDate ? new Date(hackathon.endDate).toISOString().split('T')[0] : '',
    rules: hackathon?.rules || '',
    maxTeamSize: hackathon?.maxTeamSize || 5,
    isPublic: hackathon?.isPublic ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Название хакатона *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Введите название хакатона"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Описание *
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Опишите хакатон, его цели и задачи"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Дата начала *
            </label>
            <input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Дата окончания *
            </label>
            <input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Максимальный размер команды
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.maxTeamSize}
            onChange={(e) => handleChange('maxTeamSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Правила и условия
          </label>
          <textarea
            value={formData.rules}
            onChange={(e) => handleChange('rules', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Опишите правила участия, критерии оценки и другую важную информацию"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => handleChange('isPublic', e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="isPublic" className="text-sm font-medium text-gray-300">
            Публичный хакатон (доступен всем пользователям)
          </label>
        </div>
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
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : hackathon ? 'Обновить' : 'Создать'}
        </Button>
      </div>
    </form>
  );
}
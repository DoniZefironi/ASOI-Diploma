'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { hackathonsApi, Hackathon } from '@/shared/api/hackathons';
import { useAuth } from '@/shared/lib/auth-context';

export default function HackathonsPage() {
  const { user, hasRole } = useAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isAdmin = hasRole('admin') || hasRole('mentor');

  useEffect(() => {
    loadHackathons();
  }, []);

  const loadHackathons = async () => {
    try {
      const data = await hackathonsApi.getAll();
      setHackathons(data || []);
    } catch (error) {
      console.error('Failed to load hackathons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот хакатон?')) return;
    try {
      await hackathonsApi.delete(id);
      setHackathons(hackathons.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to delete hackathon:', error);
      alert('Не удалось удалить хакатон');
    }
  };

  const getStatusBadge = (hackathon: Hackathon) => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const endDate = new Date(hackathon.endDate);
    const regDeadline = hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline) : null;

    if (now > endDate) {
      return <span className="px-3 py-1 bg-gray-600 text-white text-xs rounded-full">Завершён</span>;
    }
    if (now > startDate) {
      return <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">Идёт</span>;
    }
    if (regDeadline && now > regDeadline) {
      return <span className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-full">Регистрация закрыта</span>;
    }
    if (regDeadline) {
      return <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Регистрация</span>;
    }
    return <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full">Скоро</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D1117] py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Хакатоны</h1>
          <p className="text-gray-400 mb-8">Участвуй в хакатонах и выигрывай призы</p>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {isAdmin && (
          <div className="mb-8 flex justify-between items-center">
            <Link
              href="/admin/hackathons"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Панель управления
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Создать хакатон
            </button>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hackathons.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">
              Хакатонов пока нет
            </div>
          ) : (
            hackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="bg-[#161B22] rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  {getStatusBadge(hackathon)}
                  {hackathon.prizePool && (
                    <span className="text-green-400 font-semibold">
                      💰 {hackathon.prizePool.toLocaleString()} ₽
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{hackathon.title}</h3>
                {hackathon.theme && (
                  <p className="text-blue-400 text-sm mb-3">🏷️ {hackathon.theme}</p>
                )}
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{hackathon.description}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span>📅 Начало:</span>
                    <span>{new Date(hackathon.startDate).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🏁 Конец:</span>
                    <span>{new Date(hackathon.endDate).toLocaleDateString('ru-RU')}</span>
                  </div>
                  {hackathon.registrationDeadline && (
                    <div className="flex justify-between">
                      <span>⏰ Регистрация до:</span>
                      <span>{new Date(hackathon.registrationDeadline).toLocaleDateString('ru-RU')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>👥 Команда:</span>
                    <span>{hackathon.minTeamSize}-{hackathon.maxTeamSize} чел.</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/hackathons/${hackathon.id}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Подробнее
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        href={`/admin/hackathons/${hackathon.id}`}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => handleDelete(hackathon.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {showCreateModal && (
          <CreateHackathonModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              loadHackathons();
            }}
          />
        )}
      </div>
    </div>
  );
}

interface CreateHackathonModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function CreateHackathonModal({ onClose, onSuccess }: CreateHackathonModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxTeamSize: '5',
    minTeamSize: '3',
    prizePool: '',
    isActive: 'true',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await hackathonsApi.create({
        title: formData.title,
        description: formData.description,
        theme: formData.theme || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        registrationDeadline: formData.registrationDeadline
          ? new Date(formData.registrationDeadline).toISOString()
          : undefined,
        maxTeamSize: parseInt(formData.maxTeamSize),
        minTeamSize: parseInt(formData.minTeamSize),
        prizePool: formData.prizePool ? parseFloat(formData.prizePool) : undefined,
        isActive: formData.isActive === 'true',
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create hackathon:', error);
      alert('Не удалось создать хакатон');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161B22] rounded-xl p-8 max-w-2xl w-full mx-4 border border-gray-700 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Создать хакатон</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Название
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Тема
            </label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Например: AI и машинное обучение"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Начало
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Конец
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Регистрация до
            </label>
            <input
              type="datetime-local"
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Мин. команда
              </label>
              <input
                type="number"
                value={formData.minTeamSize}
                onChange={(e) => setFormData({ ...formData, minTeamSize: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Макс. команда
              </label>
              <input
                type="number"
                value={formData.maxTeamSize}
                onChange={(e) => setFormData({ ...formData, maxTeamSize: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Призовой фонд
              </label>
              <input
                type="number"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                className="w-full px-4 py-2 bg-[#0D1117] border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                placeholder="₽"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

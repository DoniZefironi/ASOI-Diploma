// features/admin/CourseRegistrations.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { BookOpen, Clock, Check, X, Loader2, Filter, AlertTriangle } from 'lucide-react';
import { useAdminCourseRegistrations, useApproveRegistration, useRejectRegistration, AdminCourseRegistration as RawAdminCourseRegistration } from '@/shared/api/admin';

// Тип для локальной обработки дат
interface ProcessedRegistration {
  id: number;
  user: RawAdminCourseRegistration['user'];
  courseGroup: RawAdminCourseRegistration['courseGroup'];
  userId: number;
  courseGroupId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // Приводим к верхнему регистру
  registeredAt: Date;
  approvedAt?: Date;
  approvedBy?: number;
}

// Тип для фильтра статуса
type StatusFilterType = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED';

// Компонент Badge
const Badge = ({ children, variant = 'default', className = '' }: {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'pending';
  className?: string;
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variants = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default function CourseRegistrationsPage() {
  const [registrations, setRegistrations] = useState<ProcessedRegistration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<ProcessedRegistration[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');

  // Состояния для модального окна
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null);
  const [dialogRegistrationId, setDialogRegistrationId] = useState<number | null>(null);

  const { registrations: fetchedRegistrations, isLoading, isError, mutate } = useAdminCourseRegistrations();
  const { approve, isApproving } = useApproveRegistration();
  const { reject, isRejecting } = useRejectRegistration();

  useEffect(() => {
    if (fetchedRegistrations) {
      const processed: ProcessedRegistration[] = fetchedRegistrations.map(reg => ({
        ...reg,
        // Приводим статус к верхнему регистру
        status: reg.status.toUpperCase() as 'PENDING' | 'APPROVED' | 'REJECTED',
        registeredAt: new Date(reg.registeredAt),
        approvedAt: reg.approvedAt ? new Date(reg.approvedAt) : undefined,
      }));
      setRegistrations(processed);
    }
  }, [fetchedRegistrations]);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredRegistrations(registrations);
    } else {
      setFilteredRegistrations(
        registrations.filter((reg: ProcessedRegistration) => reg.status === statusFilter)
      );
    }
  }, [registrations, statusFilter]);

  const handleApprove = (id: number) => {
    setDialogRegistrationId(id);
    setDialogAction('approve');
    setDialogOpen(true);
  };

  const handleReject = (id: number) => {
    setDialogRegistrationId(id);
    setDialogAction('reject');
    setDialogOpen(true);
  };

  const confirmAction = () => {
    if (dialogAction === 'approve' && dialogRegistrationId !== null) {
      approve(dialogRegistrationId);
    } else if (dialogAction === 'reject' && dialogRegistrationId !== null) {
      reject(dialogRegistrationId);
    }
    setDialogOpen(false);
    setDialogAction(null);
    setDialogRegistrationId(null);
  };

  const cancelAction = () => {
    setDialogOpen(false);
    setDialogAction(null);
    setDialogRegistrationId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            Ошибка загрузки заявок. Пожалуйста, попробуйте позже.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Найдем заявку для модального окна
  const dialogRegistration = registrations.find(r => r.id === dialogRegistrationId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Заявки на курсы</h1>
          <p className="text-gray-400">
            Управление заявками пользователей на участие в учебных группах
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Всего: {registrations.length}
          </Badge>
          <Badge variant="pending" className="text-sm">
            Ожидают: {registrations.filter(r => r.status === 'PENDING').length}
          </Badge>
        </div>
      </div>

      {/* Фильтр по статусу */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="h-5 w-5" />
            Фильтры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              onClick={() => setStatusFilter('all')}
              className="gap-1"
            >
              Все
            </Button>
            <Button
              variant={statusFilter === 'PENDING' ? 'primary' : 'outline'}
              onClick={() => setStatusFilter('PENDING')}
              className="gap-1"
            >
              <Clock className="h-4 w-4" />
              Ожидают
            </Button>
            <Button
              variant={statusFilter === 'APPROVED' ? 'primary' : 'outline'}
              onClick={() => setStatusFilter('APPROVED')}
              className="gap-1"
            >
              <Check className="h-4 w-4" />
              Одобрены
            </Button>
            <Button
              variant={statusFilter === 'REJECTED' ? 'primary' : 'outline'}
              onClick={() => setStatusFilter('REJECTED')}
              className="gap-1"
            >
              <X className="h-4 w-4" />
              Отклонены
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Таблица заявок */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BookOpen className="h-5 w-5" />
            Список заявок
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr className="bg-gray-800 border-b-white border-b-2">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Пользователь
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Группа
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Дата подачи
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-sm text-gray-400 dark:text-white text-center">
                      Нет заявок для отображения.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="bg-gray-800 border-b-white border-b-2">
                      <td className="px-4 py-3 text-sm text-white font-medium">{reg.id}</td>
                      <td className="px-4 py-3 text-sm text-white">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {reg.user.firstName} {reg.user.lastName}
                          </span>
                          <span className="text-xs text-gray-400">
                            ID: {reg.user.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white">{reg.courseGroup.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          variant={
                            reg.status === 'PENDING' ? 'pending' :
                            reg.status === 'APPROVED' ? 'default' : 'destructive'
                          }
                        >
                          {reg.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-white">
                        {reg.registeredAt.toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        {reg.status === 'PENDING' ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(reg.id)}
                              className="gap-1 text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                              disabled={isApproving || isRejecting}
                            >
                              <Check className="h-4 w-4" />
                              Одобрить
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(reg.id)}
                              className="gap-1 text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                              disabled={isApproving || isRejecting}
                            >
                              <X className="h-4 w-4" />
                              Отклонить
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Модальное окно подтверждения */}
      {dialogOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" 
          onClick={cancelAction}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Подтверждение действия
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {dialogAction === 'approve' && dialogRegistration && (
                `Вы уверены, что хотите одобрить заявку пользователя ${dialogRegistration.user.firstName} ${dialogRegistration.user.lastName} на группу "${dialogRegistration.courseGroup.name}"?`
              )}
              {dialogAction === 'reject' && dialogRegistration && (
                `Вы уверены, что хотите отклонить заявку пользователя ${dialogRegistration.user.firstName} ${dialogRegistration.user.lastName} на группу "${dialogRegistration.courseGroup.name}"?`
              )}
            </p>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="secondary" onClick={cancelAction} disabled={isApproving || isRejecting}>
                Отмена
              </Button>
              <Button 
                onClick={confirmAction} 
                disabled={isApproving || isRejecting}
                className={dialogAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {isApproving || isRejecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Обработка...
                  </>
                ) : (
                  dialogAction === 'approve' ? 'Одобрить' : 'Отклонить'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
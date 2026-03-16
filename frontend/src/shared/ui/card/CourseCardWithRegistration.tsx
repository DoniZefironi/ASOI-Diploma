import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useCourseGroups, useRegisterToCourse, useUserRegistrations } from '@/shared/api/admin';
import { useAuth } from '@/shared/lib/auth-context';

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  levelColor: string;
  category: string;
  duration?: number;
  imageUrl?: string;
  isActive?: boolean;
}

interface CourseCardWithRegistrationProps {
  course: Course;
  index: number;
}

export const CourseCardWithRegistration = ({ course, index }: CourseCardWithRegistrationProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [showGroups, setShowGroups] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { groups, isLoading: groupsLoading, error: groupsError, mutate } = useCourseGroups(course.id);
  const { register, isRegistering } = useRegisterToCourse();
  const { registrations, isLoading: registrationsLoading, error: registrationsError, mutate: mutateRegistrations } = useUserRegistrations();
  
  // Debug log
  useEffect(() => {
    console.log('CourseCard mounted:', course.id);
    console.log('Registrations:', registrations);
    console.log('Groups:', groups);
  }, [registrations, groups, course.id]);

  const handleRegisterClick = async (courseGroupId: number, groupName: string) => {
    if (isRegistering) return;

    // Показываем уведомление перед регистрацией
    const confirmed = window.confirm(
      '⚠️ Внимание!\n\n' +
      'После записи на курс вам потребуется:\n' +
      '1. Выйти из системы\n' +
      '2. Войти заново для применения новой роли\n\n' +
      'Продолжить?'
    );

    if (!confirmed) return;

    setRegistrationError(null);
    setSuccessMessage(null);

    try {
      await register({ courseGroupId });
      setSuccessMessage(`Вы успешно записаны на группу "${groupName}"!\n\nСейчас вы будете перенаправлены на страницу входа.`);

      // Выход из системы через 2 секунды
      setTimeout(() => {
        logout();
        router.push('/auth');
      }, 2000);

    } catch (error: any) {
      console.error('Registration failed:', error);

      // Если пользователь уже записан - перенаправляем на страницу курса
      if (error.message?.includes('already enrolled') || error.message?.includes('already applied')) {
        setSuccessMessage('Вы уже записаны на этот курс');
        await mutateRegistrations();
        setTimeout(() => {
          router.push(`/courses/${course.id}`);
        }, 1500);
        return;
      }

      if (error.message?.includes('pending')) {
        setRegistrationError('Ваша заявка уже на рассмотрении');
      } else if (error.message?.includes('Course group is full')) {
        setRegistrationError('Эта группа уже заполнена');
      } else if (error.message?.includes('Course group not found')) {
        setRegistrationError('Группа не найдена');
      } else if (error.message?.includes('Unauthorized')) {
        setRegistrationError('Необходимо авторизоваться');
      } else {
        setRegistrationError('Ошибка при регистрации. Попробуйте позже.');
      }

      setTimeout(() => {
        setRegistrationError(null);
      }, 5000);
    }
  };

  const getUserRegistrationStatus = (groupId: number) => {
    const userRegistration = registrations?.find(
      reg => reg.courseGroupId === groupId
    );
    const status = userRegistration ? userRegistration.status?.toLowerCase() : null;
    console.log(`Group ${groupId} status:`, status, 'All registrations:', registrations);
    return status;
  };

  const getRegistrationButtonProps = (groupId: number) => {
    const status = getUserRegistrationStatus(groupId);

    switch (status) {
      case 'pending':
        return {
          text: 'Заявка на рассмотрении',
          disabled: true,
          variant: 'secondary' as const,
        };
      case 'approved':
        return {
          text: 'Вы записаны',
          disabled: false,
          variant: 'primary' as const,
          action: 'go' as const,
        };
      case 'rejected':
        return {
          text: 'Заявка отклонена',
          disabled: false,
          variant: 'secondary' as const,
        };
      default:
        return {
          text: isRegistering ? 'Запись...' : 'Записаться',
          disabled: isRegistering,
          variant: 'primary' as const,
          action: 'register' as const,
        };
    }
  };

  const displayGroups = groups || [];
  
  console.log('CourseCard props:', { course, groups, registrations, showGroups });

  return (
    <Card className="h-full bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden bg-gray-700 flex items-center justify-center">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="object-cover group-hover:scale-110 transition-transform duration-500 w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
            <span className="text-gray-400 text-4xl">📚</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
            {course.level}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col">
        <h3 className="font-bold text-white mb-3 text-lg leading-tight">
          {course.title}
        </h3>
        <p className="text-gray-300 leading-relaxed mb-5 flex-grow">
          {course.description}
        </p>
        
        {/* Сообщения об ошибках и успехе */}
        {registrationError && (
          <div className="mb-3 p-2 bg-red-900 border border-red-700 text-red-200 rounded text-sm">
            {registrationError}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-3 p-2 bg-green-900 border border-green-700 text-green-200 rounded text-sm">
            {successMessage}
          </div>
        )}

        <div className="mt-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowGroups(!showGroups)}
            disabled={registrationsLoading}
            className="w-full"
          >
            {showGroups ? 'Скрыть группы' : 'Зарегистрироваться на курс'}
          </Button>

          {showGroups && (
            <div className="mt-4 space-y-3">
              {groupsLoading && (
                <div className="text-center py-2">
                  <p className="text-gray-400">Загрузка групп...</p>
                </div>
              )}
              
              {groupsError && (
                <div className="p-2 bg-red-900 border border-red-700 text-red-200 rounded text-sm">
                  Ошибка загрузки групп: {groupsError.message}
                </div>
              )}
              
              {!groupsLoading && !groupsError && displayGroups.length === 0 && (
                <div className="text-center py-2">
                  <p className="text-gray-400">Нет доступных групп для этого курса</p>
                </div>
              )}
              
              {displayGroups.map((group) => {
                const buttonProps = getRegistrationButtonProps(group.id);
                const isRejected = getUserRegistrationStatus(group.id) === 'rejected';

                return (
                  <div
                    key={group.id}
                    className={`flex justify-between items-center p-3 rounded ${
                      isRejected ? 'bg-red-900 bg-opacity-30' : 'bg-gray-700'
                    }`}
                  >
                    <div className="flex-1">
                      <span className="text-white block font-medium">{group.name}</span>
                      <span className="text-gray-400 text-xs block mt-1">
                        Макс. студентов: {group.maxStudents}
                      </span>
                      {group.startDate && (
                        <span className="text-gray-400 text-xs block">
                          Начало: {new Date(group.startDate).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>

                    <Button
                      variant={buttonProps.variant}
                      size="sm"
                      onClick={() => {
                        if (buttonProps.action === 'go') {
                          router.push(`/courses/${course.id}`);
                        } else {
                          handleRegisterClick(group.id, group.name);
                        }
                      }}
                      disabled={buttonProps.disabled}
                      className="ml-2 whitespace-nowrap"
                    >
                      {buttonProps.text}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
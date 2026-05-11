import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

  const categoryConfig: Record<string, { icon: string; bg: string; border: string }> = {
    'electronics':      { icon: '⚡', bg: 'bg-amber-500/20',  border: 'border-l-amber-500' },
    'computer-science': { icon: '💻', bg: 'bg-blue-500/20',   border: 'border-l-blue-500' },
    'iot':              { icon: '🌐', bg: 'bg-green-500/20',  border: 'border-l-green-500' },
    'language':         { icon: '📚', bg: 'bg-purple-500/20', border: 'border-l-purple-500' },
  };
  const cfg = categoryConfig[course.category] ?? { icon: '📖', bg: 'bg-gray-500/20', border: 'border-l-gray-500' };

  return (
    <div className={`border-l-4 ${cfg.border} bg-gray-800/60 hover:bg-gray-800 transition-colors duration-200`}>
      <div className="flex items-center gap-4 px-5 py-4">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-xl ${cfg.bg}`}>
          {cfg.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base leading-tight truncate">{course.title}</h3>
          <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{course.description}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {course.duration && (
            <span className="text-gray-500 text-sm whitespace-nowrap hidden sm:block">{course.duration}ч</span>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap hidden md:block ${course.levelColor}`}>
            {course.level}
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowGroups(!showGroups)}
            disabled={registrationsLoading}
            className="whitespace-nowrap"
          >
            {showGroups ? 'Скрыть' : 'Записаться'}
          </Button>
        </div>
      </div>

      {registrationError && (
        <div className="mx-5 mb-3 p-2 bg-red-900 border border-red-700 text-red-200 rounded text-sm">
          {registrationError}
        </div>
      )}

      {successMessage && (
        <div className="mx-5 mb-3 p-2 bg-green-900 border border-green-700 text-green-200 rounded text-sm">
          {successMessage}
        </div>
      )}

      {showGroups && (
        <div className="px-5 pb-4 space-y-2 ml-15">
          {groupsLoading && <p className="text-gray-400 text-sm py-1">Загрузка групп...</p>}

          {groupsError && (
            <div className="p-2 bg-red-900 border border-red-700 text-red-200 rounded text-sm">
              Ошибка загрузки групп
            </div>
          )}

          {!groupsLoading && !groupsError && displayGroups.length === 0 && (
            <p className="text-gray-400 text-sm py-1">Нет доступных групп</p>
          )}

          {displayGroups.map((group) => {
            const buttonProps = getRegistrationButtonProps(group.id);
            const isRejected = getUserRegistrationStatus(group.id) === 'rejected';

            return (
              <div
                key={group.id}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  isRejected ? 'bg-red-900/30' : 'bg-gray-700/60'
                }`}
              >
                <div>
                  <span className="text-white text-sm font-medium block">{group.name}</span>
                  <span className="text-gray-400 text-xs">
                    До {group.maxStudents} студентов
                    {group.startDate && ` · с ${new Date(group.startDate).toLocaleDateString('ru-RU')}`}
                  </span>
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
                  className="ml-3 whitespace-nowrap"
                >
                  {buttonProps.text}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useHackathon } from '@/shared/api/admin/hackathons';
import { Award, Users, Calendar, FileText, GitBranch, Video, ExternalLink, Loader2, ArrowLeft } from 'lucide-react';

const Badge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success';
  className?: string;
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variants = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline: 'border border-gray-300 text-gray-300 dark:border-gray-600 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default function HackathonDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const id = params?.id ? parseInt(params.id as string) : null;
  const { hackathon, isLoading, isError } = useHackathon(id || 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Ожидание', variant: 'secondary' as const },
      active: { label: 'Активен', variant: 'success' as const },
      completed: { label: 'Завершен', variant: 'default' as const },
      cancelled: { label: 'Отменен', variant: 'destructive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!id || isNaN(id)) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Неверный ID хакатона</p>
            <Button 
              onClick={() => router.push('/admin/hackathons')}
              className="mt-4"
              variant="secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку хакатонов
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError || !hackathon) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-500">
            <p>Ошибка загрузки хакатона</p>
            <Button 
              onClick={() => router.push('/admin/hackathons')}
              className="mt-4"
              variant="secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к списку хакатонов
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="secondary"
          onClick={() => router.push('/admin/hackathons')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
        
        <div className="flex-1 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">{hackathon.name}</h1>
            <p className="text-gray-400">{hackathon.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(hackathon.status)}
            <Badge variant={hackathon.isPublic ? 'default' : 'secondary'}>
              {hackathon.isPublic ? 'Публичный' : 'Закрытый'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Даты проведения</p>
                <p className="text-sm text-white">
                  {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Команд</p>
                <p className="text-2xl font-bold text-white">
                  {hackathon.teams?.length || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Размер команды</p>
                <p className="text-2xl font-bold text-white">
                  до {hackathon.maxTeamSize} чел.
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {hackathon.rules && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5" />
              Правила и условия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap">{hackathon.rules}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Команды ({hackathon.teams?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hackathon.teams?.map((team) => (
              <div key={team.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{team.name}</h3>
                    <p className="text-sm text-gray-400">Код для вступления: {team.joinCode}</p>
                  </div>
                  <Badge variant={
                    team.status === 'approved' ? 'success' : 
                    team.status === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {team.status === 'approved' ? 'Одобрена' : 
                     team.status === 'rejected' ? 'Отклонена' : 'На рассмотрении'}
                  </Badge>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Участники:</h4>
                  <div className="space-y-1">
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between text-sm">
                        <span className="text-white">
                          {member.user?.firstName} {member.user?.lastName}
                          {member.role === 'captain' && (
                            <Badge variant="outline" className="ml-2">Капитан</Badge>
                          )}
                        </span>
                        <span className="text-gray-400">{member.user?.email}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {team.project && (
                  <div className="border-t border-gray-700 pt-3">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Проект:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{team.project.name}</span>
                        <Badge variant={team.project.isSubmitted ? 'success' : 'secondary'}>
                          {team.project.isSubmitted ? 'Сдан' : 'В работе'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">{team.project.description}</p>
                      
                      {team.project.repositoryUrl && (
                        <div className="flex items-center gap-2 text-sm">
                          <GitBranch className="h-4 w-4 text-gray-400" />
                          <a 
                            href={team.project.repositoryUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            Репозиторий <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      
                      {team.project.presentationUrl && (
                        <div className="flex items-center gap-2 text-sm">
                          <Video className="h-4 w-4 text-gray-400" />
                          <a 
                            href={team.project.presentationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            Презентация <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {(!hackathon.teams || hackathon.teams.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Команды еще не зарегистрированы</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
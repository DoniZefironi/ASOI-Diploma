'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { User, Shield, Loader2 } from 'lucide-react';
import { useUsers } from '@/shared/api/admin';

const Badge = ({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variants = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Dialog = ({ 
  open, 
  onOpenChange, 
  children 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
    {children}
  </div>
);

const DialogTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

const Table = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
    <table className="w-full">
      {children}
    </table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50 dark:bg-gray-800">
    {children}
  </thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
    {children}
  </tbody>
);

const TableRow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <tr className={`bg-gray-800 border-b-white border-b-2 ${className}`}>
    {children}
  </tr>
);

const TableHead = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 text-sm text-gray-900 dark:text-white ${className}`}>
    {children}
  </td>
);

export default function UserManagement() {
  const { users, isLoading, isError, updateUserRoles, mutate, isUpdating } = useUsers();  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [localUpdating, setLocalUpdating] = useState(false);

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
            Ошибка загрузки пользователей
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleEditRoles = (user: any) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRoles = async (roles: string[]) => {
    if (!selectedUser) return;
    
    setLocalUpdating(true);
    try {
      await updateUserRoles({ 
        id: selectedUser.id, 
        roles 
      });

      mutate();
      
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
      alert('Роли успешно обновлены!');
    } catch (error) {
      console.error('Error updating roles:', error);
      alert('Ошибка при обновлении ролей');
    } finally {
      setLocalUpdating(false);
    }
  };

  const getUserRoles = (user: any) => {
    if (!user.roles) return [];

    return user.roles.map((role: any) => {
      if (typeof role === 'string') return role;
      return role.role || role;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Управление пользователями</h1>
          <p className="text-gray-400">
            Управление пользователями и их ролями в системе
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            Всего: {users?.length || 0}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5" />
            Список пользователей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Пользователь</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Роли</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user: any) => {
                const userRoles = getUserRoles(user);
                
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-white">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-sm text-gray-400">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Дата не указана'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {userRoles.map((role: string) => (
                          <Badge 
                            key={role} 
                            variant={
                              role === 'admin' ? 'destructive' : 
                              role === 'mentor' ? 'default' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleEditRoles(user)}
                        className="gap-1"
                        disabled={isUpdating}
                      >
                        <Shield className="h-4 w-4" />
                        Роли
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {(!users || users.length === 0) && (
            <div className="text-center py-8 text-gray-400">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Пользователи не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>

      <RoleDialog
        user={selectedUser}
        isOpen={isRoleDialogOpen}
        onClose={() => {
          setIsRoleDialogOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleUpdateRoles}
        isUpdating={localUpdating || isUpdating}
      />
    </div>
  );
}

function RoleDialog({ user, isOpen, onClose, onSave, isUpdating }: any) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (user && isOpen) {
      const userRoles = user.roles?.map((r: any) => {
        if (typeof r === 'string') return r;
        return r.role || r;
      }) || [];
      setSelectedRoles(userRoles);
    }
  }, [user, isOpen]);

  const availableRoles = [
    { value: 'registered_user', label: 'Зарегистрированный пользователь' },
    { value: 'student', label: 'Студент' },
    { value: 'mentor', label: 'Ментор' },
    { value: 'admin', label: 'Администратор' },
  ];

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSave = () => {
    if (selectedRoles.length === 0) {
      alert('Выберите хотя бы одну роль');
      return;
    }
    onSave(selectedRoles);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Редактирование ролей
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Пользователь:</p>
            <p className="text-lg text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Роли пользователя:</p>
            <div className="space-y-2">
              {availableRoles.map((role) => (
                <label 
                  key={role.value} 
                  className="flex items-center space-x-3 p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-700 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.value)}
                    onChange={() => toggleRole(role.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isUpdating}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{role.label}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {role.value.replace('_', ' ')}
                    </p>
                  </div>
                  <Badge variant={
                    role.value === 'admin' ? 'destructive' : 
                    role.value === 'mentor' ? 'default' : 'secondary'
                  }>
                    {role.value}
                  </Badge>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={onClose} disabled={isUpdating}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Сохранение...
                </>
              ) : (
                'Сохранить изменения'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
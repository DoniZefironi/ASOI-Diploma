// components/admin/UserManagement.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUsers } from '@/lib/api/admin';
import { User, Shield, Loader2 } from 'lucide-react';

export default function UserManagement() {
  const { users, isLoading, isError, updateRoles } = useUsers();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
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
    
    try {
      await updateRoles({ 
        id: selectedUser.id, 
        data: { roles } 
      });
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating roles:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление пользователями</h1>
          <p className="text-muted-foreground">
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
          <CardTitle className="flex items-center gap-2">
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
              {users?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map((role: any) => (
                        <Badge 
                          key={role.role} 
                          variant={
                            role.role === 'admin' ? 'destructive' : 
                            role.role === 'mentor' ? 'default' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {role.role}
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
                    >
                      <Shield className="h-4 w-4" />
                      Роли
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {(!users || users.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
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
      />
    </div>
  );
}

// Компонент диалога редактирования ролей
function RoleDialog({ user, isOpen, onClose, onSave }: any) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Инициализируем роли когда диалог открывается
  useState(() => {
    if (user && isOpen) {
      setSelectedRoles(user.roles?.map((r: any) => r.role) || []);
    }
  });

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
            <p className="text-sm font-medium">Пользователь:</p>
            <p className="text-lg">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Роли пользователя:</p>
            <div className="space-y-2">
              {availableRoles.map((role) => (
                <label key={role.value} className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-accent/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.value)}
                    onChange={() => toggleRole(role.value)}
                    className="rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{role.label}</p>
                    <p className="text-sm text-muted-foreground capitalize">
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
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={handleSave}>
              Сохранить изменения
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUsers } from '@/shared/api/admin';
import { apiClient } from '@/shared/api/client';
import { Badge } from '@/shared/ui/badge';
import { Shield, RefreshCw, Users, Ban, CheckCircle2 } from 'lucide-react';

const getRoleLabel = (role: string): string => {
  const roleLabels: Record<string, string> = {
    'registered_user': 'Пользователь',
    'student_english': 'Студент (Английский)',
    'student_electronics': 'Студент (Электроника)',
    'student_computer_science': 'Студент (Информатика)',
    'student_iot': 'Студент (IoT)',
    'mentor_english': 'Ментор (Английский)',
    'mentor_electronics': 'Ментор (Электроника)',
    'mentor_computer_science': 'Ментор (Информатика)',
    'mentor_iot': 'Ментор (IoT)',
    'admin': 'Администратор',
  };
  return roleLabels[role] || role;
};

const getRoleBadgeVariant = (role: string): 'default' | 'accent' | 'success' | 'attention' | 'danger' | 'done' => {
  if (role === 'admin') return 'danger';
  if (role.startsWith('mentor_')) return 'done';
  if (role.startsWith('student_')) return 'success';
  return 'default';
};

// ── Icon components ────────────────────────────────────────────────
const ShieldIcon   = () => <Shield       size={14} />;
const SyncIcon     = () => <RefreshCw    size={14} />;
const UsersIcon    = () => <Users        size={16} />;
const BanIcon      = () => <Ban          size={14} />;
const UnbanIcon    = () => <CheckCircle2 size={14} />;

// ── Modal ──────────────────────────────────────────────────────────
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
    { value: 'student_english', label: 'Студент — Английский язык' },
    { value: 'student_electronics', label: 'Студент — Электроника' },
    { value: 'student_computer_science', label: 'Студент — Информатика' },
    { value: 'student_iot', label: 'Студент — IoT' },
    { value: 'mentor_english', label: 'Ментор — Английский язык' },
    { value: 'mentor_electronics', label: 'Ментор — Электроника' },
    { value: 'mentor_computer_science', label: 'Ментор — Информатика' },
    { value: 'mentor_iot', label: 'Ментор — IoT' },
    { value: 'admin', label: 'Администратор' },
  ];

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  if (!isOpen || !user) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #21262d' }}>
          <span style={{ color: 'var(--color-fg-muted)', display: 'flex' }}><ShieldIcon /></span>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-fg-default)', margin: 0 }}>Редактирование ролей</h3>
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--color-fg-muted)', margin: '0 0 4px' }}>Пользователь</p>
          <p style={{ fontSize: 15, color: 'var(--color-fg-default)', fontWeight: 600, margin: '0 0 2px' }}>{user.firstName} {user.lastName}</p>
          <p style={{ fontSize: 12, color: 'var(--color-fg-muted)', margin: 0 }}>{user.email}</p>
        </div>

        <p style={{ fontSize: 13, color: 'var(--color-fg-muted)', marginBottom: 8 }}>Роли:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {availableRoles.map((role) => (
            <label
              key={role.value}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 6,
                border: '1px solid var(--color-border-default)', cursor: 'pointer',
                background: selectedRoles.includes(role.value) ? 'var(--color-accent-subtle)' : 'transparent',
                borderColor: selectedRoles.includes(role.value) ? 'var(--color-accent-muted)' : 'var(--color-border-default)',
                transition: 'background 80ms',
              }}
            >
              <input
                type="checkbox"
                checked={selectedRoles.includes(role.value)}
                onChange={() => toggleRole(role.value)}
                disabled={isUpdating}
                style={{ accentColor: '#2f81f7' }}
              />
              <span style={{ fontSize: 13, color: 'var(--color-fg-default)', flex: 1 }}>{role.label}</span>
              <Badge variant={getRoleBadgeVariant(role.value)} size="sm">{role.value}</Badge>
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            onClick={onClose}
            disabled={isUpdating}
            style={{ padding: '5px 16px', fontSize: 13, color: 'var(--color-fg-default)', background: 'transparent', border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer' }}
          >
            Отмена
          </button>
          <button
            onClick={() => {
              if (selectedRoles.length === 0) { alert('Выберите хотя бы одну роль'); return; }
              onSave(selectedRoles);
            }}
            disabled={isUpdating}
            style={{ padding: '5px 16px', fontSize: 13, color: '#fff', background: '#2f81f7', border: '1px solid rgba(240,246,252,0.1)', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
          >
            {isUpdating ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function UserManagement() {
  const { users, isLoading, isError, updateUserRoles, mutate, isUpdating } = useUsers();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [localUpdating, setLocalUpdating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [banningId, setBanningId] = useState<number | null>(null);

  const handleEditRoles = (user: any) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const handleUpdateRoles = async (roles: string[]) => {
    if (!selectedUser) return;
    setLocalUpdating(true);
    try {
      await updateUserRoles({ id: selectedUser.id, roles });
      mutate();
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    } catch {
      alert('Ошибка при обновлении ролей');
    } finally {
      setLocalUpdating(false);
    }
  };

  const handleSyncRoles = async () => {
    if (!confirm('Выполнить синхронизацию ролей для всех пользователей с активными курсами?')) return;
    setIsSyncing(true);
    try {
      const result = await apiClient.post('/course-groups/sync-student-roles', {});
      mutate();
      alert(`Роли синхронизированы! Обновлено пользователей: ${result.updatedCount || 0}`);
    } catch {
      alert('Ошибка при синхронизации ролей');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleBan = async (user: any) => {
    const action = user.isActive !== false ? 'заблокировать' : 'разблокировать';
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} пользователя ${user.firstName} ${user.lastName}?`)) return;
    setBanningId(user.id);
    try {
      await apiClient.patch(`/users/${user.id}/ban`, {});
      mutate();
    } catch {
      alert('Ошибка при изменении статуса пользователя');
    } finally {
      setBanningId(null);
    }
  };

  const getUserRoles = (user: any): string[] => {
    if (!user.roles) return [];
    return user.roles.map((role: any) => (typeof role === 'string' ? role : role.role || role));
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
        <div style={{ width: 24, height: 24, border: '2px solid #30363d', borderTopColor: '#2f81f7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, padding: 24, textAlign: 'center' }}>
        <p style={{ color: '#f85149', fontSize: 14 }}>Ошибка загрузки пользователей</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--color-fg-default)', margin: '0 0 4px' }}>Управление пользователями</h1>
          <p style={{ fontSize: 13, color: 'var(--color-fg-muted)', margin: 0 }}>Управление пользователями и их ролями в системе</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: 'var(--color-border-muted)', border: '1px solid var(--color-border-default)', borderRadius: 20,
            fontSize: 12, padding: '2px 8px', color: 'var(--color-fg-muted)',
          }}>
            Всего: {users?.length || 0}
          </span>
          <button
            onClick={handleSyncRoles}
            disabled={isSyncing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', fontSize: 13, fontWeight: 500,
              color: 'var(--color-fg-default)', background: 'var(--color-border-muted)',
              border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', animation: isSyncing ? 'spin 1s linear infinite' : 'none' }}>
              <SyncIcon />
            </span>
            {isSyncing ? 'Синхронизация...' : 'Синхронизировать роли'}
          </button>
        </div>
      </div>

      {/* Table card */}
      <div style={{ background: 'var(--color-canvas-overlay)', border: '1px solid var(--color-border-default)', borderRadius: 6, overflow: 'hidden' }}>
        {/* Card header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid #21262d' }}>
          <span style={{ color: 'var(--color-fg-muted)', display: 'flex' }}><UsersIcon /></span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-fg-default)' }}>Список пользователей</span>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #21262d' }}>
                {['Пользователь', 'Email', 'Роли', 'Статус', ''].map((h, i) => (
                  <th key={i} style={{
                    padding: '8px 16px', textAlign: i === 4 ? 'right' : 'left',
                    fontSize: 12, fontWeight: 600, color: 'var(--color-fg-muted)',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users?.map((user: any) => {
                const userRoles = getUserRoles(user);
                const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Пользователь';
                const avatarLetter = displayName.charAt(0).toUpperCase();

                return (
                  <tr key={user.id} style={{ borderBottom: '1px solid #21262d' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-canvas-overlay)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* User */}
                    <td style={{ padding: '12px 16px' }}>
                      <Link href={`/profile/${user.id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%', background: '#2f81f7',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                        }}>
                          {avatarLetter}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#2f81f7' }}>{displayName}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-fg-muted)' }}>
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : ''}
                          </div>
                        </div>
                      </Link>
                    </td>
                    {/* Email */}
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--color-fg-muted)' }}>{user.email}</td>
                    {/* Roles */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {userRoles.map((role: string) => (
                          <Badge key={role} variant={getRoleBadgeVariant(role)} size="sm">
                            {getRoleLabel(role)}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    {/* Status */}
                    <td style={{ padding: '12px 16px' }}>
                      <Badge variant={user.isActive !== false ? 'success' : 'default'} dot size="sm">
                        {user.isActive !== false ? 'Активен' : 'Неактивен'}
                      </Badge>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => handleEditRoles(user)}
                          disabled={isUpdating || banningId === user.id}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '4px 10px', fontSize: 12, fontWeight: 500,
                            color: 'var(--color-fg-default)', background: 'var(--color-canvas-inset)',
                            border: '1px solid var(--color-border-default)', borderRadius: 6, cursor: 'pointer',
                          }}
                        >
                          <ShieldIcon /> Роли
                        </button>
                        <button
                          onClick={() => handleToggleBan(user)}
                          disabled={banningId === user.id}
                          title={user.isActive !== false ? 'Заблокировать' : 'Разблокировать'}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '4px 10px', fontSize: 12, fontWeight: 500,
                            color: user.isActive !== false ? 'var(--color-danger-fg)' : 'var(--color-success-fg)',
                            background: user.isActive !== false ? 'var(--color-danger-subtle)' : 'var(--color-success-subtle)',
                            border: `1px solid ${user.isActive !== false ? 'var(--color-danger-muted)' : 'var(--color-success-muted)'}`,
                            borderRadius: 6, cursor: banningId === user.id ? 'not-allowed' : 'pointer', opacity: banningId === user.id ? 0.5 : 1,
                          }}
                        >
                          {user.isActive !== false ? <BanIcon /> : <UnbanIcon />}
                          {user.isActive !== false ? 'Бан' : 'Снять'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {(!users || users.length === 0) && (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--color-fg-muted)', fontSize: 13 }}>
              Пользователи не найдены
            </div>
          )}
        </div>
      </div>

      <RoleDialog
        user={selectedUser}
        isOpen={isRoleDialogOpen}
        onClose={() => { setIsRoleDialogOpen(false); setSelectedUser(null); }}
        onSave={handleUpdateRoles}
        isUpdating={localUpdating || isUpdating}
      />
    </div>
  );
}

// src/features/profile/components/MyCoursesModal.tsx
import { User, BookOpen, Calendar, Clock, Check, X, Loader2, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useUserApprovedCourses, useUserCourseRegistrations } from '@/shared/api/admin/registrations';
import Link from 'next/link';

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" 
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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

const DialogDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

const DialogFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex justify-end pt-4 ${className}`}>
    {children}
  </div>
);

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const MyCoursesModal = ({ isOpen, onClose }: Props) => {
  const { courses: approvedCourses, isLoading: isLoadingApproved } = useUserApprovedCourses();
  const { registrations: allRegistrations, isLoading: isLoadingAll } = useUserCourseRegistrations();

  if (isLoadingApproved || isLoadingAll) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Мои Курсы</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Мои Курсы</DialogTitle>
        </DialogHeader>
        <DialogDescription className="mb-4">
          Ниже приведен список курсов, на которые вы записаны.
        </DialogDescription>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Активные курсы</h4>
          {approvedCourses && approvedCourses.length > 0 ? (
            <div className="space-y-2">
              {approvedCourses.map((reg) => (
                <Link
                  key={reg.id}
                  href={`/courses/${reg.courseGroup.courseId}`}
                  className="block p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gh-fg">{reg.courseGroup.course.name}</div>
                      <div className="text-sm text-gray-400">Группа: {reg.courseGroup.name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(reg.courseGroup.startDate).toLocaleDateString('ru-RU')} - {new Date(reg.courseGroup.endDate).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <ArrowRight className="text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-700 rounded-lg text-center text-gray-400">
              У вас пока нет активных курсов
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Заявки</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Группа</TableHead>
                <TableHead>Курс</TableHead>
                <TableHead>Дата подачи</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allRegistrations && allRegistrations.length > 0 ? (
                allRegistrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="text-white">{reg.courseGroup.name}</TableCell>
                    <TableCell className="text-white">{reg.courseGroup.course.name}</TableCell>
                    <TableCell className="text-white">{new Date(reg.registeredAt).toLocaleDateString('ru-RU')}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          reg.status?.toLowerCase() === 'pending' ? 'pending' :
                          reg.status?.toLowerCase() === 'approved' ? 'default' : 'destructive'
                        }
                      >
                        {reg.status?.toLowerCase() === 'approved' ? 'Одобрено' : reg.status?.toLowerCase() === 'rejected' ? 'Отклонено' : 'В ожидании'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <td colSpan={4} className="px-4 py-3 text-sm text-gray-400 dark:text-white text-center">
                    У вас нет заявок на курсы.
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
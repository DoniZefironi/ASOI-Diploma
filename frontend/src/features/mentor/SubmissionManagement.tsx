// components/mentor/SubmissionManagement.tsx
'use client';

import { useState, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { useAssignmentSubmissions } from '@/shared/api/mentor';
import { FileText, CheckCircle, MessageSquare, Loader2 } from 'lucide-react';

interface SubmissionManagementProps {
  assignmentId: number;
}

// Создаем локальные компоненты для отсутствующих UI элементов
const Badge = ({ children, variant = 'default', className = '' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variants = {
    default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Label = ({ children, htmlFor, className = '' }: { 
  children: React.ReactNode; 
  htmlFor?: string;
  className?: string;
}) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium mb-2 ${className}`}>
    {children}
  </label>
);

const Input = ({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  id,
  min,
  max,
  className = ''
}: {
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  min?: string; // Изменено с number на string
  max?: string; // Изменено с number на string
  className?: string;
}) => (
  <input
    type={type}
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    min={min} // HTML атрибуты min/max принимают строки
    max={max} // HTML атрибуты min/max принимают строки
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${className}`}
  />
);

const Textarea = ({ 
  value, 
  onChange, 
  placeholder,
  id,
  rows = 4,
  className = ''
}: {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  id?: string;
  rows?: number;
  className?: string;
}) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${className}`}
  />
);

// Простой диалог компонент
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
  <div className="mb-4">
    {children}
  </div>
);

const DialogTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
);

export default function SubmissionManagement({ assignmentId }: SubmissionManagementProps) {
  // Временно заглушка для хука, пока не создан реальный API
  const { submissions, isLoading, isError, createReview, calculateGrade } = useAssignmentSubmissions(assignmentId);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const handleAddReview = (submission: any) => {
    setSelectedSubmission(submission);
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = async (score: number, feedback: string) => {
    if (!selectedSubmission) return;

    try {
      await createReview({
        submissionId: selectedSubmission.id,
        score,
        feedback,
        isMentorReview: true,
      });
      setIsReviewDialogOpen(false);
      setSelectedSubmission(null);
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  const handleCalculateGrade = async (submissionId: number) => {
    try {
      await calculateGrade(submissionId);
    } catch (error) {
      console.error('Error calculating grade:', error);
    }
  };

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
            Ошибка загрузки работ
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Отправленные работы</h1>
        <p className="text-muted-foreground">
          Просмотр и оценка работ студентов
        </p>
      </div>

      <div className="grid gap-6">
        {submissions?.map((submission: any) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {submission.user.firstName} {submission.user.lastName}
                    {submission.finalScore && (
                      <Badge variant="default">
                        {submission.finalScore} баллов
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Отправлено: {new Date(submission.submittedAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    submission.status === 'graded' ? 'default' : 
                    submission.status === 'submitted' ? 'secondary' : 'outline'
                  }>
                    {submission.status}
                  </Badge>
                  <Button
                    size="sm"
                    onClick={() => handleAddReview(submission)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Оценить
                  </Button>
                  {submission.peerReviews?.length > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleCalculateGrade(submission.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Рассчитать оценку
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Решение:</Label>
                  <pre className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                    {submission.content}
                  </pre>
                </div>

                {submission.attachments && submission.attachments.length > 0 && (
                  <div>
                    <Label>Прикрепленные файлы:</Label>
                    <div className="mt-2 space-y-1">
                      {submission.attachments.map((attachment: string, index: number) => (
                        <a
                          key={index}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          Файл {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {submission.peerReviews && submission.peerReviews.length > 0 && (
                  <div>
                    <Label>Рецензии:</Label>
                    <div className="mt-2 space-y-3">
                      {submission.peerReviews.map((review: any) => (
                        <div key={review.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium">
                              {review.reviewer.firstName} {review.reviewer.lastName}
                              {review.isMentorReview && (
                                <Badge variant="default" className="ml-2">
                                  Ментор
                                </Badge>
                              )}
                            </span>
                            <Badge variant="outline">
                              {review.score} баллов
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {review.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!submissions || submissions.length === 0) && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Работы не найдены</p>
            <p className="text-sm mt-2">
              Студенты еще не отправляли работы на это задание
            </p>
          </CardContent>
        </Card>
      )}

      <ReviewDialog
        submission={selectedSubmission}
        isOpen={isReviewDialogOpen}
        onClose={() => {
          setIsReviewDialogOpen(false);
          setSelectedSubmission(null);
        }}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}

// Диалог добавления рецензии
function ReviewDialog({ submission, isOpen, onClose, onSubmit }: any) {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!score || !feedback) return;
    
    onSubmit(parseInt(score), feedback);
    setScore('');
    setFeedback('');
  };

  if (!submission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить рецензию</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Студент:</p>
            <p>
              {submission.user.firstName} {submission.user.lastName}
            </p>
          </div>

          <div>
            <Label htmlFor="score">Оценка (0-100)</Label>
            <Input
              id="score"
              type="number"
              min="0"  // Теперь это строка
              max="100" // Теперь это строка
              value={score}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setScore(e.target.value)}
              placeholder="Введите оценку"
            />
          </div>

          <div>
            <Label htmlFor="feedback">Комментарий</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
              placeholder="Напишите комментарий к работе..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!score || !feedback}
            >
              Сохранить рецензию
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
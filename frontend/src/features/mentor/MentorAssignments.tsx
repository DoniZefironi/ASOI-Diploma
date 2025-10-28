// components/mentor/MentorAssignments.tsx
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMyGroups, useGroupAssignments } from '@/lib/api/mentor';
import { FileText, Plus, Eye, Loader2 } from 'lucide-react';

export default function MentorAssignments() {
  const { groups, isLoading: groupsLoading } = useMyGroups();
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  
  const { 
    assignments, 
    isLoading: assignmentsLoading, 
    isError 
  } = useGroupAssignments(selectedGroup?.id);

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Управление заданиями</h1>
          <p className="text-muted-foreground">
            Создание и просмотр заданий для ваших групп
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Создать задание
        </Button>
      </div>

      {/* Выбор группы */}
      <Card>
        <CardHeader>
          <CardTitle>Выберите группу</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedGroup?.id?.toString() || ''}
            onValueChange={(value) => {
              const group = groups?.find(g => g.id.toString() === value);
              setSelectedGroup(group);
            }}
          >
            <SelectTrigger className="w-full md:w-96">
              <SelectValue placeholder="Выберите группу для просмотра заданий" />
            </SelectTrigger>
            <SelectContent>
              {groups?.map((group: any) => (
                <SelectItem key={group.id} value={group.id.toString()}>
                  {group.name} - {group.course?.name} 
                  ({group.registrations?.filter((r: any) => r.status === 'approved').length} студентов)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Список заданий */}
      {selectedGroup && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Задания группы: {selectedGroup.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignmentsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <div className="text-center text-destructive py-8">
                Ошибка загрузки заданий
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Дедлайн</TableHead>
                    <TableHead>Отправлено работ</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments?.map((assignment: any) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        {assignment.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {assignment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(assignment.deadline).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          assignment.submissions?.length > 0 ? "default" : "secondary"
                        }>
                          {assignment.submissions?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.location.href = `/mentor/assignments/${assignment.id}/submissions`;
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Работы
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {assignments && assignments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Задания не найдены</p>
                <p className="text-sm mt-2">
                  Создайте первое задание для этой группы
                </p>
                <Button className="mt-4" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать задание
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
// app/mentor/assignments/[id]/submissions/page.tsx
'use client';

import { useParams } from 'next/navigation';
import SubmissionManagement from '@/components/mentor/SubmissionManagement';

export default function SubmissionsPage() {
  const params = useParams();
  const assignmentId = parseInt(params.id as string);

  return <SubmissionManagement assignmentId={assignmentId} />;
}
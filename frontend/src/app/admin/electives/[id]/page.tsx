import AdminElectiveDetailPage from '@/features/electives/AdminElectiveDetailPage';
export default function Page({ params }: { params: { id: string } }) {
  return <AdminElectiveDetailPage electiveId={Number(params.id)} />;
}

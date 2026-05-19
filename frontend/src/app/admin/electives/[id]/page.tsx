import AdminElectiveDetailPage from '@/features/electives/AdminElectiveDetailPage';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminElectiveDetailPage electiveId={Number(id)} />;
}

import ElectiveDetailPage from '@/features/electives/ElectiveDetailPage';
export default async function ElectiveDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ElectiveDetailPage id={Number(id)} />;
}

import ElectiveDetailPage from '@/features/electives/ElectiveDetailPage';
export default function ElectiveDetail({ params }: { params: { id: string } }) {
  return <ElectiveDetailPage id={Number(params.id)} />;
}

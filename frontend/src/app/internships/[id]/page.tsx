import InternshipDetailPage from '@/features/internships/InternshipDetailPage';

export default function Page({ params }: { params: { id: string } }) {
  return <InternshipDetailPage id={Number(params.id)} />;
}

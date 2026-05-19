import CareerTestPage from '@/features/career-test/CareerTestPage';

export default async function TestPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  return <CareerTestPage testType={type} />;
}

import CareerTestPage from '@/features/career-test/CareerTestPage';

export default function TestPage({ params }: { params: { type: string } }) {
  return <CareerTestPage testType={params.type} />;
}

import { PublicProfilePage } from '@/features/profile/PublicProfilePage';

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PublicProfilePage userId={id} />;
}

import { PublicProfilePage } from '@/features/profile/PublicProfilePage';

interface Props {
  params: { id: string };
}

export default function UserProfilePage({ params }: Props) {
  return <PublicProfilePage userId={params.id} />;
}

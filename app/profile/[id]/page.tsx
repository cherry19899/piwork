import ProfilePageClient from './ProfilePageClient';

export function generateStaticParams() {
  // Return at least one dummy entry so Next.js accepts this route
  return [{ id: '_placeholder' }];
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  return <ProfilePageClient params={params} />;
}

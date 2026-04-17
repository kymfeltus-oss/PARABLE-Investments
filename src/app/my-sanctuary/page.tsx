'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/utils/supabase/client';
import { useRegisteredProfileSuggestions } from '@/hooks/useRegisteredProfileSuggestions';
import { useSanctuaryFollowGraph } from '@/hooks/useSanctuaryFollowGraph';
import SanctuaryInstagramProfile from '@/components/sanctuary/instagram-profile/SanctuaryInstagramProfile';

export default function MySanctuaryPage() {
  const router = useRouter();
  const { userProfile, avatarUrl, loading, authUserId, refreshProfile } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const { registeredChannels } = useRegisteredProfileSuggestions();
  const { followingIds } = useSanctuaryFollowGraph(registeredChannels);

  useEffect(() => {
    if (loading) return;
    if (!userProfile) router.replace('/login?next=/my-sanctuary');
  }, [loading, userProfile, router]);

  useEffect(() => {
    if (loading || !userProfile?.id) return;
    refreshProfile();
  }, [loading, userProfile?.id, refreshProfile]);

  if (loading || !userProfile) {
    return <div className="min-h-screen bg-black" />;
  }

  const handleSlug = (userProfile?.username || 'you').replace(/^@/, '');
  const profileAvatarRaw = typeof userProfile?.avatar_url === 'string' ? userProfile.avatar_url.trim() : '';
  const avatarFromProfile =
    profileAvatarRaw && !profileAvatarRaw.startsWith('http') && !profileAvatarRaw.startsWith('data:')
      ? supabase.storage.from('avatars').getPublicUrl(profileAvatarRaw).data.publicUrl
      : profileAvatarRaw;
  const sanctuaryAvatarUrl = avatarFromProfile || avatarUrl;
  const displayName = userProfile?.full_name || handleSlug;
  const bio = (userProfile as { bio?: string | null })?.bio ?? null;
  const role = userProfile?.role as string | undefined;

  return (
    <SanctuaryInstagramProfile
      userId={String(userProfile.id)}
      authUserId={authUserId}
      avatarUrl={sanctuaryAvatarUrl}
      username={handleSlug}
      displayName={displayName}
      bio={bio}
      role={role}
      followingCount={followingIds.length}
    />
  );
}

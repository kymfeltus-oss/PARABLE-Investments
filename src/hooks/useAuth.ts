'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export const useAuth = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('/logo.svg');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user ?? null;

      if (!user) {
        setUserProfile(null);
        setAvatarUrl('/logo.svg');
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setUserProfile(data);

        if (data.avatar_url) {
          const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(data.avatar_url);

          setAvatarUrl(urlData.publicUrl || '/logo.svg');
        } else {
          setAvatarUrl('/logo.svg');
        }
      } else {
        setUserProfile(null);
        setAvatarUrl('/logo.svg');
      }

      setLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { userProfile, avatarUrl, loading };
};
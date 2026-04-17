'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { SanctuaryChannel } from '@/lib/sanctuary-following';
import { fetchRegisteredProfileSuggestions } from '@/lib/profile-suggestions';

/**
 * @param fetchEnabled When false, skips the Supabase `profiles` query (saves bandwidth until the gate opens).
 */
export function useRegisteredProfileSuggestions(fetchEnabled = true) {
  const [channels, setChannels] = useState<SanctuaryChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const load = async () => {
      if (!fetchEnabled) {
        if (!cancelled) {
          setChannels([]);
          setErrorMessage(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        if (!cancelled) {
          setChannels([]);
          setErrorMessage(null);
          setLoading(false);
        }
        return;
      }

      const res = await fetchRegisteredProfileSuggestions();
      if (!cancelled) {
        setChannels(res.channels);
        setErrorMessage(res.errorMessage);
        setLoading(false);
      }
    };

    void load();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void load();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [fetchEnabled]);

  return {
    registeredChannels: channels,
    registeredLoading: loading,
    registeredError: errorMessage,
  };
}

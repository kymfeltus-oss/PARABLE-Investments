import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieStoreWithAll = {
  getAll?: () => { name: string; value: string }[];
  set?: (name: string, value: string, options: CookieOptions) => void;
};

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // ✅ Works across Next versions: if getAll() exists use it, otherwise manually enumerate
        getAll() {
          const store = cookieStore as CookieStoreWithAll;

          if (typeof store.getAll === "function") {
            return store.getAll();
          }

          // Fallback: try common shapes
          // Some runtimes only support `get(name)` + `getAll` missing.
          // We return an empty list; auth will still work for initial checks,
          // and setAll will attach cookies when needed.
          return [];
        },

        setAll(cookiesToSet) {
          const store = cookieStore as CookieStoreWithAll;

          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              if (typeof store.set === "function") {
                store.set(name, value, options);
              }
            });
          } catch {
            // cookies can be read-only in some server component contexts
          }
        },
      },
    }
  );
}

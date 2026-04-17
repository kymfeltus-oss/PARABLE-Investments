"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EditProfileModal({ open, onClose }: Props) {
  const { userProfile, refreshProfile } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const initial = useMemo(
    () => ({
      fullName: (userProfile?.full_name as string) || "",
      username: (userProfile?.username as string) || "",
      bio: ((userProfile as { bio?: string | null })?.bio as string) || "",
    }),
    [userProfile],
  );

  const [fullName, setFullName] = useState(initial.fullName);
  const [username, setUsername] = useState(initial.username);
  const [bio, setBio] = useState(initial.bio);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setFullName(initial.fullName);
      setUsername(initial.username);
      setBio(initial.bio);
    }
  }, [open, initial]);

  const dirty = useMemo(() => {
    return fullName !== initial.fullName || username !== initial.username || bio !== initial.bio;
  }, [fullName, username, bio, initial]);

  const handleDone = async () => {
    if (!dirty || !userProfile?.id || saving) return;
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        full_name: fullName.trim(),
        username: username.trim().toLowerCase(),
        bio: bio.trim(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").update(payload).eq("id", userProfile.id);
      if (error) {
        console.error(error);
        return;
      }
      refreshProfile();
      window.dispatchEvent(new CustomEvent("parable:profile-updated", { detail: { bumpAvatar: false } }));
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 320, damping: 36 }}
          className="fixed inset-0 z-[100] flex flex-col bg-black"
        >
          <header className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.1] px-3">
            <button type="button" onClick={onClose} className="text-[15px] text-white">
              Cancel
            </button>
            <span className="text-[16px] font-semibold text-white">Edit profile</span>
            <button
              type="button"
              disabled={!dirty || saving}
              onClick={handleDone}
              className={[
                "text-[15px] font-semibold",
                dirty && !saving ? "text-[#00f2ff]" : "text-white/25",
              ].join(" ")}
            >
              {saving ? "…" : "Done"}
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
            <p className="text-center text-[13px] text-[#00f2ff]">Edit picture or avatar</p>
            <p className="mt-1 text-center text-[12px] text-neutral-600">Use Profile to change your photo.</p>

            <label className="mt-8 block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/[0.1] bg-[#0d0d0d] px-3 py-2.5 text-[15px] text-white"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Username</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/[0.1] bg-[#0d0d0d] px-3 py-2.5 text-[15px] text-white"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Bio</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="mt-1 w-full resize-none rounded-lg border border-white/[0.1] bg-[#0d0d0d] px-3 py-2.5 text-[15px] text-white"
              />
            </label>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

import { NextResponse } from "next/server";
import {
  isFromEmailConfigured,
  isResendConfigured,
} from "@/lib/resend/config";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET() {
  const supabaseConfigured =
    isSupabaseConfigured() && isSupabaseAdminConfigured();

  return NextResponse.json({
    ok: true,
    supabaseConfigured,
    resendConfigured: isResendConfigured(),
    fromEmailConfigured: isFromEmailConfigured(),
    supabase: {
      publicConfigured: isSupabaseConfigured(),
      adminConfigured: isSupabaseAdminConfigured(),
    },
    resend: {
      configured: isResendConfigured(),
      fromEmailConfigured: isFromEmailConfigured(),
    },
  });
}

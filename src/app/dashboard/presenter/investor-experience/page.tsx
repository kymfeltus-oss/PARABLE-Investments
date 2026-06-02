import { redirect } from "next/navigation";

/** Legacy route — studio is the single source of truth */
export default function LegacyInvestorExperiencePage() {
  redirect("/dashboard/presenter");
}

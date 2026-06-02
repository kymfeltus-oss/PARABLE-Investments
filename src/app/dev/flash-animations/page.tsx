import { notFound } from "next/navigation";
import FlashAnimationsPreview from "@/components/landing/FlashAnimationsPreview";

export default function FlashAnimationsDevPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <FlashAnimationsPreview />;
}

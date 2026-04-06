import type { Metadata } from "next";
import IntroLanding from "@/components/IntroLanding";

export const metadata: Metadata = {
  title: "Intro — Securafin-AI",
  description:
    "Watch our AI host introduce Securafin-AI, then explore the digital showroom.",
};

export default function IntroPage() {
  return <IntroLanding />;
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { APPS } from "@/lib/catalog";
import SandboxClient from "./sandbox-client";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return APPS.map((a) => ({ slug: a.id }));
}

export default async function TrySandboxPage({ params }: Props) {
  const { slug } = await params;
  const app = APPS.find((a) => a.id === slug);
  if (!app) notFound();

  return (
    <main
      id="securafin-main"
      className="mx-auto max-w-5xl px-4 pb-24 pt-8 md:pt-10"
    >
      <nav aria-label="Breadcrumb" className="text-xs text-white/45">
        <Link
          href="/showroom"
          className="underline-offset-2 hover:text-white/70 hover:underline"
        >
          Showroom
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <Link
          href="/marketplace"
          className="underline-offset-2 hover:text-white/70 hover:underline"
        >
          Marketplace
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-white/70">Try {app.name}</span>
      </nav>

      <header className="mt-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-white md:text-3xl">
          Sandbox · {app.name}
        </h1>
        <p className="mt-2 text-sm text-white/55">{app.tagline}</p>
      </header>

      <SandboxClient app={app} />
    </main>
  );
}

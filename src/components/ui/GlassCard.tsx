import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  glow = false,
  premium = false,
}: {
  className?: string;
  children: React.ReactNode;
  glow?: boolean;
  premium?: boolean;
}) {
  return (
    <div
      className={cn("pl-card", glow && "pl-card-glow", premium && "pl-card-premium", className)}
    >
      {children}
    </div>
  );
}

export { GlassButton } from "./GlassButton";

import { cn } from "@/lib/utils";

export function GlassButton({
  className,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
}) {
  const variants = {
    primary: "pl-btn pl-btn-primary",
    ghost: "pl-btn pl-btn-ghost",
    outline: "pl-btn pl-btn-outline",
  };

  return <button className={cn(variants[variant], className)} {...props} />;
}

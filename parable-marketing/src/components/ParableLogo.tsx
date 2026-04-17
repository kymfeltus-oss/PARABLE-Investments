import Image from "next/image";

/** Prefer `public/logo.svg` (vector). Set `NEXT_PUBLIC_MARKETING_LOGO=/logo.jpeg` when you add a raster mark. */
export const PARABLE_LOGO_SRC =
  process.env.NEXT_PUBLIC_MARKETING_LOGO?.trim() || "/logo.svg";

type ParableLogoProps = {
  variant: "nav" | "hero";
  priority?: boolean;
  className?: string;
};

export default function ParableLogo({
  variant,
  priority = false,
  className = "",
}: ParableLogoProps) {
  const box =
    variant === "nav"
      ? "relative block h-8 w-[200px] sm:h-10 sm:w-[248px]"
      : "relative mx-auto block h-16 w-[min(100%,440px)] sm:h-20 sm:w-[min(100%,520px)]";

  return (
    <span
      className={
        variant === "hero"
          ? `hero-logo-glow inline-block max-w-full ${className}`
          : `inline-block max-w-full ${className}`
      }
    >
      <span className={box}>
        <Image
          src={PARABLE_LOGO_SRC}
          alt="PARABLE"
          fill
          priority={priority}
          sizes={variant === "nav" ? "248px" : "min(100vw, 520px)"}
          className="object-contain object-left contrast-[1.06] saturate-[1.02] [image-rendering:-webkit-optimize-contrast] [image-rendering:crisp-edges]"
        />
      </span>
    </span>
  );
}

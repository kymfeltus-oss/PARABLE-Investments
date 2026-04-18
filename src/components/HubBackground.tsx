"use client";

type Props = {
  /** Sit above a full-bleed video: no solid base, effects only (grid + glow orbs). */
  variant?: "default" | "overVideo";
};

export default function HubBackground({ variant = "default" }: Props) {
  const over = variant === "overVideo";
  const position = over ? "absolute" : "fixed";

  return (
    <div
      className={`${position} inset-0 z-0 overflow-hidden ${over ? "bg-transparent" : "bg-[#050505]"}`}
    >
      <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-[#00f2ff]/10 blur-[120px]" />
      <div
        className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] animate-pulse rounded-full bg-blue-600/10 blur-[120px]"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
          maskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 80%)",
        }}
      />
    </div>
  );
}

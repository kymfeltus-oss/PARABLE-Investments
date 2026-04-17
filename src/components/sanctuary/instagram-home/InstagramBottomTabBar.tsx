"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Home, PlusSquare, Search, User } from "lucide-react";

const tabs = [
  { id: "home", href: "/home", label: "Home", Icon: Home },
  { id: "search", href: "/browse", label: "Search", Icon: Search },
  { id: "create", href: "/testify", label: "Create", Icon: PlusSquare },
  { id: "reels", href: "/parables", label: "Reels", Icon: Film },
  { id: "profile", href: "/my-sanctuary", label: "Profile", Icon: User },
] as const;

export default function InstagramBottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-[49px] items-center justify-around border-t border-neutral-900 bg-black pb-[env(safe-area-inset-bottom,0px)]"
      role="navigation"
      aria-label="Main"
    >
      {tabs.map(({ href, label, Icon, id }) => {
        const active =
          id === "home"
            ? pathname === "/home" || pathname === "/"
            : id === "profile"
              ? pathname === "/my-sanctuary" || pathname?.startsWith("/my-sanctuary/")
              : pathname === href || pathname?.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center justify-center py-1 text-neutral-100"
            aria-label={label}
            aria-current={active ? "page" : undefined}
          >
            {id === "profile" && active ? (
              <span className="rounded-full border-2 border-white p-[1px]">
                <Icon
                  className="h-[22px] w-[22px]"
                  strokeWidth={2.25}
                  fill="none"
                />
              </span>
            ) : (
              <Icon
                className="h-6 w-6"
                strokeWidth={active ? 2.5 : 1.75}
                fill={active && id === "home" ? "currentColor" : "none"}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";
import { usePathname } from "next/navigation";
import { Navbar, NavLink } from "@/components/partial/AssetNavbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  const links: NavLink[] = [
    {
      name: "Home",
      href: "/home",
      active: pathname === "/home",
    },
    {
      name: "Markets",
      href: "/markets",
      active: pathname === "/markets" || pathname === "/",
    },
    {
      name: "Dashboard",
      href: "/dashboard/user",
      active: pathname.startsWith("/dashboard"),
    },
    {
      name: "Docs",
      href: "#",
      active: pathname.startsWith("/docs"),
      dropdown: {
        label: "Docs",
        items: [
          { name: "API", href: "/docs/api" },
          { name: "Guide", href: "/docs/guide" },
          { name: "Lorem", href: "/docs/lorem" },
        ],
      },
    },
  ];

  return <Navbar links={links} />;
}

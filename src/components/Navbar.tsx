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
      name: "Pilot",
      href: "/pilot",
      active: pathname === "/pilot" || pathname === "/",
    },
    {
      name: "Deposit",
      href: "/deposit",
      active: pathname === "/deposit",
    },

    {
      name: "Wrap",
      href: "/wrap",
      active: pathname.startsWith("/wrap"),
    },
    {
      name: "Withdrawals",
      href: "/withdrawals/request",
      active: pathname.startsWith("/withdrawals"),
    },
    {
      name: "Faucet",
      href: "/faucet",
      active: pathname === "/faucet",
    },
    {
      name: "Docs",
      href: "#",
      active: pathname.startsWith("/docs"),
      dropdown: {
        label: "Docs",
        items: [{ name: "Overview", href: "/docs/overview" }],
      },
    },
  ];

  return <Navbar links={links} />;
}

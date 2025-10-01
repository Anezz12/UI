import { Navbar, NavLink } from "@/components/partial/AssetNavbar";

const links: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Markets", href: "/markets", active: true },
  {
    name: "Docs",
    href: "#",
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

export default function NavbarWrapper() {
  return <Navbar links={links} />;
}

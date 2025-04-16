"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  SquarePlus,
  ClipboardType,
  LibraryBig,
  BookOpen,
} from "lucide-react";

const links = [
  { href: "/escritorio", label: "Escritorio", icon: House },
  { href: "/escritorio/crear-test", label: "Crear Test", icon: SquarePlus },
  { href: "/escritorio/mis-tests", label: "Tests", icon: ClipboardType },
  { href: "/escritorio/asignaturas", label: "Asignaturas", icon: LibraryBig },
  { href: "/escritorio/estudio", label: "Estudio", icon: BookOpen },
];

export default function SideNav() {
  const pathname = usePathname();
  return (
    <div className="w-full h-[calc(100vh-56px)] bg-green-4 text-yellow-2 px-2 py-6">
      <div className="flex flex-col">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={clsx(
                "flex text-base grow items-center justify-center gap-3 rounded-md p-3 font-medium hover:bg-green-3 hover:text-yellow-1 md:flex-none md:justify-start md:py-2 md:px-4",
                {
                  "bg-green-2 text-yellow-1": isActive,
                }
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

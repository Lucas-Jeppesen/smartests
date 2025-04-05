"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navigationLinks = [
    { href: "/inicio", label: "Inicio" },
    { href: "/crear-test", label: "Crear Test" },
    { href: "/mis-tests", label: "Mis Tests" },
    { href: "/creditos", label: "Créditos" },
    { href: "/mi-cuenta", label: "Cuenta" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <header className="h-[74px] fixed top-0 left-0 w-full bg-background z-99">
      <div className="flex justify-between p-6 border-b-[1px] border-foreground h-full">
        <Link href="/inicio" passHref className="w-32 md:w-48 pt-[6px] md:pt-[2px]">
          <img
            src="/branding/Logo_Roadsense.svg"
            alt="Logo"
          ></img>
        </Link>
        <nav className="font-semibold">
          {/*Mobile menu*/}
          <button
            className="block md:hidden z-50"
            onClick={toggleSidebar}
            aria-expanded={isSidebarOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#212121"
            >
              <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
            </svg>
          </button>
          <ul
            id="mobile-menu"
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } fixed top-0 left-0 h-full w-full flex flex-col gap-4 text-right bg-background z-10 p-6`}
          >
            <li>
              <button
                onClick={toggleSidebar}
                aria-label="Close navigation menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#212121"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </button>
            </li>
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  prefetch={false}
                  onClick={closeSidebar}
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {/*Desktop menu*/}
          <ul className="hidden md:flex flex-row gap-8 pt-[2px]">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link prefetch={false} href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";

export default function Header() {

  return (
    <header className="h-14 fixed top-0 left-0 w-full bg-yellow-1 z-99">
      <div className="flex justify-between items-center p-6 border-foreground h-full">
        <Link href="/escritorio" passHref className="w-32 md:w-48 ">
          <img
            src="/imagotipo_smartests.svg"
            alt="Logo"
            width="100px"
          ></img>
        </Link>
      </div>
    </header>
  );
}

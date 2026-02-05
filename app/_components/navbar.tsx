"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const linkClass = (href: string) =>
    pathname === href ? "font-bold text-primary" : "text-muted-foreground";

  return (
    <nav className="border-b border-solid">
      <div className="relative flex items-center px-4 py-4 md:px-8">
        <Link href="/" aria-label="Ir para o Dashboard" className="z-10">
          <Image
            src="/logo_login.png"
            width={40}
            height={40}
            alt="Scalercio Finance"
          />
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2">
          <UserButton showName />
        </div>

        <div className="ml-auto hidden items-center gap-6 md:flex">
          <Link href="/" className={linkClass("/")}>
            Dashboard
          </Link>
          <Link href="/transactions" className={linkClass("/transactions")}>
            Transações
          </Link>
          <Link href="/subscription" className={linkClass("/subscription")}>
            Assinatura
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center rounded-md border border-input p-2 md:hidden"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex h-5 w-5 flex-col justify-between">
            <span
              className={`h-0.5 w-full bg-foreground transition-transform ${
                isOpen ? "translate-y-[9px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full bg-foreground transition-opacity ${
                isOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-0.5 w-full bg-foreground transition-transform ${
                isOpen ? "-translate-y-[9px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="flex flex-col gap-2 px-4 pb-4">
            <Link href="/" className={`rounded-md px-3 py-2 ${linkClass("/")}`}>
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className={`rounded-md px-3 py-2 ${linkClass("/transactions")}`}
            >
              Transações
            </Link>
            <Link
              href="/subscription"
              className={`rounded-md px-3 py-2 ${linkClass("/subscription")}`}
            >
              Assinatura
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

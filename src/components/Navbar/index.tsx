"use client"

import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavbarList {
  label: string
  path: string
}
const NAVBAR_LIST: NavbarList[] = [
  { label: "Dashboard", path: "/" },
  {
    label: "Transações",
    path: "/transactions"
  },
  {
    label: "Assinatura",
    path: "/subscription"
  }
]

export const Navbar = () => {
  const path = usePathname()
  console.log(path)

  return (
    <div className="flex w-full items-center justify-between border-b border-b-white/10 px-8 py-4">
      <div className="hidden items-center gap-12 sm:flex">
        <Link href={"/"}>
          <Image
            src="/logo-full.png"
            alt="Fin Track AI"
            width={173.57}
            height={39}
          />
        </Link>

        {NAVBAR_LIST.map((el) => (
          <div key={el.path}>
            <Link
              className={`${path === el.path ? "font-bold text-secondary/90 hover:text-secondary " : "font-semibold text-zinc-500 hover:text-zinc-400/80 "} text-base transition-all duration-300`}
              href={el.path}
            >
              {el.label}
            </Link>
          </div>
        ))}
      </div>
      <div>
        <UserButton showName />
      </div>
    </div>
  )
}

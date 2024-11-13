"use client"

import {
  Breadcrumb as BreadcrumbUI,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/_ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/_ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { SIDEBAR_LIST } from "./Sidebar"
import Link from "next/link"
import { useSidebar } from "./_ui/sidebar"
import { useEffect } from "react"

export function Breadcrumb() {
  const pathname = usePathname()
  const { isMobile, open, setOpen } = useSidebar()

  useEffect(() => {
    if (pathname === "/subscription") {
      setOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!isMobile && open) return <div />

  return (
    <BreadcrumbUI className="pl-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              <BreadcrumbEllipsis className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {SIDEBAR_LIST.map((el) => {
                if (el.path === pathname) return <div key={el.path} />
                return (
                  <DropdownMenuItem key={el.path}>
                    <Link href={el.path}>{el.label}</Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>
            {SIDEBAR_LIST.find((el) => el.path === pathname)?.label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbUI>
  )
}

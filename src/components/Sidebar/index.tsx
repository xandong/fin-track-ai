"use client"

import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from "../_ui/sidebar"
import { ReactNode, useEffect } from "react"
import {
  ArrowLeftRightIcon,
  CaptionsIcon,
  HouseIcon,
  NotepadTextIcon,
  PanelRightIcon
} from "lucide-react"

interface SidebarList {
  label: string
  path: string
  icon: ReactNode
}
export const SIDEBAR_LIST: SidebarList[] = [
  { label: "Dashboard", path: "/", icon: <HouseIcon /> },
  {
    label: "Transações",
    path: "/transactions",
    icon: <ArrowLeftRightIcon />
  },
  {
    label: "Assinatura",
    path: "/subscription",
    icon: <CaptionsIcon />
  },
  {
    label: "Relatórios",
    path: "/reports",
    icon: <NotepadTextIcon />
  }
]

interface SidebarProps {
  reportsAccess?: boolean
}

export const Sidebar = ({ reportsAccess }: SidebarProps) => {
  const { setOpen, isMobile, setOpenMobile } = useSidebar()
  const path = usePathname()

  useEffect(() => {
    if (isMobile || path == "/subscription") setOpen(false)
    setOpenMobile(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <UISidebar>
        <SidebarHeader className="relative p-4">
          <div className="flex items-center justify-between">
            <Link href={"/"}>
              <Image
                src="/logo-full.png"
                alt="Fin Track AI"
                width={173.57}
                height={39}
              />
            </Link>

            <SidebarTrigger className="m-0 rounded-xl p-5">
              <PanelRightIcon size={24} />
            </SidebarTrigger>
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {SIDEBAR_LIST.map((el) => {
                  if (el.path === "/reports" && !reportsAccess) {
                    return <div key={el.path} />
                  }

                  return (
                    <SidebarMenuItem key={el.path}>
                      <SidebarMenuButton
                        asChild
                        className="pl-4 text-base"
                        onClick={() => setOpen(false)}
                      >
                        <Link
                          className={`${path === el.path ? "font-bold text-secondary/90 hover:text-secondary" : "font-semibold text-zinc-500 hover:text-zinc-400/80"} transition-all duration-300`}
                          href={el.path}
                        >
                          {el.icon}
                          {el.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter className="items-end p-6 py-4">
          <UserButton showName />
        </SidebarFooter>
      </UISidebar>
    </>
  )
}

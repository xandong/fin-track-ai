"use client"

import { ReactNode } from "react"
import { Breadcrumb } from "./breadcrumb"
import { SidebarTrigger, useSidebar } from "./_ui/sidebar"

interface WrapperLayoutProps {
  children: ReactNode
  title: string
  actions: ReactNode
}

export const WrapperLayout = ({
  children,
  actions,
  title
}: WrapperLayoutProps) => {
  const { open } = useSidebar()

  return (
    <>
      <div className="flex w-full flex-1 flex-col">
        <div className="flex w-full flex-1 justify-center p-4 sm:px-10 sm:py-6">
          <div className="flex w-full max-w-[90rem] flex-1 flex-col flex-nowrap gap-3 sm:gap-6">
            <div className="flex w-full flex-col flex-wrap items-start justify-between gap-2 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-2">
                {!open && (
                  <SidebarTrigger
                    size={"default"}
                    className="m-0 rounded-xl p-5"
                  />
                )}
                <h1 className="text-lg font-bold leading-8 sm:text-2xl">
                  {title}
                </h1>
              </div>

              <div className="flex w-full flex-1 justify-end">{actions}</div>
            </div>
            {children}
          </div>
        </div>

        <div className="pb-1 pl-0">
          <Breadcrumb />
        </div>
      </div>
    </>
  )
}

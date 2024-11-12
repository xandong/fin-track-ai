"use client"

import { ReactNode } from "react"
import { Breadcrumb } from "./breadcrumb"

interface WrapperLayoutProps {
  children: ReactNode
}

export const WrapperLayout = ({ children }: WrapperLayoutProps) => {
  return (
    <>
      <div className="flex w-full flex-1 flex-col">
        <div className="flex w-full flex-1 justify-center px-6 py-6 sm:px-10">
          <div className="flex w-full max-w-[90rem] flex-1 flex-col flex-nowrap gap-6">
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

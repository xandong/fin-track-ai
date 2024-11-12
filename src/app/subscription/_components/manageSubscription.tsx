"use client"

import { Button } from "@/components/_ui/button"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"

export const ManageSubscription = () => {
  const { user } = useUser()

  return (
    <Button
      className="text-sm text-zinc-500 hover:bg-zinc-950"
      variant={"link"}
      asChild
    >
      <Link
        target="_blank"
        href={`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL || ""}?prefilled_email=${user?.emailAddresses[0].emailAddress}`}
      >
        Gerenciar plano
      </Link>
    </Button>
  )
}

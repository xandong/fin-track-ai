"use client"

import { Button } from "@/components/_ui/button"

export const CancelSubscription = () => {
  const handleCancelPlan = async () => {
    return
  }

  return (
    <Button
      className="text-sm text-zinc-500 hover:bg-zinc-900"
      variant={"ghost"}
      onClick={() => handleCancelPlan}
    >
      Cancelar
    </Button>
  )
}

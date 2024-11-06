"use client"

import { Button } from "@/components/_ui/button"
import Image from "next/image"

const LoginPage = () => {
  return (
    <div className="grid h-screen w-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center py-[4rem]">
        <div className="flex h-full w-[488px] max-w-full flex-col justify-center gap-8">
          <Image
            src="/logo.svg"
            alt="Fin Track AI"
            width={173.57}
            height={39}
          />

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold">Bem-vindo</h1>

            <p className="text-muted-foreground">
              A Finance AI é uma plataforma de gestão financeira que utiliza IA
              para monitorar suas movimentações, e oferecer insights
              personalizados, facilitando o controle do seu orçamento.
            </p>
          </div>

          <div className="w-full">
            <Button variant="outline" className="w-full">
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
      <div className="relative hidden h-full w-full lg:block">
        <Image
          src="/login-bg.png"
          alt="Preview dashboard"
          fill
          className="object-cover"
        />
      </div>
    </div>
  )
}

export default LoginPage

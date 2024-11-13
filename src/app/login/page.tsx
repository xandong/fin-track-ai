import { Button } from "@/components/_ui/button"
import { SignInButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { LogInIcon } from "lucide-react"
import Image from "next/image"
import { redirect } from "next/navigation"

const LoginPage = async () => {
  const { userId } = await auth()

  if (userId) {
    redirect("/")
  }

  return (
    <div className="grid h-screen w-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center py-[4rem]">
        <div className="flex h-full w-[488px] max-w-full flex-col justify-center gap-8">
          <Image
            src="/logo-full.png"
            alt="Fin Track AI"
            width={173.57}
            height={39}
          />

          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold">Bem-vindo</h1>

            <p className="text-muted-foreground">
              A Fintrack AI é uma plataforma de gestão financeira e controle de
              gastos, impulsionada por inteligência artificial, que monitora
              suas movimentações e oferece insights personalizados, tornando o
              controle do seu orçamento mais fácil e eficiente.
            </p>
          </div>

          <div className="w-full">
            <SignInButton>
              <Button variant="outline" className="w-full">
                <LogInIcon className="mr-2" />
                Continue with Google
              </Button>
            </SignInButton>
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

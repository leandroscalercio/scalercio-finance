import Image from "next/image";
import { redirect } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

import { Button } from "../_components/ui/button";

const LoginPage = async () => {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }

  return (
    <main className="grid h-screen grid-cols-1 overflow-hidden bg-background md:grid-cols-2">
      <section className="flex flex-col items-center justify-center px-6 py-8 text-center sm:py-10 md:px-12 md:py-12">
        <Image
          src="/logo_login.png"
          alt="Logo Scalercio"
          width={160}
          height={160}
          priority
          className="mb-8"
        />

        <h1 className="mb-4 text-4xl font-semibold tracking-tight">
          Bem-vindo!
        </h1>

        <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          Scalercio Finance é uma plataforma de gestão financeira que utiliza IA
          para monitorar suas movimentações e oferecer insights personalizados,
          facilitando o controle do seu dinheiro.
        </p>

        <SignInButton>
          <Button variant="outline" size="lg" className="gap-2">
            <Image
              className="h-4 w-4"
              src="/icon_google.png"
              alt="Google"
              width={18}
              height={18}
            />
            Fazer login ou criar uma conta
          </Button>
        </SignInButton>
      </section>

      <section className="relative hidden items-center justify-center md:flex">
        <div className="relative h-80 w-80">
          <Image
            src="/login.png"
            alt="Preview do aplicativo"
            fill
            priority
            sizes="(min-width: 1024px) 100vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>
    </main>
  );
};

export default LoginPage;

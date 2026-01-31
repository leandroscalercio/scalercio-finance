import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect("/");
  }
  return (
    <div className="grid h-full grid-cols-2">
      <div className="max-w-[500px]: mx-auto flex h-full flex-col justify-center p-8 text-center">
        <Image
          className="mx-auto mb-8"
          src="/logo_login.png"
          alt="Logo Scalercio"
          width={200}
          height={200}
        />
        <h1 className="max-auto mb-3 text-4xl">Bem vindo!</h1>
        <p className="text-muted-forground m-8">
          Scalercio Finance é uma plataforma de gestão financeira, que utiliza
          IA para monitorar sua movimentações e oeferer insights personalizados,
          para facilitar o controle do seu dinheiro.
        </p>
        <SignInButton>
          <Button variant="outline">
            <LogInIcon className="mr-2" />
            Fazer login ou criar uma conta
          </Button>
        </SignInButton>
      </div>
      <div className="relative h-full w-full">
        <Image
          className="object-cover"
          src="/login.png"
          alt="Faça Login"
          fill
        />
      </div>
    </div>
  );
};

export default LoginPage;

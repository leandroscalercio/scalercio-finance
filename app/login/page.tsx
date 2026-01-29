import Image from "next/image";
import { Button } from "../_components/ui/button";
import { LogInIcon } from "lucide-react";

const LoginPage = () => {
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
          Scalercio Finance é uma plataforma de gestão financeira. que utiliza
          IA para monitorar sua movimentações e oeferer insights personalizados,
          para facilitar o controle do seu dinheiro.
        </p>
        <Button variant="outline">
          <LogInIcon className="mr-2" />
          Fazer login ou criar uma conta
        </Button>
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

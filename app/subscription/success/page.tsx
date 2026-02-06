import Navbar from "@/app/_components/navbar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SubscriptionSuccessPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    <>
      <Navbar />
      <div className="space-y-2 p-6">
        <h1 className="text-2xl font-bold">Assinatura confirmada</h1>
        <p>Seu plano Premium será ativado em instantes.</p>
        <a className="underline" href="/subscription">
          Voltar para Assinatura
        </a>
      </div>
    </>
  );
}

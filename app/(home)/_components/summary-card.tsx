import AddTransactionButton from "@/app/_components/add-transaction-button";
import { Card, CardContent, CardHeader } from "@/app/_components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon: ReactNode;
  title: string;
  amount: number;
  size?: "small" | "large";
  userCanAddTransaction?: boolean;
}

const SummaryCard = ({
  icon,
  title,
  amount,
  size = "small",
  userCanAddTransaction,
}: SummaryCardProps) => {
  return (
    <Card className={`${size === "large" ? "bg-white bg-opacity-15" : ""}`}>
      <CardHeader className="flex-row items-center gap-2 sm:gap-4">
        <span className="shrink-0">{icon}</span>

        <p
          className={`whitespace-nowrap ${
            size === "small"
              ? "text-[10px] text-muted-foreground sm:text-sm"
              : "text-white opacity-70"
          }`}
        >
          {title}
        </p>
      </CardHeader>

      <CardContent className="flex items-center justify-between gap-2 sm:gap-3">
        <p
          className={`min-w-0 font-bold tabular-nums leading-none ${
            size === "small" ? "text-xs sm:text-2xl" : "text-xl sm:text-4xl"
          }`}
        >
          {Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(amount)}
        </p>

        {size === "large" && (
          <div className="shrink-0 origin-right scale-[0.75] sm:scale-100">
            <AddTransactionButton
              userCanAddTransaction={userCanAddTransaction}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;

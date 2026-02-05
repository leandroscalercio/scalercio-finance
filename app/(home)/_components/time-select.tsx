"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const MONTH_OPTIONS = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const TimeSelect = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const rawMonth = searchParams.get("month");
  const month = rawMonth ? String(rawMonth).padStart(2, "0") : undefined;

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const handleMonthChange = (month: string) => {
    push(`/?month=${month}`);
  };

  const selectedLabel =
    MONTH_OPTIONS.find((opt) => opt.value === (month ?? currentMonth))?.label ??
    "Mês";

  return (
    <Select
      onValueChange={(value) => handleMonthChange(value)}
      value={month ?? currentMonth}
    >
      <SelectTrigger className="h-8 w-full rounded-full px-2 text-[11px] sm:h-auto sm:w-[150px] sm:px-4 sm:text-sm">
        <SelectValue placeholder="Mês">
          <span className="block max-w-full truncate">{selectedLabel}</span>
        </SelectValue>
      </SelectTrigger>

      <SelectContent className="max-h-[280px]">
        {MONTH_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex w-full items-center justify-between">
              <span>{option.label}</span>
              {option.value === currentMonth ? (
                <span className="ml-2 rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white"></span>
              ) : null}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimeSelect;

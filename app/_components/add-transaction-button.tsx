"use client";

import { ArrowDownUpIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Link from "next/link";

interface AddTransactionButtonProps {
  userCanAddTransaction?: boolean;
}

const AddTransactionButton = ({
  userCanAddTransaction,
}: AddTransactionButtonProps) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const isDisabled = !userCanAddTransaction;

  const handleClick = () => {
    if (isDisabled) {
      setPopoverOpen(true);
      return;
    }

    setDialogIsOpen(true);
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <span className="inline-flex" onClick={handleClick}>
            <Button className="rounded-full font-bold" disabled={isDisabled}>
              Adicionar transação
              <ArrowDownUpIcon />
            </Button>
          </span>
        </PopoverTrigger>

        {isDisabled && (
          <PopoverContent
            side="top"
            align="center"
            className="w-auto rounded-md px-3 py-2 text-center text-xs font-medium shadow-md"
          >
            <p className="mb-1">Assine o Premium!</p>

            <Link
              href="/subscription"
              className="text-primary underline underline-offset-2 hover:opacity-80"
              onClick={() => setPopoverOpen(false)}
            >
              Ver planos
            </Link>
          </PopoverContent>
        )}
      </Popover>

      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddTransactionButton;

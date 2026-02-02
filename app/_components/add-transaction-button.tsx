"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import UpsertTransactionDialog from "./upsert-transaction-dialog";

const AddTransactionButton = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        className="gap-2 rounded-full bg-primary font-bold hover:bg-primary/90"
        onClick={() => setDialogIsOpen(true)}
      >
        <PlusIcon size={16} />
        Adicionar Transação
      </Button>
      <UpsertTransactionDialog
        isOpen={dialogIsOpen}
        setIsOpen={setDialogIsOpen}
      />
    </>
  );
};

export default AddTransactionButton;

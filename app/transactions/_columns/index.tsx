"use client";

import { Transaction } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import TransactionTypeBadge from "../_components/type-badge";
import {
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_PAYMENT_METHOD_LABELS,
} from "@/app/_constants/transactions";
import EditTransactionButton from "../_components/edit-transaction-button";
import DeleteTransactionButton from "../_components/delete-transaction-button";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row: { original } }) => (
      <span className="block max-w-[96px] truncate sm:max-w-none">
        {original.name}
      </span>
    ),
  },

  {
    accessorKey: "type",
    header: () => <span className="hidden md:inline">Tipo</span>,
    cell: ({ row: { original: transaction } }) => (
      <div className="hidden md:block">
        <TransactionTypeBadge transaction={transaction} />
      </div>
    ),
  },

  {
    accessorKey: "category",
    header: () => <span className="hidden md:inline">Categoria</span>,
    cell: ({ row: { original: transaction } }) => (
      <span className="hidden md:inline">
        {TRANSACTION_CATEGORY_LABELS[transaction.category]}
      </span>
    ),
  },

  {
    accessorKey: "paymentMethod",
    header: () => <span className="hidden md:inline">Método de Pagamento</span>,
    cell: ({ row: { original: transaction } }) => (
      <span className="hidden md:inline">
        {TRANSACTION_PAYMENT_METHOD_LABELS[transaction.paymentMethod]}
      </span>
    ),
  },

  {
    accessorKey: "date",
    header: () => <span className="hidden md:inline">Data</span>,
    cell: ({ row: { original: transaction } }) => (
      <span className="hidden md:inline">
        {new Date(transaction.date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </span>
    ),
  },

  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row: { original } }) => (
      <span className="block whitespace-nowrap text-right">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(original.amount))}
      </span>
    ),
  },

  {
    id: "actions",
    header: () => <span className="whitespace-nowrap">Ações</span>,
    cell: ({ row: { original } }) => (
      <div className="flex min-w-[72px] justify-end gap-1">
        <EditTransactionButton transaction={original} />
        <DeleteTransactionButton transactionId={original.id} />
      </div>
    ),
  },
];

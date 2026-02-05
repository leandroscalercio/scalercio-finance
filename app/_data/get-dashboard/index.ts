import { db } from "@/app/_lib/prisma";
import { TransactionType } from "@prisma/client";

import { auth } from "@clerk/nextjs/server";
import { TotalExpensePerCategory, TransactionPercentagePerType } from "./types";

export const getDashboard = async (month: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const year = new Date().getFullYear();
  const where = {
    userId,
    date: {
      gte: new Date(`${year}-${month}-01`),
      lt: new Date(`${year}-${month}-31`),
    },
  };
  const depositsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "DEPOSIT" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );
  const investmentsTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "INVESTMENT" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );
  const expensesTotal = Number(
    (
      await db.transaction.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      })
    )?._sum?.amount,
  );
  const balance = depositsTotal - investmentsTotal - expensesTotal;
  const transactionsTotal = depositsTotal + investmentsTotal + expensesTotal;
  const typesPercentage: TransactionPercentagePerType = {
    [TransactionType.DEPOSIT]:
      transactionsTotal > 0
        ? Math.round((depositsTotal / transactionsTotal) * 100)
        : 0,
    [TransactionType.EXPENSE]:
      transactionsTotal > 0
        ? Math.round((expensesTotal / transactionsTotal) * 100)
        : 0,
    [TransactionType.INVESTMENT]:
      transactionsTotal > 0
        ? Math.round((investmentsTotal / transactionsTotal) * 100)
        : 0,
  };
  const totalExpensePerCategory: TotalExpensePerCategory[] = (
    await db.transaction.groupBy({
      by: ["category"],
      where: {
        ...where,
        type: TransactionType.EXPENSE,
      },
      _sum: {
        amount: true,
      },
    })
  ).map((category) => ({
    category: category.category,
    totalAmount: Number(category._sum.amount || 0),
    percentageOfTotal:
      expensesTotal > 0
        ? Math.round((Number(category._sum.amount || 0) / expensesTotal) * 100)
        : 0,
  }));
  const lastTransactions = await db.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 15,
  });
  return {
    balance,
    depositsTotal,
    investmentsTotal,
    expensesTotal,
    typesPercentage,
    totalExpensePerCategory,
    lastTransactions: JSON.parse(JSON.stringify(lastTransactions)),
  };
};

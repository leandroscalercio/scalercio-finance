import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "../_components/navbar";
import SummaryCards from "./_components/summary-cards";
import TimeSelect from "./_components/time-select";
import { isMatch } from "date-fns";
import TransactionsPieChart from "./_components/transactions-pie.chart";
import { getDashboard } from "../_data/get-dashboard";
import ExpensesPerCategory from "./_components/expense-per-category";
import LastTransactions from "./_components/last-transactions";

interface HomeProps {
  searchParams: {
    month: string;
  };
}

const Home = async ({ searchParams: { month } }: HomeProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }
  const monthIsInvalid = !month || isMatch(month, "MM") === false;
  if (monthIsInvalid) {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    redirect(`/?month=${currentMonth}`);
  }

  const dashboardData = await getDashboard(month);

  return (
    <>
      <Navbar />
      <div className="flex flex-col space-y-6 overflow-hidden p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>
        <div className="grid grid-cols-[2fr,1fr] gap-6 overflow-hidden">
          <div className="flex flex-col gap-6 overflow-hidden">
            <SummaryCards month={month} {...dashboardData} />
            <div className="grid grid-cols-2 gap-6 overflow-hidden">
              <TransactionsPieChart {...dashboardData} />
              <ExpensesPerCategory
                expensesPerCategory={dashboardData.totalExpensePerCategory}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <LastTransactions
              lastTransactions={dashboardData.lastTransactions}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

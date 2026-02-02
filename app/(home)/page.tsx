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
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <TimeSelect />
        </div>
        <div className="grid grid-cols-[1fr,1.2fr] gap-6">
          <div className="space-y-6">
            <SummaryCards month={month} {...dashboardData} />
            <div className="grid grid-cols-2 gap-6">
              <TransactionsPieChart {...dashboardData} />
              <ExpensesPerCategory
                expensesPerCategory={dashboardData.totalExpensePerCategory}
              />
            </div>
          </div>

          <div>
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

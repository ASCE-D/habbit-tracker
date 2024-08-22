import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Layout from "@/components/Dashboard";
import HabitDetails from "@/components/Dashboard/Details";
import HabitList from "@/components/Dashboard/Habit";
import { Sidebar } from "@/components/Dashboard/Test";
import { fetchHabits, stackHabit, getHabitsForDay } from "@/actions/habit";
import { Suspense } from "react";
import HabitDashboardClient from "@/components/Dashboard";
import PreLoader from "@/components/Common/PreLoader";
import { authOptions } from "@/utils/auth";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="flex h-screen">
      <div className="fixed left-0 top-0 h-full w-1/6">
        <Sidebar />
      </div>
      <div className="ml-[16.6%] flex-1 overflow-hidden">
        <Suspense fallback={<PreLoader />}>
          <HabitDashboardClient />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;

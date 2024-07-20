import Layout from "@/components/Dashboard";
import  HabitDetails  from "@/components/Dashboard/Details";
import HabitList from "@/components/Dashboard/Habit";
// import Sidebar from "@/components/Dashboard/Sidebar";
import { Sidebar } from "@/components/Dashboard/Test";
import { fetchHabits, stackHabit, getHabitsForDay } from "@/actions/habit";
import { Suspense } from "react";
import HabitDashboardClient from "@/components/Dashboard";
import PreLoader from "@/components/Common/PreLoader";
// import { getHabitsForDay } from "@/actions/habit/test";

const page = async () => {
  // const habits = await getHabitsForDay(new Date());
  // console.log("hello", habits);


  return (
    <div className="flex">
      <div className="fixed left-0 top-0 h-full w-1/6 overflow-hidden">
        <Sidebar />
      </div>
      <div className="ml-[16.6%] flex w-5/6 overflow-y-auto">
        <Suspense fallback={<PreLoader />}>
          <HabitDashboardClient />
        </Suspense>
      </div>
    </div>
  );
};

export default page;

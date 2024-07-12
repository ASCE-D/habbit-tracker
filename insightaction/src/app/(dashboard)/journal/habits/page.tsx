import Layout from "@/components/Dashboard"
import {HabitDetails} from "@/components/Dashboard/Details";
import HabitList from "@/components/Dashboard/Habit";
// import Sidebar from "@/components/Dashboard/Sidebar";
import { Sidebar } from "@/components/Dashboard/Test";

const page = () => {
    const habit = {
      name: "Read for 30 minutes",
      streak: 5,
      completed: 20,
      skipped: 3,
      failed: 2,
    };


  return (
    // const [selectedHabit, setSelectedHabit] = useState(null);
    <div className="flex">
      {/* Sidebar - 20% width */}
      <div className=" w-1/6">
        <Sidebar />
      </div>

      {/* Habit List - 40% width */}
      <div className="w-3/6 border-l border-r border-gray-700">
        <HabitList />
      </div>

      {/* Habit Details - 40% width */}
      <div className="w-2/6">
        <HabitDetails habit />
      </div>
    </div>
  );
}

export default page


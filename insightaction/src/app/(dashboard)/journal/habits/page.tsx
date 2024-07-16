import Layout from "@/components/Dashboard";
import { HabitDetails } from "@/components/Dashboard/Details";
import HabitList from "@/components/Dashboard/Habit";
// import Sidebar from "@/components/Dashboard/Sidebar";
import { Sidebar } from "@/components/Dashboard/Test";
import { fetchHabits, stackHabit } from "@/actions/habit";

const page = async () => {
  const fetchedHabits = await fetchHabits();
  console.log("hello", fetchedHabits);
  const habit = [{
    name: "Read for 30 minutes",
    streak: 5,
    completed: 20,
    skipped: 3,
    failed: 2,
  }];

  return (
    // const [selectedHabit, setSelectedHabit] = useState(null);
    <div className="flex">
      {/* Sidebar - 20% width */}
      <div className=" w-1/6 ">
        <Sidebar />
      </div>
      <div className="flex w-5/6">
        <div className="w-1/2 border-l border-r border-gray-700">
          <HabitList habits={habit} />
        </div>

        {/* Habit Details - 40% width */}
        <div className="w-1/2">
          <HabitDetails habit />
        </div>
      </div>
    </div>
  );
};

export default page;

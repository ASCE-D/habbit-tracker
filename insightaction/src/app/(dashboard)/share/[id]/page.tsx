import HabitTrackingDashboard from "@/components/Share/ShareDashboard";
import { getHabitById } from "@/actions/habit/test";
import { notFound } from "next/navigation";

export default async function HabitPage({
  params,
}: {
  params: { id: string };
}) {
  const habit = await getHabitById(params.id);

  if (!habit) {
    notFound();
  }

  return (
    <div className="container mx-auto my-24 p-4">
      <HabitTrackingDashboard habit={habit} />
    </div>
  );
}

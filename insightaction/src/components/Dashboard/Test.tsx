import Link from "next/link";
import {
  Package2,
  User,
  Target,
  FolderClosed,
  Plus,
  Settings,
  LayoutList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Sidebar() {
  return (
    <div className="bg-dark hidden h-screen border-r border-gray-600 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-gray-600 px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">My Habits</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="#"
              className="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primaryOrange"
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <div className="mt-4">
              <h3 className="text-muted-foreground mb-2 px-3 text-xs font-semibold">
                GOALS
              </h3>
              <Link
                href="#"
                className="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primaryOrange"
              >
                <Target className="h-4 w-4" />
                All Goals
              </Link>
              <Link
                href="/nt"
                className="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primaryOrange"
              >
                <FolderClosed className="h-4 w-4" />
                Enable Notification
              </Link>
              <Link
                href="#"
                className="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primaryOrange"
              >
                <Plus className="h-4 w-4" />
                Add a Goal
              </Link>
            </div>
            <div className="mt-4">
              <h3 className="text-muted-foreground mb-2 px-3 text-xs font-semibold">
                PREFERENCES
              </h3>
              <Link
                href="#"
                className="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primaryOrange"
              >
                <Settings className="h-4 w-4" />
                App Settings
              </Link>
              <Link
                href="#"
                className="text-muted-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primaryOrange"
              >
                <LayoutList className="h-4 w-4" />
                Manage Habits
              </Link>
            </div>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

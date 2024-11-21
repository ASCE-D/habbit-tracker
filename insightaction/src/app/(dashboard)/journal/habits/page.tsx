"use client";

import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { useSession } from "next-auth/react";
import PreLoader from "@/components/Common/PreLoader";
import { Sidebar } from "@/components/Dashboard/Test";
import HabitDashboardClient from "@/components/Dashboard";
import { useMediaQuery } from "react-responsive";

// Wrapper component to check authentication
function AuthCheck({ children }: any) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <PreLoader />;
  }

  if (!session) {
    redirect("/signin");
  }

  return children;
}

// Main layout component with SessionProvider
export default function DashboardLayout() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <SessionProvider>
      <AuthCheck>
        <div className="flex h-screen ">
          <Sidebar isMobile={isMobile} />
          <div
            className={`flex-1 overflow-hidden ${isMobile ? "" : ""}`}
          >
            <Suspense fallback={<PreLoader />}>
              <HabitDashboardClient isMobile = {isMobile} />
            </Suspense>
          </div>
        </div>
      </AuthCheck>
    </SessionProvider>
  );
}

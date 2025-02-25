"use client";

import Layout from "@/components/Dashboard";
import { useMediaQuery } from "react-responsive";

const Dashboard = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return <Layout isMobile={isMobile} />;
};

export default Dashboard;

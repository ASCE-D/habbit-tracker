"use client";

import ComingSoon from "@/components/Common/Comingsoon";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const feature = params.slug as string;

  return <ComingSoon feature={feature} />;
};

export default Page;

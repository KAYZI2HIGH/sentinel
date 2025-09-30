import AnalyticsPage from "@/components/custom-ui/AnalyticsPage";
import React, { Suspense } from "react";
import Loading from "../loading";

const page = () => {
  return (
    <Suspense fallback={<Loading/>}>
      <AnalyticsPage />
    </Suspense>
  );
};

export default page;

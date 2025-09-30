import AnalyticsPage from "@/components/custom-ui/AnalyticsPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AnalyticsPage />
    </Suspense>
  );
};

export default page;

import AnalyzeLayout from "@/components/custom-ui/AnalyzeLayout";
import React, { Suspense } from "react";
import Loading from "../loading";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<Loading/>}>
      <AnalyzeLayout>{children}</AnalyzeLayout>
    </Suspense>
  );
};

export default layout;

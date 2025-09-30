import AnalyzeLayout from "@/components/custom-ui/AnalyzeLayout";
import React, { Suspense } from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AnalyzeLayout>{children}</AnalyzeLayout>
    </Suspense>
  );
};

export default layout;

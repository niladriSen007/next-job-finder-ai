import { Suspense } from "react";
import DashboardSkeleton from "./_components/skeletons/dashboard-skeleton";

const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="px-5 py-24 max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">Industry Insights</h1>
      </div>
      <Suspense
        fallback={<DashboardSkeleton />}
      >
        {children}
      </Suspense>
    </div>
  )
}
export default DashboardLayout
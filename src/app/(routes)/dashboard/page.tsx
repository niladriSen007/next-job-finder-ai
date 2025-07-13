import { getIndustryDetails } from "@/actions/industry/actions";
import { GET_USER_ONBOARDING_STATUS } from "@/actions/user/actions"
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardView from "./_components/dashboard-view";
import { IndustryDetailsType } from "./_types";
import DashboardSkeleton from "./_components/skeletons/dashboard-skeleton";

const DashboardPage = async () => {

  const { isOnboarded } = await GET_USER_ONBOARDING_STATUS();
  const industryDetails: IndustryDetailsType = await getIndustryDetails();

  if (!isOnboarded) {
    redirect("/onboarding")
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <div>
        <DashboardView industryDetails={industryDetails} />
      </div>
    </Suspense>
  )
}
export default DashboardPage
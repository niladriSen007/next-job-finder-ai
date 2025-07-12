import { getIndustryDetails } from "@/actions/industry/actions";
import { GET_USER_ONBOARDING_STATUS } from "@/actions/user/actions"
import { redirect } from "next/navigation";
import { Suspense } from "react";
import DashboardView from "./_components/dashboard-view";
import { IndustryDetailsType } from "./_types";

const DashboardPage = async () => {

  const { isOnboarded } = await GET_USER_ONBOARDING_STATUS();
  const industryDetails: IndustryDetailsType = await getIndustryDetails();

  if (!isOnboarded) {
    redirect("/onboarding")
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <DashboardView industryDetails={industryDetails} />
      </div>
    </Suspense>
  )
}
export default DashboardPage
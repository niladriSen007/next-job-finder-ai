import { GET_USER_ONBOARDING_STATUS } from "@/actions/user/actions"
import { redirect } from "next/navigation";
import { Suspense } from "react";

const DashboardPage = async () => {

  const { isOnboarded } = await GET_USER_ONBOARDING_STATUS();

  if (!isOnboarded) {
    redirect("/onboarding")
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>DashboardPage</div>
    </Suspense>
  )
}
export default DashboardPage
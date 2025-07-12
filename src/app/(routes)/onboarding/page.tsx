import { GET_USER_ONBOARDING_STATUS } from "@/actions/user/actions";
import { lazy, Suspense } from "react";
import { redirect } from "next/navigation";
const OnboardingForm = lazy(() => import("./_components/forms/onboarding_form"))
import OnboardingFormSkeleton from "./_components/skeletons/onboarding_form_skeleton";

const OnboardingPage = async () => {

  const { isOnboarded } = await GET_USER_ONBOARDING_STATUS();

  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<OnboardingFormSkeleton />}>
      <div className="h-screen flex items-center justify-center w-screen">
        <OnboardingForm />
      </div>
    </Suspense>
  )
}
export default OnboardingPage
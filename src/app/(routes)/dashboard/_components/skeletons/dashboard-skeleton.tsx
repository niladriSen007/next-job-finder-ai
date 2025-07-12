import { Skeleton } from "@/components/ui/skeleton"

const DashboardSkeleton = () => {
  return (
    <div className="my-16">
      <div className="flex flex-col md:flex-row gap-5">
        <Skeleton className="h-48 w-full md:w-80 rounded-md" />
        <Skeleton className="h-48  w-full md:w-80 rounded-md" />
        <Skeleton className="h-48  w-full md:w-80 rounded-md" />
        <Skeleton className="h-48  w-full md:w-80 rounded-md" />
      </div>
      <div className="mt-8">
        <Skeleton className="h-[400px]  rounded-md" />
      </div>
    </div>
  )
}
export default DashboardSkeleton
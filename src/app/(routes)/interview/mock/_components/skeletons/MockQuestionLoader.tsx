import { Skeleton } from "@/components/ui/skeleton"

const MockQuestionSkeleton = () => {
  return (
    <div className="my-16 flex flex-col gap-5 bg-slate-900 rounded-md p-8">
      <Skeleton className="h-4 w-24 md:w-32 " />
      <Skeleton className="h-10  w-full md:w-7xl rounded-md" />
      <Skeleton className="h-4  w-48 md:w-48 rounded-md" />
      <Skeleton className="h-4  w-48 md:w-48 rounded-md" />
      <Skeleton className="h-4  w-48 md:w-48 rounded-md" />
      <Skeleton className="h-4  w-48 md:w-48 rounded-md" />
    </div>
  )
}
export default MockQuestionSkeleton
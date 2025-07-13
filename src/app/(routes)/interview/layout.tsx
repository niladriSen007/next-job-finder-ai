import { Suspense } from "react"

const InterviewLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  )
}
export default InterviewLayout
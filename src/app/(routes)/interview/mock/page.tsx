import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Quiz from "../_components/quiz";


const MockInterviewPage = () => {
  return (
     <div className="container mx-auto space-y-4 px-8 md:px-0 py-24 min-h-screen">
      <div className="flex flex-col space-y-2 mx-2">
        <Link href="/interview">
          <Button variant="link" className="gap-2 pl-0 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back to Interview Preparation
          </Button>
        </Link>

        <div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Mock Interview</h1>
          <p className="text-muted-foreground">
            Test your knowledge with industry-specific questions
          </p>
        </div>
      </div>

      <Quiz />
    </div>
  )
}
export default MockInterviewPage
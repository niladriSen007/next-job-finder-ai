import { getAssessments } from "@/actions/interview/actions";
import StatsCard from "./_components/stats-card";
import PerformanceChart from "./_components/performance-chart";
import QuizList from "./_components/quiz-list";

const Interview = async() => {

   const assessments = await getAssessments();

  return (
    <div className="px-10 py-20 md:p-36">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-5xl md:text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>
      <div className="space-y-6">
        <StatsCard assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  )
}
export default Interview
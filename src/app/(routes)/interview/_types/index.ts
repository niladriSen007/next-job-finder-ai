import { QuizResult } from "@/actions/types";

export interface CommonProps {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  quizScore: number;
  questions: QuizResult[];
  category: string;
  improvementTip: string | null;
}

export interface StatsCardProps {
  assessments: CommonProps[]
}
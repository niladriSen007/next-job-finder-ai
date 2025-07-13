export interface Question{
  question: string;
  correctAnswer: string;
  explanation: string
}
export interface QuizResult extends Question{
  userAnswer: string
  isCorrect: boolean
}
export interface Questions{
  questions: Question[]
}
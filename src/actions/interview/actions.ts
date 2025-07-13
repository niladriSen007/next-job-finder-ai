"use server"

import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../../services/prisma/prisma";
import { Question } from "../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });



async function isUserAuthorized() {
  const { userId } = await auth()

  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId
    }
  })

  if (!user) throw new Error("User not found")
  return user
}

export async function generateQuiz() {
  const { userId } = await auth()

  if (!userId) throw new Error("Unauthorized")

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId
    },
    select: {
      industryName: true,
      skills: true
    }
  })

  if (!user) throw new Error("User not found")

  const prompt = `
    Generate 5 technical interview questions for a ${user?.industryName} 
    professional${user?.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const res = result?.response
    const text = res.text()
    const formattedTextResponse = text?.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(formattedTextResponse)
    return quiz?.questions
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }

}

export async function saveQuizResults(questions: Question[], answers: string[], score: number) {
  const user = await isUserAuthorized()
  const quizResults: {
    question: string,
    correctAnswer: string,
    userAnswer: string,
    isCorrect: boolean,
    explanation: string
  }[] = questions?.map((question: Question, index: number) => ({
    question: question?.question,
    correctAnswer: question?.correctAnswer,
    userAnswer: answers[index],
    isCorrect: answers[index] === question?.correctAnswer,
    explanation: question?.explanation
  }))

  const wrongAnswers = quizResults?.filter(question => !question?.isCorrect)

  let improvementTip = null
  if (wrongAnswers?.length) {
    const wrongQuestionText = wrongAnswers?.map(q => `Question: "${q.question}"\nCorrect Answer: "${q.correctAnswer}"\nUser Answer: "${q.userAnswer}"`).join("\n\n")

    const improvementPrompt = `
      The user got the following ${user.industryName} technical interview questions wrong:

      ${wrongQuestionText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const tipResult = await model.generateContent(improvementPrompt);
      improvementTip = tipResult?.response?.text()?.trim() || null;
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // no need to throw an error here proceed without an improvement tip
    }
  }

  try {
    const assesment = await prisma.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: quizResults,
        category: "Technical",
        improvementTip
      }
    })
    return assesment
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}



export async function getAssessments() {
  const user = await isUserAuthorized()

  try {
    const assessments = await prisma.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}
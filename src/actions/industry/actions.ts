"use server";

import { AiResponseType } from "@/app/(routes)/dashboard/_types";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "../../services/prisma/prisma";
import { JsonValue } from "@/generated/prisma/runtime/library";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAiIndustryDetails(industryName: string): Promise<AiResponseType> {
  const system_prompt = `
          Analyze the current state of the ${industryName} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;
  const result = await model?.generateContent(system_prompt);
  const response = result?.response;
  const text = response?.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
}

export async function getIndustryDetails() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId
    },
    include: {
      industryDetails: true
    }
  })

  if (!user) throw new Error("User not found");

  if (!user?.industryDetails) {
    const insights = await generateAiIndustryDetails(user?.industryName as string)

    const newIndustryDetails = await prisma.industryDetails.create({
      data: {
        industry: user?.industryName as string,
        nextUpdate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        ...insights,
        salaryRanges: JSON.parse(JSON.stringify(insights?.salaryRanges)),
      }
    })

    console.log(newIndustryDetails,"detailssss")
  
    const industryDetails = newIndustryDetails as {
      id: string
      industry: string
      nextUpdate: Date
      salaryRanges: JsonValue[]
      growthRate: number
      demandLevel: string
      topSkills: string[]
      marketOutlook: string
      keyTrends: string[]
      recommendedSkills: string[]
      lastUpdated: Date
    }

    

    return industryDetails
  }

  return user?.industryDetails
}
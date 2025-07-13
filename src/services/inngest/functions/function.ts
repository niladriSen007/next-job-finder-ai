import { prisma } from '../../prisma/prisma'
import { inngest } from "../client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export const generateIndustryDetailsCronJob = inngest.createFunction(
  { name: "Generate industry dettails", id: "generate-industry-details" },
  { cron: "0 0 * * 0" },
  async ({ step }) => {
    const industries = await step.run("Get all industries", async () => {
      return await prisma?.industryDetails?.findMany({
        select: {
          industry: true,
        },
      });
    });


    for (const { industry } of industries) {
      const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
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

      const res = await step?.ai?.wrap(
        "call-gemini",
        async (p) => {
          return await model.generateContent(p)
        },
        prompt
      )

      const part = res?.response?.candidates &&
        res.response.candidates[0]?.content?.parts &&
        res.response.candidates[0].content.parts[0]
        ? res.response.candidates[0].content.parts[0]
        : null;
      const text = part && "text" in part ? part.text as string : "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);

      await step.run("Update industry details", async () => {
        await prisma.industryDetails.update({
          where: {
            industry: industry,
          },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });

    }
  })


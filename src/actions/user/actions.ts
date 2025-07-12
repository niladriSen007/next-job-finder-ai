"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../services/prisma/prisma"
import { revalidatePath } from "next/cache";
import { generateAiIndustryDetails } from "../industry/actions";

export async function UPDATE_USER_DATA(data: {
  industry: string,
  experience: number,
  bio: string,
  skills: string[]
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId
    }
  })

  if (!user) throw new Error("User not found");

  try {
    const result = await prisma.$transaction(async (transaction) => {
      // Checking if the indusr=try exists or not
      let industryDetails = await transaction.industryDetails.findUnique({
        where: {
          industry: data?.industry
        }
      })

      if (!industryDetails) {
        const insights = await generateAiIndustryDetails(data?.industry as string)
        industryDetails = await prisma.industryDetails.create({
          data: {
            industry: data?.industry as string,
            nextUpdate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            ...insights,
            salaryRanges: JSON.parse(JSON.stringify(insights?.salaryRanges)),
          }
        })
      }

      const updatedUser = await transaction.user.update({
        where: {
          clerkUserId: userId
        },
        data: {
          industryName: data?.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        }
      })

      return {
        updatedUser,
        industryDetails
      }

    }, {
      timeout: 10000
    })

    revalidatePath("/")
    return result.updatedUser;
  } catch (error) {
    console.error("Error updating user and industry:", error);
    throw new Error("Failed to update profile");
  }

}

export async function GET_USER_ONBOARDING_STATUS() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: {
      clerkUserId: userId
    }
  })

  if (!user) throw new Error("User not found");

  try {
    const userWithIndutry = await prisma.user.findUnique({
      where: {
        clerkUserId: userId
      },
      select: {
        industryName: true
      }
    })

    // This is a hacky way to check if the user has onboarded or not
    return {
      isOnboarded: !!userWithIndutry?.industryName
    }
  } catch (error) {
    console.error("Error updating user and industry:", error);
    throw new Error("Failed to update profile");

  }
}
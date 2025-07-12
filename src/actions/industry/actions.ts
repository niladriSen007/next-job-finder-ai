"use server";

import { prisma } from "../../services/prisma/prisma";

export async function getIndustries() {
  return await prisma.industryDetails.findMany();
}
import { z } from "zod";


export const ONBOARDING_SCHEMA = z.object({
  industry: z.string({
    required_error: "Industry is required",
  }),
  subIndustry: z.string({
    required_error: "Sub Industry is required",
  }),
  bio: z.string().max(500),
  experience: z.string().
    transform(val => parseInt(val, 10)).
    pipe(z.number().min(0, "Experience must be greater than 0")
      .max(50, "Experience must be less than 50")),
  skills: z.string().transform(val => val ? val?.split(",")?.map(skill => skill.trim()).filter(Boolean) : []),
})


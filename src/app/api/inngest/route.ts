import { inngest } from "@/services/inngest/client";
import { generateIndustryDetailsCronJob } from "@/services/inngest/functions/function";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateIndustryDetailsCronJob, 
  ],
});

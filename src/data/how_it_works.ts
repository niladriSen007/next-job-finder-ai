import { UserPlus, FileEdit, Users, LineChart, Component } from "lucide-react";

export interface HowItWorks {
  title: string;
  description: string;
  icon: typeof Component;
}

export const howItWorks: HowItWorks[] = [
  {
    title: "Professional Onboarding",
    description: "Share your industry and expertise for personalized guidance",
    icon: UserPlus,
  },
  {
    title: "Craft Your Documents",
    description: "Create ATS-optimized resumes and compelling cover letters",
    icon: FileEdit,
  },
  {
    title: "Prepare for Interviews",
    description:
      "Practice with AI-powered mock interviews tailored to your role",
    icon: Users,
  },
  {
    title: "Track Your Progress",
    description: "Monitor improvements with detailed performance analytics",
    icon: LineChart,
  },
];
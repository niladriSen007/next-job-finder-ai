/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { industries, Industry } from "@/data/industry_data"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { ONBOARDING_SCHEMA } from "../../_validations/schema"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { UPDATE_USER_DATA } from "@/actions/user/actions"
import { useEffect, useState } from "react"
import { useFetch } from "@/hooks/use-fetch"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"

const CardHeaderComp = () => (
  <CardHeader className="text-center pb-8">
    <CardTitle className=" text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
      Complete Your Profile
    </CardTitle>
    <CardDescription className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
      Select your industry to get personalized career insights and
      recommendations tailored just for you.
    </CardDescription>
  </CardHeader>
)

const OnboardingForm = () => {
  //use-states 
  const [selectedIndustry, setSelectedIndustry] = useState<string[]>()

  //form hooks
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(ONBOARDING_SCHEMA),
  })

  //router
  const router = useRouter();

  //watch the selected industry for the sub industries
  const watchIndustry = watch("industry")


  // useFetch - custom hook
  const { data: updateResult, fn: updateUserFn, loading: updateUserLoading } = useFetch(UPDATE_USER_DATA)


  // submitting the form
  const onSubmit = async (values: {
    industry: string,
    subIndustry: string,
    bio: string,
    experience: number,
    skills: string[]
  }) => {
    try {

      // formatting the industry
      const formattedIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, "-")}`;

      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };


  // once user data updates redirect to dashboard
  useEffect(() => {
    if (updateResult && !updateUserLoading) {
      toast.success("Profile completed successfully!");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateUserLoading]);

  /* const renderForm = [
    {
      id: "experience",
      type: "number",
      min: "0",
      max: "50",
      placeholder:"Enter years of experience",
      hasErrors : errors.experience,
      errorMessage: errors.experience?.message,
    }
  ] */

  const SubIndustry = () => (
    <div className="space-y-2">
      <Label htmlFor="subIndustry" className="text-sm font-semibold text-gray-200">Specialization</Label>
      <Select
        onValueChange={(value) => setValue("subIndustry", value)}
      >
        <SelectTrigger id="subIndustry" className=" cursor-pointer h-12 border-2 border-gray-600 bg-gray-800 text-white hover:border-blue-400 focus:border-blue-500 transition-colors duration-200 rounded-lg">
          <SelectValue placeholder="Select your specialization" />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-2 bg-gray-800 border-gray-600">
          <SelectGroup>
            <SelectLabel className="font-semibold text-gray-300">Specializations</SelectLabel>
            {selectedIndustry?.map((sub) => (
              <SelectItem key={sub} value={sub} className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
                {sub}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {errors.subIndustry && (
        <p className="text-sm text-red-400 animate-in slide-in-from-left-1 duration-200">
          {errors.subIndustry.message}
        </p>
      )}
    </div>
  )

  const Experience = () => (
    <div className="space-y-3">
      <Label htmlFor="experience" className="text-sm font-semibold text-gray-200">Years of Experience</Label>
      <Input
        id="experience"
        type="number"
        min="0"
        max="50"
        defaultValue={0}
        placeholder="Enter years of experience"
        className="h-9 border-2 border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-500 transition-all duration-200 rounded-lg px-4 text-base"
        {...register("experience")}
      />
      {errors.experience && (
        <p className="text-sm text-red-400 animate-in slide-in-from-left-1 duration-200">
          {errors.experience.message}
        </p>
      )}
    </div>
  )

  const Skills = () => (
    <div className="space-y-3">
      <Label htmlFor="skills" className="text-sm font-semibold text-gray-200">Skills</Label>
      <Input
        id="skills"
        placeholder="e.g., Python, JavaScript, Project Management"
        className="h-9 border-2 border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-500 transition-all duration-200 rounded-lg px-4 text-base"
        {...register("skills")}
      />
      <p className="text-sm text-blue-300 bg-blue-900/30 px-3 py-2 rounded-md border border-blue-700">
        💡 Separate multiple skills with commas
      </p>
      {errors.skills && (
        <p className="text-sm text-red-400 animate-in slide-in-from-left-1 duration-200">{errors.skills.message}</p>
      )}
    </div>
  )

  const Bio = () => (
    <div className="space-y-3">
      <Label htmlFor="bio" className="text-sm font-semibold text-gray-200">Professional Bio</Label>
      <Textarea
        id="bio"
        placeholder="Tell us about your professional background, achievements, and career goals..."
        className="h-32 border-2 border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-500 transition-all duration-200 rounded-lg px-4 py-3 text-base max-w-[620px]"
        {...register("bio")}
      />
      {errors.bio && (
        <p className="text-sm text-red-400 animate-in slide-in-from-left-1 duration-200">{errors.bio.message}</p>
      )}
    </div>
  )

  const SubmitButton = () => (
    <Button
      type="submit"
      className=" cursor-pointer w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 mt-6"
      disabled={updateUserLoading}
    >
      {updateUserLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Saving Your Profile...
        </>
      ) : (
        <>
          🚀 Complete Profile
        </>
      )}
    </Button>
  )

  return (
    <div className="bg-gradient-to-br from-slate-950 via-gray-800 to-slate-950 flex items-center justify-center p-4 mt-20 rounded-xl">
      <Card className="w-full max-w-2xl shadow-2xl border border-gray-700 bg-slate-900 backdrop-blur-sm">
        <CardHeaderComp />
        <CardContent className="px-8 ">
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 ">
                  <Label htmlFor="industry" className="text-sm font-semibold text-gray-200">Select Industry</Label>
                <Select
                  onValueChange={(val) => {
                    console.log(val)
                    setValue("industry", val)
                    setSelectedIndustry(industries?.find(ind => ind.id === val)?.subIndustries)
                    setValue("subIndustry", "")
                  }}
                >
                  <SelectTrigger id="industry" className="cursor-pointer h-12 border-2 border-gray-600 bg-gray-800 text-white hover:border-blue-400 focus:border-blue-500 transition-colors duration-200 rounded-lg">
                    <SelectValue placeholder="Select an industry you are working in" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-2 bg-gray-800 border-gray-600">
                    <SelectGroup>
                      <SelectLabel className="font-semibold text-gray-300">Industries</SelectLabel>
                      {industries?.map((ind: Industry) => (
                        <SelectItem key={ind.id} value={ind.id} className="text-white hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">
                          {ind.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <p className="text-sm text-red-500">
                    {errors.industry.message}
                  </p>
                )}
                </div>
                {watchIndustry && <SubIndustry />}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Experience />
                <Skills />
              </div>
              <Bio />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default OnboardingForm
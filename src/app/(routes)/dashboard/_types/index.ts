

export interface AiResponseType{
  salaryRanges: SalaryRangeType[]
  growthRate: number
  demandLevel: string
  topSkills: string[]
  marketOutlook: string
  keyTrends: string[]
  recommendedSkills: string[]
}


export interface IndustryDetailsType {
  industry: string
  nextUpdate: Date
  salaryRanges: SalaryRangeType[]
  growthRate: number
  demandLevel: string
  topSkills: string[]
  marketOutlook: string
  keyTrends: string[]
  recommendedSkills: string[]
  lastUpdated: Date
}

export interface SalaryRangeType {
  role: string
  min: number
  max: number
  median: number
  location: string
}
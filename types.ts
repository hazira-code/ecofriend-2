export type Language = "en" | "te";

export interface PlantRecommendation {
  name: string;
  teluguName: string;
  description: string;
  teluguDescription: string;
  growthTime: string;
  sunlightRequired: string;
  soilRequired: string;
  waterRequired: string;
  careTips: string[];
  careTipsTelugu: string[];
}

export interface SoilGuidance {
  bestCrops: string[];
  fertilityRating: string;
  fertilityTips: string[];
  fertilityTipsTelugu: string[];
  compostSuggestions: string[];
  compostSuggestionsTelugu: string[];
}

export interface WaterPrediction {
  dailyRequirement: string;
  wateringFrequency: string;
  irrigationType: string;
  irrigationTypeTelugu: string;
  tips: string[];
  tipsTelugu: string[];
}

export interface ClimateSuitability {
  suitabilityScore: number;
  isSuitable: boolean;
  analysis: string;
  analysisTelugu: string;
  precautions: string[];
  precautionsTelugu: string[];
}

export interface DiseaseResult {
  detectedDisease: string;
  detectedDiseaseTelugu: string;
  confidenceScore: number;
  remedies: string[];
  remediesTelugu: string[];
  preventions: string[];
  preventionsTelugu: string[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  textTelugu?: string;
  timestamp: Date;
}

export interface GrowthMilestone {
  day: string;
  stage: string;
  stageTelugu: string;
  details: string;
  detailsTelugu: string;
}

export interface GrowthPrediction {
  currentStage: string;
  currentStageTelugu: string;
  nextMilestone: string;
  nextMilestoneTelugu: string;
  estimatedHarvestDate: string;
  yieldEstimate: string;
  yieldEstimateTelugu: string;
  milestones: GrowthMilestone[];
}

export interface UserProfile {
  email: string;
  name: string;
  isLoggedIn: boolean;
}

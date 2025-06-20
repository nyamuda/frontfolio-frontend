import type { Achievement } from "@/models/achievement";

export interface ValidatedAchievement {
  achievement: Achievement;
  isValid: boolean;
}

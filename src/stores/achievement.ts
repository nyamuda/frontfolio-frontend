import { defineStore } from "pinia";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import type { Achievement } from "@/models/achievement";
import { apiUrl } from "@/helpers/urlHelper";
import axios from "axios";

export const useAchievementStore = defineStore("achievement", () => {
  // Validates an array of Achievement objects by checking required fields.
  // Returns an array of ValidatedItem<Achievement> indicating whether each achievement is valid.
  const validateGivenAchievements = (achievements: Achievement[]): ValidatedItem<Achievement>[] => {
    return achievements.reduce((accumulator, currentValue) => {
      // An achievement is considered valid if all 'title', & 'description' fields are present and non-empty
      const isValid: boolean = !!currentValue.title && !!currentValue.description;

      // Wrap the achievement along with its validation result
      const validatedAchievement: ValidatedItem<Achievement> = {
        item: currentValue,
        isValid,
      };

      // Add the validated achievement to the result array
      accumulator.push(validatedAchievement);
      return accumulator;
    }, [] as ValidatedItem<Achievement>[]);
  };

  //delete background achievement for a specific project
  const deleteProjectAchievement = (achievementId: number | string, projectId: number | string) => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects/${projectId}/achievements/${achievementId}`;
      //add an access token to the request to access the protected route
      setAuthToken();
      axios
        .delete(url)
        .then(() => resolve({}))
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message ||
            "An unexpected error occurred while deleting the project achievement.";
          reject(message);
        });
    });
  };

  //Set authorization header for all request to access protected routes from the API
  const setAuthToken = () => {
    //check if there is a token in local storage
    const localToken = localStorage.getItem("jwt_token");

    //the current token
    const token = localToken ? localToken : null;

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  return { validateGivenAchievements, deleteProjectAchievement };
});

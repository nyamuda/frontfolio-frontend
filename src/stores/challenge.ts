import { defineStore } from "pinia";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import type { Challenge } from "@/models/challenge";
import { apiUrl } from "@/helpers/urlHelper";
import axios from "axios";

export const useChallengeStore = defineStore("challenge", () => {
  // Validates an array of Challenge objects by checking required fields.
  // Returns an array of ValidatedItem<Challenge> indicating whether each challenge is valid.
  const validateGivenChallenges = (challenges: Challenge[]): ValidatedItem<Challenge>[] => {
    return challenges.reduce((accumulator, currentValue) => {
      // A challenge is considered valid if all 'title', 'problem' & 'solution' fields are present and non-empty
      const isValid: boolean = !!currentValue.title && !!currentValue.problem &&!!currentValue.solution;

      // Wrap the challenge along with its validation result
      const validatedChallenge: ValidatedItem<Challenge> = {
        item: currentValue,
        isValid,
      };

      // Add the validated challenge to the result array
      accumulator.push(validatedChallenge);
      return accumulator;
    }, [] as ValidatedItem<Challenge>[]);
  };

  //delete background challenge for a specific project
  const deleteProjectChallenge = (
    challengeId: number | string,
    projectId: number | string,
  ) => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects/${projectId}/challenges/${challengeId}`;
      //add an access token to the request to access the protected route
      setAuthToken();
      axios
        .delete(url)
        .then(() => resolve({}))
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message ||
            "An unexpected error occurred while deleting the project challenge.";
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

  return { validateGivenChallenges, deleteProjectChallenge };
});

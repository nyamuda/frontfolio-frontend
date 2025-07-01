import { defineStore } from "pinia";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import type { Feedback } from "@/models/feedback";
import { apiUrl } from "@/helpers/urlHelper";
import axios from "axios";

export const useFeedbackStore = defineStore("feedback", () => {
  // Validates an array of Feedback objects by checking required fields.
  // Returns an array of ValidatedItem<Feedback> indicating whether each feedback is valid.
  const validateGivenFeedback = (feedbacks: Feedback[]): ValidatedItem<Feedback>[] => {
    return feedbacks.reduce((accumulator, currentValue) => {
      // A feedback is considered valid if all 'authorName', 'Comment' & 'SubmittedAt' fields are present and non-empty
      const isValid: boolean =
        !!currentValue.authorName && !!currentValue.comment && !!currentValue.submittedAt;

      // Wrap the feedback along with its validation result
      const validatedFeedback: ValidatedItem<Feedback> = {
        item: currentValue,
        isValid,
      };

      // Add the validated feedback to the result array
      accumulator.push(validatedFeedback);
      return accumulator;
    }, [] as ValidatedItem<Feedback>[]);
  };

  //delete background feedback for a specific project
  const deleteProjectFeedback = (feedbackId: number | string, projectId: number | string) => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects/${projectId}/feedbacks/${feedbackId}`;
      //add an access token to the request to access the protected route
      setAuthToken();
      axios
        .delete(url)
        .then(() => resolve({}))
        .catch((error) => {
          console.log(error);
          const message =
            error.response?.data?.message ||
            "An unexpected error occurred while deleting the project feedback.";
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

  return { validateGivenFeedback, deleteProjectFeedback };
});

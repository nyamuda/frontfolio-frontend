import { defineStore } from "pinia";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import type { Paragraph } from "@/models/paragraph";
import { apiUrl } from "@/helpers/urlHelper";
import axios from "axios";

export const useParagraphStore = defineStore("paragraph", () => {
  // Validates an array of Paragraph objects by checking required fields.
  // Returns an array of ValidatedItem<Paragraph> indicating whether each paragraph is valid.
  const validateGivenParagraphs = (paragraphs: Paragraph[]): ValidatedItem<Paragraph>[] => {
    return paragraphs.reduce((accumulator, currentValue) => {
      // A paragraph is considered valid if both 'title' and 'content' are present and non-empty
      const isValid: boolean = !!currentValue.title && !!currentValue.content;

      // Wrap the paragraph along with its validation result
      const validatedParagraph: ValidatedItem<Paragraph> = {
        item: currentValue,
        isValid,
      };

      // Add the validated paragraph to the result array
      accumulator.push(validatedParagraph);
      return accumulator;
    }, [] as ValidatedItem<Paragraph>[]);
  };

  //delete background paragraph for a specific project
  const deleteProjectBackgroundParagraph = (
    paragraphId: number | string,
    projectId: number | string,
  ) => {
    return new Promise((resolve, reject) => {
      const url = `${apiUrl}/projects/${projectId}/backgrounds/${paragraphId}`;
      //add an access token to the request to access the protected route
      setAuthToken();
      axios
        .delete(url)
        .then(() => resolve({}))
        .catch((error) => {
          const message =
            error.response?.data?.message ||
            "An unexpected error occurred while deleting the project background.";
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

  return { validateGivenParagraphs, deleteProjectBackgroundParagraph };
});

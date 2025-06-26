import { defineStore } from "pinia";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import type { Paragraph } from "@/models/paragraph";

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

  return { validateGivenParagraphs };
});

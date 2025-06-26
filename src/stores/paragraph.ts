import { computed, ref, type Ref } from "vue";
import { defineStore } from "pinia";
import type { ValidatedItem } from "@/interfaces/shared/validatedItem";
import type { Paragraph } from "@/models/paragraph";

export const useParagraphStore = defineStore("paragraph", () => {
  const validatedParagraphs: Ref<ValidatedItem<Paragraph>[]> = ref([]);

  // Extracts and returns the original Paragraph objects from the validatedParagraphs array
  const paragraphs: Ref<Paragraph[]> = computed(() => {
    return validatedParagraphs.value.reduce((accumulator, currentValue) => {
      accumulator.push(currentValue.item);
      return accumulator;
    }, [] as Paragraph[]);
  });
  // Determine if any paragraph in the list has failed validation
  const hasInvalidParagraphs: Ref<boolean> = computed(() => {
    //look for any paragraphs whose validation is invalid
    const anyInvalid: ValidatedItem<Paragraph>[] = validatedParagraphs.value.filter(
      (validatedParagraphs) => !validatedParagraphs.isValid,
    );
    return anyInvalid.length > 0;
  });

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

  // Resets the validatedParagraphs array to an empty state
  const $reset = () => {
    validatedParagraphs.value = [];
  };

  return { validatedParagraphs, $reset, validateGivenParagraphs, hasInvalidParagraphs };
});

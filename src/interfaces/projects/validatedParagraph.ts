import type { Paragraph } from "@/models/paragraph";

export interface ValidatedParagraph {
  paragraph: Paragraph;
  isValid: boolean;
}

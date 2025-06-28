import type { Paragraph } from "@/models/paragraph";

export class ParagraphHelper {
  /**
   * Prepares a list of paragraphs for submission to the backend.
   * Any paragraph with a string-based temporary ID (e.g., generated with crypto.randomUUID)
   * will have its ID reset to 0 to signal it's a new entity.
   */
  public static prepareParagraphsForSubmission(paragraphs: Paragraph[]): Paragraph[] {
    return paragraphs.map((paragraph) => {
      if (typeof paragraph.id === "string") {
        return { ...paragraph, id: 0 };
      }
      return paragraph;
    });
  }
}

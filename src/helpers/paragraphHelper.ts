import { Paragraph } from "@/models/paragraph";

export class ParagraphHelper {
  /**
   * Resets temporary string IDs to 0.
   *
   * In the frontend, when users create new paragraphs dynamically (e.g., for a project or blog),
   * each paragraph is assigned a temporary string-based ID using tools like `crypto.randomUUID()`.
   * These IDs are useful for managing state in the UI (e.g., tracking and updating items before saving).
   *
   * However, the backend expects each paragraph's `id` field to be an integer, since it uses integers
   * as primary keys in the database. Submitting string-based IDs would either cause validation errors
   * or be incorrectly interpreted.
   *
   * This helper function loops through the array of paragraphs and checks each paragraph's `id`:
   * - If the `id` is a string (indicating it's a new, unsaved paragraph), it's replaced with `0`.
   *   The backend interprets an ID of `0` as a signal to create a new paragraph.
   * - If the `id` is already a number, it's left unchanged (indicating it's an existing paragraph).
   * @param paragraphs - An array of Paragraph objects to be cleaned before sending to the backend.
   * @returns A new array of Paragraphs with temporary string IDs converted to 0.
   */
  public static resetTemporaryIds(paragraphs: Paragraph[]): Paragraph[] {
    return paragraphs.map((paragraph) => {
      if (typeof paragraph.id === "string") {
        const paragraphWithZeroId = Object.assign(new Paragraph(), paragraph);
        paragraphWithZeroId.id = 0;
        return paragraphWithZeroId;
      }
      return paragraph;
    });
  }
}

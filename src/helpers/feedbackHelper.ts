import { Feedback } from "@/models/feedback";

export class FeedbackHelper {
  /**
   * Resets temporary string IDs to 0.
   *
   * In the frontend, when users create new feedback dynamically (e.g., for a project),
   * each feedback is assigned a temporary string-based ID using tools like `crypto.randomUUID()`.
   * These IDs are useful for managing state in the UI (e.g., tracking and updating items before saving).
   *
   * However, the backend expects each feedback's `id` field to be an integer, since it uses integers
   * as primary keys in the database. Submitting string-based IDs would either cause validation errors
   * or be incorrectly interpreted.
   *
   * This helper function loops through the array of feedback and checks each feedback's `id`:
   * - If the `id` is a string (indicating it's a new, unsaved feedback), it's replaced with `0`.
   *   The backend interprets an ID of `0` as a signal to create a new feedback.
   * - If the `id` is already a number, it's left unchanged (indicating it's an existing feedback).
   * @param incomingFeedback - An array of Feedback objects to be cleaned before sending to the backend.
   * @returns A new array of Feedback with temporary string IDs converted to 0.
   */
  public static resetTemporaryIds(incomingFeedback: Feedback[]): Feedback[] {
    return incomingFeedback.map((feedback) => {
      if (typeof feedback.id === "string") {
        const feedbackWithZeroId = Object.assign(new Feedback(), feedback);
        feedbackWithZeroId.id = 0;
        return feedbackWithZeroId;
      }
      return feedback;
    });
  }
}
